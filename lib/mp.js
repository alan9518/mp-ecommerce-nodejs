const mercadopago = require('mercadopago')

const config = require('../config.json')

mercadopago.init = () => mercadopago.configure({
  access_token: config.accessToken
})

module.exports = mercadopago
