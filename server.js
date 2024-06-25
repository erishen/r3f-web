const next = require('next')
const express = require('express')
const { parse } = require('url')
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const getConfig = require('next/config').default
const _ = require('lodash')
const cors = require('cors')
const rest = require('./src/server/rest')

// const specialUrls = ['/_next/static', '/sw.js']

const startExpress = (options, callback) => {
    // console.info('startExpress', curFolder)

    const app = next(options)
    const handle = app.getRequestHandler()

    const BASE_PATH = process.env.BASE_PATH || '';

    app
        .prepare()
        .then(() => {
            if (callback) {
                callback()
                return
            }

            const server = express()

            server.use(
                bodyParser.urlencoded({
                    extended: false
                })
            )

            server.use((req, res, next) => {
                // console.log('req.url1: ', req.url, BASE_PATH)
                if (BASE_PATH !== '') {
                    if (req.url === '/') {
                        req.url = BASE_PATH
                    }
                }
                // console.log('req.url2: ', req.url)
                next();
            });

            // 支持跨域，nsgm export 之后前后分离
            server.use(cors())

            server.use(bodyParser.json())

            server.use(fileUpload())

            server.use('/static', express.static(path.join(__dirname, 'public')))
            server.use('/rest', rest)

            const nextConfig = getConfig()
            const { publicRuntimeConfig } = nextConfig
            const { host, port, prefix } = publicRuntimeConfig

            if (prefix !== '') {
                server.use(prefix + '/static', express.static(path.join(__dirname, 'public')))
                server.use(prefix + '/rest', rest)
            }

            server.get('*', (req, res) => {
                const { url } = req
                // console.log('url: ' + url)

                const parsedUrl = parse(url, true)
                return handle(req, res, parsedUrl)
            })

            server.listen(port, () => {
                console.log('> Ready on http://' + host + ':' + port)
            })
        })
        .catch((ex) => {
            console.error(ex.stack)
            process.exit(1)
        })
}

module.exports = {
    startExpress
}