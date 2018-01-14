import * as Promise from 'bluebird';

export class Database {
  // constructor(public conn: Config) { }
  constructor() { }

  public beginTransection(connection: any) {
    // console.log('config begin transection');
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

  public Commit(connection, success, errors) {
    connection.commit(function(e){
      if (e) {
        errors(e);
      } else {
        // console.log('commit success');
        success('commit success');
      }
    });
  }

  public Rollback(connection, roll) {
    connection.rollback(function() {
     roll('rollback');
    });
  }

  public SelectAll(connection, data, success, errors) {
    let $scrope;
    // let select_data(){
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
    order  = (Array.isArray(data.order)) ? ' ORDER BY ' + (data.order).toString() : (data.order !== undefined)
           ? ' ORDER BY ' + data.order : '';
    limit  = (data.limit !== undefined) ? ' LIMIT ' + data.limit : '';
    group  = (Array.isArray(data.group)) ? ' GROUP BY ' + (data.group).toString() : (data.group !== undefined)
           ? ' GROUP BY ' + data.group : '';

    const select = 'SELECT ' + fields + ' FROM ' + data.table + ' WHERE ' + where + group + order + limit;
    // console.log('select data = ', select);
    connection.query(select, function(error, results, field){
      if (error) {
        console.log('error : ', error);
        errors(error);
      } else if (results.length === 0) {
        console.log('Nodata => ', results);
        $scrope = results;
        success($scrope);
      }else {
        $scrope = results;
        success($scrope);
      }
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
