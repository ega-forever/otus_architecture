require('dotenv').config();
const rp = require('request-promise');

module.exports = async (method, params = []) => {
  return rp({
    uri: process.env.RPC_URI,
    method: 'POST',
    json: {
      method: method,
      'params': params,
      id: 1,
      jsonrpc: '2.0'
    }
  });
};