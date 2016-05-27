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
	}).select({ota: 1, description: 1})
})
router.post('/otaequipment', (req, res) => {
	let equpment = new Equipment(req.body)

	equpment.save(function(err, result) {
		if (err) {
			log.error({error: err.message}, 'DB Error')
			let message = err.message, status = 500
			if (err.name == 'ValidationError') {
				message = err.errors.ota.message
				status = 422
			}
			res.status(status).json({error: message})
		} else {
			res.json({id: result._id})
		}
	})
})

// Action
router.get('/action', (req, res) => {
	Action.find(function(err, result) {
		if (err) {
			log.error({error: err.message}, 'DB Error')
			res.status(500).json({error: err.message})
		} else {
			res.json(result)
		}
	}).select({ota: 1, plo: 1, date: 1})
})
router.post('/action', (req, res) => {
	let ota = req.body.ota
	let date = new Date(Date.parse(req.body.date))
	if (isNaN(date)) {
		res.status(422).json({error: 'Value error'})
		return
	}
 	Equipment.find({ota: ota}, function(err, result) {
		if (err) {
			log.error({error: err.message}, 'DB Error')
			res.status(500).json({error: err.message})
		} else {
			if (result.length == 0) {
				res.status(404).json({error: 'OTA Code not in our database'})
			} else {
				let action = new Action(req.body)
				action.save(function(err, result) {
					if (err) {
						let message = err.message, status = 500
						if (err.name == 'ValidationError') {
							message = err.errors.ota.message
							status = 422
						}
						res.status(status).json({error: message})
					} else {
						Recommend.update(
							// Condition
							{
								year: date.getFullYear(),
								month: (date.getMonth() + 1),
								ota: ota
							},
							// Update
							{
								$inc: {count: 1}
							},
							// Options
							{
								upsert: true
							},
							function(err, recRes) {
								if (err) {
									log.error({error: err.message}, 'DB Error')
									res.status(500).json({error: err.message})
								} else {
									res.json({id: result._id})
								}
							}
						)
					}
				})
			}
		}
	})

})

// Recommend
router.get('/recommend/:year/:month', (req, res) => {
	let year = parseInt(req.params.year, 10)
	let month = parseInt(req.params.month, 10)
	let valid = void 0
	if (isNaN(year) || isNaN(month) || month <1 || month > 12) {
		res.status(400).json({error: 'Value error'})
		return
	}
	Recommend
		.find({year: year, month: month}, function(err, result) {
			if (err) {
				log.error({error: err.message}, 'DB Error')
				res.status(500).json({error: err.message})
			} else {
				res.json(result)
			}
		})
		.select({count: 1, ota: 1, _id: 0})
		.sort('-count')
		.limit(5)
})

module.exports = router
