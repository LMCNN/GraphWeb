$(document).ready(function() {
    /**
     * This is a basic example on how to instantiate sigma. A random graph is
     * generated and stored in the "graph" variable, and then sigma is instantiated
     * directly with the graph.
     *
     * The simple instance of sigma is enough to make it render the graph on the on
     * the screen, since the graph is given directly to the constructor.
     */
    var i,
        s,
        N = 100,
        g = {
            nodes: [],
            edges: []
        },
        colors = [
            '#617db4',
            '#668f3c',
            '#c6583e',
            '#b956af',
            '#b9ae2f'
        ];

    // Generate a random graph:
    g.nodes.push(
        {id:'0', label:'Character', x:100 * Math.cos(2 * Math.PI / N), y:100 * Math.sin(2 * Math.PI / N), size:20, color:colors[0]},
        {id:'1', label:'Character', x:100 * Math.cos(4 * Math.PI / N), y:100 * Math.sin(4 * Math.PI / N), size:20, color:colors[0]},
        {id:'2', label:'User', x:100 * Math.cos(8 * Math.PI / N), y:100 * Math.sin(8 * Math.PI / N), size:20, color:colors[1]},
        {id:'3', label:'User', x:100 * Math.cos(16 * Math.PI / N), y:100 * Math.sin(16 * Math.PI / N), size:20, color:colors[1]},
        {id:'4', label:'Number', x:100 * Math.cos(32 * Math.PI / N), y:100 * Math.sin(32 * Math.PI / N), size:20, color:colors[2]},
        {id:'5', label:'Number', x:100 * Math.cos(64 * Math.PI / N), y:100 * Math.sin(64 * Math.PI / N), size:20, color:colors[2]},
        {id:'6', label:'APP', x:100 * Math.cos(128 * Math.PI / N), y:100 * Math.sin(128 * Math.PI / N), size:20, color:colors[3]},
        {id:'7', label:'Website', x:100 * Math.cos(256 * Math.PI / N), y:100 * Math.sin(256 * Math.PI / N), size:20, color:colors[4]});

    g.edges.push(
        {id:'0', label: 'called', source: '2', target: '4', size: 2, color:'#ccc', type: 'curvedArrow'},
        {id:'1', label: 'called', source: '2', target: '4', size: 2, color:'#ccc', type: 'curvedArrow'},
        {id:'2', label: 'message', source: '4', target: '2', size: 2, color:'#ccc', type: 'curvedArrow'},
        {id:'3', label: 'called', source: '2', target: '5', size: 2, color:'#ccc', type: 'curvedArrow'},
        {id:'4', label: 'called', source: '3', target: '5', size: 2, color:'#ccc', type: 'curvedArrow'},
        {id:'5', label: 'message', source: '5', target: '3', size: 2, color:'#ccc', type: 'curvedArrow'},
        {id:'6', label: 'is', source: '2', target: '1', size: 2, color:'#ccc', type: 'curvedArrow'},
        {id:'7', label: 'is', source: '3', target: '0', size: 2, color:'#ccc', type: 'curvedArrow'},
        {id:'8', label: 'visit', source: '2', target: '6', size: 2, color:'#ccc', type: 'curvedArrow'},
        {id:'9', label: 'visit', source: '3', target: '6', size: 2, color:'#ccc', type: 'curvedArrow'},
        {id:'10', label: 'visit', source: '3', target: '7', size: 2, color:'#ccc', type: 'curvedArrow'});

    // Instantiate sigma:
    s = new sigma({
        graph: g,
        renderer: {
            container: document.getElementById('graph-container'),
            type: 'canvas'
        },
        settings: {
            edgeLabelSize: 'proportional'//,
            // autoRescale: false
        }
    });

    // Start the ForceAtlas2 algorithm:
    s.startForceAtlas2({worker: true, barnesHutOptimize: false});
});
