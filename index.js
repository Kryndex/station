'use strict'

const mono = require('monogamous')
const winston = require('winston')
const path = require('path')
const init = require('./build/init')

// Setup Logging
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      handleExceptions: false
    }),
    new (winston.transports.File)({
      filename: path.join(__dirname, '..', 'app.log'),
      handleExceptions: false
    })
  ]
})

process.on('uncaughtException', error => {
  const msg = error.message || error
  logger.error(`Uncaught Exception: ${msg}`, error, error.stack, arguments)
  process.exit(1)
})

// This ensures that there is only one instance of our application.
const booter = mono({sock: 'station'}, {})

booter.on('boot', init.boot.bind(init, logger))
booter.on('reboot', init.reboot.bind(init))
booter.on('error', error => {
  logger.error(error)
})

logger.info('Booting')
booter.boot()
