const fs = require('fs');
const gexf = require('gexf');

module.exports = {
  parseGEXF: function () {
      const colors = [
          '#617db4',
          '#668f3c',
          '#c6583e',
          '#b956af',
          '#b9ae2f'
      ];
      let graphs = [],
          files = fs.readdirSync('./public/data'),
          fileNum = files.length;

      for (let i = 0; i < fileNum; i++){
          // Reading your gexf file
          let gexf_file = fs.readFileSync('./public/data/' + files[i], 'utf-8');
          // Parsing it
          let graph = gexf.parse(gexf_file);

          let j,
              N = 100,
              c = {},
              count = 0,
              currLabel;
          for (j = 0; j < graph.nodes.length; j++) {
              let currNode = graph.nodes[j];
              currLabel = currNode.label;
              if (typeof (c[currLabel]) === 'undefined') {
                  c[currLabel] = count;
                  count++;
              }
              currNode.x = 5 * Math.cos(2 * j * Math.PI / N);
              currNode.y = 5 * Math.sin(2 * j * Math.PI / N);
              currNode.size = 2;
              currNode.color = colors[c[currLabel]];
          }
          for (j = 0; j < graph.edges.length; j++){
              let currEdge = graph.edges[j];
              currEdge.type = 'curvedArrow';
              currEdge.color = '#ccc';
          }

          graphs.push(graph);
      }
      return graphs
  }
};