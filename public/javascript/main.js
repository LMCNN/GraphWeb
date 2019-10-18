$(document).ready(function () {
    let currId = 0,
        g = {},
        canvasRatio = 0.5,
        description;

    adjustRatio(canvasRatio);

    //get the graph number from the server
    $.ajax({
        type: 'GET',
        url: '/rendNav',
        dataType: 'json',
        success: function(response) {
            renderNavBar(response);
            switchGraph();
        },
        error: function(xhr) {
            //Do Something to handle error
            alert('nav bar render failed!');
        }
    });

    //add graph link to html nav bar
    function renderNavBar(data){
        for (let i = 0; i < data.length; i++){
            let name = data[i];
            let result = '<li><a href="#" class="navBtn" id="' + i + '">' + name + '</a></li>';
            $('#navBar').append(result);
        }
    }

    //change the graph need to load
    function switchGraph() {
        $('.navBtn').click(function(event) {
            currId =  $(this).attr('id');
            //select graph to render
            event.preventDefault();
            $.ajax({
                type: 'GET',
                url: '/graph?id=' + currId,
                dataType: 'json',
                success: renderGraph,
                error: function(xhr) {
                    //Do Something to handle error
                    alert('Select graph failed!');
                }
            });

            return false; // for good measure
        });

        //search graph to render
        $("#searchForm").submit(function (e) {
            e.preventDefault();
            let currGraph = $("input:first").val();
            $.ajax({
                type: 'GET',
                url: '/graph?id=' + currGraph,
                dataType: 'json',
                success: renderGraph,
                error: function(xhr) {
                    alert('Invalid input!\n' +
                        'Please enter a graph number.');
                }
            });
        });
    }

    //using the sigma js to render the graph which received from the server
    function renderGraph(graph) {
        g = graph;
        currId = graph.gid;
        describe(currId);

        $( "#container" ).remove();
        $(".graphBox").append('<div id="container"></div>');

        // create a network
        let container = document.getElementById('container');
        let options = {
            edges: {
                arrows:'to'
            },
            nodes : {
                shape: 'dot',
                size: 20
            },
            physics: {
                barnesHut: {
                    centralGravity: 0.5,
                    avoidOverlap: 0.5
                },
                minVelocity: 0.75
            },
            interaction:{hover:true}
        };
        let network = new vis.Network(container, g, options);

        network.on("hoverNode", function (params) {
            let id = this.getNodeAt(params.pointer.DOM);
            let currNode;
            for (let i = 0; i < g.nodes.length; i++) {
                if (g.nodes[i].id === id) {
                    currNode = g.nodes[i];
                    break;
                }
            }
            let msg = '<b>Attributes:</b><br>';
            for(let key in currNode.attributes) {
                msg = msg + g.dict.node[key].title + ': ';
                msg = msg + '<b>' + currNode.attributes[key] + '</b>' + '; ';
            }

            $('.graphNav').html(msg);
        });

        network.on("hoverEdge", function (params) {
            let id = this.getEdgeAt(params.pointer.DOM);
            let currEdge;
            for (let i = 0; i < g.edges.length; i++) {
                if (g.edges[i].id === id) {
                    currEdge = g.edges[i];
                    break;
                }
            }
            let msg = '<b>Attributes:</b><br>';
            for(let key in currEdge.attributes) {
                msg = msg + g.dict.edge[key].title + ': ';
                msg = msg + '<b>' + currEdge.attributes[key] + '</b>' + '; ';
            }
            $('.graphNav').html(msg);
        });

        network.on("selectNode", function (params) {
            console.log(this.getNodeAt(params.pointer.DOM));
            let id = this.getNodeAt(params.pointer.DOM);
            let currNode;
            for (let i = 0; i < g.nodes.length; i++) {
                if (g.nodes[i].id === id) {
                    currNode = g.nodes[i];
                    break;
                }
            }
            let key = currNode.label + ':' + currNode.title;
            let data = description[key];
            if (typeof(data) !== 'undefined') {
                console.log(data);
                $('#msgRoot').remove();
                $('#msg').append('<div id="msgRoot"></div>');

                // Get DOM-element for inserting json-tree
                let wrapper = document.getElementById("msgRoot");

                // Create json-tree
                let tree = jsonTree.create(data, wrapper);
            }
        });
    }

    //select graph to describe
    function describe(currGraph){
        $.ajax({
            type: 'GET',
            url: '/describe?id=' + currGraph,
            dataType: 'text',
            success: showMessage,
            error: function(xhr) {
                alert('error');
            }
        });
    }

    //show the message in the message part
    function showMessage(msg) {
        let strings = msg.split('\n');
        $('#msgRoot').remove();
        $('#msg').append('<div id="msgRoot"></div>');
        // $('#msgRoot').html(msg);
        strings.forEach(function (line) {
            $('#msgRoot').append(line + '<br>');
        });
        getJSON();
    }

    //get the json file from the server
    function getJSON() {
        $.ajax({
            type: 'GET',
            url: '/json?id=' + currId,
            dataType: 'json',
            success: function (data) {
                description = data;
                console.log(description);
            },
            error: function(xhr) {
                alert('Get JSON failed!');
            }
        });
    }

    // functions for render canvas
    //-------------------------------------------------
    function adjustRatio(ratio) {
        let graphStyle = {};
        let splitterStyle = {};
        let messageStyle = {};
        if (ratio < 0.1) {
            $('.graph').hide();
            $('.msgBox').show();
            $('#drag').empty();
            $('#drag').append('<p>&rsaquo;</p>');
            splitterStyle.left = 0;
            messageStyle.left = '3%';
            messageStyle.width = '90%';
        }
        else if (ratio > 0.8) {
            $('.graph').show();
            $('.msgBox').hide();
            $('#drag').empty();
            $('#drag').append('<p>&lsaquo;</p>');
            splitterStyle.left = '90.5%';
            graphStyle.left = 0;
            graphStyle.width = '90%';
        }
        else {
            $('.graph').show();
            $('.msgBox').show();
            $('#drag').empty();
            $('#drag').append('<p>&#8942;</p>');
            ratio = ratio * 100;
            graphStyle.left = 0;
            graphStyle.width = ratio + '%';
            splitterStyle.left = (ratio + 0.5) + '%';
            messageStyle.left = (ratio + 3) + '%';
            messageStyle.width = (90 - ratio) + '%';
        }
        $('.graph').css(graphStyle);
        $('.splitter').css(splitterStyle);
        $('.msgBox').css(messageStyle);

    }

    $('#drag').on('mousedown', onMouseDown);

    function onMouseDown(event) {
        if (canvasRatio > 0.8) {
            canvasRatio = 0.8;
            adjustRatio(canvasRatio);
            renderGraph(g);
        }
        else if (canvasRatio < 0.2) {
            canvasRatio = 0.2;
            adjustRatio(canvasRatio);
            renderGraph(g);
        }
        else {
            $('html').on('mousemove', onMouseMove);
            $('html').on('mouseup', onMouseUp);
        }
    }

    function onMouseMove(event) {
        let ratio = (event.screenX - $('.canvas').position().left - 65) / $('.canvas').width();
        if (ratio < canvasRatio) $( "#container" ).remove();
        canvasRatio = ratio;
        adjustRatio(canvasRatio);
    }

    function onMouseUp(event) {
        renderGraph(g);
        $('html').off('mousemove', onMouseMove);
        $('html').off('mouseup', onMouseUp);
    }
    //--------------------------------------------------
});