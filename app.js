const express = require('express');
const mongoose = require('mongoose');

const config = require('./config');
const Server = require('./server');

const app = express();
const serverInstance = new Server(app, mongoose);

serverInstance.create(config);
serverInstance.start();
