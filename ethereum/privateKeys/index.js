const Web3 = require('web3');

const web3 = new Web3();

const init = async () => {
  const account = web3.eth.accounts.create();
  console.log(account.privateKey);


};

module.exports = init();