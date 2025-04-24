import { ref, computed, markRaw } from 'vue';
import { defineStore } from 'pinia';
import Graphic from '@arcgis/core/Graphic.js'
import * as bufferOperator from '@arcgis/core/geometry/operators/bufferOperator.js'
import * as intersectionOperator from "@arcgis/core/geometry/operators/intersectionOperator.js";
import * as areaOperator from "@arcgis/core/geometry/operators/areaOperator.js";

export const useMapStore = defineStore('mapStore', () => ({
  opacity: 70,
  tab: 'layers',
  compare: true, 
  panelState: 'open',
  activeTool: 'legend',
  activeHelpElement: '',  
  category: 'both',
  legend: '',
  bufferSize: 5000,
  currentPoint: '',
  results: [],
  oppResults: [],
  getCounts(){
    let counts = {avoid: 0, develop: 0, review: 0, minimize: 0}
    let avoid = this.results.filter((item)=>{
    return item.totalArea !== 0 && item.map !== 'opportunities' && item.layerName !== 'Landscape Connectivity'
    })
    counts.avoid = avoid.length
    let review = this.results.filter((item)=>{
      return item.totalArea == 0 && item.map !== 'opportunities'&& item.layerName !== 'Landscape Connectivity'
      })
      counts.review = review.length

    let minimize = this.results.filter((item)=>{
      return item.totalArea !== 0 && item.map !== 'opportunities'&& item.layerName == 'Landscape Connectivity'
      }
    )
    counts.minimize = minimize.length

    let develop = this.oppResults.filter((item)=>{
      return item.count > 0
    })
    counts.develop = develop.length

    let developPoly = this.results.filter((item)=>{
      return item.map == 'opportunities' && item.totalArea > 0
    })
    counts.develop = counts.develop + developPoly.length
    return counts
  
  },
 
  //layers referenced by component
  layers:  [
    { header: 'Avoid / Minimize Development',
    id: 'avoid',
    subheaders: [
      {title: 'Avoid Development', id: 'avoid', visible: true, visibleModel: true, description: 'Avoid developing critical ecological areas', 
        sublayers: [
          { id: 6, elid: 'woopingCraneW', visible: true, visibleModel: true, opacity: 0.9, category: 'wind', filter: true,title: 'Whooping Crane (wind)', description: 'short description', longDescription: 'long description' },
	        { id: 7, elid: 'woopingCraneS', visible: true, visibleModel: true, opacity: 0.9, category: 'solar', filter: true, title: 'Whooping Crane (solar)', description: 'short description', longDescription: 'long description' },
		      { id: 8, elid: 'eagles', visible: true, visibleModel: true, opacity: 0.9, category: 'wind', filter: true, title: 'Eagles (wind)', description: 'short description', longDescription: 'long description' },
          { id: 9, elid: 'grouse', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Prarie Grouse', description: 'short description', longDescription: 'long description' },
	        { id: 12, elid: 'birdareas', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Important Bird Areas', description: 'short description', longDescription: 'long description' },	  
		      { id: 14, elid: 'protectedareas', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Protected Areas', description: 'short description', longDescription: 'long description' },
		      { id: 3, elid: 'tande',visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Threatened & Endangered Species', description: 'short description', longDescription: 'long description' },
          { id: 10, elid: 'biggame', filter: true, visible: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Big Game', description: 'short description for Big Game', longDescription: 'long description'},
		      { id: 13, elid: 'wetlandsS',visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'solar', title: 'Wetlands (solar)', description: 'short description', longDescription: 'long description' },
          { id: 11, elid: 'wetlandsW', visible: true, filter: true,visibleModel: true, opacity: 0.9, category: 'wind', title: 'Wetlands (wind)', description: 'short description', longDescription: 'long description' },
          { id: 15, elid: 'intacthabitats', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Intact Habitats', description: 'short description', longDescription: 'long description' },
          { id: 16, elid: 'climateResistance', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Climate Resilience', description: 'short description', longDescription: 'long' }
        ]
      },
      {title: 'Minimize Development', id: 'minimize', visible: true, visibleModel: true, description: 'Minimize development in vital connectivity corridors', 
        sublayers: [
          {id: 29, elid:'corrd', filter: true, visible: true, visibleModel: true, category: 'both', title: 'Landscape Connectivity', description: 'short description ', longDescription: 'long description', opacity: .7}
        ]
      },
    ],
  },
  {
   header: 'Opportunities for Development',
   subheaders:[
      {title: 'Opportunities for Development', id: 'swipeLayers', visible: true, description: 'Focus development in areas with lower ecological impact',
        sublayers: [
          { id:0, elid:'brownfields', visible: false, filter: true,visibleModel: true, opacity: 0.9, category: 'solar', title: 'Brownfields over 50 acres (solar)', description: 'short description',longDescription: 'long description'  },
          { id:2, elid: 'minesout', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'solar', title: 'Mines not in Suitability (solar)',description: 'short description', longDescription: 'long description' },
          { id:1, elid: 'minesin', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'solar', title: 'Mines in Suitability (solar)', description: 'short description', longDescription: 'long description' },
          { id:19, elid: 'fsd', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'solar', title: 'Low impact water bodies for floating solar development (solar)', description: 'short description', longDescription: 'Waterbodies 2.5 acres or greater within 5 kilometers of the transmission lines, that are suitable for development because they are man-made reservoirs with Slightly Below Average to Far Below Average level of biodiversity and/or resilience.' },
        ]
      },
    ],
  },
  ],

  //map loads sublayers in reverse order from the list in the ui which causes confusion about 
  //which layer is on top.  This function reverses the order
  //and is used by the MapImageLayer to define sublayers.  
  avoidLayersReverse(){
    let newList = this.layers[0].subheaders[0].sublayers
    let reversed = newList.slice().reverse();
    return reversed
  }, 
  //reversed layers for opportunities
  opportunitiesLayersReverse(){

    let newList = this.layers[1].subheaders[0].sublayers
    let reversed = newList.slice().reverse();
   
    return reversed
  },
  //this function updates the layer order in the map when the user drags to reorder layers
  //on the UI
  updateLayerOrder(layer){
  
    let map = document.querySelector("arcgis-map").map;
    if(layer == 'avoid'){
      let mapLayer = map.findLayerById(layer);
      mapLayer.sublayers = this.avoidLayersReverse()
    }
    if(layer == 'opportunities' || layer =='swipeLayers'){
      let mapLayer = map.findLayerById('opportunities');
      mapLayer.sublayers = this.opportunitiesLayersReverse()
      let mapLayer2 = map.findLayerById('swipeLayers');
      mapLayer2.sublayers=  this.opportunitiesLayersReverse()
    }
  },
  //sets overall group layer visibility
  setLayerVisibility(layer) {
    layer.visible = !layer.visible
    let map = document.querySelector("arcgis-map").map;
    let mapLayer = map.findLayerById(layer.id);
    let sublayers = layer.sublayers

    for(var i=0;i<sublayers.length;i++){
      let sublayer = mapLayer.findSublayerById(sublayers[i].id);
      if(sublayers[i].elid == 'brownfields'){
        if(this.compare){
        sublayer = map.findLayerById('brownfields_swipe')
        }else{
          sublayer = map.findLayerById('brownfields_opp')
        }
      }
      sublayer.visible = layer.visible
      sublayers[i].visibleModel = layer.visible
    }
  },
  //sets individual layer visibility
  setSublayerVisibility(elid, id, subId, checked) {
    let map = document.querySelector("arcgis-map").map;
    let layer = map.findLayerById(id);
    let sub = layer.findSublayerById(subId);
    if( elid == 'brownfields'){
      if(this.compare){
        sub = map.findLayerById('brownfields_swipe')
      }
      else{
        sub = map.findLayerById('brownfields_opp')
      }
    }
    sub.visible = checked
  },
  //function to reset layers or filter layers
  updateLayerList(category){
    this.category = category
    if(this.category == 'both'){
      //this.layers[0].subheaders[0].sublayers = this.sourceLayers[0].subheaders[0].sublayers
      //this.layers[0].subheaders[1].sublayers = this.sourceLayers[0].subheaders[1].sublayers
      //this.layers[1].subheaders[0].sublayers = this.sourceLayers[1].subheaders[0].sublayers
      this.layers[0].subheaders[0].sublayers.forEach((layer)=>{
        layer.filter = true
      })
      this.layers[0].subheaders[1].sublayers.forEach((layer)=>{ 
        layer.filter = true
      })
      this.layers[1].subheaders[0].sublayers.forEach((layer)=>{
        layer.filter = true
      })      
      this.layers[0].subheaders[0].sublayers.forEach((layer)=>{
        let map = document.querySelector("arcgis-map").map;
        let mapLayer = map.findLayerById('avoid');
        let sub = mapLayer.findSublayerById(layer.id);
        layer.visible = true
        sub.visible = true
      })
      this.layers[0].subheaders[1].sublayers.forEach((layer)=>{
        let map = document.querySelector("arcgis-map").map;
        let mapLayer = map.findLayerById('minimize');
        let sub = mapLayer.findSublayerById(layer.id);
        layer.visible = true
        sub.visible = true
      })
      this.layers[1].subheaders[0].sublayers.forEach((layer)=>{
        let map = document.querySelector("arcgis-map").map;
        let val = this.compare ? 'swipeLayers' : 'opportunities'
        let mapLayer = map.findLayerById('swipeLayers');
        let sub = mapLayer.findSublayerById(layer.id);
        layer.visible = true
        if (layer.id !== 0 ){
          sub.visible = true
        }
     
      })

      if (this.compare){
        let map = document.querySelector("arcgis-map").map;
        let sub2 = map.findLayerById('brownfields_swipe')
        sub2.visible = true
      }
      if (!this.compare){
        let map = document.querySelector("arcgis-map").map;
        let sub2 = map.findLayerById('brownfields_opp')
        sub2.visible = true
      }
    }else{
     
      this.filterLayers()
    }
  },
  //filters layers
  filterLayers(){
    let map = document.querySelector("arcgis-map").map;
    let avoid = this.layers[0].subheaders[0].sublayers
    const f_avoid = avoid.filter((layer, index) => {
      if(layer.category !== this.category && layer.category !== 'both'){
        //turn off those layers so they are not visibl ein the map
        let mapLayer = map.findLayerById('avoid');
        let sub = mapLayer.findSublayerById(layer.id);
        layer.filter = false
        sub.visible = false
      }
      if (layer.category == this.category || layer.category == 'both'){
        //turn on those layers
        let mapLayer = map.findLayerById('avoid');
        let sub = mapLayer.findSublayerById(layer.id);
   
        layer.filter = true
        sub.visible = true
      }
    })
   
    let minimize = this.layers[0].subheaders[1].sublayers
    const f_minimize = minimize.filter((layer, index) => {
    
      if(layer.category !== this.category && layer.category !== 'both'){
        //turn off those layers so they are not visibl ein the map
        let mapLayer = map.findLayerById('minimize');
        let sub = mapLayer.findSublayerById(layer.id);
        layer.filter = false
        sub.visible = false
      }
      if (layer.category == this.category || layer.category == 'both'){
        //turn on those layers
        let mapLayer = map.findLayerById('minimize');
        let sub = mapLayer.findSublayerById(layer.id);
     
        layer.filter = true
        sub.visible = true
      }
    })
    
    let opportunities = this.layers[1].subheaders[0].sublayers
    const f_opportunities = opportunities.filter((layer, index) => {
    
      if(layer.category !== this.category && layer.category !== 'both'){
        //turn off those layers so they are not visibl ein the map
        let mapLayer = ''
        if(this.compare){
          mapLayer = map.findLayerById('swipeLayers')
        }
        else{
          mapLayer = map.findLayerById('opportunities') ;
        }
        let sub = mapLayer.findSublayerById(layer.id);
        layer.filter = false
        sub.visible = false
      }
      if (layer.category == this.category || layer.category == 'both'){
        //turn on those layers
        let mapLayer = ''
        if(this.compare){
          mapLayer = map.findLayerById('swipeLayers')
        }
        else{
          mapLayer = map.findLayerById('opportunities') ;
        }
        let sub = mapLayer.findSublayerById(layer.id);
        layer.filter = true
        if (layer.id !== 0 ){
        sub.visible = true
        }
      }
      
    })
    if (this.compare){
      if (this.category == 'solar'){
        let sub2 = map.findLayerById('brownfields_swipe')
        sub2.visible = true
      }
      if(this.category !==  'solar'){
        let sub2 = map.findLayerById('brownfields_swipe')
        sub2.visible = false
      }
    } 
    if (!this.compare){
      if (this.category == 'solar'){
        let sub2 = map.findLayerById('brownfields_opp')
        sub2.visible = true
      }
      if(this.category !==  'solar'){
        let sub2 = map.findLayerById('brownfields_opp')
        sub2.visible = false
      }
    } 
      
  },
  //hide or show the swipe tool and layers
  hideShowSwipe(){
    this.compare = !this.compare 
    let swipe = document.querySelector("arcgis-swipe");
    let map = document.querySelector("arcgis-map").map;
    let layer = map.findLayerById('opportunities');

    if(this.compare){
      swipe.swipePosition="50"
      swipe.hideDivider = false;
      swipe.hideHandle = false;
      layer.visible = false
      this.layers[1].subheaders[0].id = 'swipeLayers'
      let sub = map.findLayerById('brownfields_swipe')
      sub.visible = true
      let sub2 = map.findLayerById('brownfields_opp')
      sub2.visible = false
    }
    else{
      swipe.swipePosition="100"
      swipe.hideDivider = true;
      swipe.hideHandle = true;
      layer.visible = true;
      this.layers[1].subheaders[0].id = 'opportunities'
      let sub = map.findLayerById('brownfields_opp')
      sub.visible = true
      let sub2 = map.findLayerById('brownfields_swipe')
      sub2.visible = false

    }

  },
  //gets legend img from the service when app starts after map loads
  getLegendData(){
    let url = 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/Site_Renewables_Right/MapServer/legend?f=pjson';
    let _this = this;
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(data) {
      let legendItems = {}
      for(var i=0;i<data.layers.length;i++){
        let id = data.layers[i].layerId 
        let img = data.layers[i].legend[0].imageData
        legendItems[id] = img
       
       }
      _this.legend = legendItems

    })
  },
  //function to create the buffer
  createBuffer(e){

    const polySymbol = {
      type: 'simple-fill', // autocasts as new SimpleFillSymbol()
      color: [255, 255, 255, 0.3],
      outline: {
        color: [0, 0, 0, 0.5],
        width: 2,
      },
    }
    const pointSymbol = {
      type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
      color: [255, 0, 0],
      outline: {
        color: [255, 255, 255],
        width: 1,
      },
      size: 7,
    }
    const point = e.detail.mapPoint
    //saving the last clicked point so that it can be used 
    //again for different buffer areas
    this.currentPoint = e
    let view = document.querySelector("arcgis-map")
    let map = document.querySelector("arcgis-map").map;
    view.goTo(point) 
    view.zoom = 11
    let pointLayer = map.findLayerById('pointLayer') 
    let bufferLayer = map.findLayerById('bufferLayer')  
    if (pointLayer.graphics.length === 0) {
      pointLayer.add(
        new Graphic({
          geometry: point,
          symbol: pointSymbol,
        }),
      )
    } else {
      const graphic = pointLayer.graphics.getItemAt(0)
      graphic.geometry = point
    }

    const buffer = bufferOperator.execute(point, this.bufferSize, { unit: 'meters' })
    if (bufferLayer.graphics.length === 0) {
      bufferLayer.add(
        new Graphic({
          geometry: buffer,
          symbol: polySymbol,
        }),
      )
    } else {
      const graphic = bufferLayer.graphics.getItemAt(0)
      graphic.geometry = buffer
    }
    //clear values from previous buffer
 
    let layerList = [{name: 'Big Game', id: 17, color: '#FED1EF', index: 0, map:'intersectingFeatures'},
      {name: 'Whooping Crane (wind)', id: 20, color: '#FF884D', index: 1, map:'intersectingFeatures'},
      {name: 'Whooping Crane (solar)', id: 21, color: '#FF884D', index: 2, map:'intersectingFeatures'},
      {name: 'Eagles (wind)', id: 22, color: '#AC8B7C', index: 3, map:'intersectingFeatures'},
      {name: 'Prarie Grouse', id: 23, color: '#93AE7F', index: 4, map:'intersectingFeatures'},
      {name: 'Important Bird Areas (wind)', id: 24, color: '#F9BFA3', index: 5, map:'intersectingFeatures'},
      {name: 'Threatened & Endangered Species', id: 26, color: '#D9A2F8', index: 7, map:'intersectingFeatures'},
      {name: 'Intact Habitats', id: 27, color: '#BABABA', index: 8, map:'intersectingFeatures'},
      {name: 'Climate Resilience', id: 28, color: '#80A26F', index: 9,  map:'intersectingFeatures'},
      {name: 'Landscape Connectivity', id: 30, color: '#71a599', index: 2, map:'intersectingFeatures'},
      {name: 'Protected Areas', id: 25, color: '#8895D9', index: 6, map:'intersectingFeatures'},
      {name: 'Mines not in Suitability (solar)', id: 2, color: '#FFFDE7', index: 1, map: 'opportunities'},
      {name: 'Mines in Suitability (solar)', id: 1, color: '#FFFDE7', index: 2, map:'opportunities'},
    ]
    let countLayers = [
      {name: 'Brownfields over 50 acres (solar)', id: 0, color: '#FF884D', index: 0},
      {name: 'Low impact water bodies for floating solar development (solar)', id: 19, color: '#FF884D', index: 3},
    ] 
    this.results = []
    this.oppResults = []
    for (let i=0;i<layerList.length;i++){
      this.reportSummary ={critical: 0, additional: 0, further: 0},
      this.getIntersectionFeatures(buffer, layerList[i])
    }  
    for(let i=0;i<countLayers.length;i++){
      this.getCountFeatures(buffer, countLayers[i])
    }
  },
  //function to clip features and calculate area
  getIntersectionFeatures(buffer, item){
    //first step is to probably query the layer and get geometries
    let map = document.querySelector("arcgis-map").map;
    let layer = map.findLayerById(item.map)

    let sublayer = layer.findSublayerById(item.id)
     const queryGeom = {
      geometry: buffer,
      spatialRelationship: 'intersects',
      returnGeometry: true,
      outFields: ['*'],
      where: item.map == 'intersectingFeatures'? 'gridcode <> 0': '1=1'
    }

    sublayer.queryFeatures(queryGeom).then((results) => {
      let obj = ''
      let bufferArea = areaOperator.execute(buffer,{unit:'square-kilometers'})
      if(results.features.length === 0){
        this.reportSummary.further = this.reportSummary.further + 1
     
        obj = {
          map: item.map,
          layerId: item.id,
          layerName: item.name,
          color: item.color,
          totalArea: 0, 
          numFeatures:0, 
          bufferArea: new Intl.NumberFormat('en-US', { notation: 'compact' }).format(bufferArea),
          percentOfTotal:  0
          }
      }
      else{
      
        this.reportSummary.critical = this.reportSummary.critical + 1
        let geoms = []
        for(let i=0; i<results.features.length; i++){
          geoms.push(results.features[i].geometry)
        }
        const clip = intersectionOperator.executeMany(geoms, buffer)
        let area = 0
        for(let i=0;i<clip.length;i++){
          let fa = areaOperator.execute(clip[i], {unit:'square-kilometers'})
          area = area + fa
        }
        obj = {
          map: item.map,
          layerId: item.id,
          layerName: item.name,
          color: item.color,
          totalArea: new Intl.NumberFormat('en-US', { notation: 'compact' }).format(area), 
          numFeatures: clip.length, 
          bufferArea: new Intl.NumberFormat('en-US', { notation: 'compact' }).format(bufferArea),
          percentOfTotal:  new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(area/bufferArea)
          }

      }
      this.results.push(obj)
    })
  },
  //function to get count of intersecting points
  getCountFeatures(buffer, item){
    let map = document.querySelector("arcgis-map").map;
    let layer = map.findLayerById('opportunities')
   
    let sublayer = layer.findSublayerById(item.id)
     const queryGeom = {
      geometry: buffer,
      spatialRelationship: 'intersects',
      returnGeometry: false,
      outFields: ['*'],

    }
  
    sublayer.queryFeatures(queryGeom).then((results) => {
      let count = results.features.length
      let obj = {
        map: item.map,
        layerId: item.id,
        layerName: item.name,
        count: count
      }
      this.oppResults.push(obj)
      
    })
  }  
}
));
