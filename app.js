/* ==========================================================================
** Server Start Point
** 31/07/2020
** Alan Medina Silva
** ========================================================================== */



// --------------------------------------
// Imports
// --------------------------------------


    const express = require('express')
    const bodyParser = require('body-parser')
    const exphbs  = require('express-handlebars')
    const tools = require('./lib/tools')
    const mp = require('./lib/mp')


// --------------------------------------
// Create Server
// --------------------------------------

    const hbs = exphbs.create({
        helpers: {
        ifthen: (v1, v2, options) => {
            if(v1 == v2) return options.fn(this)
            return options.inverse(this)
        }
        }
    })

    const app = express();
    mp.init()

// --------------------------------------
// Server Configuration
// --------------------------------------

    
    
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(express.static('assets'))
    app.use('/assets', express.static(__dirname + '/assets'))

    app.engine('handlebars', hbs.engine)
    app.set('view engine', 'handlebars')





// --------------------------------------
// Server Routing
// --------------------------------------


    // ?--------------------------------------
    // ? Get Functions
    // ?--------------------------------------

    app.get('/', (_, res) => res.render('home'))

    app.get('/detail', async (req, res) => res.render('detail', {
        img: req.query.img,
        title: req.query.title,
        price: req.query.price,
        unit: req.query.unit,
    }))

    app.get('/comprar', (req, res) => res.render('comprar', {
        img: req.query.img,
        title: req.query.title,
        price: req.query.price,
        unit: req.query.unit,
        img_url: tools.generateFullUrl(req.query.img.substr(2)),
    }))




    // ?--------------------------------------
    // ? Post Functions
    // ?--------------------------------------

    app.post('/confirmar', async (req, res) => {
        const preferencia = await tools.generarPreferencia(req)
        res.render('confirmar', { prefId: preferencia.id })
      })
      
    app.post('/procesar-pago', async (req, res) => {
        const pago = await tools.getPaymentData(req.body.payment_id)
        const payment_method_id = pago.body.payment_method_id
        const total_paid_amount = pago.body.transaction_details.total_paid_amount
        const order_id = pago.body.order.id
        const payment_id = pago.body.id
        res.render('procesado', { payment_method_id, total_paid_amount, order_id, payment_id, ...req.body })
    })
      
    app.post('/callback', (req, res) => res.send('OK'))




// --------------------------------------
// Start Server
// --------------------------------------
 
    app.listen(process.env.PORT || 3000)


console.log('app started');