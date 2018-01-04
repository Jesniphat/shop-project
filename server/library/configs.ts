export class Config {
  public db = null;

  constructor() {
    // console.log('start');
  }
  public init() {
    const mysql = require('mysql');
    this.db = mysql.createConnection({
      host: '47.74.235.241',
      port: 3306,
      user: 'root',
      password: 'rootp@ssw0rd',
      database: 'project_jphp'
    });
    this.db.connect(function(err){
      if (err) {
        console.log('Error Connect db');
        console.log(err);
      } else {
        // console.log("Connect DB Success");
      }
    });
    return this.db;
  }
}

// export { Config };
