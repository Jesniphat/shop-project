import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';

@Injectable()
export class ScrutinizeService {

  public api: any = '';
  public data: any = [];
  public filterText: any = '';
  public filterColumn: any = '';
  public sort: any = 'id';
  public sortColumn: any = '';
  public pageNo: any = 1;
  public limit: any = 10;

  public delayID = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object, // Get platform is cliend and server
    public apiService: ApiService,
  ) { }

  public scrutinize(action, even, api, filterText, filterColumn, sort, sortColumn, pageNo, limit) {
    this.api = api;
    this.filterText = filterText;
    this.filterColumn = filterColumn;
    this.sort = sort;
    this.sortColumn = sortColumn;
    this.pageNo = pageNo;
    this.limit = limit;

    if (action === 'filter') {
      this.pageNo = 1;
      if (isPlatformBrowser(this.platformId)) {
        // console.log(event);
        if (this.delayID === null) {
          this.delayID = setTimeout(() => {
            const input_data = event;
            this.getDataServer();
            this.delayID = null;
          }, 1000);
        } else {
          if (this.delayID) {
            clearTimeout(this.delayID);
            this.delayID = setTimeout(() => {
              const input_data = event;
              this.getDataServer();
              this.delayID = null;
            }, 1000);
          }
        }
      }
    }

  }


  public getDataServer() {
    this.apiService
      .get(this.api + '?filtertext=' + this.filterText + '&filtercolumn=' + this.filterColumn
      + '&sortby=' + this.sort + '&sortColumn=' + this.sortColumn +
      + '&page=' + this.pageNo + '&limit=10')
      .subscribe(
        data => console.log(data), // this.productLists = data.data,
        error => console.log(error)
      );
  }


}
