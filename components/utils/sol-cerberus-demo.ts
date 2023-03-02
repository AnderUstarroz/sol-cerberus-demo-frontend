import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { sc_rule_pda } from "sol-cerberus-js";
import DemoIDL from "../../public/idl/sol_cerberus_demo.json";
import { SolCerberusDemo } from "../../sol_cerberus_demo";
import { SolCerberus } from "../utils/sol-cerberus-js";

export function get_provider(connection: Connection, wallet): anchor.Provider {
  return new anchor.AnchorProvider(
    connection,
    wallet.adapter,
    anchor.AnchorProvider.defaultOptions()
  );
}

export const get_demo_program = (
  provider: any
): anchor.Program<SolCerberusDemo> => {
  return new anchor.Program(
    DemoIDL as any,
    new PublicKey(DemoIDL.metadata.address),
    provider
  );
};

export async function demo_pda(scAppId: PublicKey) {
  return (
    await PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode("sol-cerberus-demo"), scAppId.toBuffer()],
      new PublicKey(DemoIDL.metadata.address)
    )
  )[0];
}

export async function add_rules_instructions(
  solCerberus: SolCerberus,
  publicKey: PublicKey,
  scAppPda: PublicKey
) {
  const roles = ["SquareMaster", "CircleMaster", "TriangleMaster"];
  const perms = ["Add", "Update", "Delete"];
  // Create rule map
  const ruleMap = roles.reduce(
    (acc: [], role: string) => [
      ...acc,
      ...perms.map((perm: string) => `${role}${perm}`),
    ],
    []
  );
  // Create default Rules PDAs for each Role: SquareMaster, CircleMaster, TriangleMaster
  const rulesPdas = (
    await Promise.allSettled(
      roles.reduce(
        (acc: [], role: string) => [
          ...acc,
          ...perms.map((perm: string) =>
            sc_rule_pda(solCerberus.appId, role, role.slice(0, -6), perm)
          ),
        ],
        []
      )
    )
  )
    .filter((r: any) => r.status === "fulfilled")
    .reduce((acc: {}, r: any, k: number) => {
      acc[ruleMap[k]] = r.value;
      return acc;
    }, {});
  // Add each Rule instruction into the transaction:
  return (
    await Promise.allSettled(
      roles.reduce((acc: [], role: string) => {
        return [
          ...acc,
          ...perms.map((perm: string) =>
            solCerberus.program.methods
              .addRule({
                namespace: 0,
                role: role,
                resource: role.slice(0, -6),
                permission: perm,
                expiresAt: null,
              })
              .accounts({
                app: scAppPda,
                rule: rulesPdas[`${role}${perm}`],
                authority: publicKey,
              })
              .instruction()
          ),
        ];
      }, [])
    )
  ).filter((r: any) => r.status === "fulfilled");
}

export async function get_balances(
  connection: Connection,
  publicKey: PublicKey,
  transaction: Transaction,
  space: number
): Promise<number[]> {
  /**
   * Returns [balance, rentCost, txFee]
   */
  return (
    await Promise.allSettled([
      connection.getBalance(publicKey),
      connection.getMinimumBalanceForRentExemption(space),
      transaction.getEstimatedFee(connection),
    ])
  )
    .filter((r: any) => r.status === "fulfilled")
    .map((r: any) => r.value as number);
}
