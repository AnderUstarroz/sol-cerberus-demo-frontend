import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import DemoIDL from "../../public/idl/sol_cerberus_demo.json";
import { SolCerberusDemo } from "../../sol_cerberus_demo";
import { SolCerberus } from "sol-cerberus-js";

export function get_provider(connection: Connection, wallet): anchor.Provider {
  return new anchor.AnchorProvider(
    connection,
    wallet.adapter,
    anchor.AnchorProvider.defaultOptions()
  );
}

export const myAppId = (publicKey: PublicKey): string => {
  return `CeRb3rUs${publicKey.toBase58().slice(8)}`;
};

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

export async function add_rules_instructions(solCerberus: SolCerberus) {
  const roles = ["SquareMaster", "CircleMaster", "TriangleMaster"];
  const perms = ["Add", "Update", "Delete"];
  // Add each Rule instruction into the transaction:
  return (
    await Promise.allSettled(
      roles
        .reduce((acc: [], role: string) => {
          return [
            ...acc,
            ...perms.map((perm: string) =>
              solCerberus.addRule(role, role.slice(0, -6), perm, {
                getIx: true,
              })
            ),
          ];
        }, [])
        .slice(0, -1) // @TODO suddenly the transaction is too big and needed to remove last IX
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
