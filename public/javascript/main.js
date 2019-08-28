let g,
    graphNum = 0;

$.ajax({
    type: 'GET',
    url: 'http://localhost:3000/test',
    dataType: 'json',
})
    .done(function(result) {
        renderNav(result);
    })
    .fail(function(xhr, status, error) {
        console.log(error);
    })
    .always(function(data){
    });


function renderNav(data){
    console.log(data.nodes);
    console.log(data.edges);
}