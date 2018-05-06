import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, Title, Meta } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  msgs: any;
  error: any;
  response: {};
  password: any;
  username: any;
  storage: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object, // Get platform is cliend and server
    public apiService: ApiService,
    public title: Title,
    public meta: Meta,
    public router: Router
  ) {
    title.setTitle('Login to my shop');

    meta.addTags([
      { name: 'author',   content: 'jesseshop.com'},
      { name: 'keywords', content: 'jesse shop online, angular 5 universal, etc'},
      { name: 'description', content: 'This is my Angular SEO-based App, enjoy it!' }
    ]);
  }


  /**
   * Start function
   */
  public ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.storage = localStorage;
    }
    // Get login and clear cookie user.
    this.getLogin();
  }


  /**
   * Get login function
   * @access public
   * @return void
   */
  public getLogin() {
    if (isPlatformBrowser(this.platformId)) {
      const param = {'clear': 'login'};
      this.apiService
      .post('/api/authen/clearlogin', param)
      .subscribe(
        res => this.getLoginDoneAction(res),
        error => this.getLoginErrorAction(error)
      );
    }
  }

  /**
   * Get login done
   * @param res
   * @access private
   * @return void
   */
  private getLoginDoneAction(res: any) {
    // console.log("res login = ", res);
  }

  /**
   * Get login Error
   * @param error
   * @access private
   * @return void
   */
  private getLoginErrorAction(error: any) {
      this.error = error.message;
  }

  /**
   * Post login
   * @access public
   * @return void
   */
  public login() {
    const param = {
      user: this.username,
      password: this.password
    };

    this.apiService
      .post('/api/authen/login', param)
      .subscribe(
          (res) => this.loginDoneAction(res),
          (error) => this.loginErrorAction(error)
      );
  }

  /**
   * Login done action
   * @param res
   * @access private
   * @return void
   */
  private loginDoneAction(res: any) {
    if ( res.status === true) {
        const loginData = JSON.stringify(res.data);
        this.storage.setItem('logindata', loginData);
        this.router.navigate(['/manager']);
    } else {
        this.msgs = [];
        this.msgs.push({severity: 'warn', summary: 'Oops!', detail: res.error});
    }
  }


  /**
   * Login Error
   * @param error
   * @access private
   * @return void
   */
  private loginErrorAction(error: any) {
    this.error = error.message;
  }

}
