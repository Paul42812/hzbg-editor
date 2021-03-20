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

features.icons.forEach(element => {
    element.setStyle(iconStyle)
});

var vectorSource = new sVector({
  features: features.icons
});



var vectorLayer = new lVector({
  source: vectorSource
});

var map = new ol.Map({
  layers: [
    new TileLayer({
      source: new OSM(),
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

var bb = 0;

map.on('click', function(evt) {

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

$(document).on('keydown', function(e) {
  if (e.key === "a") { 
    document.getElementById("map").style.cursor = "url('assets/img/icon.png'), auto";
    document.getElementById("add_btn").style.cursor = "url('assets/img/icon.png'), auto";
    bb = 1;
  }
});

map.on('pointermove', function(e){
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  map.getViewport().style.cursor = hit ? 'marker' : '';
});

var cid = 0;
var points = []

var obj: any = {};
obj.points = points;

map.on('contextmenu', function(e){
    var coords = toLonLat(e.coordinate);
    var lat = coords[1];
    var lon = coords[0];
    bb = 0;
    document.getElementById("map").style.cursor = "";

    var ft = new ol.Feature({
      geometry: new Point(fromLonLat([lon, lat])),
    })

    ft.setStyle(activeStyle)
  
    var vss = new sVector({
      features: [ft],
    });
    
    var vll = new lVector({
      source: vss,
    });
    
    map.addLayer(vll);

    var lonlat = [lon, lat];
    var point = {
      "id": cid,
      "lonlat": lonlat,
      "text": "TEXT"
    }
    obj.points.push(point)
    cid += 1;

    updatelist();
});

/* saveFile("Example.txt", "data:attachment/text", "Hello, world."); */

function updatelist(){
  var a = document.getElementById('lst')
  a.innerHTML = "";

  obj['points'].forEach(element => {
    a.innerHTML += "<p>"+ element.id + " | " + element.lonlat +"</p>"
  });
};

document.getElementById('map').focus();
const img = (document.getElementById('img') as HTMLImageElement);