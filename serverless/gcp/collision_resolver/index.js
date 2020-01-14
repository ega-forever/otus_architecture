const Promise = require('bluebird'),
  semaphore = require('semaphore'),
  sem = semaphore(1);

let pendingPromise = Promise.resolve();


exports.collisionHelloWorld = async (req, res) => {

  await new Promise(res => {

    sem.take(async () => {

      if (!pendingPromise.isFulfilled()) {
        throw new Error('concurrency error');
      }

      pendingPromise = Promise.delay(10000);
      await pendingPromise;
      sem.leave();
      res();
    });
  });


  let message = req.query.message || req.body.message || 'Hello World!';
  res.status(200).send(message);
};