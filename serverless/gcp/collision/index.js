let resolved = false;

exports.collisionHelloWorld = async (req, res) => {

  if(resolved){
    return res.status(500).send("concurrency error");
  }

  resolved = true;

  let message = 'Hello World!';
  res.status(200).send(message);
};