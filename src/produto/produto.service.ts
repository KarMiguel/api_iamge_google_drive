import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProdutoDto } from './dto/produto.dto';
import { GoogleDriveService } from '../google-drive/google-drive.service';

@Injectable()
export class ProdutoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  async createProduto(createProdutoDto: ProdutoDto, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhuma imagem foi enviada!');
    }
  
    try {
      const uploadedImage = await this.googleDriveService.uploadFile(file);
  
      const {
        idGoogleDrive,
        linkVisualizacao,
        linkDownload,
        criadoEm,
        tamanhoArquivo,
        tipoMime,
      } = uploadedImage;
      
      if (!criadoEm || isNaN(Date.parse(criadoEm))) {
        throw new BadRequestException('Data de criação inválida retornada pelo Google Drive!');
      }
      
      const imagem = await this.prisma.imagem.create({
        data: {
          idGoogleDrive,
          linkVisualizacao,
          linkDownload,
          criadoEm: new Date(criadoEm),
          tamanhoArquivo: tamanhoArquivo || '0', 
          tipoMime: tipoMime || 'unknown', 
        },
      });
        
      const produto = await this.prisma.produto.create({
        data: {
          nome: createProdutoDto.nome,
          descricao: createProdutoDto.descricao,
          preco: parseFloat(createProdutoDto.preco.toString()), 
          quantidade: parseInt(createProdutoDto.quantidade.toString(), 10), 
          imagem: {
            connect: { id: imagem.id },
          },
        },
        include: {
          imagem: true,
        },
      });
  
      return produto;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
  
      if (error.code === 'P2002') {
        throw new BadRequestException('Produto com dados duplicados já existe!');
      }
  
      throw new BadRequestException('Erro ao criar produto e salvar imagem!');
    }
  }

  async findAll() {
    return this.prisma.produto.findMany({
      include: {
        imagem: true, 
      },
    });
  }
  
  async findOne(id: number) {
    return this.prisma.produto.findUnique({
      where: { id },
      include: {
        imagem: true, 
      },
    });
  }
  
  async update(id: number, data: ProdutoDto) {
    return this.prisma.produto.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.produto.delete({ where: { id } });
  }
}
