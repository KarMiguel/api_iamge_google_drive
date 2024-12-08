import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { GoogleDriveService } from './google-drive.service';
import { GoogleDriveController } from './google-drive.controller';
import * as multer from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(), 
    }),
  ],
  providers: [GoogleDriveService],
  controllers: [GoogleDriveController],
  exports: [GoogleDriveService], 
})
export class GoogleDriveModule {}
