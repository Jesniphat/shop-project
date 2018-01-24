import { Component, OnInit, Input, ElementRef, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-table-element',
  templateUrl: './table-element.component.html',
  styleUrls: ['./table-element.component.scss']
})
export class TableElementComponent implements OnInit {
  /**
   * Data from parent page e.g. category_list
   */
  @Input() dataTables: any[];

  /**
   * Sent date back to parent page e.g. category_list
   */
  @Output() tableElementResult: EventEmitter<number> = new EventEmitter();
  @Output() editData: EventEmitter<number> = new EventEmitter();
  @Output() deleteData: EventEmitter<number> = new EventEmitter();

  /**
   * Varable
   */
  public dataTableLists: any[] = [];
  public columnList: any;
  public isAction: any = false;
  public sortTableData: any = '';
  public filterText: any = '';
  public pageNo: any = 1;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object, // Get platform is cliend and server
    public router: Router
  ) { }

  ngOnInit() {
  }

  /**
   * Get data list from parante
   * @param Objext{} tableData
   * @access public
   * @returns void
   */
  public getTableDataLists(tableData: any) {
    this.dataTableLists = tableData.list;
    this.columnList = tableData.column;
    this.isAction = tableData.action;
  }

  /**
   * When focus on filter box.
   * @access public
   */
  public focusFilter() {
    this.pageNo = 1;
  }


  /**
   * When click head table for sort
   * @param any data **data of element
   * @param string key
   */
  public sortTable(data: any, key: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.dataTableLists = this.dataTableLists.slice(0, this.dataTableLists.length);
      const currentClass = data.target.classList;
      const listHeadClass = document.getElementsByClassName('head');
      for (let i = 0; i < listHeadClass.length; i++) {
        if (listHeadClass[i].classList[1] === currentClass[1]) {
          continue;
        }
        listHeadClass[i].classList.remove('sort-up');
        listHeadClass[i].classList.remove('sort-down');
      }

      if (currentClass[2] === undefined) {
        document.getElementsByClassName(currentClass[1])[0].classList.add('sort-up');
        // this.categoryLists.sort(this.dynamicSort(key));
        this.sortTableData = key;
      } else if (currentClass[2] === 'sort-up') {
        document.getElementsByClassName(currentClass[1])[0].classList.remove('sort-up');
        document.getElementsByClassName(currentClass[1])[0].classList.add('sort-down');
        // this.categoryLists.sort(this.dynamicSort('-' + key));
        this.sortTableData = '-' + key;
      } else if (currentClass[2] === 'sort-down')  {
        document.getElementsByClassName(currentClass[1])[0].classList.remove('sort-down');
        document.getElementsByClassName(currentClass[1])[0].classList.add('sort-up');
        // this.categoryLists.sort(this.dynamicSort(key));
        this.sortTableData = key;
      }
    }
  }

  /**
   * Sent data edit to parant
   * @param data
   * @access public
   */
  public edit(data: any) {
    this.editData.emit(data);
  }

  /**
   * Sent data delete to parant
   * @param data
   * @access public
   */
  public delete(data: any) {
    this.deleteData.emit(data);
  }

}
