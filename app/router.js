const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const device_reg = require('@adopisoft/core/middlewares/device.js')
const cookie_parser = require('@adopisoft/core/middlewares/cookie_parser.js')
const device_cookie = require('@adopisoft/core/middlewares/device_cookie.js')

const admin_ctrl = require('./controller/admin_ctrl.js')

router.use(cookie_parser)
router.use(device_cookie.read)
router.use(device_cookie.portalCookie)

router.post('/api/auth/', express.urlencoded({
  extended: true
}), bodyParser.json(), admin_ctrl.addDevice)
router.post('/api/register', device_reg, express.urlencoded({
  extended: true
}), bodyParser.json(), admin_ctrl.register)
router.post('/api/enable-dataplicity', express.urlencoded({
  extended: true
}), bodyParser.json(), admin_ctrl.saveConfig)

router.get('/api/config', device_reg, admin_ctrl.get)

module.exports = router
