const bcoin = require('bcoin'),
  testData = require('./testData'),
  assert = require('assert'),
  BlockTemplate = require('bcoin/lib/mining/template'),
  crypto = require('crypto');

function rcmp (a, b) {
  assert(a.length === b.length);

  for (let i = a.length - 1; i >= 0; i--) {
    if (a[i] < b[i])
      return -1;
    if (a[i] > b[i])
      return 1;
  }

  return 0;
}

const init = async () => {

  const block = bcoin.Block.fromRaw(Buffer.from(testData.blockHex, 'hex'));
  assert(block.hash().reverse().toString('hex') === testData.hash);

  const attempt = new BlockTemplate(block.toHeaders().toJSON());
  const headerRaw = Buffer.from(testData.blockHex.substr(0, 160), 'hex');

  headerRaw.writeUInt32LE(block.nonce, 76, true);

  const target = attempt.target;

  const doubleSha256Hash = crypto.createHash('sha256').update(crypto.createHash('sha256').update(headerRaw).digest()).digest();

  console.log(doubleSha256Hash.toString('hex'))
  console.log(target.toString('hex'))

  const result = rcmp(doubleSha256Hash, target);

  assert(result <= 0);
};

module.exports = init();

