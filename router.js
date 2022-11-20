const router = require('express').Router()

const slotController = require('./controller')

router.route('/viewAll').get(slotController.index)

router.route('/newSlot').post(slotController.new)

router.route('/view').get(slotController.view)

router.route('/update').put(slotController.update)

router.route('/delete').delete(slotController.delete)

module.exports  = router