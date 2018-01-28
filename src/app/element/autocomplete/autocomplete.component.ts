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

  /**
   * Sent something to parent
   */
  @Output() autocompleteResultText: EventEmitter<number> = new EventEmitter();

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


  /**
   * Get data when typing in input bow from server
   * @param text
   * @access public
   */
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

  /**
   * Get data from server done
   * @param res
   * @access private
   */
  private getDataListDoneAction(res) {
    this.request = null;
    this.show = true;
    this.autoCompleteDataList = res.data;
  }

  /**
   * Can't get data from server
   * @param error
   * @access private
   */
  private getDataListErrorAction(error) {
    console.log(error);
    this.request = null;
    this.show = false;
  }

  /**
   * When click list of data list.
   * @param text
   * @access public
   */
  public setText(text: any) {
    this.show = false;
    this.autocompleteText = text;
  }

  /**
   * When move out from input box not show list of data list
   * @access public
   */
  public blurAutocomplete() {
    setTimeout(() => {
      this.show = false;
    }, 300);
  }

  /**
   * Click search bt sent data text from input box to parant
   */
  public clickSearch() {
    this.show = false;
    this.autocompleteResultText.emit(this.autocompleteText);
  }

}
