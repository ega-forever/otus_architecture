const bitcoin = require('bitcoinjs-lib'),
  bip39 = require('bip39'),
  bip32 = require('bip32');

const keyPairAlice = bitcoin.ECPair.makeRandom();
console.log(`hex key: ${keyPairAlice.privateKey.toString('hex')}`);


const mnemonic = bip39.generateMnemonic();
console.log(`mnemonic: ${mnemonic}`);

const seed = bip39.mnemonicToSeedSync(mnemonic);
const node = bip32.fromSeed(seed);
const extendedPrivate = node.toBase58();
console.log(`extended private key: ${extendedPrivate}`);

const derivedPrivate = node.derivePath('m/0/0');
console.log(`derived hex key: ${derivedPrivate.privateKey.toString('hex')}`);
