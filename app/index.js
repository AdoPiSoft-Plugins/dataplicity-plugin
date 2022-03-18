const router = require('./router.js')
const {app} = require('@adopisoft/exports')

module.exports = {
  async init () {
    app.use(router)
  },
  uninstall () {}
}
