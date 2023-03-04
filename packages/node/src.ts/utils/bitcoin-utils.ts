import bitcore from 'bitcore-lib';

export function getTxHash(utxo, destination, amount, gateway) {
// Create inputs
const tx = new bitcore.Transaction();

tx.from(utxo);

// Create outputs
tx.to(destination, amount);
tx.change(gateway);

// pass hash of TX to FROST
const hash = tx.getHash()
return hash;

// Print transaction
console.log(tx.toString());
}