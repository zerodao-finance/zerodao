import type { Long } from '@grpc/proto-loader';

export interface Balance {
    'hash'?: (Buffer | Uint8Array | string);
    'balance'?: (number | string | Long);
  }