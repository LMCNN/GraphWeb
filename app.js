const express = require('express');
const path = require('path');

const parser = require('./public/javascript/parser');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

//parser graphs from data folder and convert them to a object array
let graphs = parser.parseGEXF();

//load the main page
app.get('/', function(req, res) {
    res.sendFile('public/graph.html', {root: __dirname })
});

//load the nav bar
app.get('/rendNav', function (req, res) {
    res.status(200);
    res.setHeader('Content-type', 'text/plain');
    return res.send(graphs.length.toString());
});

//load the graph
app.get('/graph', function (req, res) {
    let graphId = req.query.id;
    let g = {};
    g.nodes = graphs[graphId].nodes;
    g.edges = graphs[graphId].edges;

    res.status(200);
    res.setHeader('Content-type', 'json/plain');
    return res.send(g);
});

module.exports = app;
