import { PublicKey } from "@solana/web3.js";

export interface ShapeType {
  size: number;
  color: string;
}
export interface SquareType extends ShapeType {}
export interface CircleType extends ShapeType {}
export interface TriangleType extends ShapeType {}

export type ActionType = "Add" | "Update" | "Delete";
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
  type: "nft" | "wallet" | "collection";
  expiresAt: Date;
  loading: boolean;
  useCustomRole: boolean;
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

export type ResourceType = "Square" | "Circle" | "Triangle";
export interface ResourceDataType {
  func: Function | null;
  resource: ResourceType;
  action: ActionType;
  size: number;
  color: string;
}
