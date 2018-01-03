import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableSort'
})
export class TableSortPipe implements PipeTransform {

  public dynamicSort(args: any) {
    let sortOrder = 1;
    if (args[0] === '-') {
        sortOrder = -1;
        args = args.substr(1);
    }

    return function (a, b) {
        const result = (a[args] < b[args]) ? -1 : (a[args] > b[args]) ? 1 : 0;
        return result * sortOrder;
    };
  }

  transform(data: any[], args: any): any {
    if (!data || data === undefined || data.length === 0) {
      return [];
    }
    // console.log(args);
    if (!args) {
      return data;
    }
    // result = data.sort(this.dynamicSort(args));
    return data.sort(this.dynamicSort(args));
  }

}
