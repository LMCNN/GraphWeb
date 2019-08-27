const express = require('express');
const path = require('path');
const logger = require('morgan');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile('public/graph.html', {root: __dirname })
});

module.exports = app;
