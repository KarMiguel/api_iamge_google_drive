import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProdutoModule } from './produto/produto.module';
import { GoogleDriveModule } from './google-drive/google-drive.module';

@Module({
  imports: [PrismaModule, ProdutoModule, GoogleDriveModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
