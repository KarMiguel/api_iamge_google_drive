import { BadRequestException, Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Readable } from 'stream';

@Injectable()
export class GoogleDriveService {
  private driveClient;

  private readonly folderId = process.env.FOLDER_ID; 

  constructor() {
    const GOOGLE_DRIVE = {
      type: process.env.GOOGLE_DRIVE_TYPE,
      project_id: process.env.GOOGLE_DRIVE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_DRIVE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY,
      client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_DRIVE_CLIENT_ID,
      auth_uri: process.env.GOOGLE_DRIVE_AUTH_URI,
      token_uri: process.env.GOOGLE_DRIVE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.GOOGLE_DRIVE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.GOOGLE_DRIVE_CLIENT_CERT_URL,
    };
    
    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_DRIVE,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    this.driveClient = google.drive({ version: 'v3', auth });
  }
  async uploadFile(file: Express.Multer.File): Promise<any> {
    const fileMetadata = {
      name: file.originalname,
      parents: [this.folderId],
    };
  
    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);
  
    const media = {
      mimeType: file.mimetype,
      body: bufferStream,
    };
  
    try {
      const response = await this.driveClient.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id, name, webViewLink, webContentLink, createdTime, size, mimeType',
      });
  
      return {
        idGoogleDrive: response.data.id,
        linkVisualizacao: response.data.webViewLink,
        linkDownload: response.data.webContentLink,
        criadoEm: response.data.createdTime, 
        tamanhoArquivo: response.data.size,
        tipoMime: response.data.mimeType,
      };
    } catch (error) {
      console.error('Erro ao fazer upload para o Google Drive:', error.message);
      throw new Error('Upload falhou');
    }
  }
  
  async listFiles(): Promise<any> {
    try {
      const response = await this.driveClient.files.list({
        pageSize: 10,
        fields: 'id, name, webViewLink, webContentLink, createdTime, size, mimeType',
      });
      return response.data.files;
    } catch (error) {
      throw new BadRequestException(`Erro ao listar arquivos: ${error.message}`);
    }
  }

  async getFileById(fileId: string): Promise<any> {
    try {
      const response = await this.driveClient.files.get({
        fileId,
        fields: 'id, name, webViewLink, webContentLink, createdTime, size, mimeType',
      });
      return response.data;
    } catch (error) {
      throw new BadRequestException(`Erro ao buscar arquivo por ID: ${error.message}`);
    }
  }

  async deleteFile(fileId: string): Promise<any> {
    try {
      await this.driveClient.files.delete({
        fileId,
      });
      return { message: `Arquivo com ID ${fileId} excluído com sucesso!` };
    } catch (error) {
      throw new BadRequestException(`Erro ao excluir arquivo por ID: ${error.message}`);
    }
  }
}
