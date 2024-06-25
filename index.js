require('dotenv').config();

const { startExpress } = require('./server')

startExpress({ dev: true })