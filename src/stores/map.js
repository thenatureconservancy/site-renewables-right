import { ref, computed, markRaw } from 'vue';
import { defineStore } from 'pinia';
import Graphic from '@arcgis/core/Graphic.js'
import * as bufferOperator from '@arcgis/core/geometry/operators/bufferOperator.js'
import * as intersectionOperator from "@arcgis/core/geometry/operators/intersectionOperator.js";
import * as areaOperator from "@arcgis/core/geometry/operators/areaOperator.js";
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'

export const useMapStore = defineStore('mapStore', () => ({
  opacity: 70,
  tab: 'layers',
  compare: true, 
  panelState: 'closed',
  activeTool: 'legend',
  activeHelpElement: '',  
  category: 'both',
  legend: '',
  bufferSize: 1,
  currentPoint: '',
  currentMapExtent: '',
  results: {
    highlySensitiveTotalArea: 0,
    highlySensitiveCount: 0,
    moderatelySensitiveTotalArea: 0,
    minesTotalArea: 0,
    waterBodies: 0,
    brownfields: 0,
    bufferArea: 0
  },
   summary: {
    highlySensitiveTotalArea: 0,
    highlySensitiveCount: 0,
    moderatelySensitiveTotalArea: 0,
    minesTotalArea: 0,
    waterBodies: 0,
    brownfields: 0,
    bufferArea: 0,
    highlySensitiveHabitats: [],
    hsExtentCount: 0,
    minesExtentCount: 0,
    msExtentCount: 0,
  },
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
  splash: true,

 
  //layers referenced by component
  layers:  [
    { header: 'Avoid / Minimize Development',
    id: 'avoid',
    subheaders: [
      {title: 'Highly Sensitive', id: 'avoid', visible: true, visibleModel: true, description: 'Avoid developing critical ecological areas', 
        sublayers: [
          { id: 10, elid: 'biggame', filter: true, visible: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Big Game', description: 'short description for Big Game', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '' },
		      { id: 16, elid: 'climateResistance', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Climate Resilience', description: 'short description', longDescription: 'long', totalArea: 0, percentOfTotal: 0, inExtent: '' },
          { id: 8, elid: 'eagles', visible: true, visibleModel: true, opacity: 0.9, category: 'wind', filter: true, title: 'Eagles (wind)', description: 'short description', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '' },
	        { id: 12, elid: 'birdareas', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Important Bird Areas', description: 'short description', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '' },	   
          { id: 15, elid: 'intacthabitats', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Intact Habitats', description: 'short description', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '' },
		      { id: 9, elid: 'grouse', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Prarie Grouse', description: 'short description', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '' },
          { id: 14, elid: 'protectedareas', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Protected Areas', description: 'short description', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '' },
          { id: 3, elid: 'tande',visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Threatened & Endangered Species', description: 'short description', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '' },
          { id: 13, elid: 'wetlandsS',visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'solar', title: 'Wetlands (solar)', description: 'short description', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '' },
          { id: 11, elid: 'wetlandsW', visible: true, filter: true,visibleModel: true, opacity: 0.9, category: 'wind', title: 'Wetlands (wind)', description: 'short description', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: ''  },
          { id: 7, elid: 'woopingCraneS', visible: true, visibleModel: true, opacity: 0.9, category: 'solar', filter: true, title: 'Whooping Crane (solar)', description: 'short description', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '' },
          { id: 6, elid: 'woopingCraneW', visible: true, visibleModel: true, opacity: 0.9, category: 'wind', filter: true,title: 'Whooping Crane (wind)', description: 'short description', longDescription: 'long description',  totalArea: 0, percentOfTotal: 0, inExtent: '' },
        ]
      },
      {title: 'Moderately Sensitive', id: 'minimize', visible: true, visibleModel: true, description: 'Minimize development in vital connectivity corridors', 
        sublayers: [
          {id: 29, elid:'corrd', filter: true, visible: true, visibleModel: true, category: 'both', title: 'Landscape Connectivity', description: 'short description ', longDescription: 'long description', opacity: .7, totalArea: 0, percentOfTotal:0 , inExtent: '' },
        ]
      },
    ],
  },
  {
   header: 'Opportunities for Development',
   subheaders:[
      {title: 'Degraded and Disturbed Lands and Waters', id: 'opportunities', visible: true, description: 'Focus development in areas with lower ecological impact',
        sublayers: [
          { id:0, elid:'brownfields', visible: false, filter: true,visibleModel: true, opacity: 0.9, category: 'solar', title: 'Brownfields over 50 acres (solar)', description: 'short description',longDescription: 'long description', totalArea: 0, percentOfTotal: 0, count: 0, inExtent: '' },
          { id:19, elid: 'fsd', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'solar', title: 'Low impact water bodies for floating solar development (solar)', description: 'short description', longDescription: 'Waterbodies 2.5 acres or greater within 5 kilometers of the transmission lines, that are suitable for development because they are man-made reservoirs with Slightly Below Average to Far Below Average level of biodiversity and/or resilience.', totalArea: 0, percentOfTotal: 0, count:0, inExtent: '' },
         // { id:2, elid: 'minesout', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'solar', title: 'Mines not in Suitability (solar)',description: 'short description', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '' },
          { id:1, elid: 'minesin', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'solar', title: 'Mines in Suitability (solar)', description: 'short description', longDescription: 'long description',totalArea: 0, percentOfTotal: 0, inExtent: '' },
        ]
      },
    ],
  },
  ],
  reportLayers: function(){
    return this.layers.map((layer) => {
      return {
        header: layer.header,
        id: layer.id,
        subheaders: layer.subheaders.map((subheader) => {
          return {
            title: subheader.title,
            id: subheader.id,
            visible: subheader.visible
          }
        })
      }
    })
},
   
 
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
    let map = document.querySelector("arcgis-map").map;
    let mapLayer = map.findLayerById(layer.id);
    console.log(mapLayer)
    let sublayers = layer.sublayers
    console.log(mapLayer)

    for(var i=0;i<sublayers.length;i++){
      let sublayer = mapLayer.findSublayerById(sublayers[i].id);
      if(sublayers[i].elid == 'brownfields'){
          sublayer = map.findLayerById('brownfields')
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
      sub = map.findLayerById('brownfields')
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
        let mapLayer = map.findLayerById('opportunities');
        let sub = mapLayer.findSublayerById(layer.id);
        layer.visible = true
        if (layer.id !== 0 ){
          sub.visible = true
        }
     
      })
    
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
        mapLayer = map.findLayerById('opportunities') ;
        let sub = mapLayer.findSublayerById(layer.id);
        layer.filter = false
        sub.visible = false
      }
      if (layer.category == this.category || layer.category == 'both'){
        //turn on those layers
        let mapLayer = ''
        mapLayer = map.findLayerById('opportunities') ;
        let sub = mapLayer.findSublayerById(layer.id);
        layer.filter = true
        if (layer.id !== 0 ){
          sub.visible = true
        }
      }
      
    })
   
    if (this.category == 'solar'){
      let sub2 = map.findLayerById('brownfields')
      sub2.visible = true
    }
    if(this.category !==  'solar'){
      let sub2 = map.findLayerById('brownfields')
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
   
    let pointLayer = map.findLayerById('pointLayer') 
    let bufferLayer = map.findLayerById('bufferLayer')  
    
    //view.zoom = 11
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

    const buffer = bufferOperator.execute(point, this.bufferSize, { unit: 'miles' })
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
    //view.goTo({target: bufferLayer.graphics.getItemAt(0).geometry, padding: 20})
    let layerList = [{name: 'Big Game', id: 17, color: '#FED1EF', index: 0, map:'intersectingFeatures', pathToLayer:  this.layers[0].subheaders[0].sublayers[0]},
      {name: 'Whooping Crane (wind)', id: 20, color: '#FF884D', index: 1, map:'intersectingFeatures', pathToLayer:  this.layers[0].subheaders[0].sublayers[11]},
      {name: 'Whooping Crane (solar)', id: 21, color: '#FF884D', index: 2, map:'intersectingFeatures', pathToLayer:  this.layers[0].subheaders[0].sublayers[10]},
      {name: 'Eagles (wind)', id: 22, color: '#AC8B7C', index: 3, map:'intersectingFeatures', pathToLayer:  this.layers[0].subheaders[0].sublayers[2]},
      {name: 'Prarie Grouse', id: 23, color: '#93AE7F', index: 4, map:'intersectingFeatures',  pathToLayer:  this.layers[0].subheaders[0].sublayers[5]},
      {name: 'Important Bird Areas', id: 24, color: '#F9BFA3', index: 5, map:'intersectingFeatures', pathToLayer:  this.layers[0].subheaders[0].sublayers[3]},
      {name: 'Threatened & Endangered Species', id: 26, color: '#D9A2F8', index: 7, map:'intersectingFeatures',  pathToLayer:  this.layers[0].subheaders[0].sublayers[7]},
      {name: 'Intact Habitats', id: 27, color: '#BABABA', index: 8, map:'intersectingFeatures',  pathToLayer:  this.layers[0].subheaders[0].sublayers[4]},
      {name: 'Climate Resilience', id: 28, color: '#80A26F', index: 9,  map:'intersectingFeatures', pathToLayer:  this.layers[0].subheaders[0].sublayers[1]},
      {name: 'Landscape Connectivity', id: 30, color: '#71a599', index: 2, map:'intersectingFeatures',  pathToLayer:  this.layers[0].subheaders[1].sublayers[0]},
      {name: 'Protected Areas', id: 25, color: '#8895D9', index: 6, map:'intersectingFeatures',  pathToLayer:  this.layers[0].subheaders[0].sublayers[6]},
      //{name: 'Mines not in Suitability (solar)', id: 2, color: '#FFFDE7', index: 1, map: 'opportunities',  pathToLayer:  this.layers[1].subheaders[0].sublayers[2]},
      {name: 'Mines in Suitability (solar)', id: 1, color: '#FFFDE7', index: 2, map:'opportunities',  pathToLayer:  this.layers[1].subheaders[0].sublayers[2]},
    ]
    let countLayers = [
      {name: 'Brownfields over 50 acres (solar)', id: 0, color: '#FF884D', index: 0, map: 'opportunities', pathToLayer:  this.layers[1].subheaders[0].sublayers[0]},
      {name: 'Low impact water bodies for floating solar development (solar)', id: 19, color: '#FF884D', index: 2, pathToLayer:  this.layers[1].subheaders[0].sublayers[1], },
    ] 
    this.results = []
    this.oppResults = []
      //clear all previous results
    this.layers[0].subheaders[0].sublayers.forEach((layer)=>{
      layer.totalArea = 0
      layer.percentOfTotal = 0
    })
    this.layers[0].subheaders[1].sublayers.forEach((layer)=>{ 
      layer.totalArea = 0
      layer.percentOfTotal = 0
    })
    this.layers[1].subheaders[0].sublayers.forEach((layer)=>{
      layer.totalArea = 0
      layer.percentOfTotal = 0
    })
    this.summary= {
        highlySensitiveTotalArea: 0,
        highlySensitiveCount: 0,
        moderatelySensitiveTotalArea: 0,
        minesTotalArea: 0,
        waterBodies: 0,
        brownfields: 0,
        bufferArea: 0,
        highlySensitiveHabitats: [],
        hsExtentCount: 0,
        msExtentCount: 0,
        minesExtentCount: 0,
    }      
    for (let i=0;i<layerList.length;i++){
      this.getIntersectionFeatures(buffer, layerList[i])
      this.getIntersectionExtent(layerList[i])
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
      //let obj = ''
      let bufferArea = areaOperator.execute(buffer,{unit:'square-miles'})
     
      if(results.features.length === 0){
       //TODO handle if no results come back must zero out old results
       /* this.summary= {
          highlySensitiveTotalArea: 0,
          highlySensitiveCount: 0,
          moderatelySensitiveTotalArea: 0,
          minesTotalArea: 0,
          waterBodies: 0,
          brownfields: 0,
          bufferArea: 0,
          highlySensitiveHabitats: []
        }*/
      
      }
      else{
        let geoms = []
        for(let i=0; i<results.features.length; i++){
          geoms.push(results.features[i].geometry)
        }
        const clip = intersectionOperator.executeMany(geoms, buffer)
        let area = 0
        for(let i=0;i<clip.length;i++){
          let fa = areaOperator.execute(clip[i], {unit:'square-miles'})
          area = area + fa
        }
    
        item.pathToLayer.totalArea= new Intl.NumberFormat('en-US', { notation: 'compact' }).format(area),
        item.pathToLayer.percentOfTotal = area/bufferArea 
      
    //new Intl.NumberFormat('en-US', { notation: 'compact' }).format(bufferArea)
    console.log(this.summary.highlySensitiveTotalArea)
    //console.log(this.results.value.highlySensitiveTotalArea)
    this.summary.bufferArea =bufferArea
    if (item.id !== 1 && item.id !== 2 && item.id !== 30){ 
      this.summary.highlySensitiveTotalArea = this.summary.highlySensitiveTotalArea + area
      this.summary.highlySensitiveCount = this.summary.highlySensitiveCount + 1
      this.summary.highlySensitiveHabitats.push({name: item.name, area: area, percentOfTotal: (area/bufferArea)  })
    }
    this.summary.highlySensitiveHabitats.sort((a, b) => b.percentOfTotal - a.percentOfTotal); 
    if (item.id == 30){     
    this.summary.moderatelySensitiveTotalArea= this.summary.moderatelySensitiveTotalArea + area
    }
    if (item.id == 1 || item.id == 2){
      this.summary.minesTotalArea = this.summary.minesTotalArea + area
    }
    }
   
     })
  },
  //function to get count of intersecting points
  getCountFeatures(buffer, item){ 
    console.log(item)
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
      console.log(results)
     /* let obj = {
        map: item.map,
        layerId: item.id,
        layerName: item.name,
        count: count
      }*/
        if(count > 0){
          item.pathToLayer.inExtent = true
       }else{
          item.pathToLayer.inExtent = false
       }
     
      if (item.id == 0){
        this.summary.brownfields = count
        item.pathToLayer.count = count
      }
      if (item.id == 19){
        this.summary.waterBodies = count
        item.pathToLayer.count = count
      }
      
    })
  },
    //function to clip features and calculate area
  getIntersectionExtent(item){
    //first step is to probably query the layer and get geometries
    let map = document.querySelector("arcgis-map").map;
    let layer = map.findLayerById(item.map)
   
    console.log(item.name)
    let sublayer = layer.findSublayerById(item.id)
     const queryGeom = {
      geometry: this.currentMapExtent,
      spatialRelationship: 'intersects',
      returnGeometry: false,
      outFields: [],
      where: item.map == 'intersectingFeatures'? 'gridcode <> 0': '1=1'
    }

    sublayer.queryFeatures(queryGeom).then((results) => {
     if(results.features.length > 0){  
       console.log(item.name)  
        item.pathToLayer.inExtent = true 
        console.log(item.pathToLayer.inExtent)
        if (item.id !== 1 && item.id !== 2 && item.id !== 30){ 
          this.summary.hsExtentCount = this.summary.hsExtentCount + 1
        }
        else if (item.id == 30){     
          this.summary.msExtentCount = this.summary.msExtentCount + 1
        }
        else if (item.id == 1 || item.id == 2){
          this.summary.minesExtentCount = this.summary.minesExtentCount + 1
        }
        else{
          console.log('no match')
        }
      }
      else{
         item.pathToLayer.inExtent = false 
      }
    })
   
    
  },
  changeOpacity(){
  let map = document.querySelector("arcgis-map").map;
  let avoid = map.findLayerById('avoid');
  let minimize = map.findLayerById('minimize');
  let opportunities = map.findLayerById('opportunities');
  //let layersList = [avoid, minimize, opportunities]
  avoid.opacity = this.opacity / 100;
  minimize.opacity = this.opacity / 100;  
  opportunities.opacity = this.opacity / 100;
  }

}
));
