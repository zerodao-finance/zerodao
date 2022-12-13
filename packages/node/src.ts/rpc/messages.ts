"use strict";
// Send Transaction Message Interface

function handleTransactionMessage(call, callback) {	
	callback(null, ackTranscationMessage(call));
}

function ackTransactionMessage(message) {
	try {
		validateTransaction(message); //TODO: implement validateTransaction()
		return { status: 0 }; 
	} catch (error) {
		return { status: 1, errorMsg: new TextEncoder().encode(error.message) };
	}
}

type UnaryCallHandler = (call: any, callback: any) => void;

interface ITransactionService {
	handleTransaction: UnaryCallHandler;
}

export const TransactionService: ITransactionService = {
	handleTransaction: handleTransactionMessage;
}
