$(document).ready(function() {
    /**
     * Load Gexf file and display them on the web page
     */
    const colors = [
            '#617db4',
            '#668f3c',
            '#c6583e',
            '#b956af',
            '#b9ae2f'
        ],
        containers = document.getElementsByClassName('containers');

    // var fs = require('fs');
    // var files = fs.readdirSync('static/data/');
    // console.log(files);

    function loadFromGexf(path, container){
        // Asynchronously fetch the gexf file and parse it
        gexf.fetch(path, function(graph) {
            var i,
                N = 100,
                c = {},
                count = 0,
                currLabel;
            for (i = 0; i < graph.nodes.length; i++) {
                var currNode = graph.nodes[i];
                currLabel = currNode.label;
                if (typeof (c[currLabel]) === 'undefined') {
                    c[currLabel] = count;
                    count++;
                }
                currNode.x = 5 * Math.cos(2 * i * Math.PI / N);
                currNode.y = 5 * Math.sin(2 * i * Math.PI / N);
                currNode.size = 2;
                currNode.color = colors[c[currLabel]];
            }
            for (i = 0; i < graph.edges.length; i++){
                var currEdge = graph.edges[i];
                currEdge.type = 'curvedArrow';
                currEdge.color = '#ccc';
            }

            // Instantiate sigma:
            var s = new sigma({
                graph: graph,
                renderer: {
                    container: container,
                    type: 'canvas'
                },
                settings: {
                    edgeLabelSize: 'proportional',
                    sideMargin: 1
                }
            });

            // Start the ForceAtlas2 algorithm:
            s.startForceAtlas2({worker: true, barnesHutOptimize: false});
        });
    }

    loadFromGexf('../data/data.gexf', containers[0]);
    loadFromGexf('../data/standard_graph.gexf', containers[1]);

    for (var i = 0; i < containers.length; i++){
        if (i === 0) $(containers.item(i)).show();
        else $(containers.item(i)).hide();
    }

    function changeGraph(index) {
        for (var i = 0; i < containers.length; i++){
            if (i === index){
                $(containers.item(i)).show();
            }
            else {
                $(containers.item(i)).hide();
            }
        }
    }

    $('#g1').click(function () {
        changeGraph(0);
    });
    $('#g2').click(function () {
        changeGraph(1);
    });
});
