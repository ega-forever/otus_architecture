const Web3 = require('web3'),
  tokenDefinition = require('../truffle/build/contracts/OtusToken');


const init = async () => {
  const web3 = new Web3('ws://localhost:8545');
  const accounts = await web3.eth.getAccounts();

  const token = new web3.eth.Contract(tokenDefinition.abi, tokenDefinition.networks['4'].address);

  const balance = await token.methods.balanceOf(accounts[0]).call();

  console.log(`my balance on start: ${balance}`);

  token.events.Transfer({
    // fromBlock: 0
  })
    .on('data', ev => {
      console.log(ev);
    });
};

module.exports = init().catch(e => {
  console.error(e);
  process.exit(0);
});
