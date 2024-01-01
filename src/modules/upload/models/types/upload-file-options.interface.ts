import { Progress } from '@aws-sdk/lib-storage';

export interface UploadFileOptions {
  file: Express.Multer.File;
  directory: string;
  progressCallback?: (progress: Progress) => void;
}
