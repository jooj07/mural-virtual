const config = require("../config/auth.config");
const { v4: uuidv4 } = require("uuid"); 
/*
Segundo o sequelize:
  A default unique universal identifier generated following the UUID v4 standard

com isso, posso criar um hash único para ser meu token que será usado para atualizar o token de sessão;
Por isso não posso usar simplesmente o campo ID autogerado, pq vai me gerar apenas um número inteiro
*/

module.exports = (sequelize, Sequelize) => {
  const tokenEfemero = sequelize.define("tokenEfemero", {
    token: {
      type: Sequelize.STRING,
    },
    validade: {
      type: Sequelize.DATE,
    },
  });

  tokenEfemero.criarToken = async function (usuario) {
    let hashIdUnico = uuidv4(); //criando meu hash que fiz menção acima
    let tempoDeVida = new Date(); //criando a validade do meu token

    tempoDeVida.setSeconds(tempoDeVida.getSeconds() + config.tokenEfemeroValidade);

    let tokenEfemero = await this.create({
      token: hashIdUnico,
      usuarioId: usuario.id,
      validade: tempoDeVida.getTime(),
    });

    return tokenEfemero.token;
  };

  tokenEfemero.validar = (token) => {
    return token.validade.getTime() < new Date().getTime(); //aqui de fato comparo a data de validade com a atual
  };

  return tokenEfemero;
};