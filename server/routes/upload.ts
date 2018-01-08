import * as express from 'express';
import * as uuidv1 from 'uuid/v1';
import * as promise from 'bluebird';

import { Permission } from '../library/permissions';
import { Config } from '../library/configs';
import { Database } from '../library/databases';

const uploadRouter: express.Router = express.Router();

const permission: any = new Permission();
const conn: any = new Config();
const db: any = new Database();

import * as fs from 'fs';
import * as moment from 'moment';
import * as multer from 'multer';

const dir = './dist/server/tmp/';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const uploadFile = multer({ dest: './dist/server/tmp/' });
// console.log(uploadFile);

/* GET users listing. */
uploadRouter.post('/product', uploadFile.single('file'), function (req, res, next) {
  let $scope: any = {};
  const connection: any = conn.init();
  // console.log("res product pic = ", req.file);
  const save_file = function(){
    const deferred = promise.pending();
    const newName = moment().format('YYYY-MM-DD_hh-mm-ss') + '_' + req.file.originalname;

    const dirImg = './dist/public/images/product-img/';
    if (!fs.existsSync(dirImg)) {
      fs.mkdirSync(dirImg);
    }
    const filename = dirImg + newName;
    const src = fs.createReadStream(req.file.path);
    src.pipe(fs.createWriteStream(filename));
    src.on('end', function () {
      // res.send({
      //   status: true,
      //   fileName: newName
      // });
      $scope.newName = newName;
      deferred.resolve('Save file success');
    });
    src.on('error', function (err) {
      // res.send({
      //   status: false,
      //   exMessage: 'upload file error' + err
      // });
      deferred.reject(err);
    });
    return deferred.promise;
  };

  const insert_file_data = function(){
    const deferred = promise.pending();
    const pic = req.file;
    const data = {
      table: 'product_pic',
      query: {
        productpic_name: $scope.newName,
        productpic_type: pic.mimetype,
        productpic_size: pic.size,
        productpic_path: 'public/images/product-img/' + $scope.newName,
        uuid: uuidv1()
      }
    };

    db.Insert(connection, data, (results) => {
      $scope.pic_id = results.insert_id;
      deferred.resolve('Insert pic data success');
    }, (errors) => {
      console.log('error = ', errors);
      deferred.reject(errors);
    });
    return deferred.promise;
  };

  const get_pic = function(){
    const deferred = promise.pending();
    const query = {
      table: 'product_pic',
      where: {
        id: $scope.pic_id
      }
    };
    db.SelectRow(connection, query, (results) => {
      $scope = {};
      $scope = results;
      deferred.resolve('Can get data');
    }, (errors) => {
      console.log('Can\'t get data = ', errors);
      deferred.reject(errors);
    });
    return deferred.promise;
  };

  save_file()
  .then(insert_file_data)
  .then(get_pic)
  .then(function() {
    res.json({
      status: true,
      data: $scope
    });
    connection.end();
  }).catch(function(e) {
    res.json({
      status: false,
      error: e
    });
    connection.end();
  });
});


uploadRouter.post('/category', uploadFile.single('file'), function (req, res, next) {
  const $scope: any = {};
  const connection = conn.init();
  // console.log("res product pic = ", req.file);
  const save_file = function(){
    const deferred = promise.pending();
    const newName = moment().format('YYYY-MM-DD_hh-mm-ss') + '_' + req.file.originalname;

    const dirImg = './dist/public/images/category-img/';
    if (!fs.existsSync(dirImg)) {
      fs.mkdirSync(dirImg);
    }
    const filename = dirImg + newName;
    const src = fs.createReadStream(req.file.path);
    src.pipe(fs.createWriteStream(filename));
    src.on('end', function () {
      // res.send({
      //   status: true,
      //   fileName: newName
      // });
      $scope.newName = newName;
      deferred.resolve('Save file success');
    });
    src.on('error', function (err) {
      // res.send({
      //   status: false,
      //   exMessage: 'upload file error' + err
      // });
      deferred.reject(err);
    });
    return deferred.promise;
  };

  save_file()
  .then(function() {
    res.json({
      status: true,
      data: {
        pic_name: $scope.newName,
        pic_path: 'public/images/category-img/'  + $scope.newName
      }
    });
    connection.end();
  }).catch(function(e) {
    res.json({
      status: false,
      error: e
    });
    connection.end();
  });
});


uploadRouter.post('/staff', uploadFile.single('file'), function (req, res, next) {
  const $scope: any = {};
  const connection = conn.init();
  // console.log("res product pic = ", req.file);
  const save_file = function(){
    const deferred = promise.pending();
    const newName = moment().format('YYYY-MM-DD_hh-mm-ss') + '_' + req.file.originalname;

    const dirImg = './dist/public/images/staff-img/';
    if (!fs.existsSync(dirImg)) {
      fs.mkdirSync(dirImg);
    }
    const filename = dirImg + newName;
    const src = fs.createReadStream(req.file.path);
    src.pipe(fs.createWriteStream(filename));
    src.on('end', function () {
      // res.send({
      //   status: true,
      //   fileName: newName
      // });
      $scope.newName = newName;
      deferred.resolve('Save file success');
    });
    src.on('error', function (err) {
      // res.send({
      //   status: false,
      //   exMessage: 'upload file error' + err
      // });
      deferred.reject(err);
    });
    return deferred.promise;
  };

  save_file()
  .then(function() {
    res.json({
      status: true,
      data: {
        pic_name: $scope.newName,
        pic_path: 'public/images/staff-img/'  + $scope.newName
      }
    });
    connection.end();
  }).catch(function(e) {
    res.json({
      status: false,
      error: e
    });
    connection.end();
  });
});

export { uploadRouter };
