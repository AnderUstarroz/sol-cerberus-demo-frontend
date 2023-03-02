import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  SolCerberus as SolCerberusType,
  SOL_CERBERUS_PROGRAM_ID,
  sc_app_pda,
  sc_rule_pda,
} from "sol-cerberus-js";
import SolCerberusIDL from "sol-cerberus-js/lib/idl.json";

export enum namespaces {
  Default = 0,
  Internal = 1,
}
export interface PermsType {
  [perm: string]: {
    createdAt: number;
    expiresAt: number | null;
  };
}

export interface ResourcesType {
  [resource: string]: PermsType;
}

export interface RolesType {
  [role: string]: ResourcesType;
}

export interface NamespacesType {
  [namespace: number]: RolesType;
}

export interface CachedPermsType {
  cachedAt: number;
  latestCreatedAt: number;
  size: number;
  perms: NamespacesType;
}

export interface AssignedRolesType {
  [role: string]: {
    addressType: string;
    createdAt: number;
    expiresAt: number | null;
  };
}

export interface AddressAssignedRolesType {
  [address: string]: AssignedRolesType;
}

export class SolCerberus {
  /** @internal */ #program: anchor.Program<SolCerberusType>;
  /** @internal */ #appId: anchor.web3.PublicKey;
  /** @internal */ #appPda: anchor.web3.PublicKey;
  /** @internal */ #appData;
  /** @internal */ #permissions: CachedPermsType;

