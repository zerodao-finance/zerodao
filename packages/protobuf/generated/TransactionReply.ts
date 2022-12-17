// Original file: proto/ZeroProtocol.proto

// Original file: proto/ZeroProtocol.proto

export const _TransactionReply_STATUS = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
} as const;

export type _TransactionReply_STATUS = "SUCCESS" | 0 | "ERROR" | 1;

export type _TransactionReply_STATUS__Output =
  typeof _TransactionReply_STATUS[keyof typeof _TransactionReply_STATUS];

export interface TransactionReply {
  status?: _TransactionReply_STATUS;
  errorMsg?: Buffer | Uint8Array | string;
}

export interface TransactionReply__Output {
  status: _TransactionReply_STATUS__Output;
  errorMsg: Buffer;
}
