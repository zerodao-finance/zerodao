import { bitcoin } from 'bitcoinjs-lib';

// Create a transaction
const tx = new bitcoin.TransactionBuilder();
tx.addInput('prevTxHash', 0); // Add an input from a previous transaction
tx.addOutput('address', 1000); // Add an output to an address with a value of 1000 satoshis
tx.sign(0, keyPair); // Sign the transaction with a private key

// Serialize the transaction
const txHex = tx.build().toHex();
console.log(txHex); // Outputs the serialized transaction in hex format
