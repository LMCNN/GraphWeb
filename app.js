const express = require('express');
const path = require('path');
const exec = require('child_process').exec;

const parser = require('./public/javascript/parser');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

//parser graphs from data folder and convert them to a object array
let graphs = parser.parseGEXF(),
    commandStr1 = 'java -Dfile.encoding=utf-8 -jar public/Graph2NL/Graph2NL.jar -g public/data/',
    commandStr2 = 'java -Dfile.encoding=utf-8 -jar public/Graph2NL/Graph2NL.jar -j -g public/data/';

//load the main page
app.get('/', function(req, res) {
    res.sendFile('public/graph.html', {root: __dirname })
});

//load the nav bar
app.get('/rendNav', function (req, res) {
    let fileNames = [];
    for (let i = 0; i < graphs.length; i++){
        let currName = graphs[i].filename;
        fileNames.push(currName.substring(0, currName.length - 5));
    }
    res.status(200);
    res.setHeader('Content-type', 'text/plain');
    return res.send(fileNames);
});

//load the graph
app.get('/graph', function (req, res) {
    let graphId = req.query.id;
    let g = {};
    g.nodes = graphs[graphId].nodes;
    g.edges = graphs[graphId].edges;
    g.model = graphs[graphId].model;
    // g.description = graphs[graphId].description;
    g.gid = graphId;

    res.status(200);
    res.setHeader('Content-type', 'json/plain');
    return res.send(g);
});

app.get('/describe', function (req, res) {
    let graphId = req.query.id,
        file = graphs[graphId].filename;

    exec(commandStr1 + file, function(error, stdout, stderr) {
        res.status(200);
        res.setHeader('Content-type', 'text/plain');
        // console.log(stdout);
        return res.send(stdout);
    });
});

app.get('/json', function (req, res) {
    let graphId = req.query.id,
        file = graphs[graphId].filename;

    exec(commandStr2 + file, function(error, stdout, stderr) {
        res.status(200);
        res.setHeader('Content-type', 'json/plain');
        return res.send(stdout);
    });
});

module.exports = app;
