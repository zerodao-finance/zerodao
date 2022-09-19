export declare function fromJSONtoBuffer(o: any): Uint8Array;
export declare function advertiseAsKeeper(p2p: any): Promise<() => void>;
export declare function pipeToString(stream: any): Promise<unknown>;
export declare function pipeToBuffer(stream: any): Promise<unknown>;
export declare function handleRequestsV1(p2p: any): void;
export declare function handleRequestsV2(p2p: any): void;
export declare function handleRequestsV21(p2p: any): void;
export declare function serializeToJSON(request: any): string;
