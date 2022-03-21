const core = require('../core')
const {plugin_config, https} = core


const config = require('./config.js')
const { exec } = require('child_process')

const BASE_URL = 'https://apps.dataplicity.com'

exports.addDevice = async (params) => {
  const {token} = await https.post({
    url: BASE_URL + '/auth/',
    json: {email: params.email, password: params.password}
  })

  let device_url = null
  if (!token) return
  try {
    await exports.installDataplicity(token)

    const devices = await exports.getDevice(token)
    if (devices.length > 0) {
      device_url = devices[devices.length - 1].url
    }
  } catch (e) {
    console.log('Error: ', e)
    return {error: 'Installation failed, Try again.'}
  }

  params.token = token
  params.device_url = device_url

  await plugin_config.updatePlugin(config.id, params)

  return {success: true}
}

exports.register = async (email) => {
  await https.post({
    url: BASE_URL + '/register/',
    json: {email}
  })
}

exports.resetConfig = {
  enable_dataplicity: false,
  password: null,
  token: null,
  device_url: null,
  email: null
}

exports.getConfig = async () => {
  const {plugins} = await plugin_config.read()
  let cfg = plugins.find(p => p.id === config.id)

  if (!cfg.token) {
    return cfg
  }
  const devices = await exports.getDevice(cfg.token)
  const d = devices.filter(device => device.url === cfg.device_url)

  if (d.length === 0 || devices.length === 0) {
    await plugin_config.updatePlugin(config.id, exports.resetConfig)
    const p = await plugin_config.read()
    cfg = p.plugins.find(p => p.id === config.id)
  }

  return cfg
}

exports.installDataplicity = async (token) => {
  let {install_command} = await https.get({
    url: BASE_URL + '/profile/',
    headers: {
      Authorization: 'Token ' + token
    }
  })

  if (!install_command) return

  await new Promise((resolve, reject) => {
    const proc = exec(install_command, err => (err ? reject(err) : resolve()))
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
  })
}
exports.deleteDataPlicity = async () => {
  const cmds = ['sudo rm -rf /opt/dataplicity', 'sudo apt purge -y supervisor', 'sudo rm -rf /etc/supervisor']

  await new Promise((resolve, reject) => {
    for (const c in cmds) {
      const proc = exec(cmds[c], err => (err ? reject(err) : resolve()))
      proc.stdout.pipe(process.stdout)
      proc.stderr.pipe(process.stderr)
    }
  })
  await plugin_config.updatePlugin(config.id, exports.resetConfig)
}

exports.getDevice = async (token) => {
  let devices = await https.get({
    url: BASE_URL + '/devices/',
    headers: {
      Authorization: 'Token ' + token
    }
  })
  return devices
}
