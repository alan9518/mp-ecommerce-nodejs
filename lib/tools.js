const mp = require('./mp')

let generateFullUrl

module.exports.getPaymentData = async function (id) {
  return await mp.payment.get(id)
}

module.exports.generateFullUrl = generateFullUrl = function (url) {
  return `${process.env.URL}/${url}`
}

module.exports.generarPreferencia = async function (req) {
  try {
    const data = {
      external_reference: "ABCD",
      notification_url: `https://sos-contador-mp-ecommerce.herokuapp.com/callback`,
      back_urls: {
        success: generateFullUrl('procesado'),
        pending: generateFullUrl('procesado'),
        failure: generateFullUrl('procesado')
      },
      items: [
        {
          id: "1234",
          title: req.body.title,
          picture_url: req.body.img_url,
          description: "Dispositivo móvil de Tienda e-commerce",
          quantity: parseInt(req.body.unit, 10),
          unit_price: parseFloat(req.body.price, 10),
        }
      ],
      payment_methods: {
        excluded_payment_methods: [
          { id: "amex" }
        ],
        excluded_payment_types: [
          { id: "atm" }
        ],
        installments: 6
      },
      payer: {
        name: req.body.nombre,
        email: req.body.email,
        identification: {
          type: req.body.tipo,
          number: req.body.numero
        },
        phone: {
          area_code: req.body.area,
          number: parseInt(req.body.fono, 10)
        },
        address: {
          street_name: req.body.calle,
          street_number: parseInt(req.body.calle_num, 10),
          zip_code: req.body.zip
        }
      }
    }

    console.log(data)

    const preferencia = await mp.preferences.create(data)

    return preferencia.response
  } catch (e) {
    console.log(e)
  }
}
