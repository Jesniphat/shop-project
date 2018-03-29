import { Config } from './configs';

export class Databases extends Config {
  // public conn = new Config();
  public connection;

  constructor() {
    super();
    this.connection = super.init();
  }

  /**
   * Begin transection for start some query
   * @access public
   * @return Promise
   */
  public beginTransection(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.beginTransaction((err) => {
        if (err) {
          reject(err);
        } else {
          resolve('start transaction');
        }
      });
    });
  }

  /**
   * Commit sql
   * @access public
   * @return Promise
   */
  public Commit(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.commit(function(e){
        if (e) {
          reject(e);
        } else {
          resolve('commit success');
        }
      });
    });
  }


  /**
   * Rollback sql
   *
   * @access public
   * @return Promise
   */
  public Rollback(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.rollback(function() {
        resolve('rollback');
      });
    });
  }


  /**
   * End connect sql
   * @access public
   * @returns Promise
   */
  public EndConnect(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.end();
      resolve('end connect');
    });
  }


  /**
   * select all data form my sql
   * @param data
   * @access public
   * @returns Promise
   */
  public async SelectAll(data, success, errors) {
    let $scrope;
    // let select_data(){
    let fields: any = ' * ';
    let where = ' 1 = 1 ';
    let group = '';
    let order = '';
    let limit = '';

    // Genatator where string for mysql
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
    group  = await this._getSelectGroup(data);

    // Query string
    const select = 'SELECT ' + fields + ' FROM ' + data.table + ' WHERE ' + where + group + order + limit;
    // console.log('line 118 ', select);
    // Main function for get data from database
    this.connection.query(select, function(error, results, field){
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


  /**
   * Select one row of data from mysql
   * @param data
   * @access public async
   * @returns Promise
   */
  public async SelectRow(data, success, errors) {
    let $scrope;
    let fields = ' * ';
    let where = ' 1 = 1 ';
    let group = '';
    let order = '';
    let limit = '';

    // Genatator where string for mysql
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
    fields = await this._getSelectFields(data);

    // Group data if data.group is array change data.group to string else use nomal data.group
    group  = await this._getSelectGroup(data);

    // Order query if data.order is array change array to string then use data string else use ''
    order  = await this._getSelectOrder(data);

    // Limit data if data.limit is not undefined use string data.limit
    limit  = await this._getSelectLimit(data);

    // Query string
    const select = 'SELECT ' + fields + ' FROM ' + data.table + ' WHERE ' + where + order + limit;
    // Get data
    const select_row = this.connection.query(select, function(error, results, field){
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

  /**
   * Insert data to data base
   * @param data
   * @access public
   * @returns Promise
   */
  public Insert(data, success, errors): Promise<any> {
    let $scrope;
    if (typeof(data) !== 'object') {
      errors('Is not object');
      return;
    }

    const insert = 'INSERT INTO ' + data.table + ' SET ? ';
    const querys = this.connection.query(insert, data.query, function(error, results, fields) {
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

  /**
   * Update data
   * @param data
   * @access public
   * @returns Promise {}
   */
  public Update(data, success, errors) {
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
    const querys = this.connection.query(update, set, function(error, results, field) {
      // console.log('Update is ', querys.sql);
      if (error) {
        errors(error);
      } else {
        $scrope = { effected_row: results.affectedRows, change_row: results.changedRows };
        success($scrope);
      }
    });
  }


  /**
   * Data data
   * @param data
   * @access public
   * @returns Promise
   */
  public Delete(data, success, errors) {
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
    this.connection.query(query, function(error, results, fields) {
      if (error) {
        console.log('Error : ', error);
        errors(error);
      }
      $scrope = { effected_row: results.affectedRows, change_row: results.changedRows };
      success($scrope);
    });
  }


  /**
   * Genarator query where string for select all
   * @param data
   * @access private
   * @returns string where
   */
  private _getSelectFields(data): Promise<any> {
    return new Promise((resolve, reject) => {
      let where_text: any = '';
      if (Array.isArray(data.fields)) {
        where_text = data.fields.toString();
      } else if (data.fields !== undefined) {
        where_text = data.fields;
      } else {
        where_text = ' * ';
      }
      resolve(where_text);
      // resolve((Array.isArray(data.fields)) ? (data.fields).toString() : (data.fields !== undefined) ? data.fields : ' * ');
    });
  }

  /**
   * Genarator order string for select all
   * @param data
   * @access private
   * @returns Promise string order
   */
  private _getSelectOrder(data): Promise<any> {
    return new Promise((resolve, reject) => {
      let order_text = '';
      if (Array.isArray(data.order)) {
        order_text = ' ORDER BY ' + (data.order).toString();
      } else if (data.order !== undefined) {
        order_text = ' ORDER BY ' + data.order;
      } else {
        order_text = '';
      }
      resolve(order_text);
      // resolve((Array.isArray(data.order)) ? ' ORDER BY ' + (data.order).toString() : (data.order !== undefined)
      // ? ' ORDER BY ' + data.order : '');
    });
  }

  /**
   * Genarator limit string for select all
   * @param data
   * @access private
   * @returns Promise limit string
   */
  private _getSelectLimit(data): Promise<any> {
    return new Promise((resolve, reject) => {
      let limit_text = '';
      if (data.limit !== undefined) {
        limit_text = ' LIMIT ' + data.limit;
      }

      resolve(limit_text);
      // resolve((data.limit !== undefined) ? ' LIMIT ' + data.limit : '');
    });
  }

  /**
   * Genarator group string for select all
   * @param data
   * @access private
   * @returns Promise group string
   */
  private _getSelectGroup(data): Promise<any> {
    return new Promise((resolve, reject) => {
      let group_text = '';
      if (Array.isArray(data.group)) {
        group_text = ' GROUP BY ' + data.group.toString();
      } else if (data.group !== undefined) {
        group_text = ' GROUP BY ' + data.group;
      }

      resolve(group_text);
      // resolve((Array.isArray(data.group)) ? ' GROUP BY ' + (data.group).toString() : (data.group !== undefined)
      //         ? ' GROUP BY ' + data.group : '');
    });
  }
}

// export { Database };
