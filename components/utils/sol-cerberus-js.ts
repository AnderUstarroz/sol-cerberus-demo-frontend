import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export class SolCerberus {
  /** @internal */ _program: anchor.Program<any>;

  /**
   * Create Sol Cerberus client
   *
   * @param program Anchor program
   * @param appPubkey The Public key of the Sol Cerberus APP
   */
  constructor(program: anchor.Program<any>, appPubkey: PublicKey) {
    this._program = program;
  }
}
