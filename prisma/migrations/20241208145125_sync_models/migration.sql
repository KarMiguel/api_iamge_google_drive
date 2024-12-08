-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "preco" DOUBLE PRECISION NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "imagemId" INTEGER,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imagem" (
    "id" SERIAL NOT NULL,
    "idGoogleDrive" VARCHAR(255) NOT NULL,
    "linkVisualizacao" TEXT,
    "linkDownload" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tamanhoArquivo" VARCHAR(255),
    "tipoMime" VARCHAR(255),

    CONSTRAINT "Imagem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Produto_imagemId_key" ON "Produto"("imagemId");

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_imagemId_fkey" FOREIGN KEY ("imagemId") REFERENCES "Imagem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
