$(document).ready(function () {
    let s = new sigma(document.getElementById('container'));
    let navBar = document.getElementById('navBar');
    console.log(navBar);

    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/rendNav',
        dataType: 'json',
        success: function(response) {
            renderNavBar(response);
            loadGraph();
        },
        error: function(xhr) {
            //Do Something to handle error
        }
    });

    function renderNavBar(data){
        for (let i = 0; i < data; i++){
            let name = 'Graph ' + (i + 1);
            let result = '<li><a href="#" class="navBar" id="' + i + '">' + name + '</a></li>';
            navBar.insertAdjacentHTML('beforeend', result);
        }
    }

    function loadGraph() {
        $('.navBar').click(function(event) {
            event.preventDefault();
            $.ajax({
                type: 'GET',
                url: '/graph?id=' + $(this).attr('id'),
                dataType: 'json',
                success: function(response) {
                    console.log(response);

                    $( "#container" ).remove();
                    $('<div id="container"></div>').insertAfter("#navBar");

                    // Instantiate sigma:
                    s = new sigma({
                        graph: response,
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
                },
                error: function(xhr) {
                    //Do Something to handle error
                }
            });
            return false; // for good measure
        });
    }
});

