const kad = require('kademlia-dht'),
    {promisify} = require('util');

const spawnNode = async (endpoint, seeds = []) => {
    const rpc = await promisify(kad.MockRpc.spawn)(endpoint);
    return await promisify(kad.Dht.spawn)(rpc, seeds);
};

const init = async () => {

    const dhtNode1 = await spawnNode('localhost:9876');
    const dhtNode2 = await spawnNode('localhost:4321', [dhtNode1.rpc.endpoint]);

    const key = 'super_key';
    const val = Date.now().toString();
    console.log(`setting ${key}:${val} on node1`);

    await promisify(dhtNode1.set).call(dhtNode1, key, val);

    const foundValOnNode2 = await promisify(dhtNode2.get).call(dhtNode2, key);

    console.log(`are values equal ${val ===foundValOnNode2}`);
};

module.exports = init();