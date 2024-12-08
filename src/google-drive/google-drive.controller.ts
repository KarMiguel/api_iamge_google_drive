import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Delete,
    Param,
    Get,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { GoogleDriveService } from './google-drive.service';
  import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
  
  @Controller('google-drive')
  @ApiTags('Google Drive')
  export class GoogleDriveController {
    constructor(private readonly googleDriveService: GoogleDriveService) {}
  
    @Post('upload')
    @ApiOperation({ summary: 'Fazer upload de um arquivo para o Google Drive' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: { type: 'string', format: 'binary' },
        },
      },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new BadRequestException('Nenhum arquivo foi enviado!');
      }
  
      try {
        const uploadedFile = await this.googleDriveService.uploadFile(file);
        return {
          message: 'Upload realizado com sucesso!',
          file: uploadedFile,
        };
      } catch (error) {
        throw new BadRequestException('Erro ao fazer upload para o Google Drive!');
      }
    }

    @Get('list')
    @ApiOperation({ summary: 'Listar arquivos no Google Drive' })
    async listFiles() {
      try {
        const files = await this.googleDriveService.listFiles();
        return { message: 'Arquivos listados com sucesso!', files };
      } catch (error) {
        throw new BadRequestException('Erro ao listar arquivos!');
      }
    }
  
    @Get(':fileId')
    @ApiOperation({ summary: 'Buscar arquivo no Google Drive pelo ID' })
    async getFileById(@Param('fileId') fileId: string) {
      try {
        const file = await this.googleDriveService.getFileById(fileId);
        return { message: 'Arquivo encontrado com sucesso!', file };
      } catch (error) {
        throw new BadRequestException('Erro ao buscar arquivo pelo ID!');
      }
    }
  
    @Delete(':fileId')
    @ApiOperation({ summary: 'Excluir arquivo no Google Drive pelo ID' })
    async deleteFile(@Param('fileId') fileId: string) {
      try {
        const result = await this.googleDriveService.deleteFile(fileId);
        return result;
      } catch (error) {
        throw new BadRequestException('Erro ao excluir arquivo pelo ID!');
      }
    }
  }
  