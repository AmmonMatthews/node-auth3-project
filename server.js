const express = require('express')

const UserRouter = require('./users/users-router')

const server = express();

server.use(express.json());
server.use('/api', UserRouter)

module.exports = server