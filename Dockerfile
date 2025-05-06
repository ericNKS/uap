FROM node:23.11-alpine

# Diretório da aplicação
WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante da aplicação
COPY . .

# Compila o TypeScript
RUN npm run build

# Expõe a porta padrão (ajuste conforme necessário)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/index.js"]
