import { State } from "./state";

/* 
 * the Store class saves and loads ABCI responses,
 * validators, and consensus parameters
 */
abstract class Store {

	constructor() {

	}
	
	loadFromDBorGenesisFile(path_to: string): typeof State;
	loadFromDBorGenesisDoc(doc: GenesisDoc): typeof State;
	load(): typeof State;
	abstract save(state: typeof State): void;
	abstract close(): void;
}
