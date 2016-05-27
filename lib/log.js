"use strict"
let bunyan = require('bunyan')

let log = null
let level = process.env.LOG_LEVEL || 'info'

module.exports = function() {
	if (!log) {
		log = bunyan.createLogger({name: 'harbormaster-api'})
		log.level(level)
		log.info('Logger setup')
	}
	return log
}
