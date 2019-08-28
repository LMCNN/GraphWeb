const express = require('express');
const path = require('path');
const logger = require('morgan');
const fs = require('fs');
const gexf = require('gexf');
const parser = require('./public/javascript/parser');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
// app.use(logger('dev'));
// app.use(express.json());

const jsdom = require("jsdom");
const { JSDOM } = jsdom;


let graphs = parser.parseGEXF();

// let dom = JSDOM.fromFile('public/graph.html');


// console.log(graphs[0]);
// console.log(graphs[1]);

app.get('/', function(req, res) {
    res.sendFile('public/graph.html', {root: __dirname })
});

app.get('/test', function (req, res) {
    res.status(200);
    res.setHeader('Content-type', 'text/plain');
    return res.send(graphs[0]);
});


module.exports = app;
