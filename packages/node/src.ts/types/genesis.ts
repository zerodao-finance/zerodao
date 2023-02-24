"use strict";
import fs from "fs";

type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type YYYY = `${oneToNine}${zeroToNine}${zeroToNine}${zeroToNine}`;
type MM = `${zeroToNine}${zeroToNine}`;
type DD = `${zeroToNine}${zeroToNine}`;
type HH = `${zeroToNine}${zeroToNine}`;
type mm = `${zeroToNine}${zeroToNine}`;
type ss = `${zeroToNine}${zeroToNine}`;
// validates UTCDateTime YYYY-MM-DDTHH:mm:ssZ
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

function ValidateAndComplete(doc: GenesisDoc) {
  if (doc.ChainID == "")
    throw new Error("genesis doc must include non-empty chain_id");
  if (doc.InitialHeight < 0)
    throw new Error(
      `initial_height cannot be negative (got ${doc.InitialHeight})`
    );
  if (doc.InitialHeight == 0) doc.InitialHeight = 1;
  return doc;
}

// basic genesis doc from json
export function GenesisDocFromJSON(path_to_file: string) {
  try {
    const _gdoc = fs.readFileSync(path_to_file);
    return JSON.parse(_gdoc);
  } catch (error) {
    throw error;
  }
}

export function SaveAs() {
  //TODO implement save genesis file to JSON
}
