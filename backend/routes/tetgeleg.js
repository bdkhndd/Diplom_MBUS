const express = require('express')
const {
    getTetgeleg,
    getSingleTetgeleg,
    addTetgeleg,
    deleteTetgeleg,
    updateTetgeleg,
} = require('../controllers/tetgelegController') 

const router = express.Router()

router.get('/', getTetgeleg)

router.get('/:id', getSingleTetgeleg)

router.post('/', addTetgeleg)

router.delete('/:id', deleteTetgeleg)

router.put('/:id', updateTetgeleg)

module.exports = router