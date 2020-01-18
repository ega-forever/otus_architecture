import sqlite3 from 'sqlite3';
import {promisify} from 'util';
import {TransactionDatabase} from 'sqlite3-transactions';

export default class Database {

  private readonly sqlite: sqlite3.Database;

  constructor(){
    this.sqlite = new TransactionDatabase(new sqlite3.Database(':memory:'));
  }

  public async select(query: string){
    return promisify(this.sqlite.all.bind(this.sqlite))(query);
  }

  public async run(query: string){
    return promisify(this.sqlite.run.bind(this.sqlite))(query);
  }

  public async test(query: string){
    const transaction = await promisify(this.sqlite.beginTransaction.bind(this.sqlite))();
    this.sqlite.run(query);
    console.log('!!')
    await promisify(transaction.commit.bind(transaction))();
    await promisify(transaction.rollback.bind(transaction))();
    console.log('!!2')
  }

}