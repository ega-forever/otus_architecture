const request = require('request-promise');

const url = 'https://us-central1-private-260418.cloudfunctions.net/function-1';

const init = async () => {

  const pendings = [];
  let errors = [];
  let round = 1;

  while (errors.length === 0) {

    console.log(`round: ${round}`);

    for (let i = 0; i < 10; i++) {
      pendings.push(request(url, {timeout: 60000}).catch(e => e.error))
    }

    const result = await Promise.all(pendings);
    errors = result.filter((item) => item !== 'Hello World!');
    round += 1;
  }

  console.log(errors);


};

module.exports = init();

