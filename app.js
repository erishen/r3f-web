require('dotenv').config();

const { startExpress } = require('./server')

process.env.NODE_ENV = 'production'

// console.log('process.env.BASE_PATH', process.env.BASE_PATH)

startExpress({ dev: false })