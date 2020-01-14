const request = require('request-promise'),
  Promise = require('bluebird');

const url = 'https://9mobm41n84.execute-api.us-east-2.amazonaws.com/default/test_func';

const init = async () => {

  const pendings = [];
  let errors = [];
  let round = 1;

  while (errors.length === 0) {

    console.log(`round: ${round}`);

    for (let i = 0; i < 20; i++) {
      pendings.push(request(url, {timeout: 60000}).catch(e => e.error))
    }

    const result = await Promise.all(pendings);
    errors = result.filter((item) => item !== 'Hello World!');
    round += 1;
    // await Promise.delay(10000);
  }

  console.log(errors);


};

module.exports = init();

