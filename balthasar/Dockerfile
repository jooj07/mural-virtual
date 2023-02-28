# Use a imagem oficial do Node.js como base
FROM node:16.16.0

ENV PORT 3000
ENV DB_USER postgres
ENV DB_PWD 123456
ENV DB_NAME eva01
ENV DB_HOST localhost
ENV DB_PORT 5432
ENV DB_DIALECT postgres
ENV SECRET_kEY secret-key


# Defina a pasta de trabalho no container
WORKDIR /workspaces

# Copie todos os arquivos do projeto para a pasta /app no container
COPY . /workspaces

# Instale as dependências do projeto
RUN npm install

# Exponha a porta 3000
EXPOSE 3000

# Defina o comando de inicialização do projeto
CMD [ "yarn", "dev" ]
