"use strict"

var MONGO_DB
var DOCKER_DB = process.env.MONGO_PORT
if ( DOCKER_DB ) {
	MONGO_DB = DOCKER_DB.replace( 'tcp', 'mongodb' ) + '/myapp'
} else {
	MONGO_DB = process.env.MONGODB
}

const log = require('../log')()
const mongoose = require('mongoose')
mongoose.connect(MONGO_DB)
const db = mongoose.connection;
db.on('error', function() {
	log.error('MongoDB Connection error')
})
db.once('open', function() {
	log.info('MongoDB up and running')
});

const models = {

}


module.exports = models
