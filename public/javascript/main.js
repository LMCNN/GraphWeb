$(document).ready(function () {
    let s = new sigma(document.getElementById('container')),
        currGraph = 0;

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
            currGraph =  $(this).attr('id');
            //select graph to render
            event.preventDefault();
            $.ajax({
                type: 'GET',
                url: '/graph?id=' + currGraph,
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
        $('#searchBtn').click(function () {
            let currGraph = $('#searchVal').val();
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
        currGraph = graph.gid;
        console.log(graph);
        describe(currGraph);

        $( "#container" ).remove();
        $(".graph").append('<div id="container"></div>');

        // Instantiate sigma:
        s = new sigma({
            graph: graph,
            renderer: {
                container: document.getElementById('container'),
                type: 'canvas'
            },
            settings: {
                // edgeLabelSize: 'proportional',
                sideMargin: 1
            }
        });

        // s.bind('overNode', function(event) {
        //     console.log(event.data.node.attributes);
        // });

        // Start the ForceAtlas2 algorithm:
        s.startForceAtlas2({worker: true, barnesHutOptimize: false});
        // s.stopForceAtlas2();
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
        strings.forEach(function (line) {
            $('#msgRoot').append('<a> ' + line + ' </a><br>');
        });
    }
});

