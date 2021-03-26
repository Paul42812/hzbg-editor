import Point from 'ol/geom/Point';
import * as ol from 'ol';
import OSM from 'ol/source/OSM';
import sVector from 'ol/source/Vector';
import lVector from 'ol/layer/Vector';
import { fromLonLat, toLonLat } from 'ol/proj';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Icon, Style} from 'ol/style';
import features from './features'
import {defaults as defaultInteractions} from 'ol/interaction';
import KeyboardZoom from 'ol/interaction/KeyboardZoom';
import Collection from 'ol/Collection';
import {Attribution,FullScreen, defaults as defaultControls} from 'ol/control';
import {toSize} from 'ol/size';

var cid = 0;
var currentid = 0;
var points = []

/* Styles */
var iconStyle = new Style({
  image: new Icon(({
    anchor: [0.5, 18], 
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'assets/img/rico.png'
  }))
});

var activeStyle = new Style({
  image: new Icon(({
    anchor: [0.5, 18], 
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'assets/img/bico.png'
  }))
});

var currentStyle = new Style({
  image: new Icon(({
    anchor: [0.5, 18], 
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'assets/img/gico.png'
  }))
});

features.icons.forEach(element => {
    element.setStyle(iconStyle)
});

var vectorSource = new sVector({
  features: features.icons
});



var vectorLayer = new lVector({
  source: vectorSource,
  type: "stay"
});

var map = new ol.Map({
  layers: [
    new TileLayer({
      source: new OSM(),
      type: "stay"
    }),
    vectorLayer
  ],
  target: 'map',
  view: new ol.View({
    center: fromLonLat([15.6979, 48.2831]),
    zoom: 15,
    maxZoom: 18,
  }),
  interactions: defaultInteractions({keyboard: false}).extend([new KeyboardZoom()]),
  controls: defaultControls({attribution: false})
});

map.on('click', function(evt) {
  var f = map.forEachFeatureAtPixel(
      evt.pixel,
      function(ft, layer){return ft;}
  );
  if (f && f.get('type') == 'added') {
      var geometry = f.getGeometry();
      var coord = geometry.getCoordinates();
      var bid = f.get('id');
      
      obj['points'].forEach(element => {
        var ft = new ol.Feature({
          id: element.id,
          geometry: new Point(fromLonLat([element.lonlat[0], element.lonlat[1]])),
          type: "added",
          text: element.text,
        })
        
        if (element.id == bid){
          ft.setStyle(currentStyle)
          currentid = element.id;
          document.getElementById(element.id).style.backgroundColor = "lightgray";
        } else {
          ft.setStyle(activeStyle)
          document.getElementById(element.id).style.backgroundColor = "white";
        }
      
        var vss = new sVector({
          features: [ft],
        });
        
        var vll = new lVector({
          source: vss,
        });
        
        map.addLayer(vll);
      });

  } 
});

$(document).on('keydown', function(e) {
  if (e.key === "d") { 
    
  }
});

function saveFile (name, type, data) {
	if (data != null && navigator.msSaveBlob)
		return navigator.msSaveBlob(new Blob([data], { type: type }), name);
	var a = $("<a style='display: none;'/>");
  var url = window.URL.createObjectURL(new Blob([data], {type: type}));
	a.attr("href", url);
	a.attr("download", name);
	$("body").append(a);
	a[0].click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

var obj: any = {};
obj.points = points;

$("button#remove").on('click', function() {
  delete obj.points[currentid];
  update();
});


map.on('pointermove', function(e){
  map.getViewport().style.cursor = 'default';
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  
  map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    if (feature.get('type') == "added"){
      map.getViewport().style.cursor = 'pointer';
    }
  });
});

map.on('contextmenu', function(e){
    var coords = toLonLat(e.coordinate);
    var lat = coords[1];
    var lon = coords[0];
    document.getElementById("map").style.cursor = "";

    var lonlat = [lon, lat];
    var point = {
      "type": "click",
      "id": cid,
      "lonlat": lonlat,
      "text": "TEXT"
    }

    obj.points.push(point)
    cid += 1;

    update();
});

function update(){
  map.getLayers().getArray().slice().forEach(layer => {
    if (layer && layer.get('type') !== 'stay') {
      map.removeLayer(layer);
    }
  });

  var a = document.getElementById('lst')
  a.innerHTML = "";

  obj['points'].forEach(element => {
    a.innerHTML += "<p id='"+ element.id +"' class='hbtn'>"+ element.id + "</p>"
  });

  var elements = document.getElementsByClassName("hbtn");

  Array.from(elements).forEach(function(element) {
    element.addEventListener('click', function() {
      obj['points'].forEach(e => {
        var ft = new ol.Feature({
          geometry: new Point(fromLonLat([e.lonlat[0], e.lonlat[1]])),
        })
        
        if (e.id == element.id){
          ft.setStyle(currentStyle)
          currentid = e.id;
          document.getElementById(e.id).style.backgroundColor = "lightgray";
        } else {
          ft.setStyle(activeStyle)
          document.getElementById(e.id).style.backgroundColor = "white";
        }
      
        var vss = new sVector({
          features: [ft],
        });
        
        var vll = new lVector({
          source: vss,
        });

        map.addLayer(vll);        
      });
    });
  });

  obj['points'].forEach(element => {
    var ft = new ol.Feature({
      id: element.id,
      geometry: new Point(fromLonLat([element.lonlat[0], element.lonlat[1]])),
      type: "added",
      text: element.text,
    })
    
    if (element.id + 1 == cid){
      ft.setStyle(currentStyle)
      currentid = element.id;
      document.getElementById(element.id).style.backgroundColor = "lightgray";
    } else {
      ft.setStyle(activeStyle)
      document.getElementById(element.id).style.backgroundColor = "white";
    }
  
    var vss = new sVector({
      features: [ft],
    });
    
    var vll = new lVector({
      source: vss,
    });
    
    map.addLayer(vll);
  });
}

/* saveFile("data.json", "data:attachment/text", "Hello, world."); */

document.getElementById('map').focus();
const img = (document.getElementById('img') as HTMLImageElement);