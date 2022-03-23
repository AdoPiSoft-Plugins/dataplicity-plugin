const services = require('../services.js')
const config = require('../config.js')
const core = require('../../core')

const {plugin_config} = core

exports.addDevice = async (req, res, next) => {
  try {
    const d = await services.addDevice(req.body)
    if (d && d.has_error) {
      return res.status(400).send({error: d.has_error})
    }
    res.send(d)
  } catch (e) {
    console.log(e)
    const err = Object.keys(e)
    next(e[err])
  }
}
exports.register = async (req, res, next) => {
  try {
    await services.register(req.body.email)
    res.json({success: true})
  } catch (e) {
    console.log(e)
    const err = Object.keys(e)
    next(e[err])
  }
}

exports.get = async (req, res, next) => {
  try {
    const cfg = await services.getConfig()
    res.send(cfg)
  } catch (e) {
    console.log(e)
    next(e)
  }
}

exports.saveConfig = async (req, res, next) => {
  try {
    const {enable_dataplicity} = req.body

    if (!enable_dataplicity) {
      await services.deleteDataPlicity()
    } else {
      await plugin_config.updatePlugin(config.id, {enable_dataplicity})
    }

    res.json({success: true})
  } catch (e) {
    console.log(e)
    next(e)
  }
}
