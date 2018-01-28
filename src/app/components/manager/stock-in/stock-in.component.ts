import { Component, OnInit, OnDestroy, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ProductManagerComponent } from '../product/product-manager/product-manager.component';
import { TableElementComponent } from '../../../element/table-element/table-element.component';
import { AutocompleteComponent } from '../../../element/autocomplete/autocomplete.component';

import { ProductStorageService } from '../../../service/product-storage.service';
import { ApiService } from '../../../service/api.service';
import { RootscopeService } from '../../../service/rootscope.service';

declare let $: any;
declare var toastr: any;

@Component({
  selector: 'app-stock-in',
  templateUrl: './stock-in.component.html',
  styleUrls: ['./stock-in.component.scss']
})
export class StockInComponent implements OnInit, OnDestroy {

  /** Connect to child */
  @ViewChild(TableElementComponent) private tableElementComponent: TableElementComponent;
  @ViewChild(ProductManagerComponent) public productManagerComponent: ProductManagerComponent;
  @ViewChild(AutocompleteComponent) private autocompleteComponent: AutocompleteComponent;

  /**
   * Product id.
   */
  public productId: any = 'create';

  /**
   * Send data to autocomplete child.
   */
  public autoCompleteData: any = {
    api: '/api/product/name',
    column: 'product_name'
  };

  /**
   * Create var.
   */
  public productNameList: any[];
  public productName: any = '';
  public storage: any;

  public stockInProduct: any = {
    id: '',
    code: '',
    name: '',
    qty:  '',
    staffid: 0
  };

  /**
   * Data table var
   */
  public stockList: any[] = [];
  public columns = [
    { name: 'Code', prop: 'code' },
    { name: 'Name', prop: 'product_name' },
    { name: 'Lot In', prop: 'lot_in' },
    { name: 'Price', prop: 'product_price'}
  ];


  /**
   * Create Autocomplete Option
   */
  public options: any = { };

  /**
   * Dialog
   */
  public addProductDialog: any;

  /**
   * Unsubscribe var
   */
  public unsubProductList: any;

  /**
   * constructor of class
   *
   * @param storages
   * @access public
   */
  public constructor (
    @Inject(PLATFORM_ID) private platformId: object, // Get platform is cliend and server
    public storages: ProductStorageService,
    public apiService: ApiService,
    // public dialogService: DialogService,
    public $rootScope: RootscopeService,
  ) { }


  /**
   * start function
   *
   * @access public
   */
  public ngOnInit() {
    // console.log(this.storages.getProductNameList());
    if (isPlatformBrowser(this.platformId)) {
      this.options = {
        data: [],
        getValue: 'name',
        template: {
          type: 'description',
          fields: {
            description: 'code'
          }
        },
        list: {
          onChooseEvent: function() {
            const selectedItemValue = $('#product-name').getSelectedItemData().id;
            $('#product-id').val(selectedItemValue).trigger('change');
          }
        }
      };

      this.$rootScope.setBlock(false);
      this.storage = localStorage;
      if (this.storage.getItem('logindata')) {
        const logindata = JSON.parse(this.storage.getItem('logindata'));
        this.stockInProduct.staffid = logindata.id;
      }

      this.unsubProductList = this.storages.$productList.subscribe(data => this.getProductNameList(data));
      this.storages.productListGetting();
    }
    // this.addProductDialog = this.dialogService.build(document.getElementById('add-product')); **
  }


  /**
   * Submit function  getproductbyid
   *
   * @access public
   */
  public searchProduct() {
    if (isPlatformBrowser(this.platformId)) {
      console.log($('#product-id').val());
      if (!$('#product-id').val()) {
        this.productId = 'create';
        // this.addProductDialog.showModal();
        document.getElementById('addproductmodel').style.display = 'block';
        this.productManagerComponent.reset();
        return;
      }
      this.$rootScope.setBlock(true);
      const param = {
        product_id: $('#product-id').val()
      };
      this.apiService
      // .post('/api/productstore/getproductbyid', param)
      .get('/api/productstore/' + param.product_id)
      .subscribe(
        res => this.getProductByidDoneAction(res),
        error => this.getProductByidErrorAction(error)
      );
    }
  }


