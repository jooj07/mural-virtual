require('dotenv').config()

module.exports = {
  chaveSecreta: process.env.CHAVE_SECRETA,
  /* for test */
  tokenEfemeroValidade: 60, // 1 minute - tempo que vai valer o token efêmero
  jwtValidate: 120 // 2 minutes - tempo que vai valer o token de sessão
  // 3600 1 hora
  // 86400 24 hours

}
