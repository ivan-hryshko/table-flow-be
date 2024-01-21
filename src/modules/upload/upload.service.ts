<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import * as fs from 'node:fs';

=======
>>>>>>> 1db683a (Added s3 url signing)
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Progress, Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
=======
=======
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Progress, Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
>>>>>>> 70e82a2 (Added s3 url signing)
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
<<<<<<< HEAD
<<<<<<< HEAD
import * as fs from 'node:fs';
>>>>>>> 03a06b2 (Progress)
=======
>>>>>>> bb6f1af (Progress)
import { v4 as uuid } from 'uuid';
=======
>>>>>>> 70e82a2 (Added s3 url signing)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bb6f1af (Progress)
      credentials: {
        accessKeyId: configService.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('S3_SECRET_ACCESS_KEY'),
      },
<<<<<<< HEAD
=======
>>>>>>> 03a06b2 (Progress)
=======
>>>>>>> bb6f1af (Progress)
    });
  }

  async uploadFile(options: UploadFileOptions) {
    const {
      file,
      directory,
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
      progressCallback,
=======
      progressCallback = () => {},
>>>>>>> bb6f1af (Progress)
    } = options;

    const extension = path.extname(file.originalname);
    const key = `${directory}/${uuid()}${extension}`;

    try {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.configService.get('S3_BUCKET'),
          Key: key,
<<<<<<< HEAD
          Body: fs.createReadStream(file.path),
>>>>>>> 03a06b2 (Progress)
=======
          Body: file.buffer,
>>>>>>> bb6f1af (Progress)
        },
        queueSize: 4, // optional concurrency configuration
        partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
        leavePartsOnError: false, // optional manually handle dropped parts
      });

      upload.on('httpUploadProgress', (progress: Progress) => {
        progressCallback(progress);
      });

<<<<<<< HEAD
<<<<<<< HEAD
      const output = await upload.done();

      return output;
    }

<<<<<<< HEAD
=======
      await upload.done();
=======
      const output = await upload.done();

      return output;
>>>>>>> bb6f1af (Progress)
    }
    
>>>>>>> 03a06b2 (Progress)
=======
>>>>>>> 70e82a2 (Added s3 url signing)
    catch (e) {
      console.log(e);
    }
  }
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 70e82a2 (Added s3 url signing)

  async getSignedUrl(key: string, expiresIn: number): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.configService.get('S3_BUCKET'),
      Key: key,
    });
    const url = await getSignedUrl(this.s3Client, command, { expiresIn });

    return url;
  }
<<<<<<< HEAD
=======
>>>>>>> 03a06b2 (Progress)
=======
>>>>>>> 70e82a2 (Added s3 url signing)
}
