const express = require('express')

const router = express.Router()

router.get('/world', (req, res) => {
    const { query } = req

    res.json({
        name: 'world',
        query,
        returnCode: 0,
        result: {
            message: 'world'
        }
    })
})

router.get('/*', (req, res) => {
    res.statusCode = 200
    res.json({ name: 'HELLO' })
})

module.exports = router