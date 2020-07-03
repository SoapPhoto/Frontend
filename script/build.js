/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config({
  path: '.env.production',
});

const chalk = require('chalk');
const spawn = require('cross-spawn');
const prompts = require('prompts');
const createLogger = require('progress-estimator');
const path = require('path');
const rimraf = require('rimraf');
const qiniu = require('qiniu');
const FileHound = require('filehound');

const PUBLIC_PATH = path.join(__dirname, '../.next');
const PREFIX = '_next';

const logger = createLogger({
  storagePath: path.join(__dirname, '.progress-estimator'),
});

const onCancel = () => {
  console.log(`${chalk.red('×')} 结束！`);
  process.exit(1);
};

const promptsOptions = { onCancel };

const getBuild = async () => new Promise((resolve, reject) => {
  const result = spawn('npm', ['run', 'build'], { stdio: 'inherit' });
  result.on('close', (code) => {
    if (code === 0) {
      resolve();
    } else {
      reject();
    }
  })
    .on('error', () => {
      reject();
    });
});

const rm = async pathname => new Promise((resolve) => {
  rimraf(pathname, () => resolve());
});

const uploadQiniu = async () => {
  const mac = new qiniu.auth.digest.Mac(process.env.QN_ACCESS_KEY, process.env.QN_SECRET_KEY);

  const options = {
    scope: process.env.QN_BUCKET,
  };

  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  const config = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z0;
  config.useHttpsDomain = true;
  config.useCdnDomain = true;

  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();

  const src = `${PUBLIC_PATH}/static`;
  const files = await FileHound.create()
    .paths(src)
    .find();
  return Promise.all(files.map(async (v) => {
    const key = v.replace(PUBLIC_PATH, PREFIX).replace(/\\/g, '/');
    return new Promise((resolve, reject) => {
      formUploader.putFile(uploadToken, key, v, putExtra, (respErr,
        respBody, respInfo) => {
        if (respErr) {
          reject(respErr);
        }
        if (respInfo.statusCode === 200) {
          resolve();
        } else {
          resolve(respInfo.statusCode);
        }
      });
    });
  }));
};

const build = async () => {
  const { value } = await prompts({
    type: 'confirm',
    name: 'value',
    message: '是否将前端打包文件上传至七牛?',
    initial: true,
  }, promptsOptions);
  const upQiniu = value;
  if (upQiniu) {
    await logger(rm(`${PUBLIC_PATH}/static`), '删除前端打包文件');
  }
  await logger(getBuild(), '打包文件');
  if (upQiniu) {
    await logger(uploadQiniu(), '上传前端打包文件到七牛');
  }
  console.log(`${chalk.green('✓')} 打包成功！`);
};

const main = async () => {
  build();
};


main();