  /**
   * When get product complete
   * @param res
   * @access public
   * @return void
   */
  public getProductByidDoneAction(res: any) {
    this.stockInProduct.id = res.data.id;
    this.stockInProduct.code = res.data.code;
    this.stockInProduct.name = res.data.product_name;

    this.getStockList(res.data.id);

    this.$rootScope.setBlock(false);
  }


  /**
   * When get product not complete
   *
   * @param error
   * @access public
   * @return void
   */
  public getProductByidErrorAction(error: any) {
    if (isPlatformBrowser(this.platformId)) {
      console.log(error);
      this.$rootScope.setBlock(false);
    }
  }


  /**
   * Clear hidden box data when focus on autocomplete box
   */
  public clearData() {
    if (isPlatformBrowser(this.platformId)) {
      $('#product-id').val('');
    }
  }


  /**
   * Show obsavel data
   *
   * @access public
   * @param data
   * @return voie
   */
  public getProductNameList(data: any) {
    if (isPlatformBrowser(this.platformId)) {
      console.log(data);
      this.options.data = data;
      $('#product-name').easyAutocomplete(this.options);
    }
  }


  /**
   * Save ot in data
   *
   * @param none
   * @access public
   * @return void
   */
  public saveLotIn() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('save lot in');
      this.$rootScope.setBlock(true);
      const param = {
        product_id: this.stockInProduct.id,
        product_code: this.stockInProduct.code,
        product_qty: this.stockInProduct.qty,
        staff_id: this.stockInProduct.staffid
      };
      this.apiService
        .post('/api/productstore/saveStockIn', param)
        .subscribe(
          res => this.saveStockDoneAction(res),
          error => this.saveStockErrorAction(error)
      );
    }
  }

/**
 * Save stock done.
 *
 * @param res
 * @access private
 */
  private saveStockDoneAction(res: any) {
    if (isPlatformBrowser(this.platformId)) {
      console.log(res);
      if (res.status === true) {
        this.reset();
        this.$rootScope.setBlock(false);
        this.searchProduct();
        // toastr.success('บันทึกข้อมูลสำเร็จ', 'Success!');
      } else {
        console.log('can\'t save ', res.error);
        this.$rootScope.setBlock(false);
        // toastr.warning('บันทึกข้อมูลไม่สำเร็จ', 'Warning!');
      }
    }
  }


  /**
   * Save stock error
   *
   * @param error
   * @access private
   */
  private saveStockErrorAction(error: any) {
    if (isPlatformBrowser(this.platformId)) {
      console.log('can\'t save ', error);
      this.$rootScope.setBlock(false);
      // toastr.warning('บันทึกข้อมูลไม่สำเร็จ', 'Warning!');
    }
  }


  /**
   * Get stock list
   *
   * @access private
   */
  private getStockList(id: any) {
    if (isPlatformBrowser(this.platformId)) {
      const param = {
        product_id: id // $('#product-id').val()
      };
      this.apiService
      // .post('/api/productstore/getStockList', param)
      .get('/api/productstore/getStockList/' + param.product_id)
      .subscribe(
        (res) => {
          this.stockList = res.data;
          console.log(this.stockList);
          const stockColumn = [
            {'name': 'Product code', 'column': 'code'},
            {'name': 'Product name', 'column': 'product_name'},
            {'name': 'Lot in', 'column': 'lot_in'},
            {'name': 'Product price', 'column': 'product_price'}
          ];
          const action = {
            search: false,
            status: false,
            edit: false,
            delete: false
          };
          this.tableElementComponent.getTableDataLists({list: res.data, column: stockColumn, action: action});
        },
        error => console.log(error)
      );
    }
  }

  /**
   * Reset every thing
   *
   * @param none
   * @access public
   * @return void
   */
  public reset() {
    if (isPlatformBrowser(this.platformId)) {
      this.stockInProduct = {
        id: '',
        code: '',
        name: '',
        qty:  '',
        staffid: this.stockInProduct.staffid
      };
    }
    // this.options.data = [];
    // $("#product-id").val('');
  }

  public createProductResult(result) {
    console.log(result);
    if (result) {
      // this.getAllProduct();
      if (isPlatformBrowser(this.platformId)) {
        document.getElementById('addproductmodel').style.display = 'none';
      }
    } else {
      if (isPlatformBrowser(this.platformId)) {
        console.log('can\'t save');
      }
    }
  }

  /**
   * When component has destroy
   * @access public
   */
  public ngOnDestroy() {
    this.unsubProductList.unsubscribe();
  }

}
