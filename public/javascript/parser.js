const fs = require('fs');
const gexf = require('gexf');
const path = require('path');

//this module parse the graph files from a folder
module.exports = {
    parseForVis: function () {
        const colors = [
            '#617db4',
            '#668f3c',
            '#c6583e',
            '#b956af',
            '#b9ae2f'
        ];
        let graphs = [],
            data = path.join(__dirname, '../data'),
            files = fs.readdirSync(data),
            fileNum = files.length;

        for (let i = 0; i < fileNum; i++){
            // Reading your gexf file './public/data/' +
            let filePath = path.join(__dirname, '../data/') + files[i];
            let gexf_file = fs.readFileSync(filePath, 'utf-8');
            // Parsing it
            let graph = gexf.parse(gexf_file);
            let g = {},
                c = {},
                j,
                count = 0,
                nodeNameIndex = 0;
            g.filename = files[i];

            for (let k = 0; k < graph.model.node.length; k++){
                if (graph.model.node[k].title === 'name') {
                    nodeNameIndex = k;
                    break;
                }
            }

            let nodes = [];
            for (j = 0; j < graph.nodes.length; j++) {
                let currNode = graph.nodes[j];
                let currLabel = currNode.label;
                if (typeof (c[currLabel]) === 'undefined') {
                    c[currLabel] = count;
                    count++;
                }
                let newNode = {};
                newNode.id = currNode.id;
                newNode.label = currNode.label;
                newNode.color = colors[c[currLabel]];
                newNode.title = currNode.attributes[nodeNameIndex];
                newNode.attributes = currNode.attributes;
                nodes.push(newNode);
            }

            let edges = [];
            for (j = 0; j < graph.edges.length; j++) {
                let currEdge = graph.edges[j];
                let newEdge = {};
                newEdge.id = currEdge.id;
                newEdge.from = currEdge.source;
                newEdge.to = currEdge.target;
                newEdge.label = currEdge.label;
                newEdge.attributes = currEdge.attributes;
                edges.push(newEdge);
            }
            g.dict = graph.model;
            g.nodes = nodes;
            g.edges = edges;
            graphs.push(g);
        }
        return graphs
    }
};