import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

declare var window : any;
@Injectable()
export class SqliteProvider {
  public db = null;

  constructor(public http: Http) {
    console.log('Hello SqliteProvider Provider');
  }

  /**
  * 
  * Open The Database
  */
 openDb() {
   
  this.db = window.sqlitePlugin.openDatabase({name: 'ricb.db', location: 'default'});
  this.db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS t_user_master (id INTEGER UNIQUE, user_name TEXT, password TEXT, phone_number number, email TEXT, cid_no TEXT, PRIMARY KEY(id))');
      
    }, (e) => {
      console.log('Transaction Error', e);
    }, () => {
      console.log('Populate Database OK..');
    })
}

registerUser(username, password, phoneNo, email, cidNo){
  this.insertIntoTable("INSERT INTO t_user_master (id, user_name, password, phone_number, email, cid_no) "+
  "VALUES('1', '" + username + "', '" + password + "', '" + phoneNo + "', '" + email + "', '" + cidNo + "')");
  console.log('User Inserted');
}

insertIntoTable(query: any) {

  this.db.transaction((tx) => {
    this.db.executeSql(query, {}).then((data) => {
      }, (error) => {
          console.error("Unable to execute sql", error);
      }), (error) => {
          console.error("Unable to open database", error);
      }
  })
}

getRegisteredCID(){
  return new Promise(res => {
    let query = "SELECT cid_no FROM t_user_master";
    this.db.executeSql(query, [], rs => {
        if (rs.rows.length > 0) {
          res(rs.rows.item(0).cid_no);
          //console.log("has data"+rs.rows.item(0).cid_no);
        }else{
          res(false);
          //console.log("no data");
        }
      }, (e) => {
        res(false);
        console.log('Sql Query Error While selecting cidno', e);
      });
  })
}

}
