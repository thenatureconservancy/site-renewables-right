import { ref, computed, markRaw } from 'vue';
import { defineStore } from 'pinia';
import Graphic from '@arcgis/core/Graphic.js'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import * as bufferOperator from '@arcgis/core/geometry/operators/bufferOperator.js'
import * as intersectionOperator from "@arcgis/core/geometry/operators/intersectionOperator.js";
import * as areaOperator from "@arcgis/core/geometry/operators/areaOperator.js";
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import MosaicRule from '@arcgis/core/layers/support/MosaicRule.js';
import ImageHistogramParameters from '@arcgis/core/rest/support/ImageHistogramParameters.js';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer'

import Query from "@arcgis/core/rest/support/Query";
import * as query from "@arcgis/core/rest/query";

export const useMapStore = defineStore('mapStore', () => ({
  opacity: 90,
  showOpacity: false,
  showDemo: false,
  tab: 'layers',
  reportTab: 'conservation',
  showReportDetails: true,
  reportLayerFilter: 'buffer',
  compare: true, 
  panelState: 'closed',
  activeTool: 'legend',
  activeHelpElement: '',  
  category: 'solar',
  communitySelection: 'Climate Disadvantaged',
  legend: '',
  bufferSize: 1,
  currentPoint: '',
  currentMapExtent: '',
  checkboxHideSplash: false,
  results: {
    highlySensitiveTotalArea: 0,
    highlySensitiveCount: 0,
    moderatelySensitiveTotalArea: 0,
    mines: 0,
    minesTotalArea: 0,
    waterBodies: 0,
    brownfields: 0,
    bufferArea: 0
  },
  summary: {
    highlySensitiveTotalArea: 0,
    highlySensitiveCount: 0,
    moderatelySensitiveTotalArea: 0,
    mines: 0,
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
  {header: 'Conservation Values' , id: 'avoid', expanded: false,
   subheaders: [
    {title: 'Highly Sensitive', id: 'high', visible: true, visibleModel: true, expanded: false,
      sublayers:  [
         {
        index: 10,
        mapIndex: 25,
        elid: 'bats',
        filter: true,
        visible: false,
        visibleModel: false,
        opacity: 0.9,
        category: 'solar',
        title: 'Bats',
        inBuffer: false,
        inExtent: false,
        description: 'short description',
        longDescription: "",
        totalArea: 0,
        percentOfTotal: 0,
        legendImg: '',
        pngLegend: '\\bat.png',
        pngWidth: '220'

      },
      {
        index: 0,
        mapIndex: 10,
        elid: 'bigGameSolar',
        filter: true,
        visible: false,
        visibleModel: false,
        opacity: 0.9,
        category: 'solar',
        title: 'Big Game',
        inBuffer: false,
        inExtent: false,
        description: 'short description',
        longDescription: "Energy development may alter the movement of big game animals and increase rates of mortality, particularly along migration routes and in winter ranges. This layer includes migration areas for elk, mule deer, and pronghorn antelope across the Western United States, including annual ranges, corridors, stopovers, and winter ranges <a href='https://westernmigrations.net/' target='_blank'>(US Geological Survey Western Migrations)</a>, supplemented with state-specific data from North Dakota, Montana, and New Mexico state wildlife agency data.",
        totalArea: 0,
        percentOfTotal: 0,
        legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGP8d+YdAymAiSTVoxpGNQwpDQCCqALYvqtRVwAAAABJRU5ErkJggg==' // #feccee
      },
      {
        index: 2,
        mapIndex: 19,
        elid: 'floodPlainsWetlands',
        filter: true,
        visible: false,
        visibleModel: false,
        opacity: 0.9,
        category: 'both',
        title: 'Floodplains, Wetlands, and Groundwater-fed Ecosystems',
        inBuffer: false,
        inExtent: false,
        description: 'short description',
        longDescription: 'Renewable energy development near wetland complexes and riparian corridors may cause adverse impacts to wildlife and fragile wetland ecosystems. This layer identifies floodplains, rivers, open water, and wetlands (Fathom-US 1-in-20 year fluvial and 1-in-20-year pluvial flood model tiles; <a href="https://www.fws.gov/program/national-wetlands-inventory" target="_blank"> US Fish & Wildlife Service National Wetlands Inventory </a>). Groundwater-dependent ecosystem data in Nevada and Arizona and vernal pools in California were also included.',
        totalArea: 0,
        percentOfTotal: 0,
        legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGOcdvwPAymAiSTVoxpGNQwpDQBf8QJ5pQeyKAAAAABJRU5ErkJggg==' // #96c7fc
      },
      {
        index: 3,
        mapIndex: 15,
        elid: 'prairieGrouse',
        filter: true,
        visible: false,
        visibleModel: false,
        opacity: 0.9,
        category: 'both',
        title: 'Prairie Grouse',
        inBuffer: false,
        inExtent: false,
        description: 'short description',
        longDescription: 'Grouse species in the central U.S. have experienced substantial population declines since the early 20th century and may be further threatened by improperly sited energy development. To prevent grouse displacement, we mapped important habitat for the following species: Attwater’s prairie-chicken (Tympanuchus cupido attwateri), Columbian sharp-tailed grouse (T. phasianellus columbianus), greater prairie-chicken (T. cupido), greater sage-grouse (Centrocercus urophasianus), Gunnison sage-grouse (C. minimus), lesser prairie-chicken (T. pallidicinctus), and plains sharp-tailed grouse (T. phasianellus jamesi).',
        totalArea: 0,
        percentOfTotal: 0,
        legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGNsbyxgIAUwkaR6VMOohiGlAQCw8wGYzMRkMAAAAABJRU5ErkJggg==' // #878170
      },
      {
        index: 4,
        mapIndex: 6,
        elid: 'protectedAreas',
        filter: true,
        visible: false,
        visibleModel: false,
        opacity: 0.9,
        category: 'both',
        title: 'Protected Areas',
        inBuffer: false,
        inExtent: false,
        description: 'short description',
        longDescription: "This layer presents the <a href='https://www.usgs.gov/programs/gap-analysis-project/science/pad-us-data-overview?qt-science_center_objects=0#qt-science_center_objects' target='_blank'>US Geological Survey’s Protected Areas database</a>, a national inventory of U.S. terrestrial protected areas that are dedicated to the preservation of biological diversity and other natural, recreation and cultural uses, managed for these purposes through legal or other effective means. It includes all Federal and most State and local lands. We also included the <a href='https://www.conservationeasement.us/' target='_blank'>National Conservation Easement Database</a> for additional areas protected by agencies, land trusts (including TNC preserves), and other organizations, and additional state-specific data as appropriate.  ",
        totalArea: 0,
        percentOfTotal: 0,
        legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGPsmHyHgRTARJLqUQ2jGoaUBgA0mAIXWenGNAAAAABJRU5ErkJggg==' // #c8c8c8
      },
      {
        index: 5,
        mapIndex: 4,
        elid: 'resilientConnected',
        filter: true,
        visible: false,
        visibleModel: false,
        opacity: 0.9,
        category: 'both',
        title: 'Resilient and Connected Network',
        inBuffer: false,
        inExtent: false,
        description: 'short description',
        longDescription: 'Over the next century, climate change is expected to drive shifts in species ranges and increase stressors to natural ecosystems. To identify areas important to sustaining species and natural communities in a changing climate, we mapped the Resilient and Connected Network, including all areas with resilience and concentrated or diffuse flow, with or without recognized biodiversity. These sites include representative geophysical environments and microclimates with relatively low levels of human modification, which comprise a network of lands most likely to retain biodiversity and ecosystem function in altered climate conditions (<a href="https://www.pnas.org/doi/10.1073/pnas.2204434119" target="_blank">Anderson et al. 2023</a>).',
        totalArea: 0,
        percentOfTotal: 0,
        legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGNsWJjPQApgIkn1qIZRDUNKAwD6PQGwgiIB7gAAAABJRU5ErkJggg==' // #80a16f
      },
      {
        index: 6,
        mapIndex: 18,
        elid: 'threatenedEndangeredSpecies',
        filter: true,
        visible: false,
        visibleModel: false,
        opacity: 0.9,
        category: 'both',
        title: 'Threatened and Endangered Species',
        inBuffer: false,
        inExtent: false,
        description: 'short description',
        longDescription: "Energy and infrastructure development are among the most significant threats to imperiled species in the U.S. We identified federally listed threatened and endangered species that are at-risk from renewable energy development due to their habitat and life history requirements (e.g., gopher and desert tortoise, golden-cheeked warbler, Preble's jumping mouse; full species list available in methods paper.), and then mapped locations of current/recent distributions, modeled priority habitats, and occurrence records. We also included <a href=\"https://ecos.fws.gov/ecp/report/critical-habitat\" target=\"_blank\">critical habitat</a> delineated by the U.S. Fish and Wildlife Service.",
        totalArea: 0,
        percentOfTotal: 0,
        legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGO8POM3AymAiSTVoxpGNQwpDQCH5QKGbbyb2QAAAABJRU5ErkJggg==' // #d398fb
      },
      {
        index: 7,
        mapIndex: 20,
        elid: 'whoopingCraneSolar',
        filter: true,
        visible: false,
        visibleModel: false,
        opacity: 0.9,
        category: 'solar',
        title: 'Whooping Crane',
        inBuffer: false,
        inExtent: false,
        description: 'short description',
        longDescription: 'The federally endangered whooping crane (Grus americana), which has a current population of approximately 500 individuals, depends on wetlands in the central Great Plains during migration. Whooping cranes exhibit aversion to wind turbines and may be displaced from suitable habitats near wind and solar energy infrastructure. In addition, whooping cranes may be at risk of turbine collisions in low light conditions when ascending or descending from high altitude migration flights, or when travelling between roost and foraging areas. To address these concerns, we delineated areas within 400 meters and 5 km of whooping crane critical habitats and stopover sites to be avoided by solar and wind development, respectively. ',
        totalArea: 0,
        percentOfTotal: 0,
        legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGP8X23JQApgIkn1qIZRDUNKAwBl6wHTpybEsgAAAABJRU5ErkJggg==' // #ff7b39
      },
      {
        index: 8,
        mapIndex: 21,
        elid: 'whoopingCraneWind',
        filter: true,
        visible: false,
        visibleModel: false,
        opacity: 0.9,
        category: 'wind',
        title: 'Whooping Crane',
        inBuffer: false,
        inExtent: false,
        description: 'short description',
        longDescription: 'The federally endangered whooping crane (Grus americana), which has a current population of approximately 500 individuals, depends on wetlands in the central Great Plains during migration. Whooping cranes exhibit aversion to wind turbines and may be displaced from suitable habitats near wind and solar energy infrastructure. In addition, whooping cranes may be at risk of turbine collisions in low light conditions when ascending or descending from high altitude migration flights, or when travelling between roost and foraging areas. To address these concerns, we delineated areas within 400 meters and 5 km of whooping crane critical habitats and stopover sites to be avoided by solar and wind development, respectively.  ',
        totalArea: 0,
        percentOfTotal: 0,
        legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGP8X23JQApgIkn1qIZRDUNKAwBl6wHTpybEsgAAAABJRU5ErkJggg==' // #ff7b39
      },
      {index: 9, mapIndex: 10, elid: 'qualitywater', filter: true, visible: false, visibleModel: false, opacity: 0.9, category: 'floating', title: 'High Quality Watersheds', inBuffer: false, inExtent: false, description: 'short description', longDescription: 'This layer represents highly resilient and biodiverse watershed areas, containing lakes and ponds, from TNC’s Freshwater Resilience and Resilient and Connected Network (RCN) analyses (<a href="https://crcs.tnc.org/pages/frcn" target="_blank">Anderson et al. 2024</a>). This area covers 20.6% of the conterminous United States.', totalArea: 0, percentOfTotal: 0, inExtent: '', legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAA0SURBVDhPYxj0gBFKM2Ruf/IfyiQLTPeUAZvFBOZREYwaSDkYNZByMGog5WDwGzjYAQMDAMr8BCCfppMvAAAAAElFTkSuQmCC'},
      
    ]
    },
    {title: 'Moderately Sensitive', id: 'moderate', visible: true, visibleModel: true, expanded: false,
      sublayers:  [
          {
        index: 1,
        mapIndex: 11,
        elid: 'birdsWind',
        filter: true,
        visible: false,
        visibleModel: false,
        opacity: 0.9,
        category: 'wind',
        title: 'Birds at Risk from Wind',
        inBuffer: false,
        inExtent: false,
        description: 'short description',
        longDescription: 'Raptors, waterbirds, and other large species may be injured or killed by collisions with wind turbines, and rates of mortality at commercial wind facilities may be underestimated due to lack of rigorous monitoring and reporting. We include golden eagle nest data, ferruginous hawk presence, and prairie dog complexes to account for raptors. To represent waterbirds, we include playas, prairie potholes, and other wetlands important to birds <a href="https://whsrn.org/whsrn-sites/map-of-sites/" target="_blank">(Western Hemisphere Shorebird Reserve Network sites, Global Important Bird Areas, Ramsar Convention Wetlands).</a>',
        totalArea: 0,
        percentOfTotal: 0,
        legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGNcWJ/LQApgIkn1qIZRDUNKAwDxNgGtEzR2JAAAAABJRU5ErkJggg==' // #a17f6d
      },
      
      {index: 10, elid: 'landscape', filter: true, visible: false, 
        visibleModel: false, opacity: 0.9, category: 'both', 
        title: 'Connectivity',
          inBuffer: false, inExtent: false,description: 'short description',
           longDescription: 'Wildlife movement is critical for animals to escape development and move to more optimal habitat in the face of a shifting climate. This layer identifies wildlife corridors that were modeled between “large protected areas” in the U.S. (<a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0154223" target="_blank"> Belote et al. 2016</a>, highest 40% of modeled values). In addition, we included state-specific corridor data in Arizona, California, and Florida.', totalArea: 0, percentOfTotal: 0, inExtent: '', legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGO8/eIYAymAiSTVoxpGNQwpDQDzDAKp3ffyNAAAAABJRU5ErkJggg==' },
      
           {
        index: 12,
        mapIndex: 24,
        elid: 'landscapeIntactness',
        filter: true,
        visible: false,
        visibleModel: false,
        opacity: 0.9,
        category: 'both',
        title: 'Landscape Intactness',
        inBuffer: false,
        inExtent: false,
        description: 'short description',
        longDescription: 'Remaining intact landscapes provide the basis for long-term viability of many species of conservation concern. To delineate discrete patches of relatively undisturbed natural landcover for renewable energy avoidance, we used a human modification model (<a href="https://www.nature.com/articles/s41597-025-04892-2" target="_blank">Theobald 2022</a> data using a 1 km radius moving window and selected areas with HM index values less than 0.2). We then eliminated areas fragmented by oil and natural gas development, defined as sites with 1.5 active wells per km2 or greater.  <br/><br/> We also excluded lands in the Great Plains bioregion altered by past tillage or other landscape disturbances (Ostlie 2003). Finally, we added core forest and core wetland areas to capture additional, functionally intact habitats in Illinois, Indiana, Iowa, Michigan, Minnesota, Missouri, and Ohio.',
        totalArea: 0,
        percentOfTotal: 0,
        legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGPctGkTAymAiSTVoxpGNQwpDQCTngI2h5rRGQAAAABJRU5ErkJggg==' // #b2b2b2
      },
        {
        index: 11,
        mapIndex: 13,
        elid: 'migratoryBirdStopoverWind',
        filter: true,
        visible: false,
        visibleModel: false,
        opacity: 0.9,
        category: 'wind',
        title: 'Migratory Bird Stopover',
        inBuffer: false,
        inExtent: false,
        description: 'short description',
        longDescription: 'Billions of migratory birds cross North America twice a year, putting them at risk for wind collision. Stopover habitat—places the birds feed and rest on their journey—help delineate these migratory routes. This layer highlights high-density distributions of migratory landbirds in stopover habitat across the U.S. (<a href="https://www.nature.com/articles/s41467-023-43046-z" target="_blank">Horton et al. 2023</a>). ',
        totalArea: 0,
        percentOfTotal: 0,
        legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGP8tm0WAymAiSTVoxpGNQwpDQAmqQJm+0U4DQAAAABJRU5ErkJggg==' // #f6b69a
      },
        
    ]
    },
   
  ]},
  {header: 'Disturbed Lands' , id: 'agriculture', expanded: false, 
   subheaders: [
    {title: ' Disturbed Lands', id: 'ag', visible: true, visibleModel: true, expanded: false,
      sublayers:  [
        {index: 13, elid: 'abandonedmines', filter: true, visible: false, visibleModel: false, 
          opacity: 0.9, category: 'both', title: 'Former Mine Lands',  inBuffer: false, inExtent: false, description: 'short description',
           longDescription: 'This layer identifies sites that operated as mines between 1977-2006. These sites may present an opportunity for renewable energy development after further site assessment and feasibility analysis. The mine lands layer uses the best available nationwide data on mines <a href="https://mrdata.usgs.gov/usmin/" target="_blank">(USGS geospatial database).</a> Users are advised that the data are of inconsistent quality and better data may be available from state mining agencies. Mines in the dataset include former coal mines, silica mines, iron pits, lignite pits, open pit mines, quarries, and strip mines.', 
           totalArea: 0, percentOfTotal: 0, inExtent: '', legendImg: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAGwSURBVDhP5ZPLbtNQEECPnbhJmgewARaULd+B+AEWfCoLlhVCbVFRIVIqmlRNY6VJareJUz9i+/pF7EYRUR1vyI6zudLM6OjeOzNSsoQdIq/OnbFzYeGT4yRmttCJREJV3qfZbCLLxXfYmo3jGF94jK0BPfOMnv0TP/CyeBFbhVEcYnpzruw2v+xDOs435u6UMApWFflsFVrCZPDQ5bJ8zLD1A63+m75xkcWLyBVGUcRc6FyKU+zGLeEzC2f/jm54hBFMsvw2coWucLj1B1yXzgjrNkoDgppNXzlF81UWnrOqfEqucGRfo4pzzNaQqCyyWFIK8F9MGYs+mjXKYnlsCNMOuq7LTdBlIneh7pPIj11NSglSLUClTV+0s7q8jq+F6TiKwGdq64ziC6YVFXlvOajSYz49pDJolR6q1Obe0nI7vhamH/3gGZwb39HLV4hafjellsBQhnRmJ9jB05r1pqRC3R5zdPOFUaWDU71HLmU1GyyXh6r3nJeLd7x/+5FXzTcb27MWpv9x50z4OviMGc6IpOIB3pOrfDj4xOvGAYqirKJ/CXdF7tj8C/+dEP4AGLv06o7CI14AAAAASUVORK5CYII="},
        {index: 14, elid: 'brownfields', filter: true, visible: false, visibleModel: false, opacity: 0.9,
           category: 'both', title: 'Brownfields over 10 acres', inBuffer: false, inExtent: false, description: 'short description',
            longDescription: 'This layer depicts sites (over 10 acres) which are identified as Brownfields by the US Environmental Protection Agency (EPA), defined as abandoned, underused, or idled commercial or industrial properties whose redevelopment or expansion may be complicated by the presence or potential presence of a hazardous pollutant. These sites may present an opportunity for renewable energy development after further site assessment and feasibility analysis. This data layer is a selection of the EPA’s RE-Powering America’s Land Initiative data. ', totalArea: 0, percentOfTotal: 0, inExtent: '', legendImg: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAC/SURBVDhPY/wPBAxUBExQmmpg1EDKAcFYnjJ5CsOurdsZnr15ySAlIs7g5u3JkJObA5XFBHgNTI1PYpD5w8cQpmzHoMAnwfDg0wuGVXcPMTxh+cQwe+E8qCpUgNNAkMvenrjDUGYYBhVBgK7zqxiELVSwuhRnGIK8CXIZNgASB8ljAzgNBIUZyJvYAEgcJI8N4DQQFAGgMMMGQOIgeWwAp4Gg2ARFADYAEgfJYwP0i2UYoGo6JAdQPeuNOAMZGACQ7mcGtSS9RgAAAABJRU5ErkJggg=="},
       {index: 15, elid: 'abandonedag', serviceId: 'rasters',  filter: true, visible: false, visibleModel: false, opacity: 0.9, category: 'both', title: 'Abandoned Cropland',  inBuffer: false, inExtent: false, description: 'short description', 
      longDescription: 'This layer identifies croplands that were abandoned between 1986-2018 (<a href="https://iopscience.iop.org/article/10.1088/1748-9326/ad2d12" target="_blank"> Xie et al. 2024</a>). These areas are likely marginal for food production and therefore could be a suitable location for large-scale solar development, according to the American Farmland Trust. However, 20% of this area was enrolled in the Conservation Reserve Program as of 2020, and may be ecologically sensitive or susceptible to erosion, either of which may make these lands unsuitable for large-scale solar developments.',
      totalArea: 0, percentOfTotal: 0, legendImg:  "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAQElEQVQ4jWNhoDJgoZmBT6bU/KfEIJmcFkYUA6kFWEYNpBiwUG4EKhg1kHLAQgUzUMCogZQDeBjCyjOqGUgtAAALkgVen6ZPhAAAAABJRU5ErkJggg=="},
	          ]   
  },
  ]},
  {header: 'Agricultural Values' , id: 'agriculture', expanded: false, 
   subheaders: [
    {title: ' Agricultural Values', id: 'ag', visible: true, visibleModel: true, expanded: false,
      sublayers: [
        {index: 16, elid: 'highestag', serviceId: 'rasters',  filter: true, visible: true, visibleModel: false,
       opacity: 0.9, category: 'both', title: 'Highest Quality Farmland', description: 'short description',
        longDescription: 'The American Farmland Trust recommends these areas not be converted to non-agrivoltaic solar development, particularly large-scale solar. This layer identifies the top half of farm and ranchland in each state – that is, the lands with PVR (productivity, versatility, and resiliency) values above each states’ median. PVR data are based on soil productivity and capacity, land cover and use, crop type, and length of the growing season (<a href="https://farmlandinfo.org/publications/farms-under-threat-the-state-of-the-states/" target="_blank"> Farms Under Threat 2020</a>).',
        totalArea: 0, percentOfTotal: 0, inExtent: '',
        legendImg: "", pngLegend: '\\ag.png', pngWidth: '200'
      },
 	   ]
  },
  ]},
  {header: 'Community Considerations' , id: 'community', expanded: false, 
   subheaders: [
    {title: 'Community Considerations', id: 'comm', visible: true, visibleModel: true, expanded: false,
      sublayers: [
        
 
  {
    index: 14, elid: 'cjest_lowincome', serviceId: 'vtl', filter: true, type: 'radio',
    visible: false, visibleModel: false, opacity: 0.9, category: 'both',
    title: 'Household Income', style: 'styles/P200_I_PFS.json',
    inBuffer: false, inExtent: false,
    description: 'short description',
    longDescription: 'Percent of a census tract’s population in households where household income is at or below 200% of the Federal poverty level, not including students enrolled in higher education.',
    totalArea: 0,
    percentOfTotal: 0,
    legendImg: 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAQCAIAAAD4YuoOAAAAT0lEQVR4nO3NsRGAMAwDQMj+c9IDRc6ypFAQ7hgAOquS5eLXc+uClcNp5SAkmDBhQYQZ96lnNEOEc77EmD3ffXS2ne1oy88poIACCijgi1zvDVxsJV53JAAAAABJRU5ErkJggg=='
  },      
{
    index: 15, elid: 'cjest_climate', serviceId: 'vtl', filter: true, type: 'radio',
    visible: false, visibleModel: false, opacity: 0.9, category: 'both',
    title: 'Climate Disadvantaged', style: 'styles/N_CLT_EOMI.json',
    inBuffer: false, inExtent: false,
    description: 'short description',
    longDescription: 'Communities are identified as disadvantaged if they are in census tracts that are at or above the 90th percentile for expected agriculture loss rate OR expected building loss rate OR expected population loss rate OR projected flood risk OR projected wildfire risk AND are at or above the 65th percentile for low income.',
    totalArea: 0,
    percentOfTotal: 0,
    legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGMst29nIAUwkaR6VMOohiGlAQD8gwFdEJxTQgAAAABJRU5ErkJggg=='
  },
  {
    index: 16, elid: 'cjest_energy', serviceId: 'vtl', filter: true, type: 'radio',
    visible: false, visibleModel: false, opacity: 0.9, category: 'both',
    title: 'Energy Disadvantaged', style: 'styles/N_ENY_EOMI.json',
    inBuffer: false, inExtent: false,
    description: 'short description',
    longDescription: 'Communities are identified as disadvantaged if they are in census tracts that are at or above the 90th percentile for energy cost OR PM2.5 in the air AND are at or above the 65th percentile for low income.',
    totalArea: 0,
    percentOfTotal: 0,
    legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGMst29nIAUwkaR6VMOohiGlAQD8gwFdEJxTQgAAAABJRU5ErkJggg=='
  },
   {
    index: 21, elid: 'cjest_health', serviceId: 'vtl', filter: true, type: 'radio',
    visible: false, visibleModel: false, opacity: 0.9, category: 'both',
    title: 'Health Disadvantaged', style: 'styles/N_HLTH_90.json',
    inBuffer: false, inExtent: false,
    description: 'short description',
    longDescription: 'Communities are identified as disadvantaged if they are in census tracts that are at or above the 90th percentile for asthma OR diabetes OR heart disease OR low life expectancy AND are at or above the 65th percentile for low income.',
    totalArea: 0,
    percentOfTotal: 0,
    legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGMst29nIAUwkaR6VMOohiGlAQD8gwFdEJxTQgAAAABJRU5ErkJggg=='
  },
  {
    index: 18, elid: 'cjest_housing', serviceId: 'vtl', filter: true, type: 'radio',
    visible: false, visibleModel: false, opacity: 0.9, category: 'both',
    title: 'Housing Disadvantaged', style: 'styles/N_HSG_EOMI.json',
    inBuffer: false, inExtent: false,
    description: 'short description',
    longDescription: 'Communities are identified as disadvantaged if they are in census tracts that experienced historic underinvestment OR are at or above the 90th percentile for housing cost OR lack of green space OR lack of indoor plumbing OR lead paint AND are at or above the 65th percentile for low income.',
    totalArea: 0,
    percentOfTotal: 0,
    legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGMst29nIAUwkaR6VMOohiGlAQD8gwFdEJxTQgAAAABJRU5ErkJggg=='
  },
   {
    index: 19, elid: 'cjest_pollution', serviceId: 'vtl', filter: true, type: 'radio',
    visible: false, visibleModel: false, opacity: 0.9, category: 'both',
    title: 'Pollution Disadvantaged', style: 'styles/N_PLN_EOMI.json',
    inBuffer: false, inExtent: false,
    description: 'short description',
    longDescription: 'Communities are identified as disadvantaged if they are in census tracts that have at least one abandoned mine land OR Formerly Used Defense Sites OR are at or above the 90th percentile for proximity to hazardous waste facilities OR proximity to Superfund sites (National Priorities List (NPL)) OR proximity to Risk Management Plan (RMP) facilities AND are at or above the 65th percentile for low income.',
    totalArea: 0,
    percentOfTotal: 0,
    legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGMst29nIAUwkaR6VMOohiGlAQD8gwFdEJxTQgAAAABJRU5ErkJggg=='
  },
  {
    index: 17, elid: 'cjest_transportation', serviceId: 'vtl', filter: true, type: 'radio',
    visible: false, visibleModel: false, opacity: 0.9, category: 'both',
    title: 'Transportation Disadvantaged', style: 'styles/N_TRN_EOMI.json',
    inBuffer: false, inExtent: false,
    description: 'short description',
    longDescription: 'Communities are identified as disadvantaged if they are in census tracts that are at or above the 90th percentile for diesel particulate matter exposure OR transportation barriers OR traffic proximity and volume AND are at or above the 65th percentile for low income.',
    totalArea: 0,
    percentOfTotal: 0,
    legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGMst29nIAUwkaR6VMOohiGlAQD8gwFdEJxTQgAAAABJRU5ErkJggg=='
  },
  
 
  {
    index: 20, elid: 'cjest_water', serviceId: 'vtl', filter: true, type: 'radio',
    visible: false, visibleModel: false, opacity: 0.9, category: 'both',
    title: 'Water Disadvantaged', style: '/styles/N_WTR_EOMI.json',
    inBuffer: false, inExtent: false,
    description: 'short description',
    longDescription: 'Communities are identified as disadvantaged if they are in census tracts that are at or above the 90th percentile for underground storage tanks and releases OR wastewater discharge AND are at or above the 65th percentile for low income.',
    totalArea: 0,
    percentOfTotal: 0,
    legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGMst29nIAUwkaR6VMOohiGlAQD8gwFdEJxTQgAAAABJRU5ErkJggg=='
  },
 
  {
    index: 22, elid: 'cjest_workforce', serviceId: 'vtl', filter: true, type: 'radio',
    visible: false, visibleModel: false, opacity: 0.9, category: 'both',
    title: 'Workforce Disadvantaged', style: 'styles/N_WKFC_91.json',
    inBuffer: false, inExtent: false,
    description: 'short description',
    longDescription: 'Communities are identified as disadvantaged if they are in census tracts that are at or above the 90th percentile for linguistic isolation OR low median income OR poverty OR unemployment AND more than 10% of people ages 25 years or older whose high school education is less than a high school diploma.',
    totalArea: 0,
    percentOfTotal: 0,
    legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGMst29nIAUwkaR6VMOohiGlAQD8gwFdEJxTQgAAAABJRU5ErkJggg=='
  }

	   ]
  },
  ]},
  {header: 'Potential Renewable Energy Buildout', id: 'renewable', expanded: false, 
   subheaders: [
    {title: 'Potential Renewable Energy Buildout', id: 'renewable', visible: true, visibleModel: true, expanded: false,
      sublayers:  [
        {index: 13, elid: 'buildout_solar', filter: true, visible: false, visibleModel: false, 
          opacity: 0.9, category: 'both', title: 'Potential Solar Buildout',  inBuffer: false, inExtent: false, description: 'short description',
           longDescription: '', 
           totalArea: 0, percentOfTotal: 0, legendImg: ""},
        {index: 14, elid: 'buildout_wind', filter: true, visible: false, visibleModel: false, opacity: 0.9,
           category: 'both', title: 'Potential Wind Buildout', inBuffer: false, inExtent: false, description: 'short description',
            longDescription: ''},
        ]   
  },
  ]},
  {header: 'Native Lands' , id: 'native', expanded: true, 
   subheaders: [
     {title: ' Native Lands', id: 'native', visible: true, visibleModel: true, expanded: false,
      sublayers: [
        {index: 0, elid: 'nativeLands', serviceId: 'rasters',  filter: true, visible: true, visibleModel: true,
       opacity: 0.9, category: 'both', title: 'American Indian, Alaska Native, and Native Hawaiian Areas', description: 'short description',
        longDescription: 
'This layer displays locations of the Federally Recognized Tribal entities in the contiguous U.S. and Alaska (<a href="https://www.arcgis.com/home/item.html?id=1d6231f4358c4e3781557e702c319d9a" target="_blank">National Geospatial Data Asset data from the U.S. Census Bureau</a>). Categories included are:<br/> <ul><li>American Indian Reservations (AIR). The Bureau of Indian Affairs (BIA) defines AIRs as "areas of land reserved for a tribe or tribes under treaty or other agreement with the United States, executive order, or federal statute or administrative action as permanent tribal homelands, and where the federal government holds title to the land in trust on behalf of the tribe".</li><br/><li>Federally Recognized Tribal Entities (FRTE). According to the BIA, an FRTE is "an American Indian or Alaska Native tribal entity that is recognized as having a government-to-government relationship with the United States, with the responsibilities, powers, limitations, and obligations attached to that designation."</li></ul>',        totalArea: 0, percentOfTotal: 0, inExtent: '',
        legendImg: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAMUlEQVR4nGNgGOyAEca4du3af0oM0tLSYmRgYGBgotRF6GDUwFEDRw0cNZA+Bg5+AADqfAQg5jR4QQAAAABJRU5ErkJggg=="      }]
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
    console.log(layer)
    if(layer.id == 'native'){
      return
    }
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
      let resetlayers = ['highestag','abandonedag','brownfields',
        'abandonedmines','landscapeIntactness','landscape','migratoryBirdStopoverWind',] 
        resetlayers.forEach((layer, index) => {
        let mapLayer = map.findLayerById(layer);
        map.reorder(mapLayer,index);
      })
   
  },
  setGroupVisibility(group){
    group.expanded = !group.expanded
    this.toggleGroupVisibility(group)
      // Custom behavior for expansion groups
    if (group.header == 'Potential Renewable Energy Buildout'  && group.expanded == true){
      //when community is open close the other two groups
      this.layers[0].expanded = false;
      this.layers[1].expanded = false;
      this.layers[2].expanded = false;
      this.layers[3].expanded = false;
      this.toggleGroupVisibility(this.layers[0])
      this.toggleGroupVisibility(this.layers[1])
      this.toggleGroupVisibility(this.layers[2])
      this.toggleGroupVisibility(this.layers[4])
    }
    
    // Custom behavior for expansion groups
    if (group.header == 'Community Considerations'  && group.expanded == true){
      //when community is open close the other two groups
      this.layers[0].expanded = false;
      this.layers[1].expanded = false;
      this.layers[2].expanded = false;
      this.layers[4].expanded = false;
      this.toggleGroupVisibility(this.layers[0])
      this.toggleGroupVisibility(this.layers[1])
      this.toggleGroupVisibility(this.layers[2])
      this.toggleGroupVisibility(this.layers[4])
    }
      if (group.header == 'Agricultural Values'  && group.expanded == true){
      //when community is open close the other two groups
      this.layers[0].expanded = false;
      this.layers[1].expanded = false;
      this.layers[3].expanded = false;
      this.layers[4].expanded = false;
      this.toggleGroupVisibility(this.layers[0])
      this.toggleGroupVisibility(this.layers[1])
      this.toggleGroupVisibility(this.layers[3])
      this.toggleGroupVisibility(this.layers[4])
    }
    if (
      group.header == 'Conservation Values' && group.expanded == true ||
      group.header == 'Disturbed Lands' && group.expanded == true
    ){
      //this turns on the CA overlay
       if (
      group.header == 'Conservation Values' && group.expanded == true){
       let map = document.querySelector("arcgis-map").map;
       map.findLayerById('states').visible = true
       map.findLayerById('buttonLayer').visible = true
      }
      //when the other two are open close community
      this.layers[3].expanded = false;
      this.layers[2].expanded = false;
      this.layers[4].expanded = false;
      this.toggleGroupVisibility(this.layers[2])
      this.toggleGroupVisibility(this.layers[3])
      this.toggleGroupVisibility(this.layers[4])
    }
    //this turns off CA overlay and button
     if (
      group.header == 'Conservation Values' && group.expanded == false){
       let map = document.querySelector("arcgis-map").map;
       map.findLayerById('states').visible = false
       map.findLayerById('buttonLayer').visible = false
      }
  },
  toggleGroupVisibility(group){
    let map = document.querySelector("arcgis-map").map;
    group.subheaders.forEach(subheader => {
      let visible = group.expanded
      subheader.visible = visible
      subheader.expanded = true
      subheader.sublayers.forEach(layer => {
        let sublayer = map.findLayerById(layer.elid);
        if(layer.elid.slice(0, 5) === 'cjest'){
          sublayer = map.findLayerById('cjest')
        }
        
        if(layer.filter){
        sublayer.visible = visible
        }
        
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
    this.filterLayers(this.category)
  },
  //sets individual layer visibility
  setSublayerVisibility(elid, checked) {
    let map = document.querySelector("arcgis-map").map;
    let layer = map.findLayerById(elid);
    layer.visible = checked
  },
  //filter layers
  filterLayers(cat){
    console.log(cat)
    this.category = cat
    let map = document.querySelector("arcgis-map").map;
 
   if (this.category == 'floating'){
   this.layers.forEach(layer => {
      layer.subheaders.forEach(subheader => {
        subheader.sublayers.forEach(layer => {
          
          if(layer.category !== this.category || layer.category == 'both' ){
            //turn off those layers so they are not visibl ein the map
            let mapLayer = map.findLayerById(layer.elid);
            layer.filter = false
            mapLayer.visible = false
          }
          if (layer.category == this.category || (layer.elid == 'nativeLands' && layer.visibleModel == true)){
            //turn on those layers
            let mapLayer = map.findLayerById(layer.elid);
            layer.filter = true
            if(layer.visibleModel){mapLayer.visible = true}
          }
         })
      });
    });
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
    if(this.bufferSize > 36){
      alert ('Buffer size cannot exceed 35 miles')
      return
    }
    

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
   // this.getHistogram(buffer, 'test')
  this.fetchRasterIds()
  
  },
  oldExtras(){
        //clear values from previous buffer
    view.goTo({target: bufferLayer.graphics.getItemAt(0).geometry, padding: 20})
    /*let layerList = [{name: 'Big Game', id: 17, color: '#FED1EF', index: 0, map:'intersectingFeatures', pathToLayer:  this.layers[0].subheaders[0].sublayers[0]},
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
    ]*/
    let layerList = [{
        title: 'High Quality Watersheds',
        layerid: 0,
        type: 'polygon',
        group: 'highly sensitive',
        defquery: '',
        pathToLayer: this.layers[0].subheaders[0].sublayers[1]
        },

        {
        title: 'Landscape Connectivity',
        layerid: 1,
        type: 'polygon',
        group: 'moderately sensitive',
        defquery: 'gridcode <> 0',
        pathToLayer: this.layers[0].subheaders[1].sublayers[0]
        },
        {
        title: 'Prairie Grouse',
        layerid: 2,
        type: 'polygon',
        group: 'highly sensitive',
        defquery: 'gridcode <> 0',
        pathToLayer: this.layers[0].subheaders[0].sublayers[4]
        },
        {
        title: 'Resilient and Connected Network',
        layerid: 3,
        type: 'polygon',
        group: 'highly sensitive',
        defquery: 'gridcode <> 0',
        pathToLayer: this.layers[0].subheaders[0].sublayers[3]
        },
        {
        title: 'Whooping Crane Wind',
        layerid: 4,
        type: 'polygon',
        group: 'highly sensitive',
        defquery: 'gridcode <> 0',
        pathToLayer: this.layers[0].subheaders[0].sublayers[5]
        },
        {
        title: 'Whooping Crane Solar',
        layerid: 5,
        type: 'polygon',
        group: 'highly sensitive',
        defquery: 'gridcode <> 0',
        pathToLayer: this.layers[0].subheaders[0].sublayers[6]
        },
        {
        title: 'Former Mine Lands',
        layerid: 7,
        type: 'point',
        group: 'degraded lands',
        defquery: '',
        pathToLayer: this.layers[0].subheaders[2].sublayers[0]
        },
        {
        title: 'Brownfields over 10 acres',
        layerid: 8,
        type: 'point',
        group: 'degraded lands',
        defquery: '',
        pathToLayer: this.layers[0].subheaders[2].sublayers[0]
            },]
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
     this.layers[0].subheaders[2].sublayers.forEach((layer)=>{ 
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
    mines: 0,
    brownfields: 0,
    bufferArea: 0,
    highlySensitiveHabitats: [],
    hsExtentCount: 0,
    minesExtentCount: 0,
    msExtentCount: 0,
    }      
    for (let i=0;i<layerList.length;i++){
      if(layerList[i].type == 'polygon'){
        this.getIntersectionFeatures(buffer, layerList[i])
        this.getHistogram(buffer, layerList[i])
      }
      if(layerList[i].type == 'point'){
        this.getCountFeatures(buffer, layerList[i])
      }
      if(layerList[i].type == 'raster'){
         this.getHistogram(buffer, layerList[i])
      }
      //this.getIntersectionExtent(layerList[i])
    }  
    
  },
  //function to clip features and calculate area
  getIntersectionFeatures(buffer, item){
    //first step is to probably query the layer and get geometries
    //let map = document.querySelector("arcgis-map").map;
    //console.log(item)
    //let layer = map.findLayerById(item.id)
    //console.log(layer)
    
  // Create a FeatureLayer instance (not added to map)
      const featureLayer = new FeatureLayer({
        url: "https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/" + item.layerid 
      });

     const queryGeom = {
      geometry: buffer,
      spatialRelationship: 'intersects',
      returnGeometry: true,
      outFields: ['*'],
      where: item.defquery !== '' ? item.defquery : '1=1',
    }

    featureLayer.queryFeatures(queryGeom).then((results) => {
      console.log(results)
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
    if (item.group == 'highly sensitive'){ 
      this.summary.highlySensitiveTotalArea = this.summary.highlySensitiveTotalArea + area
      this.summary.highlySensitiveCount = this.summary.highlySensitiveCount + 1
      this.summary.highlySensitiveHabitats.push({name: item.title, area: area, percentOfTotal: (area/bufferArea)  })
    }
    this.summary.highlySensitiveHabitats.sort((a, b) => b.percentOfTotal - a.percentOfTotal); 
    if (item.group == 'moderately sensitive'){     
    this.summary.moderatelySensitiveTotalArea= this.summary.moderatelySensitiveTotalArea + area
    }
    }
   
     })
  },
  //function to get count of intersecting points
  getCountFeatures(buffer, item){ 
     const featureLayer = new FeatureLayer({
        url: "https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/" + item.layerid 
      });

     const queryGeom = {
      geometry: buffer,
      spatialRelationship: 'intersects',
      returnGeometry: false,
      outFields: ['*'],
    }

    featureLayer.queryFeatures(queryGeom).then((results) => {
      let count = results.features.length
      console.log(results)
     /* let obj = {
        map: item.map,
        layerId: item.id,
        layerName: item.name,
        count: count
      }*/
        if(count > 0){
          item.pathToLayer.inBuffer = true
       }else{
          item.pathToLayer.inBuffer = false
       }
     
      if (item.title == 'Brownfields over 10 acres'){
        this.summary.brownfields = count
        item.pathToLayer.count = count
      }
      if (item.title == 'Former Mine Lands'){
        console.log('mines count:' + count)
        console.log(item.pathToLayer)
        this.summary.mines = count
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
      where: item.defquery !== ''? 'item.defquery': '1=1'
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


  getHistogram(buffer, item) {
    const rasters = [
      'pvr_pctls_merged_FINAL',
      'birds_COG',
      'Connectivity_04_20260304',
      'BigGame_08',
      'IntactHabitats_04',
      'Migratory_Bird_Stopover',
      'OtherBiodiversity_09',
      'PrairieGrouseAndSageGrouse_Hise',
      'ProtectedAreas_COG_NEW',
      'ResilientAndConnected_COG2',
      'WhoopingCraneSolar_Hise',
      'WhoopingCraneWind_Hise',
      'TE_Species_03',
      'FloodPlainsAndWetlands2'
    ];

    const map = document.querySelector("arcgis-map").map;
    const imageLayer = map.findLayerById("imageLayer");

    rasters.forEach((rasterName) => {
      const mosaicRule = new MosaicRule({
        method: "attribute",
        where: `Name = '${rasterName}'`,
        operation: "first"
      });

      const params = new ImageHistogramParameters({
        geometry: buffer,
        mosaicRule,
        pixelSize: 30,
        renderingRule: null,
        bandIds: [0]
      });

      imageLayer.computeHistograms(params)
        .then((results) => {
          console.log(rasterName, results);
        })
        .catch((err) => {
          console.error(`Histogram failed for ${rasterName}`, err);
        });
    });
  },

  fetchRasterIds() {
    const imageServerUrl =
      'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/SRR_MosaicRasters/ImageServer'


    const rasterNames = [
      'pvr_pctls_merged_FINAL',
      'birds_COG',
      'Connectivity_04_20260304',
      'BigGame_08',
      'IntactHabitats_04',
      'Migratory_Bird_Stopover',
      'OtherBiodiversity_09',
      'PrairieGrouseAndSageGrouse_Hise',
      'ProtectedAreas_COG_NEW',
      'ResilientAndConnected_COG2',
      'WhoopingCraneSolar_Hise',
      'WhoopingCraneWind_Hise',
      'TE_Species_03',
      'FloodPlainsAndWetlands2'
    ];

   
 const q = new Query({
    where: "1=1",                 // or filter by Name
    outFields: ["Name", "OBJECTID"],
    returnGeometry: false
  });

  return query.executeQueryJSON(imageServerUrl, q)
    .then(res => {
      const map = {};
      res.features.forEach(f => {
        map[f.attributes.Name] = f.attributes.OBJECTID;
      });
      console.log(map)
      return map;
    });

  },



  changeNativeOpacity(opacity){
      let map = document.querySelector("arcgis-map").map;
      let native = map.findLayerById('nativeLands');
      native.opacity = opacity;
  },
  changeOpacity(){
  let map = document.querySelector("arcgis-map").map;
  //let layersList = [avoid, minimize, opportunities]
  map.layers.forEach(layer => layer.opacity = this.opacity)
  },
  fadeLayer(layer, start, end, duration = 300) {
  return new Promise(resolve => {
    const startTime = performance.now();

    function animate(time) {
      const t = Math.min((time - startTime) / duration, 1);
      layer.opacity = start + (end - start) * t;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(animate);
  });
},

  changeCommunityStyle(style){
    let map = document.querySelector("arcgis-map").map;
    let layer = map.findLayerById('cjest');
    layer.loadStyle(style)
   
  }
  

}
));
