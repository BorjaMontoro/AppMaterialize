//GUI
(function($){
  $(function(){

    $('.sidenav').sidenav();
    $('.tabs').tabs({"swipeable":true});

    $('#cargarArticulos').click(cargarArticulos);
  }); // end of document ready
})(jQuery); // end of jQuery name space

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    $('#botonCamera').click(hacerFoto);

}

function hacerFoto(){
  let cameraOptions={
    destinationType: Camera.DestinationType.FILE_URI,
    encodingType : Camera.EncodingType.JPEG,
    correctOrientation: true,
    sourceType: Camera.PictureSourceType.CAMERA
  };
  navigator.camera.getPicture(function(imageURI) {
  resolveLocalFileSystemURL(imageURI, function(fileEntry) {
    fileEntry.file(function(file) { 
      var reader = new FileReader();
      reader.onloadend = function() {
        let image = document.getElementById('imagen');
        image.src = this.result;
      }
      reader.readAsDataURL(file);
    }, cameraError);
  }, cameraError);
}, cameraError, cameraOptions);
  return false;
}

function cameraSuccess(imageURI) {
  //let image = document.getElementById('imagen');
  //image.src = "data:image/jpeg;base64,"+imageData;
}

function cameraError(message) {
    alert(message);
}

function cargarArticulos(){
  $.ajax({
    method: "GET",
    url: "https://api.spaceflightnewsapi.net/v3/articles?_limit=8",
    dataType: "json",   // necessitem això pq ens retorni un objecte JSON
  }).done(function (msg) {
    $('#listaArticulos').empty();
    $('#listaArticulos').append('<li class="collection-header"><h4>Articulos</h4></li>');
    for(let item in msg) {
      var title = msg[item].title;
      var imagen = msg[item].imageUrl;
      var noticia = msg[item].summary;
      var fecha = msg[item].publishedAt;
      let articulo=$('<li id='+msg[item].id+' class="collection-item"><div>'+title+'<a href="#!" class="secondary-content informacion"><i class="material-icons">send</i></a></div></li>');
      let articuloCard=$(`<div class="col s12 m6 l3"">
                            <div class="card">
                              <div class="card-title">
                                <h4>${title}</h4>
                              </div>
                              <div class="card-image">
                                <img src="${imagen}">
                              </div>
                              <div class="card-content">
                                <p>${noticia}</p>
                                <p>${fecha}</p>
                              </div>
                          </div>`);
      $(".informacion",articulo).click((e) => {
        let id=($(e.target).parent().parent().parent().attr("id"));
        $('#test-swipe-2').empty();
        $.ajax({
          method: "GET",
          url: "https://api.spaceflightnewsapi.net/v3/articles/"+id,
          dataType: "json",   
        }).done(function (msg) {
          var title = msg.title;
          var imagen = msg.imageUrl;
          var noticia = msg.summary;
          var fecha = msg.publishedAt;
          let detallesArticulo=$(`<div class="row">
                          <div class="col m3"></div>
                          <div class="col s12 m6">
                            <div class="card">
                              <div class="card-title">
                                <h4>${title}</h4>
                              </div>
                              <div class="card-image">
                                <img src="${imagen}">
                              </div>
                              <div class="card-content">
                                <p>${noticia}</p>
                                <p>${fecha}</p>
                              </div>
                          </div>
                          <div class="col m3"></div>
                        </div>
                      </div>`);
          $('#test-swipe-2').append(detallesArticulo);
        }).fail(function () {
          alert("ERROR");
        });
        $('#tabs-swipe-demo').tabs("select", "test-swipe-2");
    });
      $('#listaArticulos').append(articulo);
      $('#todasNoticias').append(articuloCard);
    }
  }).fail(function () {
    alert("ERROR");
  });
}

  
