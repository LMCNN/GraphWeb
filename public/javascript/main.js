$(document).ready(function () {
    let s = new sigma(document.getElementById('container'));

    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/rendNav',
        dataType: 'json',
        success: function(response) {
            renderNavBar(response);
            switchGraph();
        },
        error: function(xhr) {
            //Do Something to handle error
        }
    });

    function renderNavBar(data){
        for (let i = 0; i < data; i++){
            let name = 'Graph ' + (i + 1);
            let result = '<li><a href="#" class="navBar" id="' + i + '">' + name + '</a></li>';
            $('#navBar').append(result);
        }
    }

    function switchGraph() {
        $('.navBar').click(function(event) {
            //select graph to load
            event.preventDefault();
            $.ajax({
                type: 'GET',
                url: '/graph?id=' + $(this).attr('id'),
                dataType: 'json',
                success: loadGraph,
                error: function(xhr) {
                    //Do Something to handle error
                }
            });
            return false; // for good measure
        });

        //search graph to load
        $('#searchBtn').click(function () {
            let v = $('#searchVal').val();
            $.ajax({
                type: 'GET',
                url: '/graph?id=' + v,
                dataType: 'json',
                success: loadGraph,
                error: function(xhr) {
                    alert('Invalid input!\n' +
                        'Please enter a graph number.');
                }
            });
        });
    }

    function loadGraph(graph) {
        console.log(graph);

        $( "#container" ).remove();
        $('<div id="container"></div>').insertAfter("#navBar");

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
});

