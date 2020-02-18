const ganache = require("ganache-cli");
const server = ganache.server({
  ws: true,
  network_id: 4
});
server.listen(8545, function(err, blockchain) {
  console.log('started')
});