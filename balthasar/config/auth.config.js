require('dotenv').config()

module.exports = {
  chaveSecreta: process.env.CHAVE_SECRETA,
  /* for test */
  tokenEfemeroValidade: 3600, // 1 minuto - tempo que vai valer o token efêmero
  jwtValidate: 86400 // 2 minutos - tempo que vai valer o token de sessão
  // 3600 1 hora
  // 86400 24 hours

}
