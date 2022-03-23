const router = require('./router.js')
const services = require('./services.js')
var config = require('./config.js')
const {app} = require('../core.js')

module.exports = {
  async init (id) {
    config.id = id
    app.use(router)
  },

  async uninstall () {
    //delete dataplicity when uninstall this plugin
    await services.deleteDataPlicity()
  }
}
