// import * as Promise from 'bluebird';

export class Database {
  // constructor(public conn: Config) { }
  constructor() { }

  public beginTransection(connection: any) {
    return new Promise((resolve, reject) => {
      connection.beginTransaction((err) => {
        if (err) {
          reject(err);
        } else {
          resolve('start transaction');
        }
      });
    });
  }

  public Commit(connection) {
    return new Promise((resolve, reject) => {
      connection.commit(function(e){
        if (e) {
          reject(e);
        } else {
          resolve('commit success');
        }
      });
    });
  }

  public Rollback(connection) {
    return new Promise((resolve, reject) => {
      connection.rollback(function() {
        resolve('rollback');
      });
    });
  }

  private _getSelectFields(data): Promise<any> {
    return new Promise((resolve, reject) =>{
      resolve((Array.isArray(data.fields)) ? (data.fields).toString() : (data.fields !== undefined) ? data.fields : ' * ');
    });
  }

  private _getSelectOrder(data): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve((Array.isArray(data.order)) ? ' ORDER BY ' + (data.order).toString() : (data.order !== undefined)
      ? ' ORDER BY ' + data.order : '');
    });
  }

  private _getSelectLimit(data): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve((data.limit !== undefined) ? ' LIMIT ' + data.limit : '');
    });
  }

  private _getSelectGroup(data): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve((Array.isArray(data.group)) ? ' GROUP BY ' + (data.group).toString() : (data.group !== undefined)
              ? ' GROUP BY ' + data.group : '');
    });
  }

  public async SelectAll(connection, data) {
    let $scrope;
    // let select_data(){
    let fields: any = ' * ';
    let where = ' 1 = 1 ';
    let group = '';
    let order = '';
    let limit = '';

    // Manage Where data
    if (typeof(data.where) === 'object') {
      for (const keys in data.where) {
        if (keys) {
          where += ' AND ' + keys + ' = \'' + data.where[keys] + '\'';
        } else {
          continue;
        }
      }
    } else if (data.where !== undefined) {
      where += ' AND ' + data.where;
    }

    // If fields is array change array to string else use *
    // (Array.isArray(data.fields)) ? (data.fields).toString() : (data.fields !== undefined) ? data.fields : ' * ';
    fields = await this._getSelectFields(data);

    // Order query if data.order is array change array to string then use data string else use ''
    order  = await this._getSelectOrder(data);

    // Limit data if data.limit is not undefined use string data.limit
    limit  = await this._getSelectLimit(data);

    // Group data if data.group is array change data.group to string else use nomal data.group
    group  = (Array.isArray(data.group)) ? ' GROUP BY ' + (data.group).toString() : (data.group !== undefined)
           ? ' GROUP BY ' + data.group : '';

    // Query string
    const select = 'SELECT ' + fields + ' FROM ' + data.table + ' WHERE ' + where + group + order + limit;

    // Main function for get data from database
    return new Promise((resolve, reject) => {
      connection.query(select, (error, results, field) => {
        if (error) {
          console.log('error : ', error);
          reject(error);
        } else if (results.length === 0) {
          console.log('Nodata => ', results);
          $scrope = results;
          resolve($scrope);
        }else {
          $scrope = results;
          resolve($scrope);
        }
      });
    });
  }

  public SelectRow(connection, data, success, errors) {
    let $scrope;
    let fields = ' * ';
    let where = ' 1 = 1 ';
    let group = '';
    let order = '';
    let limit = '';

    if (typeof(data.where) === 'object') {
      for (const keys in data.where) {
        if (keys) {
          where += ' AND ' + keys + ' = \'' + data.where[keys] + '\'';
        } else {
          continue;
        }
      }
    } else if (data.where !== undefined) {
      where += ' AND ' + data.where;
    }
    fields = (Array.isArray(data.fields)) ? (data.fields).toString() : (data.fields !== undefined) ? data.fields : ' * ';
    group  = (Array.isArray(data.group)) ? ' GROUP BY ' + (data.group).toString() : (data.group !== undefined)
           ? ' GROUP BY ' + data.group : '';
    order  = (Array.isArray(data.order)) ? ' ORDER BY ' + (data.order).toString() : (data.order !== undefined)
           ? ' ORDER BY ' + data.order : '';
    limit  = (data.limit !== undefined) ? ' LIMIT ' + data.limit : '';

    const select = 'SELECT ' + fields + ' FROM ' + data.table + ' WHERE ' + where + order + limit;
    const select_row = connection.query(select, function(error, results, field){
      // console.log('sql select row = ', select_row.sql);
      if (error) {
        console.log('error : ', error);
        errors(error);
      } else if (results.length === 0) {
        console.log('Nodata => ', results);
        $scrope = results;
        success({});
      } else {
        $scrope = results;
        success($scrope[0]);
      }
    });
  }

  public Insert(connection, data, success, errors) {
    let $scrope;
    if (typeof(data) === 'object') {

    } else {
      errors('Is not object');
      return;
    }

    const insert = 'INSERT INTO ' + data.table + ' SET ? ';
    const querys = connection.query(insert, data.query, function(error, results, fields) {
      // console.log(querys.sql);
      if (error) {
        errors(error);
      } else {
        $scrope = {insert_id: results.insertId, effected_row: results.affectedRows, change_row: results.changedRows };
        // console.log('INSERT SUCCESS = ', $scrope);
        success($scrope);
      }
    });
  }

  public Update(connection, data, success, errors) {
    let $scrope;
    const fields = [];
    const set = [];
    let where = ' WHERE 1 = 1 ';
    for (const keys in data.query) {
      if (keys) {
        fields.push(keys + ' = ?');
        set.push(data.query[keys]);
      } else {
        continue;
      }
    }
    fields.toString();

    if (typeof(data.where) === 'object') {
      for (const keys in data.where) {
        if (keys) {
          where += ' AND ' + keys + ' = ?';
          set.push(data.where[keys]);
        } else {
          continue;
        }
      }
    } else if (data.where !== undefined) {
      where += ' AND ' + data.where;
    }
    const update = 'UPDATE ' + data.table + ' SET ' + fields + where;
    const querys = connection.query(update, set, function(error, results, field) {
      // console.log('Update is ', querys.sql);
      if (error) {
        errors(error);
      } else {
        $scrope = { effected_row: results.affectedRows, change_row: results.changedRows };
        success($scrope);
      }
    });
  }

  public Delete(connection, data, success, errors) {
    let $scrope;
    let where = ' WHERE 1 = 1 ';
    if (typeof(data.where) === 'object') {
      for (const keys in data.where) {
        if (keys) {
          where += ' AND ' + keys + ' = \'' + data.where[keys] + '\'';
        } else {
          continue;
        }
      }
    } else if (data.where !== undefined) {
      where += ' AND ' + data.where;
    } else {
      errors('You can\'t delete data by this query');
    }
    const query = 'DELETE FROM ' + data.table + where;
    connection.query(query, function(error, results, fields) {
      if (error) {
        console.log('Error : ', error);
        errors(error);
      }
      $scrope = { effected_row: results.affectedRows, change_row: results.changedRows };
      success($scrope);
    });
  }
}

// export { Database };
