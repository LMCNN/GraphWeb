$(document).ready(function () {
    "use strict";
    var jsav = new JSAV("container");
    var initGraph = function(opts) {
        var g = jsav.ds.graph({
            width: 400,
            height: 360,
            left: 0,
            top: 0,
            layout: "automatic",
            directed: true
        });
        var a = g.addNode("A"),
            b = g.addNode("B"),
            c = g.addNode("C"),
            d = g.addNode("D"),
            e = g.addNode("E"),
            f = g.addNode("F");
        g.addEdge(a, b);
        g.addEdge(a, c);
        g.addEdge(b, d);
        g.addEdge(e, a);
        g.addEdge(d, e);
        g.addEdge(d, f);
        return g;
    };

    jsav.label("Layered graph layout")
    var g = initGraph({layout: "automatic"});
    g.layout();
    jsav.displayInit();
    jsav.umsg("Test Message");

});