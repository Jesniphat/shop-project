export class Gencode {
  constructor(private db) {}
  public Code (table, fld, prefix, size, start, callback_success, callback_error) {
    let where = ' 1 = 1 ';
    if (prefix !== '') {
        where += ' AND `' + fld + '` LIKE \'' + prefix + '%\'';
    }
    const sql = {
      table: table,
      fields: 'max(`' + fld + '`) as maxCode',
      where: where
    };
    let next: any = '';
    const maxCode = this.db.SelectRow(sql, (result) => {
      if (result.maxCode) {
        console.log('Maxcode 18 = ', result.maxCode);
        next = parseInt((result.maxCode).substr(prefix.length), null) + 1;
        console.log('20 => ', prefix + '0000000000000' + next);
        callback_success(prefix + (('0000000000000' + next).substr(-size)));
      } else {
        next = start + 0;
      }
    }, (error) => {
      callback_error(error);
    });
  }
}
