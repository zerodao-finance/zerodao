export declare class RPCServer {
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
}
