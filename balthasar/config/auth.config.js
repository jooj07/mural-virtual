require('dotenv').config()

module.exports = {
  chaveSecreta: process.env.CHAVE_SECRETA,
  tokenEfemeroValidade: 3600, // 1 hora - tempo que vai valer o token efêmero
  jwtValidate: 86400 // 24h - tempo que vai valer o token do jwt (mas quem 'manda' é o token de sessão)

}
