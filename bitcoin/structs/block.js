const rpc = require('../utils/rpc');

const init = async ()=>{

  const {result: blockHash} = await rpc('getblockhash', [613657]);
  console.log(blockHash);
  const {result: block} = await rpc('getblock', [blockHash]);

  console.log(block)

};

module.exports = init();