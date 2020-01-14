let resolved = false;

exports.collisionHelloWorld = async (event, context, callback) => {

  if (resolved) {
    return callback(null, {
      statusCode: 500,
      body: 'concurrency error'
    });
  }

  resolved = true;
  const message = 'Hello World!';

  callback(null, {
    statusCode: 200,
    body: message
  });
};