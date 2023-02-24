/// <reference types="node" />
declare const MessageChannel: {
    readonly PexChannel: 0;
    readonly StateChannel: 32;
    readonly DataChannel: 33;
    readonly VoteChannel: 34;
    readonly VoteSetBitsChannel: 35;
    readonly EvidenceChannel: 56;
    readonly BlockchainChannel: 64;
    readonly ParamsChannel: 99;
    readonly SnapshotChannel: 96;
    readonly MempoolChannel: 48;
};
type MessageChannel = typeof MessageChannel[keyof typeof MessageChannel];
type NetworkMessage = {
    channel: MessageChannel;
    message: Buffer;
};
