const express = require('express');
const path = require('path');
const logger = require('morgan');
const fs = require('fs');
const gexf = require('gexf');
const url = require('url');
const parser = require('./public/javascript/parser');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
// app.use(logger('dev'));
// app.use(express.json());


let graphs = parser.parseGEXF();

// let dom = JSDOM.fromFile('public/graph.html');


// console.log(graphs[0]);
// console.log(graphs[1]);

app.get('/', function(req, res) {
    res.sendFile('public/graph.html', {root: __dirname })
});

app.get('/rendNav', function (req, res) {
    res.status(200);
    res.setHeader('Content-type', 'text/plain');
    return res.send(graphs.length.toString());
});

app.get('/graph', function (req, res) {
    let graphId = req.query.id;
    let g = {};
    g.nodes = graphs[graphId].nodes;
    g.edges = graphs[graphId].edges;
    g.model = graphs[graphId].model;
    // console.log(req.query.id);
    res.status(200);
    res.setHeader('Content-type', 'json/plain');
    return res.send(g);
});

module.exports = app;
