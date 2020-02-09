const rpc = require('../utils/rpc');

const init = async () => {

  const {result: blockHash} = await rpc('getblockhash', [613657])
  const {result: block} = await rpc('getblock', [blockHash]);

  console.log(block.tx[800])

  const {result: tx} = await rpc('getrawtransaction', [block.tx[3], true]);

  console.log(require('util').inspect(tx, false, 10))


/*
  const tx = {
    txid: '3b29b258f6c1ebc0b4fc750e3e9950f859e3c7cb5fd843e8049905ef18aa08c1',
    hash: '74654e6e4ace830d24f02d5fea20686521f7196f95152a6ec2276eee8c27b33b',
    version: 1,
    size: 380,
    vsize: 190,
    weight: 758,
    locktime: 0,
    vin:
      [{
        txid: 'db43b8c11cd89682c4182c7f9a8561b2836da822a3ece440d103e0d5c1551521',
        vout: 1,
        sequence: 4294967295
      }],
    vout:
      [{
        value: 0.1868556,
        n: 0,
        scriptPubKey:
          {
            asm:
              'OP_HASH160 84604c5bbb939737139437dcd6d3b31da59746ee OP_EQUAL',
            hex: 'a91484604c5bbb939737139437dcd6d3b31da59746ee87',
            reqSigs: 1,
            type: 'scripthash',
            addresses: ['3DkxUnb3EMH1BoJiW6yMGrSLqAJBbC3BR6']
          }
      }],
    blockhash: '0000000000000000000b0f271558b6ae0bb31389d4072bb11f3b9cda51e1357a',
    confirmations: 2031,
    time: 1579506481,
    blocktime: 1579506481
  }
*/


};

module.exports = init();