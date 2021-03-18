import Point from 'ol/geom/Point';
import * as ol from 'ol';
import OSM from 'ol/source/OSM';
import sVector from 'ol/source/Vector';
import lVector from 'ol/layer/Vector';
import {FullScreen, defaults as defaultControls} from 'ol/control';
import { fromLonLat, toLonLat } from 'ol/proj';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Icon, Style} from 'ol/style';
import features from './features'
import {defaults as defaultInteractions} from 'ol/interaction';
import KeyboardZoom from 'ol/interaction/KeyboardZoom';
import Collection from 'ol/Collection';

var iconStyle = new Style({
  image: new Icon(({
    anchor: [0.5, 18], 
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'https://www.dropbox.com/s/fx852dq393bwjj3/icon.png?dl=1'
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
});

var bb = 0;

map.on('click', function(evt) {
  if (bb == 1){
    var coords = toLonLat(evt.coordinate);
    var lat = coords[1];
    var lon = coords[0];
    bb = 0;
    document.getElementById("map").style.cursor = "";
    document.getElementById("add_btn").style.cursor = "";

    var ft = new ol.Feature({
      geometry: new Point(fromLonLat([lon, lat])),
    })

    ft.setStyle(iconStyle)
  
    var vss = new sVector({
      features: [ft],
    });
    
    var vll = new lVector({
      source: vss,
    });
    
    map.addLayer(vll);
  }
});

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

document.getElementById('map').focus();
const img = (document.getElementById('img') as HTMLImageElement);

$("#add_btn").on('click', function() {
  document.getElementById("map").style.cursor = "url('assets/img/icon.png'), auto";
  document.getElementById("add_btn").style.cursor = "url('assets/img/icon.png'), auto";
  bb = 1;
})