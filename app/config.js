const path = require('path')
const ini_file = 'dataplicity.ini'
const fs = require('fs')
const ini_parser = require('@adopisoft/core/utils/ini-parser.js')
const ini = require('ini')

exports.read = async () => {
  let cfg = await ini_parser(ini_file)
  return cfg
}

exports.save = async (cfg) => {
  if (!cfg) return

  const ini_file_path = path.join(process.env.APPDIR, 'config', ini_file)
  await fs.promises.writeFile(ini_file_path, ini.stringify(cfg))
  return cfg
}
