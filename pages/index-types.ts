import { PublicKey } from "@solana/web3.js";

export interface ShapeType {
  size: number;
  color: string;
}
export interface SquareType extends ShapeType {}
export interface CircleType extends ShapeType {}
export interface TriangleType extends ShapeType {}

export interface DemoType {
  authority: PublicKey;
  solCerberusApp: PublicKey;
  bump: number;
  square: SquareType | null;
  circle: CircleType | null;
  triangle: TriangleType | null;
}

export interface PDAsType {
  scAppPda: PublicKey;
  demoPda: PublicKey;
}

export interface AssignRoleType {
  role: string;
  address: string;
  type: "NFT" | "Wallet" | "Collection";
  loading: boolean;
}
export interface NewRuleType {
  role: string;
  resource: string;
  permission: string;
  loading: boolean;
}

export interface ErrorType {
  [k: string]: string;
}

export interface AddresssesByRoleType {
  [role: string]: string[];
}
