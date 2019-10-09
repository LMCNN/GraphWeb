$(document).ready(function () {


    let s = new sigma(document.getElementById('container')),
        currId = 0,
        g = {},
        canvasRatio = 0.5;

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
        // console.log(graph);
        describe(currId);

        $( "#container" ).remove();
        $(".graphBox").append('<div id="container"></div>');

        // Instantiate sigma:
        s = new sigma({
            graph: graph,
            renderer: {
                container: document.getElementById('container'),
                type: 'canvas'
            },
            settings: {
                minEdgeSize: 5,
                minArrowSize: 5,
                edgeHoverSizeRatio: 3,
                enableEdgeHovering: true,
                sideMargin: 1
            }
        });

        s.bind('clickNode', function(event) {
            let count = 0,
                result = "",
                attr = event.data.node.attributes;
            console.log(event.data.node);
            while (true) {
                if (typeof attr[count] === 'undefined') break;
                else {
                    result += g.model.node[count].title + ': ' + attr[count];
                    // console.log(attr[count]);
                    result += '\n';
                    count++;
                }
            }
            alert(result);
        });

        // Start the ForceAtlas2 algorithm:
        s.startForceAtlas2({worker: true, barnesHutOptimize: false});
        setTimeout(function() { s.stopForceAtlas2(); }, 500);
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
        console.log(msg);
        let strings = msg.split('\n');
        $('#msgRoot').remove();
        $('#msg').append('<div id="msgRoot"></div>');
        strings.forEach(function (line) {
            $('#msgRoot').append(line + '<br>');
        });
    }

    //get the json file from the server
    $('#json').click(function () {
        $.ajax({
            type: 'GET',
            url: '/json?id=' + currId,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                $('#msgRoot').remove();
                $('#msg').append('<div id="msgRoot"></div>');
                // $('#msgRoot').jsonView(data);
            },
            error: function(xhr) {
                alert('Get JSON failed!');
            }
        });
    });

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
        // console.log('down');
        if (canvasRatio > 0.8) {
            canvasRatio = 0.8;
            adjustRatio(canvasRatio);
        }
        else if (canvasRatio < 0.1) {
            canvasRatio = 0.2;
            adjustRatio(canvasRatio);
        }
        else {
            $('html').on('mousemove', onMouseMove);
            $('html').on('mouseup', onMouseUp);
        }
    }

    function onMouseMove(event) {
        let ratio = (event.screenX - $('.canvas').position().left - 65) / $('.canvas').width();
        // console.log(ratio);
        canvasRatio = ratio;
        adjustRatio(canvasRatio);
    }

    function onMouseUp(event) {
        // console.log('up');
        renderGraph(g);
        $('html').off('mousemove', onMouseMove);
        $('html').off('mouseup', onMouseUp);
    }
    //--------------------------------------------------
});