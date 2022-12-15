"use strict";

function validateTransaction(transaction) { return true };

function handleTransactionMessage(call, callback) {	
	callback(null, ackTransactionMessage(call));
}

function ackTransactionMessage(message) {
	try {
		validateTransaction(message); 
		return { status: 0 }; 
	} catch (error) {
		return { status: 1, errorMsg: new TextEncoder().encode(error.message) };
	}
}

export type UnaryCallHandler = (call: any, callback: any) => void;

interface ITransactionService {
	handleTransaction: UnaryCallHandler;
}

export const TransactionService: ITransactionService = {
	handleTransaction: handleTransactionMessage
};
