import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pageNumber'
})
export class PageNumberPipe implements PipeTransform {

  transform(data: any[], start: any): any {
    if (!data || data === undefined || data.length === 0) {
      return [];
    }
    const result = {'data': [], 'page': []};
    const pageNumber = data.length / start.row ;
    const startNo = (start.pageNo * start.row) - start.row;
    const finishNo = (start.pageNo * start.row);
    // console.log(Math.ceil(pageNumber));
    for (let j = 1; j <= Math.ceil(pageNumber); j++) {
      result.page.push(j);
    }
    for (let i = startNo; i < finishNo; i++) {
        if (!data[i]) {
            break;
        }
        result.data.push(data[i]);
    }

    return result.data;
  }
}
