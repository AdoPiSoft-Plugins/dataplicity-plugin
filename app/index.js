const router = require('./router.js')
const {app} = require('@adopisoft/exports')
const services = require('./services.js')
const config = require('./config.js')

module.exports = {
  async init () {
    app.use(router)
  },
  async uninstall () {
    //delete dataplicity when uninstall this plugin
    await services.deleteDataPlicity()
    await config.save({enable_dataplicity: false})
  }
}
