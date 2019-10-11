const fs = require('fs');
const gexf = require('gexf');
const path = require('path');

//this module parse the graph files from a folder
module.exports = {
  parseForSigma: function () {
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

          graph.filename = files[i];

          let j,
              N = 100,
              c = {},
              count = 0,
              currLabel,
              nodeNameIndex = 0;

          for (let k = 0; k < graph.model.node.length; k++){
              if (graph.model.node[k].title === 'name') {
                  nodeNameIndex = k;
                  break;
              }
          }

          for (j = 0; j < graph.nodes.length; j++) {
              let currNode = graph.nodes[j];
              currLabel = currNode.label;
              if (typeof (c[currLabel]) === 'undefined') {
                  c[currLabel] = count;
                  count++;
              }

              currNode.label += ':' + currNode.attributes[nodeNameIndex];

              currNode.x = 5 * Math.cos(2 * j * Math.PI / N);
              currNode.y = 5 * Math.sin(2 * j * Math.PI / N);
              currNode.size = 2;
              currNode.color = colors[c[currLabel]];
          }
          for (j = 0; j < graph.edges.length; j++){
              let currEdge = graph.edges[j];
              currEdge.type = 'curvedArrow';
              currEdge.color = '#373737';
              currEdge.size = 5;
              currEdge.count = j;
          }

          graphs.push(graph);
      }
      return graphs
  },
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
                newEdge.from = currEdge.source;
                newEdge.to = currEdge.target;
                newEdge.label = currEdge.label;
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