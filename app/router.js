const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const admin_ctrl = require('./controllers/admin_ctrl.js')

router.post('/api/auth/', express.urlencoded({
  extended: true
}), bodyParser.json(), admin_ctrl.addDevice)
router.post('/api/register',express.urlencoded({
  extended: true
}), bodyParser.json(), admin_ctrl.register)
router.post('/api/enable-dataplicity', express.urlencoded({
  extended: true
}), bodyParser.json(), admin_ctrl.saveConfig)

router.get('/api/config', admin_ctrl.get)

module.exports = router
