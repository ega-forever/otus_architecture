import bunyan = require('bunyan');
import { Mokka } from 'mokka/dist/components/consensus/main';
import MokkaEvents from 'mokka/dist/components/shared/constants/EventTypes';
import TCPMokka from 'mokka/dist/implementation/TCP';
import * as readline from 'readline';
import Database from './db';
import crypto from 'crypto';
import MokkaStates from 'mokka/dist/components/consensus/constants/NodeStates';
import semaphore from 'semaphore';
import config from './config';
import express from 'express';
import bodyParser from 'body-parser';
import request from 'request-promise';

const dbInstance = new Database();

const sem = semaphore(1);


// init mokka instance, bootstrap other nodes, and call the askCommand
const initMokka = async () => {
  const index = parseInt(process.env.INDEX, 10);

  const uris = [];
  for (let index1 = 0; index1 < config.nodes.length; index1++) {
    if (index === index1)
      continue;
    uris.push(`tcp://127.0.0.1:${ config.nodes[index1].consensus }/${ config.nodes[index1].publicKey }`);
  }

  const logger = bunyan.createLogger({ name: 'mokka.logger', level: 30 });

  const mokka = new TCPMokka({
    address: `tcp://127.0.0.1:${ config.nodes[index].consensus }/${ config.nodes[index].publicKey }`,
    electionMax: 300,
    electionMin: 100,
    gossipHeartbeat: 200,
    heartbeat: 100,
    logger,
    privateKey: config.nodes[index].secretKey,
    proofExpiration: 30000
  });

  mokka.connect();

  mokka.on(MokkaEvents.STATE, () => {
    // logger.info(`changed state ${mokka.state} with term ${mokka.term}`);
  });

  for (const peer of uris)
    mokka.nodeApi.join(peer);

  mokka.on(MokkaEvents.ERROR, (err) => {
    logger.error(err);
  });

  mokka.on(MokkaEvents.LOG, (index) => {

    if (mokka.state === MokkaStates.LEADER)
      return;

    sem.take(async () => {
      const { log } = await mokka.getDb().getEntry().get(index);
      await dbInstance.run(log.value.value);

      logger.info(`query executed: ${ log.value.value }`);
      sem.leave();
    });

  });


  const rpc = express();
  rpc.use(bodyParser.json());

  rpc.post('/', async (req, res) => {

    if (mokka.state !== MokkaStates.LEADER)
      return res.send({ status: 0 });

    try {
      await dbInstance.run(req.body.query);
      const key = crypto.createHmac('sha256', req.body.query)
        .digest('hex');
      await mokka.logApi.push(key, { value: req.body.query, nonce: Date.now() });
    } catch (e) {
      return res.send({ status: 0, err: e.toString() });
    }

    res.send({ status: 1 });
  });

  rpc.listen(config.nodes[index].rpc, () => {
    logger.info(`rpc started on port: ${ config.nodes[index].rpc }`)
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  askCommand(rl, mokka);
};

// listens to user's input via console
const askCommand = (rl, mokka) => {
  rl.question('enter command > ', async (command) => {

    if (command.trim().toUpperCase().indexOf('SELECT') === 0) {
      const result = await dbInstance.select(command).catch(e => console.log(e.toString()));
      console.log(result);
    }

    if (
      command.trim().toUpperCase().indexOf('CREATE') === 0 ||
      command.trim().toUpperCase().indexOf('INSERT') === 0 ||
      command.trim().toUpperCase().indexOf('UPDATE') === 0 ||
      command.trim().toUpperCase().indexOf('DELETE') === 0
    ) {
      await update(mokka, command);
    }

    askCommand(rl, mokka);
  });
};

const update = async (mokka: Mokka, command: string) => {

  if (mokka.state === MokkaStates.LEADER) {

    try {
      await dbInstance.run(command);
      const key = crypto.createHmac('sha256', command)
        .digest('hex');
      await mokka.logApi.push(key, { value: command, nonce: Date.now() });
    } catch (e) {
      console.log(e.toString());
    }

  } else {

    const leaderConfig = config.nodes.find(node => node.publicKey === mokka.leaderPublicKey);

    const res = await request({
      method: 'POST',
      uri: `http://localhost:${ leaderConfig.rpc }`,
      body: {
        query: command
      },
      json: true
    });

    if (res.err)
      console.log(res.err);

  }


};

/*
// add new log
const addLog = async (mokka, key, value) => {
  await mokka.logApi.push(key, { value, nonce: Date.now() });
};

// get log by index
const getLog = async (mokka, index) => {
  const entry = await mokka.getDb().getEntry().get(parseInt(index, 10));
  mokka.logger.info(entry);
};

// get info of current instance
const getInfo = async (mokka) => {
  const info = await mokka.getDb().getState().getInfo();
  mokka.logger.info(info);
  const info2 = mokka.getLastLogState();
  console.log({ ...info2, state: mokka.state });
};

const getNodes = async (mokka: Mokka) => {
  const keys = Array.from(mokka.nodes.keys());
  for (let index = 0; index < mokka.nodes.size; index++) {
    console.log(`node ${ index } / ${ mokka.nodes.get(keys[index]).address } with state ${ mokka.nodes.get(keys[index]).getLastLogState().index }`);
  }
};

const resetNode = async (mokka: Mokka, index) => {
  const keys = Array.from(mokka.nodes.keys());
  mokka.nodes.get(keys[index]).setLastLogState(new StateModel());
};
*/

initMokka();
