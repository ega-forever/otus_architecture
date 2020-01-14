const express = require('express'),
  bodyParser = require('body-parser'),
  route = require('.'),
  app = express();

app.use(bodyParser.json({type: 'application/*+json'}));

app.all('/', async (req, res) => {
  try {
    return await route.collisionHelloWorld(req, res);
  } catch (e) {
    res.send(e.toString());
  }
});

app.listen(8080, () => {
  console.log('server started on port 8080');
});