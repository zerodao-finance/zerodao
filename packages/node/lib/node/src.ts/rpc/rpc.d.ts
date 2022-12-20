declare const EventEmitter: any;
export declare class RPCServer extends EventEmitter {
    self: any;
    path: string;
    service: any;
    pkg: any;
    static PORT: string;
    static init(): RPCServer;
    constructor();
    start({ port }?: any): {
        success: boolean;
    };
    _handleTransaction(call: any, callback: any): void;
    _emit(eventName: any, msg: any): void;
}
export {};
