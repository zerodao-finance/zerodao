/// <reference types="node" />
type SNAPSHOT_REQUEST = {
    address: string;
    data: Buffer;
};
declare function newSyncer(): any;
