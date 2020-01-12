const DHT = require('bittorrent-dht'),
    magnet = require('magnet-uri');

const uri = 'magnet:?xt=urn:btih:e3811b9539cacff680e418124272177c47477157';
const parsed = magnet(uri);

console.log(`searching for hash: ${parsed.infoHash}`);

const dht = new DHT();

dht.listen(20000, ()=> {
    console.log('now listening')
});

dht.on('peer', (peer, infoHash, from) => {
    console.log(`found potential peer ${peer.host}:${peer.port} through ${from.address}:${from.port}`)
});

dht.lookup(parsed.infoHash);