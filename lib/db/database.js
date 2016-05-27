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

let equipmentSchema = mongoose.Schema({
	description: String,
	ota: {type: String, index: true, unique: true}
})

let actionSchema = mongoose.Schema({
	date: Date,
	ota: String,
	plo: String
})

let recommendSchema = mongoose.Schema({
	year:Number,
	month: Number,
	ota: String,
	count: Number
})

// Models
let equipmentModel = mongoose.model('Equipment', equipmentSchema)
let actionModel = mongoose.model('Action', actionSchema)
let recommendModel = mongoose.model('Recommend', recommendSchema)


const models = {
	Equipment: equipmentModel,
	Action: actionModel,
	Recommend: recommendModel
}


module.exports = models
