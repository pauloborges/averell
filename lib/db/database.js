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
	ota: {
		type: String,
		index: true,
		unique: true
	}
})
equipmentSchema.path('ota').validate(function(value) {
	return value && value.length == 3
}, 'Value error')

let actionSchema = mongoose.Schema({
	date: Date,
	ota: {type: String, maxLength: 3, minLength: 3},
	plo: String
})
actionSchema.path('ota').validate(function(value) {
	return value && value.length == 3
}, 'Value error')

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

// Rename id to _id for output.
function idAdapter(old) {
	return function() {
		let res = old.apply(this, arguments)
		if (res._id) {
			res.id = res._id
			delete res._id
		}
		return res
	}
}
equipmentModel.prototype.toJSON = idAdapter(equipmentModel.prototype.toJSON)
actionModel.prototype.toJSON = idAdapter(actionModel.prototype.toJSON)

const models = {
	Equipment: equipmentModel,
	Action: actionModel,
	Recommend: recommendModel
}


module.exports = models
