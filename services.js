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

  let deviceSerial = null
  if (!token) return
  try {
    await exports.installDataplicity(token)

    const devices = await exports.getDevice(token)
    if (devices.length > 0) {
      deviceSerial = devices[devices.length - 1].serial
    }
  } catch (e) {
    console.log('Error: ', e)
    return {error: 'Installation failed, try again.'}
  }

  params.token = token
  params.device_serial = deviceSerial

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
  device_serial: null,
  email: null
}

exports.getConfig = async () => {
  const {plugins} = await plugin_config.read()
  let cfg = plugins.find(p => p.id === config.id)

  if (!cfg.token) {
    return cfg
  }
  const devices = await exports.getDevice(cfg.token)
  const d = devices.filter(device => device.serial === cfg.device_serial)

  if (d.length === 0 || devices.length === 0) {
    cfg = exports.resetConfig
    exports.deleteDataPlicity()
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
  const cmds = [install_command, 'sudo apt install -y python3-setuptools']
  
  async function runCommand(cmd) {
    return new Promise(resolve => {
      const proc = exec(cmd, err => {
        if (err) {
          console.warn(`Command failed (continuing): ${cmd}\n${err.message}`)
        }
        resolve() // always resolve, never reject, so we continue regardless
      })
      proc.stdout.pipe(process.stdout)
      proc.stderr.pipe(process.stderr)
    })
  }
  for (const cmd of cmds) {
    await runCommand(cmd)
  }
}
exports.deleteDataPlicity = async (is_uninstalled) => {
  const cmds = ['sudo rm -rf /opt/dataplicity', 'sudo apt purge -y supervisor', 'sudo rm -rf /etc/supervisor']

  await new Promise((resolve, reject) => {
    for (const c in cmds) {
      const proc = exec(cmds[c], err => (err ? reject(err) : resolve()))
      proc.stdout.pipe(process.stdout)
      proc.stderr.pipe(process.stderr)
    }
  })
  if(!is_uninstalled)
    await plugin_config.updatePlugin(config.id, exports.resetConfig)
}

exports.getDevice = async (token) => {
  let data = await https.get({
    url: BASE_URL + '/devices/',
    headers: {
      Authorization: 'Token ' + token
    }
  })
  return (data || { devices: [] }).devices
}