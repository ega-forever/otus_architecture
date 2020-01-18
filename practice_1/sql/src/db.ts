import sqlite3 from 'sqlite3';
import {promisify} from 'util';

export default class Database {

  private readonly sqlite: sqlite3.Database;

  constructor(){
    this.sqlite = new sqlite3.Database(':memory:');
  }

  public async select(query: string){
    return promisify(this.sqlite.all.bind(this.sqlite))(query);
  }

  public async run(query: string){
    return promisify(this.sqlite.run.bind(this.sqlite))(query);
  }

}