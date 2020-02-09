const bcoin = require('bcoin'),
  request = require('request-promise'),
  assert = require('assert'),
  bitcoin = require('bitcoinjs-lib');

const customNetwork = {...bcoin.networks.regtest};

customNetwork.keyPrefix = bcoin.networks.testnet.keyPrefix;
customNetwork.addressPrefix = bcoin.networks.testnet.addressPrefix;

bcoin.networks.custom = customNetwork;

const node = new bcoin.FullNode({
  network: 'custom',
  db: 'memory',
  indexTX: true,
  indexAddress: true,
  logLevel: 'warning',
  'http-port': 18332
});

const init = async () => {
  await node.open();
  await node.connect();

  const {result: height} = await request({
    uri: 'http://localhost:18332',
    method: 'POST',
    json: {
      method: 'getblockcount',
      params: [],
      id: Date.now()
    }
  });

  console.log(`current height: ${height}`);


  const keyPairAlice = bitcoin.ECPair.makeRandom();
  const keyPairBob = bitcoin.ECPair.makeRandom();

  const {address: addressAlice} = bitcoin.payments.p2pkh({
    pubkey: keyPairAlice.publicKey,
    network: bitcoin.networks.testnet
  });
  const {address: addressBob} = bitcoin.payments.p2pkh({
    pubkey: keyPairBob.publicKey,
    network: bitcoin.networks.testnet
  });

  await request({
    uri: 'http://localhost:18332',
    method: 'POST',
    json: {
      method: 'generatetoaddress',
      params: [500, addressAlice],
      id: Date.now()
    }
  });

  const utxoAlice = await node.getCoinsByAddress(addressAlice);
  const selectedUtxo = utxoAlice.sort((a, b)=> a.height - b.height)[0];

  const reversedUtxoHash = Buffer.from(selectedUtxo.hash, 'hex').reverse().toString('hex');

  const {result: utxoTx} = await request({
    uri: 'http://localhost:18332',
    method: 'POST',
    json: {
      method: 'getrawtransaction',
      params: [reversedUtxoHash],
      id: Date.now()
    }
  });

  const psbt = new bitcoin.Psbt({network: bitcoin.networks.testnet});
  psbt.addInput({
    hash: reversedUtxoHash,
    index: 0,
    nonWitnessUtxo: Buffer.from(utxoTx, 'hex')
  });

  const bobAmount = selectedUtxo.value - 1000;

  console.log(`bob should receive: ${bobAmount}`);

  psbt.addOutput({
    address: addressBob,
    value: bobAmount
  });
  psbt.signInput(0, keyPairAlice);
  psbt.validateSignaturesOfInput(0);
  psbt.finalizeAllInputs();

  const rawTx = psbt.extractTransaction().toHex();

  const {result: rawTxHash} = await request({
    uri: 'http://localhost:18332',
    method: 'POST',
    json: {
      method: 'sendrawtransaction',
      params: [rawTx],
      id: Date.now()
    }
  });

  console.log(`rawTx hash: ${rawTxHash}`);


  await request({ // mine one block, so our broadcasted tx become confirmed
    uri: 'http://localhost:18332',
    method: 'POST',
    json: {
      method: 'generatetoaddress',
      params: [1, addressAlice],
      id: Date.now()
    }
  });

  const utxoBob = await node.getCoinsByAddress(addressBob);

  assert(utxoBob.length === 1);
  assert(utxoBob[0].value === bobAmount);


  await node.close();
};

module.exports = init();