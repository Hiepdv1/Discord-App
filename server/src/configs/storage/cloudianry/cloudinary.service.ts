import { v4 as genuid } from 'uuid';
import sharp from 'sharp';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { ICloudinaryFile } from './cloudinary.config';
import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

interface ISize {
  width: number;
  height: number;
  mimetype?: string;
}

type Folder =
  | 'NexTalk'
  | 'NexTalk/videos'
  | 'NexTalk/images'
  | 'NexTalk/ServerImages';

@Injectable()
export class CloudinaryService {
  private async UploadStream(
    file: ICloudinaryFile,
    sizes: ISize,
    folder?: string
  ): Promise<{ _id: string; url: string }> {
    return new Promise(async (resolve, reject) => {
      let resizedBuffer: Buffer = file.buffer;
      if (sizes.mimetype === 'image/gif') {
        resizedBuffer = file.buffer;
      } else if (sizes.mimetype.startsWith('image/')) {
        resizedBuffer = await sharp(file.buffer).resize(sizes).toBuffer();
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder,
          public_id: genuid(),
        },
        (
          err: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (result) {
            // When stored directly on the server, remove files after they are uploaded
            // fs.unlink(file.path, (errFs) => {
            //     if (errFs) reject(errFs);
            // });
            resolve({
              _id: result.public_id,
              url: result.secure_url,
            });
          }
          reject(err);
        }
      );
      uploadStream.end(resizedBuffer);
    });
  }

  async UploadFile(
    files: ICloudinaryFile[] | ICloudinaryFile,
    folder: Folder,
    mimetype?: string,
    sizes?: ISize
  ) {
    const resize = {
      width: sizes?.width || 500,
      height: sizes?.height || 500,
      mimetype: mimetype,
    };
    if (Array.isArray(files)) {
      const filesPromise = files.map((file) =>
        this.UploadStream(file, resize, folder)
      );
      const result = await Promise.all(filesPromise);
      return result;
    } else {
      const uploadToCloud = await this.UploadStream(files, resize, folder);
      return uploadToCloud;
    }
  }

  public async createThumbnailFromVideo(
    publicId: string,
    timestamp: string,
    resize?: { width: number; height: number },
    maxRetries = 20,
    retryDelay = 10000
  ): Promise<Buffer> {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const thumbnailUrl = cloudinary.url(publicId, {
          resource_type: 'video',
          start_offset: timestamp,
          width: resize?.width || 200,
          height: resize?.height || 200,
          crop: 'scale',
          format: 'jpg',
        });

        const response = await axios.get(thumbnailUrl, {
          responseType: 'arraybuffer',
        });

        if (response.status === 200) {
          console.log('Thumbnail created successfully with attempt: ', attempt);
          return Buffer.from(response.data);
        }
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } catch {
        throw new BadRequestException('Failed to create thumbnail from video');
      }
    }
  }

  public async uploadBuffer(
    buffer: Buffer,
    folder: string,
    fileName: string
  ): Promise<{ _id: string; url: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, public_id: fileName, resource_type: 'image' },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve({ _id: result.public_id, url: result.secure_url });
        }
      );
      uploadStream.end(buffer);
    });
  }

  private async DestroyStream(cloudId: string, resourceType: string) {
    try {
      const destroyStream = await cloudinary.uploader.destroy(cloudId, {
        resource_type: resourceType,
      });

      if (destroyStream.result === 'ok') {
        return { cloudId, status: 'deleted' };
      }

      return { cloudId, status: 'not_found', message: destroyStream.message };
    } catch (error: any) {
      return { cloudId, status: 'not_found', message: error.message };
    }
  }

  async Destroy(cloudIds: string | Array<string>, resourceType: string) {
    if (Array.isArray(cloudIds)) {
      const destroyPromise = cloudIds.map((cloudId) =>
        this.DestroyStream(cloudId, resourceType)
      );
      const result = await Promise.all(destroyPromise);
      console.log(result);
      return result;
    } else {
      const result = await this.DestroyStream(cloudIds, resourceType);
      console.log(result);
      return result;
    }
  }
}
