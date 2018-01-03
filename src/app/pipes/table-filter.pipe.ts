import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableFilter'
})
export class TableFilterPipe implements PipeTransform {

  public arrayUnique(array) {
    const result = array.concat();
    for (let i = 0; i < result.length; ++i) {
        for (let j = i + 1; j < result.length; ++j) {
            if (result[i] === result[j]) {
              result.splice(j--, 1);
            }
        }
    }
    return result;
  }


  transform(data: any[], str: any): any {
    if (!data || data === undefined || data.length === 0) {
      return [];
    }

    if (!str) {
      return data;
    }

    const keys = [];
    for (const k in data[0]) {
      if (k === 'img') {
        continue;
      }
      keys.push(k);
    }
    let result: any = [];
    for (let i = 0; i < keys.length; i++) {
        if (data.filter(item => (item[keys[i]].toString()).indexOf(str) !== -1).length !== 0) {
          result = result.concat(data.filter(item => item[keys[i]].indexOf(str) !== -1));
          // break;
        }
    }
    return this.arrayUnique(result);
  }

}
