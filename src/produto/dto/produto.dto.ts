import { IsNotEmpty, IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class ProdutoDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  preco: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantidade: number;
}
