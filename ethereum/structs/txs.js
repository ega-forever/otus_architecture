const Web3 = require('web3'),
  ganache = require('ganache-cli');

const web3 = new Web3(ganache.provider());

const init = async () => {

  const accounts = await web3.eth.getAccounts();
  await web3.eth.sendTransaction({from: accounts[0], to: accounts[1], value: 12});

  const currentBlockNumber = await web3.eth.getBlockNumber();
  console.log(currentBlockNumber);
  const block = await web3.eth.getBlock(currentBlockNumber);
  const tx = await web3.eth.getTransaction(block.transactions[0]);
  console.log(tx);

  const receivedTx = {
    hash: '0xed01b954f4238d540b6a4a3dacf16ef34bf91901a6175432adb3b0f22ef41e6b',
    nonce: 0,
    blockHash: '0x82573e410cc86d869279ef0ace7c6e0a4b574371cec7b2d2ece6531b4badb8b6',
    blockNumber: 1,
    transactionIndex: 0,
    from: '0x188d061521070af6A75A05Eed4af09b6C37d0000',
    to: '0x9ad14219984bBd6C26bdeaF5014884dBe0784DdE',
    value: '12',
    gas: 90000,
    gasPrice: '2000000000',
    input: '0x',
    v: '0x26',
    r: '0xb4f89b6e7cc7da92e791fb28b5183c3fc94019f7bbfe68e2ebc1b93e95a1e077',
    s: '0x5f9126e3a279c85e29fbd58013ce0443026081e506cc95a3d84d5e6934a70b82'
  }


};

module.exports = init();