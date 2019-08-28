const express = require('express');
const path = require('path');

const parser = require('./public/javascript/parser');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));


let graphs = parser.parseGEXF();

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
