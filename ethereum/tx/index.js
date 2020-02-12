const Web3 = require('web3'),
  assert = require('assert'),
  ganache = require('ganache-cli');

const init = async () => {

  const web3 = new Web3();

  const accountAlice = web3.eth.accounts.create();
  const accountBob = web3.eth.accounts.create();

  web3.setProvider(ganache.provider({
    accounts: [
      {
        balance: '100'.padEnd(19 + 3, '0'),
        secretKey: accountAlice.privateKey
      }
    ]
  }));


  const accounts = await web3.eth.getAccounts();


  assert(accounts.length === 1);
  assert(accounts[0] === accountAlice.address);

  const txCount = await web3.eth.getTransactionCount(accountAlice.address);

  const signedTx = await web3.eth.accounts.signTransaction({
    from: accountAlice.address,
    gasPrice: '20000000000',
    gas: '21000',
    to: accountBob.address,
    value: '10'.padEnd(19, '0'),
    data: '',
    nonce: txCount
  }, accountAlice.privateKey);

  const sendTxResult = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

  const tx = await web3.eth.getTransaction(sendTxResult.transactionHash);
  console.log(tx);

  const balanceBob = await web3.eth.getBalance(accountBob.address);
  console.log(`bob balance: ${balanceBob}`);


};

module.exports = init();