import * as fs from 'node:fs';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Progress, Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    });
  }

  async uploadFile(options: UploadFileOptions) {
    const {
      file,
      directory,
      progressCallback,
    } = options;

    const key = `${directory}/${uuid()}`;

    try {
      const upload = new Upload({
        client: new S3Client({
          region: this.configService.get('S3_REGION'),
        }),
        params: {
          Bucket: this.configService.get('S3_BUCKET'),
          Key: key,
          Body: fs.createReadStream(file.path),
        },
        queueSize: 4, // optional concurrency configuration
        partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
        leavePartsOnError: false, // optional manually handle dropped parts
      });

      upload.on('httpUploadProgress', (progress: Progress) => {
        progressCallback(progress);
      });

      await upload.done();
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
