import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';

import { RootscopeService } from '../../../../service/rootscope.service';

declare const $: any;

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    public meta: Meta,
    public title: Title,
    public $rootScope: RootscopeService
  ) {
    title.setTitle('My Spiffy Dashboard Page');
    meta.addTags([
      { name: 'author',   content: 'Coursetro.com'},
      { name: 'keywords', content: 'angular seo, angular 4 universal, etc'},
      { name: 'description', content: 'This is my Angular SEO-based App, enjoy it!' }
    ]);
  }

  ngOnInit() {
    this.$rootScope.changeHeaderText('dashboard');
    // If want to use jQuery in server.
    if (isPlatformBrowser(this.platformId)) {
      $('#jquery-text').text('jQuery works!');
    }
  }

}
