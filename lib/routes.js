"use strict"

let router = require('express').Router()
// let co = require('co')
const log = require('./log')()

const {Equipment, Action, Recommend} = require('./db/database')

// Equipment
router.get('/otaequipment', (req, res) => {
	Equipment.find(function(err, result) {
		if (err) {
			log.error({error: err.message}, 'DB Error')
			res.status(500).json({error: err.message})
		} else {
			res.json(result)
		}
	})
})
router.post('/otaequipment', (req, res) => {
	// let json = req.body
	// let equpment = new Equipment({description: json.description, ota: json.ota})
	let equpment = new Equipment(req.body)
	equpment.save(function(err, result) {
		if (err) {
			log.error({error: err.message}, 'DB Error')
			res.status(500).json({error: err.message})
		} else {
			res.json({id: result._id})
		}
	})
})

// Action
router.get('/action', (req, res) => {
	res.json({foo: 'bar'})
})
router.post('/action', (req, res) => {
	res.json({foo: 'bar'})
})

// Recommend
router.get('/recommend', (req, res) => {
	res.json({foo: 'bar'})
})

module.exports = router
