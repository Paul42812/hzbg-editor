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
  /*controls: defaultControls().extend([new FullScreen()]),*/
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

var imgs; var index;

map.on('click', function(evt) {
    var f = map.forEachFeatureAtPixel(
        evt.pixel,
        function(ft, layer){return ft;}
    );
    if (f && f.get('type') == 'click') {
        var geometry = f.getGeometry();
        var coord = geometry.getCoordinates();
        
        imgs = f.get('images'); index = 0;
        (document.getElementById('img') as HTMLImageElement).src = imgs[0];
        (document.getElementById('img') as HTMLImageElement).style.visibility = "visible";
    } 
});

map.on('contextmenu', function(evt){
  var coords = toLonLat(evt.coordinate);
  var lat = coords[1];
  var lon = coords[0];
  var locTxt = String(lat) + " " + String(lon);
  alert(locTxt)
});

$(document).keydown(function(e) {
  if (e.key === "Escape") { 
    img.style.visibility = "hidden";
    img.removeAttribute('src');
    document.getElementById('map').focus();
  }

  if (e.key === "ArrowRight") { 
    if (typeof imgs[index + 1] !== "undefined"){
      index += 1;
      (document.getElementById('img') as HTMLImageElement).src = imgs[index];
    }
  }

  if (e.key === "ArrowLeft") { 
    if (typeof imgs[index - 1] !== "undefined"){
      index -= 1;
      (document.getElementById('img') as HTMLImageElement).src = imgs[index];
    }
  }
});

map.on('pointermove', function(e){
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  map.getViewport().style.cursor = hit ? 'pointer' : '';
});

document.getElementById('map').focus();
const img = (document.getElementById('img') as HTMLImageElement);

function CenterImage(){
  img.style.height = String($(window).height()*(9/10))+"px";
  img.style.width = String((img.naturalWidth*img.height)/img.naturalHeight)+"px"

  img.style.marginLeft = String(-(img.width/2))+"px";
  img.style.marginTop = String(-(img.height/2))+"px";
}

img.onload = CenterImage;
window.onresize = CenterImage;
CenterImage();
img.style.position = "absolute"
img.style.top = "50%";
img.style.left = "50%";