import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';

import { SharedModule } from './shared/shared.module';
import { Routing } from './app.routing';

import { LoginModule } from './components/login/login.module';
import { ManagerModule } from './components/manager/manager.module';

import { AppComponent } from './app.component';
import { AlertsComponent } from './components/alerts/alerts.component';


@NgModule({
  declarations: [
    AppComponent,
    AlertsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'shop'}),
    FormsModule,
    HttpClientModule,
    Routing,
    SharedModule,
    LoginModule,
    ManagerModule
  ],
  // providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  // constructor(
  //   @Inject(PLATFORM_ID) private platformId: Object,
  //   @Inject(APP_ID) private appId: string) {
  //   const platform = isPlatformBrowser(platformId) ?
  //     'on the server' : 'in the browser';
  //   console.log(`Running ${platform} with appId=${appId}`);
  // }
}
