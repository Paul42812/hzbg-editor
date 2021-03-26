import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import * as ol from 'ol';

var icons = [
  new ol.Feature({
    geometry: new Point(fromLonLat([15.69526, 48.28461])),
    text: "0",
    images: [
      "assets/img/moon.png"
    ]
  }),
  
  new ol.Feature({
    geometry: new Point(fromLonLat([15.69476, 48.28529])),
    text: "1",
    images: [
      "assets/Auring/DSC_1455.JPG",
      "assets/Auring/20191122_085427.jpg"
    ]
  }),

  new ol.Feature({
    geometry: new Point(fromLonLat([15.69476, 48.28729])),
    text: "2",
    images: [
      "https://raw.githubusercontent.com/Paul42812/hzbg/master/assets/Auring/20191122_090245.jpg",
      "https://raw.githubusercontent.com/Paul42812/hzbg/master/assets/Auring/20190825_113825.jpg",
      "https://raw.githubusercontent.com/Paul42812/hzbg/master/assets/Auring/DSC_1453.JPG"
    ]
  })
]

export default {
  icons: icons
}