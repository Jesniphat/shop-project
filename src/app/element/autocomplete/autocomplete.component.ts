import { Component, OnInit, Input, ElementRef, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ApiService } from '../../service/api.service';
import { RootscopeService } from '../../service/rootscope.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  /**
   * Data from parente
   */
  @Input() autoCompleteData: any;

  public request: any = null;
  public delayID = null;

  public autocompleteText: any = '';
  public show = false;
  public autoCompleteDataList: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    public apiService: ApiService,
    public $rootscope: RootscopeService,
  ) { }

  public ngOnInit() {

  }

  /**
   * Search data from server
   * @param event
   * @access public
   */
  public search(event) {
    if (isPlatformBrowser(this.platformId)) {
      if (this.delayID === null) {
        this.delayID = setTimeout(() => {
          const input_data = event;
          this.getDataList(event);
          this.delayID = null;
        }, 500);
      } else {
        if (this.delayID) {
          clearTimeout(this.delayID);
          this.delayID = setTimeout(() => {
            const input_data = event;
            this.getDataList(event);
            this.delayID = null;
          }, 500);
        }
      }
    }
  }


  public getDataList(text) {
    if (this.request) {
      this.request.unsubscribe();
    }

    this.request = this.apiService
      .get(this.autoCompleteData.api + '?column=' + this.autoCompleteData.column + '&keyword=' + text)
      .subscribe(
        data => this.getDataListDoneAction(data), // this.productLists = data.data,
        error => this.getDataListErrorAction(error)
      );
  }

  private getDataListDoneAction(res) {
    this.show = true;
    this.autoCompleteDataList = res.data;
  }

  private getDataListErrorAction(error) {
    console.log(error);
  }

  public setText(text: any) {
    this.show = false;
    this.autocompleteText = text;
  }

  public blurAutocomplete() {
    setTimeout(() => {
      this.show = false;
    }, 500);
  }

}
