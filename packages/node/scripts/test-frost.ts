import bitcore from 'bitcore-lib';

// Create inputs
const tx = new bitcore.Transaction();

tx.from(/*UTXO*/);

// Create outputs
tx.to(/*destination, amount*/);
tx.change(/*Original UTXO Address*/);

// Sign transaction, pass hash of TX to FROST
const hash = tx.getHash()
const privateKey = new bitcore.PrivateKey();
tx.sign(privateKey);

// Print transaction
console.log(tx.toString());
