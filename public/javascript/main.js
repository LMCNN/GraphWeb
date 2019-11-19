$(document).ready(function () {
    let currId = 0,
        g = {},
        canvasRatio = 0.5,
        description;

    adjustRatio(canvasRatio);

    //it gets the total graph number from the server
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
            alert('navBar rendering is failed!');
        }
    });

    //This function adds the graph link to html navBar section
    function renderNavBar(data){
        for (let i = 0; i < data.length; i++){
            let name = data[i];
            let result = '<li><a href="#" class="navBtn" id="' + i + '">' + name + '</a></li>';
            $('#navBar').append(result);
        }
    }

    //This function changes the graph which needs to be rendered
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
                    alert('Connecting Error\nSelect graph failed!');
                }
            });

            return false; // for good measure
        });

        //This function searches the graph need to be rendered
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

    //This function uses the vis.js to render the graph which is received from the server
    function renderGraph(graph) {
        if (typeof graph.gid === 'undefined') return;
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
            // console.log(this.getNodeAt(params.pointer.DOM));
            let id = this.getNodeAt(params.pointer.DOM);
            let currNode;
            for (let i = 0; i < g.nodes.length; i++) {
                if (g.nodes[i].id === id) {
                    currNode = g.nodes[i];
                    break;
                }
            }
            document.getElementById(currNode.id).focus({preventScroll:true});
            // let key = currNode.label + ':' + currNode.title;
            // let data = description[key];
            // if (typeof(data) !== 'undefined') {
            //     // console.log(data);
            //     $('#msgRoot').remove();
            //     $('#msg').append('<div id="msgRoot"></div>');
            //
            //     // Get DOM-element for inserting json-tree
            //     let wrapper = document.getElementById("msgRoot");
            //
            //     // Create json-tree
            //     let tree = jsonTree.create(data, wrapper);
            // }
        });
    }

    //This function describes the graph which was selected by the user
    function describe(currGraph){
        $.ajax({
            type: 'GET',
            url: '/describe?id=' + currGraph,
            dataType: 'text',
            success: showMessage,
            error: function(xhr) {
                alert('Connecting error');
            }
        });
    }

    //showing the message in the message part
    function showMessage(msg) {
        let strings = msg.split('\n');
        $('#msgRoot').remove();
        $('#msg').append('<div id="msgRoot"></div>');
        // $('#msgRoot').html(msg);
        let count = 0;
        console.log(g);
        strings.forEach(function (line) {
            let strs = line.split(' ');
            if (line[line.length - 2] === ':') {
                let count = strs.length - 1;
                let name = strs[count].substring(0, strs[count].length - 2);
                count--;
                while (strs[count] !== 'vertex') {
                    name = strs[count] + ' ' + name;
                    count--
                }
                let currNode;
                for (let i = 0; i < g.nodes.length; i++) {
                    if (g.nodes[i].title === name) {
                        currNode = g.nodes[i];
                        break;
                    }
                }
                console.log(name);
                $('#msgRoot').append('<a id=' + currNode.id + '>' + line + '</a>' + '<br>');
            }
            else {
                $('#msgRoot').append('<a>' + line + '</a>' + '<br>');
            }
        });
        getJSON();
    }

    //getting the json file from the server
    function getJSON() {
        $.ajax({
            type: 'GET',
            url: '/json?id=' + currId,
            dataType: 'json',
            success: function (data) {
                description = data;
                // console.log(description);
            },
            error: function(xhr) {
                alert('Get JSON failed!');
            }
        });
    }

    // functions for rendering the canvas
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