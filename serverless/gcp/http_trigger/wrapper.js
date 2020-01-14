const express = require('express'),
  bodyParser = require('body-parser'),
  route = require('.'),
  app = express();

app.use(bodyParser.json({ type: 'application/*+json' }))

app.all('/', route.helloWorld);

app.listen(8080, ()=>{
  console.log('server started on port 8080');
});