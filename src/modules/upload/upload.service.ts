import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Progress, Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

import { UploadFileOptions } from './models/types/upload-file-options.interface';

@Injectable()
export class UploadService {
  s3Client: S3Client;
  configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
    this.s3Client = new S3Client({
      region: configService.get('S3_REGION'),
      credentials: {
        accessKeyId: configService.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(options: UploadFileOptions) {
    const {
      file,
      directory,
      progressCallback = () => {},
    } = options;

    const extension = path.extname(file.originalname);
    const key = `${directory}/${uuid()}${extension}`;

    try {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.configService.get('S3_BUCKET'),
          Key: key,
          Body: file.buffer,
        },
        queueSize: 4, // optional concurrency configuration
        partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
        leavePartsOnError: false, // optional manually handle dropped parts
      });

      upload.on('httpUploadProgress', (progress: Progress) => {
        progressCallback(progress);
      });

      const output = await upload.done();

      return output;
    }
    
    catch (e) {
      console.log(e);
    }
  }

  async getSignedUrl(key: string, expiresIn: number): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.configService.get('S3_BUCKET'),
      Key: key,
    });
    const url = await getSignedUrl(this.s3Client, command, { expiresIn });

    return url;
  }
}
