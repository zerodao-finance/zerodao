/// <reference types="node" />
import { BytesLike } from "@ethersproject/bytes";
import { Buffer } from "buffer";
export declare abstract class Request {
    contractAddress?: string;
    static addressToChainId(address: any): any;
    static get PROTOCOL(): string | void;
    static get FIELDS(): Array<string>;
    serialize(): Buffer;
    static deserialize(data: BytesLike): Request;
    toJSON(...args: Array<any>): string;
    toPlainObject(): Object;
    static fromJSON(data: string): Request;
    getChainId(): number;
}
