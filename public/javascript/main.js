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
            describe();
        },
        error: function(xhr) {
            //Do Something to handle error
        }
    });

    //add graph link to html nav bar
    function renderNavBar(data){
        for (let i = 0; i < data; i++){
            let name = 'Graph ' + (i + 1);
            let result = '<li><a href="#" class="navBtn" id="' + i + '">' + name + '</a></li>';
            $('#navBar').append(result);
        }
    }

    //change the graph need to load
    function switchGraph() {
        $('.navBtn').click(function(event) {
            //select graph to render
            event.preventDefault();
            $.ajax({
                type: 'GET',
                url: '/graph?id=' + $(this).attr('id'),
                dataType: 'json',
                success: renderGraph,
                error: function(xhr) {
                    //Do Something to handle error
                }
            });

            return false; // for good measure
        });

        //search graph to render
        $('#searchBtn').click(function () {
            let v = $('#searchVal').val();
            $.ajax({
                type: 'GET',
                url: '/graph?id=' + v,
                dataType: 'json',
                success: renderGraph,
                error: function(xhr) {
                    alert('Invalid input!\n' +
                        'Please enter a graph number.');
                }
            });
        });
    }

    //using the sigma js to render the graph which received from server
    function renderGraph(graph) {
        currGraph = graph.gid;
        // console.log(currGraph);
        // console.log(graph);

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
                edgeLabelSize: 'proportional',
                sideMargin: 1
            }
        });

        // Start the ForceAtlas2 algorithm:
        s.startForceAtlas2({worker: true, barnesHutOptimize: false});
    }

    //select graph to describe
    function describe(){
        $('.navBtn').click(function () {
            $.ajax({
                type: 'GET',
                url: '/describe?id=' + $(this).attr('id'),
                dataType: 'text',
                success: showMessage,
                error: function(xhr) {
                    alert('error');
                }
            });
        })
    }

    //show the message in the message part
    function showMessage(msg) {
        // console.log(msg);
        let strings = msg.split('\n');
        // console.log(strings);
        $('#msgRoot').remove();
        $('#msg').append('<div id="msgRoot"></div>');
        strings.forEach(function (line) {
            $('#msgRoot').append('<a> ' + line + ' </a><br>')
        });
    }
});

