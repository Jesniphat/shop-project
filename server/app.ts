// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

// import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

// Import Routes
import { menuRouter } from './routes/menu';
import { homeRouter } from './routes/home';
import { authenRouter } from './routes/authen';
import { categoryRouter } from './routes/category';
import { productRouter } from './routes/product';
import { productStoreRouter } from './routes/productstore';
import { uploadRouter } from './routes/upload';
import { staffRouter } from './routes/staff';
import { usersRouter } from './routes/users';
import { orderRouter } from './routes/order';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app: express.Application = express();

// const PORT = process.env.PORT || 8000;
const DIST_FOLDER = join(process.cwd(), 'dist');

let template = '';
if (process.env.PROD === 'production') {
  // Our index.html we'll use as our template
  template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();
}

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../dist/server-side/main.bundle');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';

const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/menu', menuRouter);
app.use('/api/authen', authenRouter);
app.use('/api/home', homeRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/productstore', productStoreRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/staff', staffRouter);
app.use('/api/user', usersRouter);
app.use('/api/order', orderRouter);

// Disable 304
// app.disable('etag');

// Server static files from /public
app.use('/public', express.static(join(DIST_FOLDER, 'public')));

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'browser', 'index.html'), { req });
});

// This one add it with out ex from angular.io It same express gen. For debug some error. Then we add ./bin/www.ts
// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const err = new Error('Not Found');
  next(err);
});

// production error handler
// no stacktrace leaked to user
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message,
  });
});

export { app };
