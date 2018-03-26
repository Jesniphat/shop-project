import { Component, OnInit, Input, ElementRef, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Uploader } from 'angular2-http-file-upload';
import { MyUploadItem } from '../../../upload-item';
import { ApiService } from '../../../service/api.service';
import { RootscopeService } from '../../../service/rootscope.service';
import { SocketService } from '../../../service/socket.service';
import { AlertsService } from '../../../service/alerts.service';


@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.scss']
})
export class AddEditCategoryComponent implements OnInit {

  /**
   * Data from parent page e.g. category_list
   */
  @Input() categoryId: any;
  @Input() modelOpen: any = false;

  /**
   * Sent date back to parent page e.g. category_list
   */
  @Output() createCateResult: EventEmitter<number> = new EventEmitter();

  /**
  * Varable
  */
  public loginData: any;
  public error: any = '';
  public cate = {
    cateId: '',
    cateName: '',
    cateDescription: '',
    selectedStatus: 'Y',
    coverPic: 'public/images/empty-image.png',
    cateImage: ''
  };

  public uploadUrl: any = '/api/upload/category';
  public imgLink: any = '';
  public uploadedFiles: any = {
    flag: '',
    pic_name: '',
    coverPic: ''
  };
  public statusLists = [{ label: 'Active', value: 'Y' },
                        { label: 'Unactive', value: 'N' }];

  public constructor(
    @Inject(PLATFORM_ID) private platformId: object, // Get platform is cliend and server
    public router: Router,
    public route: ActivatedRoute,
    public uploaderService: Uploader,
    public apiService: ApiService,
    public $rootscope: RootscopeService,
    public socketService: SocketService,
    public el: ElementRef,
    public alerts: AlertsService
  ) { }

  public ngOnInit() {
    console.log('category_managet.component');
    /** Is client */
    if (isPlatformBrowser(this.platformId)) {
      this.loginData = JSON.parse(localStorage.getItem('logindata'));
    }
    this.imgLink = this.apiService.img;

    if (this.route.snapshot.paramMap.has('id')) {
      this.$rootscope.changeHeaderText('Category Manager');
      this.cate.cateId = this.route.snapshot.paramMap.get('id');
    } else {
      this.cate.cateId = this.categoryId;
    }

    if (this.cate.cateId !== 'create') {
      this.getCategoryByid(this.cate.cateId);
    }
  }

  /**
   * Get Category by id
   * @param id
   * @access public
   */
  public getCategoryByid(id: any) {
    this.apiService
      .get('/api/category/' + id)
      .subscribe(
      res => this.getCategoryByidDoneAction(res),
      error => this.getCategoryByidErrorAction(error)
      );
  }

  /**
   * Get category by id done
   * @param res
   * @access private
   */
  private getCategoryByidDoneAction(res: any) {
    if (res.status === true) {
      const cateResData = res.data;
      this.cate.cateId = cateResData.id;
      this.cate.cateName = cateResData.cate_name;
      this.cate.cateDescription = cateResData.cate_description;
      this.cate.selectedStatus = cateResData.status;
      this.cate.coverPic = cateResData.cover_pic;
      this.uploadedFiles.coverPic = cateResData.cover_pic;
    } else {
      if (isPlatformBrowser(this.platformId)) {
        console.log('No data');
      }
    }
  }

  /**
   * Get category by id error
   * @param error
   * @access private
   */
  private getCategoryByidErrorAction(error: any) {
    this.error = error.message;
    if (isPlatformBrowser(this.platformId)) {
      console.log('error = ', this.error);
    }
  }

  /**
   * Change status
   * @param newValue
   * @access public
   */
  public changeStatus(newValue: any) {
    this.cate.selectedStatus = newValue;
  }

  /**
   * Confirm save data
   * @access public
   */
  public confirmSaveCate() {
    // this.dialog.showModal();
  }

  /**
   * Save Category
   * @access public
   */
  public saveCategory() {
    this.$rootscope.setBlock(true, 'Saving...');
    if (this.cate.cateId === 'create') {
      this.apiService
      .post('/api/category', this.cate)
      .subscribe(
        res => this.saveCategoryDoneAction(res),
        error => this.saveCategoryErrorAction(error)
      );
    } else {
      this.apiService
      .put('/api/category', this.cate)
      .subscribe(
        res => this.saveCategoryDoneAction(res),
        error => this.saveCategoryErrorAction(error)
      );
    }
  }

  /**
   * Save category done
   * @param res
   * @access private
   */
  private saveCategoryDoneAction(res: any) {
    if (res.status === true) {
      if (isPlatformBrowser(this.platformId)) {
        this.socketService.emitMessage({
          logindata: this.loginData,
          message: this.loginData.display_name + ' save category.'
        });
      }
      this.alerts.success('บันทึกข้อมูลสำเร็จ');
      this.reset();
      this.createCateResult.emit(1);
    } else {
      this.alerts.warning('บันทึกข้อมูลไม่สำเร็จ');
      this.createCateResult.emit(0);
    }
    this.$rootscope.setBlock(false);
  }

  /**
   * Save category error
   * @param error
   * @access private
   */
  private saveCategoryErrorAction(error: any) {
    this.error = error.message;
    if (isPlatformBrowser(this.platformId)) {
      console.log('error = ', this.error);
    }
    this.alerts.warning('บันทึกข้อมูลไม่สำเร็จ');
    this.$rootscope.setBlock(false);
    this.createCateResult.emit(0);
  }

  /**
   * Click close
   * @access public
   */
  public close() {
    this.reset();
    this.createCateResult.emit(1);
  }

  /**
   * Reset form
   * @access public
   */
  public reset() {
    this.cate = {
      cateId: 'create',
      cateName: '',
      cateDescription: '',
      selectedStatus: 'Y',
      coverPic: 'public/images/empty-image.png',
      cateImage: ''
    };

    this.uploadedFiles = {
      flag: '',
      pic_name: '',
      coverPic: ''
    };
  }

  /**
   * Upload file
   * @param data
   * @access public
   */
  public uploadFile(data: any) {
    if (isPlatformBrowser(this.platformId)) {
      if (!data.target.files[0]) {
        return;
      }
      // console.log('file = ', data.target.files[0]);
      this.$rootscope.setBlock(true, 'Uploading...');
      const uploadFile = data.target.files[0];
      const myUploadItem = new MyUploadItem(uploadFile, this.uploadUrl);
      myUploadItem.formData = { FormDataKey: 'Form Data Value' };  // (optional) form data can be sent with file
      this.uploaderService.onSuccessUpload = (item, response, status, headers) => {
        let pic_name: any;
        if (typeof response === 'string') {
            pic_name = JSON.parse(response);
        } else {
            pic_name = response;
        }
         if (pic_name.status === true) {
            pic_name.data.coverPic = /* this.imgLink + */ pic_name.data.pic_path;
            pic_name.data.flag = 'c';
            this.cate.coverPic = /* this.imgLink + */ pic_name.data.pic_path;
            this.uploadedFiles = pic_name.data;
            console.log('upload seccess');
         } else {
            console.log('error = ', pic_name.error);
            this.alerts.warning('บันทึกรูปภาพไม่สำเร็จกรุณาลองใหม่อีกครั้ง');
         }
        this.$rootscope.setBlock(false);
      };
      this.uploaderService.onErrorUpload = (item, response, status, headers) => {
        console.log('onErrorUpload = ', response);
        this.$rootscope.setBlock(false);
      };
      this.uploaderService.upload(myUploadItem);
    }
  }

}
