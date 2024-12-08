import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ProdutoService } from './produto.service';
import { ProdutoDto } from './dto/produto.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('produtos') 
@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um produto com imagem' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string' },
        descricao: { type: 'string' },
        preco: { type: 'number' },
        quantidade: { type: 'number' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async createProduto(
    @Body() createProdutoDto: ProdutoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Uma imagem do produto é obrigatória!');
    }

    return await this.produtoService.createProduto(createProdutoDto, file);
  }


  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  findAll() {
    return this.produtoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um produto pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: number) {
    return this.produtoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar informações de um produto pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: ProdutoDto })
  update(@Param('id') id: number, @Body() updateProdutoDto: ProdutoDto) {
    return this.produtoService.update(id, updateProdutoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um produto pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: number) {
    return this.produtoService.delete(id);
  }
}
