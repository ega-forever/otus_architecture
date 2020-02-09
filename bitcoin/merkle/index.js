const rpc = require('../utils/rpc'),
  {MerkleTree} = require('merkletreejs'),
  crypto = require('crypto');

const init = async () => {

  const {result: blockHash} = await rpc('getblockhash', [613657]);
  const {result: block} = await rpc('getblock', [blockHash]);

  console.log(`original: ${block.merkleroot}`);

  function sha256 (data) {
    return crypto.createHash('sha256').update(data).digest()
  }

  const tree2 = new MerkleTree(block.tx, sha256, {isBitcoinTree: true});
  const root = tree2.getRoot().toString('hex');

  console.log(`are equal: ${root === block.merkleroot}`)
};

module.exports = init();