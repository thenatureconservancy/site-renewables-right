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
 
  splash: true,

  layers: [
  {header: 'Conservation Lands' , id: 'avoid', expanded: true,
   subheaders: [
    {title: 'Highly Sensitive', id: 'high', visible: true, visibleModel: true, 
    sublayers: [
    {index: 0, mapIndex: 11, elid: 'wetlands', filter: true, visible: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Flood Plains and Wetlands', description: 'short description', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '', legendImg: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAQElEQVQ4jWNhoDJgoZmBM459/0+JQRlWnIwoBlILsIwaSDFgodwIVDBqIOWAhQpmoIBRAykH8DCElWdUM5BaAADq8gT9+4JlcgAAAABJRU5ErkJggg=="},
    {index: 1, mapIndex: 10, elid: 'qualitywater', filter: true, visible: true, visibleModel: true, opacity: 0.9, category: 'floating', title: 'High Quality Watersheds', description: 'short description', longDescription: 'This layer represents highly resilient and biodiverse watershed areas, containing lakes and ponds, from TNC’s Freshwater Resilience and Resilient and Connected Network (RCN) analyses (<a href="https://crcs.tnc.org/pages/frcn" target="_blank">Anderson et al. 2024</a>). This area covers 20.6% of the conterminous United States.', totalArea: 0, percentOfTotal: 0, inExtent: '', legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAA0SURBVDhPYxj0gBFKM2Ruf/IfyiQLTPeUAZvFBOZREYwaSDkYNZByMGog5WDwGzjYAQMDAMr8BCCfppMvAAAAAElFTkSuQmCC'},
    {index: 2, mapIndex: 9, elid: 'protected', filter: true, visible: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Protected Areas', description: 'short description for protected', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '', legendImg: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAQElEQVQ4jWNhoDJgoZmBvVNv/6fEoOJsVUYUA6kFWEYNpBiwUG4EKhg1kHLAQgUzUMCogZQDeBjCyjOqGUgtAAAJMAVV3tayLwAAAABJRU5ErkJggg=="},
    {index: 3, mapIndex: 8, elid: 'resilient', filter: true, visible: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Resilient and Connected Network', description: 'short description', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '', legendImg: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAQElEQVQ4jWNhoDJgoZmBzx9l/KfEIEm5GYwoBlILsIwaSDFgodwIVDBqIOWAhQpmoIBRAykH8DCElWdUM5BaAAD2dAUhr2Ob1QAAAABJRU5ErkJggg=="},
    {index: 4, mapIndex: 7, elid: 'prairie', filter: true, visible: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Prairie Grouse', description: 'short description', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '', legendImg: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAQElEQVQ4jWNhoDJgoZmBHUsL/1NiUEV0PyOKgdQCLKMGUgxYKDcCFYwaSDlgoYIZKGDUQMoBPAxh5RnVDKQWAAApcwW0EGndgwAAAABJRU5ErkJggg=="},
    {index: 5, mapIndex: 6, elid: 'whoopwind', filter: true, visible: true, visibleModel: true, opacity: 0.9, category: 'wind', title: 'Whooping Crane (wind)', description: 'short description', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '', legendImg: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAQElEQVQ4jWNhoDJgoZmB/6st/1NiEGPrcUYUA6kFWEYNpBiwUG4EKhg1kHLAQgUzUMCogZQDeBjCyjOqGUgtAAAhjAWff1Dw7QAAAABJRU5ErkJggg=="},
    {index: 6, mapIndex: 5, elid: 'whoopsolar', filter: true, visible: true, visibleModel: true, opacity: 0.9, category: 'solar', title: 'Whooping Crane (solar)', description: 'short description', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '', legendImg: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAQElEQVQ4jWNhoDJgoZmB/6st/1NiEGPrcUYUA6kFWEYNpBiwUG4EKhg1kHLAQgUzUMCogZQDeBjCyjOqGUgtAAAhjAWff1Dw7QAAAABJRU5ErkJggg=="},
    ]
    },
    {title: 'Moderate', id: 'moderate', visible: true, visibleModel: true, 
      sublayers:  [
      {index: 0, elid: 'landscape', filter: true, visible: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Landscape Connectivity', description: 'short description', longDescription: 'long description', totalArea: 0, percentOfTotal: 0, inExtent: '', legendImg: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAQElEQVQ4jWNhoDJgoZmBE25M+0+JQQUaWYwoBlILsIwaSDFgodwIVDBqIOWAhQpmoIBRAykH8DCElWdUM5BaAAAIkAVU/br7OgAAAABJRU5ErkJggg=="},
    ]
    },
    {title: 'Degraded and Disturbed Lands', id: 'degraded', visible: true, visibleModel: true, 
      sublayers: [
        {index: 0, elid: 'abandonedmines', filter: true, visible: true, visibleModel: true, 
          opacity: 0.9, category: 'both', title: 'Abandoned Mine Lands', description: 'short description',
           longDescription: 'This layer identifies sites that operated as mines between 1886-2006. These sites may present an opportunity for renewable energy development after further site assessment and feasibility analysis. The mine lands layer uses the best available nationwide data on mines ( <a href="https://mrdata.usgs.gov/usmin/" target="_blank">USGS geospatial database</a>) but the data are incomplete for the western United States. Mines included in the dataset include pits, mines, and quarries.', totalArea: 0, percentOfTotal: 0, inExtent: '', legendImg: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAFESURBVDhP5ZI9S8NQFIbffmCrBCSNiIuli4E4iUMIOEgSnP0D+WP9F9kcs0lTsuqsGSSDkCWgqdaP93KLaXobFDsIPsu999zLw7nnnNb7J9ggbblujH8obGwKr5IkQZqmKMsShmHAsiwMh0P5YpW1wizLEIYh8jyXkS8cx4HruvK0jFLI0Hg8FrL9ziGOuqfot3aQze9x83It3vi+D9u2xb6Ksob85kJ20Q8w6h7joDPCydY5znqX4k0cx2KtoxSyZoSZ1aF8t72HoihkZBmlkA0g/KaKXmtb7lZRCtlNwprVKfGEx/mDPK2iFHI0CBtw93or9oSy+PkKb5jDNE0ZXWbt2ERRhMlkIvasGb/JzCjTNA1BEEDXdXFfpXGwp9Op6Ga1AczM8zyljDQKF3DIZ7MZBoOByK6Jbwl/grIpv+GvC4EP052FsE/F/fEAAAAASUVORK5CYII="},
        {index: 1, elid: 'brownfields', filter: true, visible: true, visibleModel: true, opacity: 0.9,
           category: 'solar', title: 'Brownfields over 10 acres ', description: 'short description',
            longDescription: 'This layer depicts sites (over 10 acres) which are identified as Brownfields by the US Environmental Protection Agency (EPA), defined as abandoned, underused, or idled commercial or industrial properties whose redevelopment or expansion may be complicated by the presence or potential presence of a hazardous pollutant. These sites may present an opportunity for renewable energy development after further site assessment and feasibility analysis. This data layer is a selection of the EPA’s RE-Powering America’s Land Initiative data. ', totalArea: 0, percentOfTotal: 0, inExtent: '', legendImg: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAFASURBVDhP5ZO9SsNQGIZfNbWCuNVFIuZnEXSIi0M2Bzch5hrc7W5uIrcQSL0D76AOQoaAo4MEMlR0qjQQrGje4wmScNoiduuzJPly8vCd7z1Z+6rAElmX16WxgsKFoeR5jiRJUBQFDMOA67ryjZq5wjAMEcexuNc6XUw/SpimhSC4geM4ot5mprCWWacX2Dt0saF18f6a4Tm5Qzke4XYwgK7rcvUvyhlym7Vs//hMyMjO7gGOzq+qrzYRRZGotVEKOTPCztpQ3jMdDIf3stJEKWQAnFndWRttaxuTYiKfmiiFTJMBcGYqxi8ZbNuWT02UQh4NwzBFAJ/TUlZ/GD094C17xKXnyUqTmSmnaYrrfr9a0UHPOhHbZGeU+b5fHZ1Armwy9xwybabJADgzbpOdeTO6Iwv/lL+inOF/WDkh8A3IyX8fH/JMOAAAAABJRU5ErkJggg=="},
      ]   
    },
  ]},
  {header: 'Agricultural Lands' , id: 'agriculture', expanded: false, 
   subheaders: [
    {title: ' Agricultural Lands - solar only', id: 'ag', visible: false, visibleModel: false, 
      sublayers: [
        {index: 0, elid: 'highestag', serviceId: 'rasters',  filter: true, visible: false, visibleModel: false,
       opacity: 0.9, category: 'solar', title: 'Highest Quality Farmland', description: 'short description',
        longDescription: 'The American Farmland Trust recommends these areas not be converted to non-agrivoltaic solar development, particularly large-scale solar. This layer identifies the top half of farm and ranchland in each state – that is, the lands with PVR (productivity, versatility, and resiliency) values above each states’ median. PVR data are based on soil productivity and capacity, land cover and use, crop type, and length of the growing season (<a href="https://farmlandinfo.org/publications/farms-under-threat-the-state-of-the-states/" target="_blank"> Farms Under Threat 2020</a>).',
        totalArea: 0, percentOfTotal: 0, inExtent: '',
        legendImg: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAQElEQVQ4jWNhoDJgoZmBLp0F/ykxaE/5BEYUA6kFWEYNpBiwUG4EKhg1kHLAQgUzUMCogZQDeBjCyjOqGUgtAABLDgYV9UASiQAAAABJRU5ErkJggg=="
      },
 	  {index: 1, elid: 'abandonedag', serviceId: 'rasters',  filter: true, visible: false, visibleModel: false, opacity: 0.9, category: 'solar', title: 'Abandoned Cropland', description: 'short description', 
      longDescription: 'This layer identifies croplands that were abandoned between 1986-2018 (<a href="https://iopscience.iop.org/article/10.1088/1748-9326/ad2d12" target="_blank"> Xie et al. 2024</a>). These areas are likely marginal for food production and therefore could be a suitable location for large-scale solar development, according to the American Farmland Trust. However, 20% of this area was enrolled in the Conservation Reserve Program as of 2020, and may be ecologically sensitive or susceptible to erosion, either of which may make these lands unsuitable for large-scale solar developments.',
      totalArea: 0, percentOfTotal: 0, inExtent: '', legendImg:  "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAQElEQVQ4jWNhoDJgoZmBT6bU/KfEIJmcFkYUA6kFWEYNpBiwUG4EKhg1kHLAQgUzUMCogZQDeBjCyjOqGUgtAAALkgVen6ZPhAAAAABJRU5ErkJggg=="},
	  ]
  },
]},
  {header: 'Community Lands' , id: 'community', expanded: false, 
   subheaders: [
    {title: 'Community', id: 'comm', visible: true, visibleModel: true, 
      sublayers: [
	   ]
  },
  ]}
  ],

  
  //map loads sublayers in reverse order from the list in the ui which causes confusion about 
  //which layer is on top.  This function reverses the order
  //and is used by the MapImageLayer to define sublayers.  
  consLayersReverse(){
    let newList = this.layers[0].subheaders[0].sublayers
    let reversed = newList.slice().reverse();
    return reversed
  }, 
  //reversed layers for opportunities
  agLayersReverse(){

    let newList = this.layers[1].subheaders[0].sublayers
    let reversed = newList.slice().reverse();
   
    return reversed
  },
  //this function updates the layer order in the map when the user drags to reorder layers
  //on the UI
  updateLayerOrder(layer){
    let map = document.querySelector("arcgis-map").map;
    //update index in layers list
    layer.sublayers.forEach((sublayer,index) => { 
      //get dif
      
      let dif = sublayer.index - index
     
      //update new index
      sublayer.index = index
      let currMapIndex = sublayer.mapIndex
      let newMapIndex = ''
      if (dif > 0 ){
        newMapIndex = currMapIndex + dif
      }
      if (dif > 0 ){
        newMapIndex = currMapIndex - dif
      }
      
      sublayer.mapIndex = newMapIndex
     // console.log('currMapIndex:' + currMapIndex)
     // console.log('newMapIndex:' + newMapIndex)
     let mapLayer = map.findLayerById(sublayer.elid);
     map.reorder(mapLayer,newMapIndex);
    
     // 

    })
      let resetlayers = ['highestag','abandonedag','brownfields','abandonedmines','landscape']
      resetlayers.forEach((layer, index) => {
        let mapLayer = map.findLayerById(layer);
        map.reorder(mapLayer,index);
      })
   
  },
  setGroupVisibility(group){
    let map = document.querySelector("arcgis-map").map;
    group.subheaders.forEach(subheader => {
      let visible = !group.expanded
      subheader.visible = visible
      console.log(subheader.sublayers)
      subheader.sublayers.forEach(layer => {
        let sublayer = map.findLayerById(layer.elid);
        sublayer.visible = visible
        layer.visibleModel = visible
      })
    })
  },
  //sets overall group layer visibility
  setLayerVisibility(layer) {
    let map = document.querySelector("arcgis-map").map;
    let sublayers = layer.sublayers
    for(var i=0;i<sublayers.length;i++){
      let sublayer = map.findLayerById(sublayers[i].elid);
      sublayer.visible = layer.visible
      sublayers[i].visibleModel = layer.visible
    }
  },
  //sets individual layer visibility
  setSublayerVisibility(elid, checked) {
    let map = document.querySelector("arcgis-map").map;
    let layer = map.findLayerById(elid);
    console.log(layer)
    layer.visible = checked
  },
 
  filterLayers(cat){
    this.category = cat
    let map = document.querySelector("arcgis-map").map;
    if(this.category == 'both'){
        this.layers.forEach(layer => {
        layer.subheaders.forEach(subheader => {
        subheader.sublayers.forEach(layer => {
          layer.filter = true
        })
      })
    })
   }
   else{
    this.layers.forEach(layer => {
      layer.subheaders.forEach(subheader => {
        subheader.sublayers.forEach(layer => {
        
          if(layer.category !== this.category && layer.category !== 'both'){
            //turn off those layers so they are not visibl ein the map
            let mapLayer = map.findLayerById(layer.elid);
            layer.filter = false
            mapLayer.visible = false
          }
          if (layer.category == this.category || layer.category == 'both'){
            //turn on those layers
            let mapLayer = map.findLayerById(layer.elid);
            layer.filter = true
            if(layer.visibleModel){mapLayer.visible = true}
          }
        })
      });
    });
  }
  
/*
    const h = highly.filter((layer, index) => {
      if(layer.category !== this.category && layer.category !== 'both'){
        //turn off those layers so they are not visibl ein the map
        let mapLayer = map.findLayerById(layer.elid);
        layer.filter = false
        mapLayer.visible = false
      }
      if (layer.category == this.category || layer.category == 'both'){
        //turn on those layers
        let mapLayer = map.findLayerById(layer.elid);
        layer.filter = true
        mapLayer.visible = true
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
    }*/
    
      
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

    /* not being used? 
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
  },*/
   /* not in use currently?
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
  
  },*/ 

}
));
