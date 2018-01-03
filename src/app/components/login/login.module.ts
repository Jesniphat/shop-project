import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login.component';
import { Routing } from './login.routing';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    SharedModule,
    Routing
  ],
  declarations: [
    LoginComponent
  ],
  bootstrap: [
    LoginComponent
  ]
})
export class LoginModule { }
