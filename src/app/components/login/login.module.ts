import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { SharedServiceModule } from '../../shared/shared-service.module';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routing';

@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
    FormsModule,
    LoginRoutingModule,
    SharedServiceModule
  ],
  declarations: [
    LoginComponent
  ],
  bootstrap: [
    LoginComponent
  ]
})
export class LoginModule { }
