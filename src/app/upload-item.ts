import { UploadItem } from 'angular2-http-file-upload';

export class MyUploadItem extends UploadItem {
   constructor(file: any, url: any) {
       super();
       this.url = url;
       this.headers = { HeaderName: 'pic', AnotherHeaderName: 'pic' };
       this.file = file;
   }
}