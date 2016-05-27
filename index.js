"use strict"

var http = require('http')
var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var app = express()
const TIMEOUT = 30*1000
var gracefulShutdown = require('http-graceful-shutdown')

const log = require('./lib/log')()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var router = require('./lib/routes')

app.use('/api', router)
app.use(express.static('public'))

var server = http.createServer(app)

server.listen(8000, () => {
	var host = server.address().address,
			port = server.address().port

	log.info(`listening at http://${host}:${port}`)
})

// Graceful shutdown
gracefulShutdown(server,
	{
		signals: 'SIGINT SIGTERM',
		timeout: TIMEOUT,
		development: false,
		callback: function() {
			log.info('All connections gracefully closed..')
			log.info('Exiting..')
		}
	}
)
