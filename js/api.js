var geocoder;
var map;
var points = [];
var polygonArray = [];
var data = [];


function initialize() {
  	map = new google.maps.Map(
    	document.getElementById("map_canvas"), {
      	center: new google.maps.LatLng(19.6985296,-101.1889345), 
      	zoom: 15,
      	mapTypeId: google.maps.MapTypeId.ROADMAP
    });

  	var drawingManager = new google.maps.drawing.DrawingManager({
    	drawingMode: google.maps.drawing.OverlayType.POLYGON,
    	drawingControl: true,
    	drawingControlOptions: {
      		position: google.maps.ControlPosition.TOP_CENTER,
      		drawingModes: [
        		google.maps.drawing.OverlayType.POLYGON
      		]
    	},

		polygonOptions: {
		    fillColor: '#BCDCF9',
		    fillOpacity: 0.5,
		    strokeWeight: 2,
		    strokeColor: '#57ACF9',
		    clickable: false,
		    editable: false,
		    zIndex: 1
		}
	});

	//console.log(drawingManager)
	drawingManager.setMap(map)

  fillCombo();

	google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
	    
	    for (var i = 0; i < polygon.getPath().getLength(); i++) {
        points.push({lat: polygon.getPath().getAt(i).lat(), lng: polygon.getPath().getAt(i).lng()});
	    }

	    polygonArray.push(polygon);
  	});

}

google.maps.event.addDomListener(window, "load", initialize);

function Draw(polygoneCoords) {
  polygoneCoords.push(polygoneCoords[0]);
  for(var i in polygoneCoords){
      polygoneCoords[i].lat = parseFloat(polygoneCoords[i].lat);
      polygoneCoords[i].lng = parseFloat(polygoneCoords[i].lng);
  }

    var userPolygone = new google.maps.Polygon({
          paths: polygoneCoords,
          strokeColor: '#57ACF9',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#BCDCF9',
          fillOpacity: 0.35
        });

    userPolygone.setMap(map);
}

$(document).ready(function(){

  $('#guardar_poli').submit(function(e){
      e.preventDefault();

      if (points.length > 0){
            var namePoly = {"name": document.getElementById("poly_name").value};
      
            var option = {"option":3};
            var data = [{"option":option},{"namePoly":namePoly},{"points":points}];
      
            data = JSON.stringify(data);
      
            __ajax("php/process.php",{"data": data})
            .done(function(info){
              if (info){
                alert("Se guardó con éxito");
                fillCombo();
                points = [];
                document.getElementById("poly_name").value = "";
              }
            });}

  });

});

$(document).ready(function(){
  $('#mostrar_poli').submit(function(e){
      e.preventDefault();

      var option = {"option":2};
      var search = {"search":document.getElementById("poli_combo").value};
      var data = [{"option":option},{"search":search}];
      data = JSON.stringify(data);

      __ajax("php/process.php",{"data": data})
      .done(function(info){
        var coords = JSON.parse(info);
        Draw(coords.points);
      });

  });
});

function __ajax(url, data){
  var ajax = $.ajax({
    "method": "POST",
    "url": url,
    "data": data
  })
  return ajax;
}

function fillCombo(){
  var selection = "";
  var option = {"option":1};
  var data = [{"option":option}];
  data = JSON.stringify(data);

  __ajax("php/process.php",{"data": data})
  .done(function(info){
    var polygones = JSON.parse(info);

    for(var i in polygones.data)
      selection += `<option value = "${polygones.data[i].idPolygone}"> ${polygones.data[i].Name} </option>`
    $("#poli_combo").html(selection);
  });

}