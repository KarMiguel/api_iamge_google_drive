import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GoogleDriveModule } from 'src/google-drive/google-drive.module';

@Module({
  imports: [PrismaModule, GoogleDriveModule], 
  providers: [ProdutoService],
  controllers: [ProdutoController],
})
export class ProdutoModule {}
