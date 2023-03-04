/// <reference types="node" />
import { EventEmitter } from "node:events";
export declare class RPC extends EventEmitter {
    self: any;
    service: any;
    pkg: any;
    proxy_peer: any;
    implementations: {};
    static DEFAULT_PORT: string;
    static LOCAL_ADDRESS: string;
    static ServiceCallbackWrapper: (returnMsg: any) => (call: any, callback: any) => any;
    static init(): RPC;
    constructor();
    addService(proxy: any): void;
    start({ address, port }?: any): void;
    stop(): void;
    wrapServiceMethod(methodName: any, proxy: any): (call: any, callback: any) => Promise<void>;
    handler(method: string, func: (message: any) => any): (server: RPC) => void;
}
