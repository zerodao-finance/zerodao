type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type YYYY = `${oneToNine}${zeroToNine}${zeroToNine}${zeroToNine}`;
type MM = `${zeroToNine}${zeroToNine}`;
type DD = `${zeroToNine}${zeroToNine}`;
type HH = `${zeroToNine}${zeroToNine}`;
type mm = `${zeroToNine}${zeroToNine}`;
type ss = `${zeroToNine}${zeroToNine}`;
type UTCDateTime = `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}Z`;
type GenesisValidator = {
    Address: string;
    PubKey: string;
    Power: number;
};
export type GenesisDoc = {
    GenesisTime: UTCDateTime;
    ChainID: string;
    InitialHeight: number;
    ConsensusParams: any;
    Validators: GenesisValidator[];
    AppHash: string;
    AppState: any;
};
export declare function GenesisDocFromJSON(path_to_file: string): any;
export declare function SaveAs(): void;
export {};
