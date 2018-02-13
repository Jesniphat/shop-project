import { Config } from './configs';

export class Databases extends Config {
  // public conn = new Config();
  public connection;

  constructor() {
    super();
    this.connection = super.init();
  }

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

  public Rollback(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.rollback(function() {
        resolve('rollback');
      });
    });
  }

  public EndConnect(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.connection.end());
    });
  }

  public async SelectAll(data): Promise<any> {
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
    group  = await this._getSelectGroup(data);

    // Query string
    const select = 'SELECT ' + fields + ' FROM ' + data.table + ' WHERE ' + where + group + order + limit;

    // Main function for get data from database
    return new Promise((resolve, reject) => {
      this.connection.query(select, (error, results, field) => {
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


  public async SelectRow(data): Promise<any> {
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

    fields = await this._getSetectRowField(data);
    group  = await this._getSetectRowGroup(data);
    order  = await this._getSelectRowOrder(data);
    limit  = await this._getSelectRowLimit(data);

    return new Promise((resolve, reject) => {
      const select = 'SELECT ' + fields + ' FROM ' + data.table + ' WHERE ' + where + order + limit;
      const select_row = this.connection.query(select, function(error, results, field){
        // console.log('sql select row = ', select_row.sql);
        if (error) {
          console.log('error : ', error);
          reject(error);
        } else if (results.length === 0) {
          console.log('Nodata => ', results);
          $scrope = results;
          resolve({});
        } else {
          $scrope = results;
          resolve($scrope[0]);
        }
      });
    });
  }

  public async Insert(data): Promise<any> {
    return new Promise((resolve, reject) => {
      let $scrope;
      if (typeof(data) === 'object') {

      } else {
        reject('Is not object');
        return;
      }

      const insert = 'INSERT INTO ' + data.table + ' SET ? ';
      const querys = this.connection.query(insert, data.query, function(error, results, fields) {
        // console.log(querys.sql);
        if (error) {
          reject(error);
        } else {
          $scrope = {insert_id: results.insertId, effected_row: results.affectedRows, change_row: results.changedRows };
          // console.log('INSERT SUCCESS = ', $scrope);
          resolve($scrope);
        }
      });
    });
  }

  public async Update(data): Promise<any> {
    return new Promise((resolve, reject) => {
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
          reject(error);
        } else {
          $scrope = { effected_row: results.affectedRows, change_row: results.changedRows };
          resolve($scrope);
        }
      });
    });
  }

  public async Delete(data): Promise<any> {
    return new Promise((resolve, reject) => {
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
        reject('You can\'t delete data by this query');
      }
      const query = 'DELETE FROM ' + data.table + where;
      this.connection.query(query, function(error, results, fields) {
        if (error) {
          console.log('Error : ', error);
          reject(error);
        }
        $scrope = { effected_row: results.affectedRows, change_row: results.changedRows };
        resolve($scrope);
      });
    });
  }


  /**
   * Genarator format select stuff for select all
   * @param data
   * @access private
   * @returns resolve let select_text
   */
  private _getSelectFields(data): Promise<any> {
    return new Promise((resolve, reject) => {
      let select_text = '';
      if (Array.isArray(data.fields)) {
        select_text = data.fields.toString();
      } else if (data.fields !== undefined) {
        select_text = data.fields;
      } else {
        select_text = ' * ';
      }

      resolve(select_text);
      // resolve((Array.isArray(data.fields)) ? (data.fields).toString() : (data.fields !== undefined) ? data.fields : ' * ');
    });
  }


  /**
   * Genarator format order stuff for select all
   * @param data
   * @access private
   * @returns resolve let order_text
   */
  private _getSelectOrder(data): Promise<any> {
    return new Promise((resolve, reject) => {
      let order_text = '';
      if (Array.isArray(data.order)) {
        order_text = ' ORDER BY ' + data.order.toString();
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


  private _getSetectRowField(data): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve((Array.isArray(data.fields)) ? (data.fields).toString() : (data.fields !== undefined) ? data.fields : ' * ');
    });
  }

  private _getSetectRowGroup(data): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve((Array.isArray(data.group)) ? ' GROUP BY ' + (data.group).toString() : (data.group !== undefined)
              ? ' GROUP BY ' + data.group : '');
    });
  }

  private _getSelectRowOrder(data): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve((Array.isArray(data.order)) ? ' ORDER BY ' + (data.order).toString() : (data.order !== undefined)
      ? ' ORDER BY ' + data.order : '');
    });
  }

  private _getSelectRowLimit(data): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve((data.limit !== undefined) ? ' LIMIT ' + data.limit : '');
    });
  }


}

// export { Database };