  /**
   * Creates Sol Cerberus client
   *
   * @param #_program The Public key of the Sol Cerberus APP
   * @param #_appId Anchor program
   */
  constructor(appId: PublicKey, provider: anchor.Provider) {
    this.#appId = appId;
    this.#program = new anchor.Program(
      SolCerberusIDL as any,
      SOL_CERBERUS_PROGRAM_ID,
      provider
    );
    this.refreshPerms();
  }

  async fetchAppPda() {
    this.#appPda = await sc_app_pda(this.#appId);
    return this.#appPda;
  }
  async fetchAppData() {
    this.#appData = await this.program.account.app.fetch(this.#appPda);
    return this.#appData;
  }

  get program() {
    return this.#program;
  }
  get appId() {
    return this.#appId;
  }

  get appPda() {
    return this.#appPda
      ? this.#appPda
      : (async () => await this.fetchAppPda())();
  }

  get appData() {
    return this.#appData
      ? this.#appData
      : (async () => await this.fetchAppData())();
  }

  get permissions() {
    return this.#permissions;
  }

  defaultCachedPerms(): CachedPermsType {
    return {
      cachedAt: 0,
      latestCreatedAt: 0,
      size: 0,
      perms: {},
    };
  }

  permsWildcards(resource, permission) {
    return [
      [resource, permission],
      ["*", "*"],
      ["*", permission],
      [resource, "*"],
    ];
  }

  hasPerm(
    roles: string[],
    resource: string,
    permission: string,
    namespace: number = namespaces.Default
  ) {
    for (const role of roles) {
      for (const [res, perm] of this.permsWildcards(resource, permission)) {
        if (this.hasRule(role, res, perm, namespace)) {
          return true;
        }
      }
    }
    return false;
  }

  hasRule(
    role: string,
    resource: string,
    permission: string,
    namespace: number = namespaces.Default
  ): boolean {
    try {
      let perm = this.#permissions.perms[namespace][role][resource][permission];
      if (!perm.expiresAt || perm.expiresAt > new Date().getTime()) {
        return true;
      }
    } catch (e) {}
    return false;
  }

  async getRule(
    roles: string[],
    resource: string,
    permission: string,
    namespace: number = namespaces.Default
  ): Promise<PublicKey | null> {
    for (const role of roles) {
      for (const [res, perm] of this.permsWildcards(resource, permission)) {
        if (this.hasRule(role, res, perm, namespace)) {
          return await sc_rule_pda(this.appId, role, res, perm, namespace);
        }
      }
    }
    return null;
  }

  parseAddressType(addressType) {
    return Object.keys(addressType)[0];
  }

  async assignedRoles(address: PublicKey): Promise<AssignedRolesType> {
    let data = await this.allAssignedRoles([
      {
        memcmp: {
          offset: 40, // Starting byte of the Address Pubkey
          bytes: address.toBase58(), // Address as base58 encoded string
        },
      },
    ]);
    return Object.keys(data).length ? Object.values(data)[0] : {};
  }

  async allAssignedRoles(filters = []): Promise<AddressAssignedRolesType> {
    return (
      await this.#program.account.role.all([
        {
          memcmp: {
            offset: 8, // APP ID Starting byte (first 8 bytes is the account discriminator)
            bytes: this.#appId.toBase58(), // base58 encoded string
          },
        },
        ...filters,
      ])
    ).reduce((assignedRoles, data) => {
      assignedRoles[data.account.address.toBase58()] = {
        [data.account.role]: {
          addressType: this.parseAddressType(data.account.addressType),
          createdAt: data.account.createdAt.toNumber() * 1000,
          expiresAt: data.account.expiresAt
            ? data.account.expiresAt.toNumber() * 1000
            : null,
        },
      };
      return assignedRoles;
    }, {} as AddressAssignedRolesType);
  }

  async refreshPerms() {
    /*
     * Fetches Permissions from blockchain
     */
    let cached = this.cachedPerms();
    let fetched = await this.#program.account.rule.all([
      {
        memcmp: {
          offset: 8, // APP ID Starting byte (first 8 bytes is the account discriminator)
          bytes: this.#appId.toBase58(), // base58 encoded string
        },
      },
    ]);
    let latestCreatedAt: number = fetched.reduce(
      (latestDate: number, data: any) => {
        let date = data.account.createdAt.toNumber() * 1000;
        return latestDate >= date ? latestDate : date;
      },
      0
    );
    // Update cache only if Perms have been modified (different size or different creation date)
    if (
      cached.latestCreatedAt < latestCreatedAt ||
      cached.size !== fetched.length
    ) {
      cached = this.parsePerms(fetched);
      this.cachePerms(cached);
    }
    this.#permissions = cached;
  }

  parsePerms(accounts): CachedPermsType {
    /**
     * Parse Permissions into following mapped format:
     *
     * {
     *   cachedAt: 0,
     *   latestCreatedAt: 0,
     *   perms: {
     *      0: {
     *       role1:  {
     *          resource1: {
     *            permission1: {
     *              createdAt: 1677485630000;
     *             expiresAt: null;
     *           },
     *           resource2: {...}
     *          },
     *       },
     *        role2:  {...}
     *      },
     *      1: {...}
     *   },
     * }
     *
     */
    if (!accounts) return this.defaultCachedPerms();

    return accounts.reduce((result: CachedPermsType, account: any) => {
      let data = account.account;
      if (!result.perms.hasOwnProperty(data.namespace)) {
        result.perms[data.namespace] = {};
      }
      if (!result.perms[data.namespace].hasOwnProperty(data.role)) {
        result.perms[data.namespace][data.role] = {};
      }
      if (
        !result.perms[data.namespace][data.role].hasOwnProperty(data.resource)
      ) {
        result.perms[data.namespace][data.role][data.resource] = {};
      }
      let created = data.createdAt.toNumber() * 1000; // Convert to milliseconds
      result.perms[data.namespace][data.role][data.resource][data.permission] =
        {
          createdAt: created,
          expiresAt: data.expiresAt ? data.expiresAt.toNumber() * 1000 : null,
        };
      result.size += 1;
      if (created > result.latestCreatedAt) {
        result.latestCreatedAt = created;
      }
      return result;
    }, this.defaultCachedPerms());
  }

  cachePermsKey(): string {
    return `SolCerberus-Perms-${this.#appId.toBase58()}`;
  }

  cachePerms(perms: CachedPermsType) {
    /**
     * Stores Perms in localStorage
     */
    perms.cachedAt = new Date().getTime();
    localStorage.setItem(this.cachePermsKey(), JSON.stringify(perms));
  }

  cachedPerms(): CachedPermsType {
    /**
     * Retrieves Perms from localStorage
     */
    let cached = JSON.parse(
      localStorage.getItem(this.cachePermsKey()) as string
    );
    return cached ? cached : this.defaultCachedPerms();
  }
}
