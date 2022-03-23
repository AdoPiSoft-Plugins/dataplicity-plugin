const admin_ctrl = require('./controllers/admin_ctrl.js')
const core = require('../core')
const {router, middlewares} = core

var {
  express,
  bodyParser
} = middlewares

router.post('/api/auth/', express.urlencoded({
  extended: true
}), bodyParser.json(), admin_ctrl.addDevice)
router.post('/api/register', express.urlencoded({
  extended: true
}), bodyParser.json(), admin_ctrl.register)
router.post('/api/enable-dataplicity', express.urlencoded({
  extended: true
}), bodyParser.json(), admin_ctrl.saveConfig)

router.get('/api/config', admin_ctrl.get)

module.exports = router
