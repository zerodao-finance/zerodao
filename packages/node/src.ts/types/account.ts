export interface Account__Output {
	address: Buffer;
	unStakedBalance: string;
	stakedBalance: string;
	nonce: string;
}


export interface Account {
	address: string;
	stakedBalance: { [tokenAddress: string]: number };
	unStakedBalance: { [tokenAddress: string]: number };
	nonce: number;
}
