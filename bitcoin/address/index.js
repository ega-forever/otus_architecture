const bitcoin = require('bitcoinjs-lib');

const keyPairAlice = bitcoin.ECPair.makeRandom();
const keyPairBob = bitcoin.ECPair.makeRandom();
const keyPairDenis = bitcoin.ECPair.makeRandom();
const {address: addressAlice} = bitcoin.payments.p2pkh({pubkey: keyPairAlice.publicKey});

console.log(`Alice p2pkh: ${addressAlice}`);

const {address: addressMulti} = bitcoin.payments.p2sh({
  redeem: bitcoin.payments.p2ms({m: 2, pubkeys: [keyPairAlice.publicKey, keyPairBob.publicKey, keyPairDenis.publicKey]})
});

console.log(`multiSig address: ${addressMulti}`);

const { address: addressSegwit } = bitcoin.payments.p2wpkh({ pubkey: keyPairAlice.publicKey });

console.log(`segwit address: ${addressSegwit}`);