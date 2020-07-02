import { isFunction } from 'lodash';

import { request } from '@lib/common/utils/request';
import { UploadType } from '@common/enum/upload';
import { v4 as uuid } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const OSS = require('ali-oss');

interface ICreds {
  AccessKeyId: string;
  AccessKeySecret: string;
  SecurityToken: string;
  Expiration: string;
}

type onUploadProgress = (formatSpeed: string, percentComplete: number) => void;

export const getSts = async () => (
  request.get<ICreds>('/api/file/sts')
);


export const getQiniuToken = async (type: UploadType) => (
  request.get<string>('/api/file/token', {
    params: {
      type,
    },
  })
);

export const upload = async (formData: FormData, onUploadProgress?: onUploadProgress) => {
  let taking: number;
  const startDate = new Date().getTime();
  return request.post('//upload.qiniup.com', formData, {
    withCredentials: false,
    onUploadProgress(progressEvent: any) {
      if (progressEvent.lengthComputable) {
        const nowDate = new Date().getTime();
        taking = nowDate - startDate;
        const x = progressEvent.loaded / 1024;
        const y = taking / 1000;
        const uploadSpeed = x / y;
        let formatSpeed;
        if (uploadSpeed > 1024) {
          formatSpeed = `${(uploadSpeed / 1024).toFixed(2)}Mb/s`;
        } else {
          formatSpeed = `${uploadSpeed.toFixed(2)}Kb/s`;
        }
        const percentComplete = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        if (isFunction(onUploadProgress)) {
          onUploadProgress(formatSpeed, percentComplete);
        }
      }
    },
  });
};

export const uploadQiniu = async (
  file: File,
  type: UploadType = UploadType.PICTURE,
  onUploadProgress?: onUploadProgress,
) => {
  const { data: token } = await getQiniuToken(type);
  const formData = new FormData();
  const key = uuid();
  formData.append('file', file);
  formData.append('key', key);
  formData.append(
    'token',
    token,
  );
  await upload(formData, onUploadProgress);
  return key;
};

export const uploadOSS = async (
  file: File,
  userId: number,
  type: UploadType = UploadType.PICTURE,
  progress?: (num: number) => void,
) => {
  const { data: creds } = await getSts();
  const key = uuid();
  const client = new OSS({
    region: process.env.OSS_REGION,
    bucket: process.env.OSS_BUCKET,
    accessKeyId: creds.AccessKeyId,
    accessKeySecret: creds.AccessKeySecret,
    stsToken: creds.SecurityToken,
  });
  const { data } = await client
    .multipartUpload(process.env.OSS_PATH + key, file, {
      progress,
      callback: {
        url: 'https://soapphoto.com/api/file/upload/oss/callback',
        /* eslint no-template-curly-in-string: [0] */
        body:
          '{"userId":${x:userId},"originalname":${x:originalname},"type":${x:type},"object":${object},"bucket":${bucket},"etag":${etag},"size":${size},"mimetype":${mimeType}}',
        contentType: 'application/json',
        customValue: {
          userId,
          originalname: file.name,
          type,
        },
      },
    });
  return data.key as string;
};
