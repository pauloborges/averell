"use strict"

let router = require('express').Router()
// let co = require('co')
const log = require('./log')()

const models = require('./db/database')

// Equipment
router.get('/otaequipment', (req, res) => {
	log.info('got request..')
	res.json({foo: 'bar'})
})
router.post('/otaequipment', (req, res) => {
	log.info(req.body)

	let json = req.body
	res.json({foo: json})
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
