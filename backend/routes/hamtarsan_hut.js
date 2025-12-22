const express = require('express')
const {
    getHamtarsanHut,
    getSingleHamtarsanHut,
    addHamtarsanHut,
    deleteHamtarsanHut,
    updateHamtarsanHut,
} = require('../controllers/hamtarsan_hutController') 

const router = express.Router()

router.get('/', getHamtarsanHut)

router.get('/:id', getSingleHamtarsanHut)

router.post('/', addHamtarsanHut)

router.delete('/:id', deleteHamtarsanHut)

router.put('/:id', updateHamtarsanHut)

module.exports = router