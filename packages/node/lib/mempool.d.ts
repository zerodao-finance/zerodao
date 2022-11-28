export declare class ZeroPool {
    _running: boolean;
    _pool: Map<string, any[]>;
    _length: number;
    opened: boolean;
    private _buffer;
    private _pending;
    private _gossipInterval;
    static initialize({ config, buffer }?: any): any;
    constructor({ config, buffer }?: any);
    Object: any;
    assign(this: any, config: any): any;
}
