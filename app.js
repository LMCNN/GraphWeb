const express = require('express');
const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

const parser = require('./public/javascript/parser');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

//parser graphs from data folder and convert them to a object array
let graphs = parser.parseForVis(),
    nlPath = '"' + path.join(__dirname, '/public/Graph2NL/Graph2NL.jar') + '"',
    filePath = path.join(__dirname, '/public/data/'),
    commandStr1 = 'java -Dfile.encoding=utf-8 -jar ' + nlPath + ' -g ',
    commandStr2 = 'java -Dfile.encoding=utf-8 -jar ' + nlPath + ' -j -g ';

//load the main page
app.get('/', function(req, res) {
    res.sendFile('public/graph.html', {root: __dirname })
});

//load the nav bar
app.get('/rendNav', function (req, res) {
    let fileNum = fs.readdirSync(filePath).length;
    if (fileNum !== graphs.length) {
        graphs = parser.parseForSigma();
    }
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
    g.dict = graphs[graphId].dict;
    g.gid = graphId;

    res.status(200);
    res.setHeader('Content-type', 'json/application');
    return res.send(g);
});

app.get('/describe', function (req, res) {
    let graphId = req.query.id,
        file = '"' + filePath + graphs[graphId].filename + '"';
    exec(commandStr1 + file, function(error, stdout, stderr) {
        res.status(200);
        res.setHeader('Content-type', 'text/plain');
        // console.log(error);
        // console.log(stdout);
        return res.send(stdout);
    });
});

app.get('/json', function (req, res) {
    let graphId = req.query.id,
        file = graphs[graphId].filename;

    exec(commandStr2 + file, function(error, stdout, stderr) {
        res.status(200);
        res.setHeader('Content-type', 'json/application');
        return res.send(stdout);
    });
});

module.exports = app;
