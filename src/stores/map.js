import { ref, computed, markRaw } from 'vue';
import { defineStore } from 'pinia';
import Graphic from '@arcgis/core/Graphic.js'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import * as bufferOperator from '@arcgis/core/geometry/operators/bufferOperator.js'
import MosaicRule from '@arcgis/core/layers/support/MosaicRule.js';
import ImageHistogramParameters from '@arcgis/core/rest/support/ImageHistogramParameters.js';
import * as projectOperator from "@arcgis/core/geometry/operators/projectOperator.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";

import Query from "@arcgis/core/rest/support/Query";
import * as query from "@arcgis/core/rest/query";

export const useMapStore = defineStore('mapStore', () => ({
  showHelpPanel: false,
  selectedHelpSection: 'Highly Sensitive',
  showSiteReport: false,
  opacity: 90,
  showOpacity: false,
  showDemo: false,
  tab: 'layers',
  reportTab: 'conservation',
  showReportDetails: true,
  reportLayerFilter: 'buffer',
  compare: true, 
  activeTool: 'legend',
  activeHelpElement: '',  
  category: 'solar',
  legend: '',
  bufferSize: 1,
  currentPoint: '',
  currentMapExtent: '',
  checkboxHideSplash: false,
  reportBufferAreaHa: '',
  reportBufferAreaAc: '',

  reportResults: [],
  reportLoading: false,
  reportGeneratedAt: null,
 
  splash: true,

  layers: [
  {header: 'Conservation Values' , id: 'avoid', expanded: false,
   subheaders: [
    {title: 'Highly Sensitive', id: 'high', visible: true, visibleModel: true, expanded: false,
      sublayers:  [
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
        description: 'short description',
        longDescription: "This layer presents the <a href='https://www.usgs.gov/programs/gap-analysis-project/science/pad-us-data-overview?qt-science_center_objects=0#qt-science_center_objects' target='_blank'>US Geological Survey’s Protected Areas database</a>, a national inventory of U.S. terrestrial protected areas that are dedicated to the preservation of biological diversity and other natural, recreation and cultural uses, managed for these purposes through legal or other effective means. It includes all Federal and most State and local lands. We also included the <a href='https://www.conservationeasement.us/' target='_blank'>National Conservation Easement Database</a> for additional areas protected by agencies, land trusts (including TNC preserves), and other organizations, and additional state-specific data as appropriate.  ",
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
        description: 'short description',
        longDescription: 'Renewable energy development near wetland complexes and riparian corridors may cause adverse impacts to wildlife and fragile wetland ecosystems. This layer identifies floodplains, rivers, open water, and wetlands (Fathom-US 1-in-20 year fluvial and 1-in-20-year pluvial flood model tiles; <a href="https://www.fws.gov/program/national-wetlands-inventory" target="_blank"> US Fish & Wildlife Service National Wetlands Inventory </a>). Groundwater-dependent ecosystem data in Nevada and Arizona and vernal pools in California were also included.',
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
        //legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGUlEQVR4nGNsWJjPQApgIkn1qIZRDUNKAwD6PQGwgiIB7gAAAABJRU5ErkJggg==', // #80a16f
        pngLegend: '\\legend\\rcn.png',
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
      {index: 9, mapIndex: 10, elid: 'qualitywater', filter: true, visible: false, 
        visibleModel: false, opacity: 0.9, category: 'floating solar', title: 'High Quality Watersheds', inBuffer: false, inExtent: false, description: 'short description', longDescription: 'This layer represents highly resilient and biodiverse watershed areas, containing lakes and ponds, from TNC’s Freshwater Resilience and Resilient and Connected Network (RCN) analyses (<a href="https://crcs.tnc.org/pages/frcn" target="_blank">Anderson et al. 2024</a>). This area covers 20.6% of the conterminous United States.', totalArea: 0, percentOfTotal: 0, inExtent: '', legendImg: 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAA0SURBVDhPYxj0gBFKM2Ruf/IfyiQLTPeUAZvFBOZREYwaSDkYNZByMGog5WDwGzjYAQMDAMr8BCCfppMvAAAAAElFTkSuQmCC'},
       
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
        index: 10,
        mapIndex: 25,
        elid: 'bats',
        filter: true,
        visible: false,
        visibleModel: false,
        opacity: 0.9,
        category: 'wind',
        title: 'Bats',
        inBuffer: false,
        inExtent: false,
        description: 'short description',
        longDescription: "Bat mortality has been documented at wind energy facilities across North America. Because bats concentrate in large numbers and have low reproductive rates, the viability of their populations is particularly vulnerable to adult mortality events. Therefore, caution is warranted when undertaking any activity that may adversely affect known bat populations. <br/><br/> To represent bat presence, we display roost and detection data (via acoustical recorders) collected from every state via the <a href='https://www.nabatmonitoring.org/' target='_blank'>North America Bat Monitoring Program.</a> Threatened and endangered species are shown in blue, non-listed species in gray. These areas on the map may pose a particular threat to bats from wind.",
        totalArea: 0,
        percentOfTotal: 0,
        legendImg: '',
        pngLegend: '\\legend\\bat.png',
        pngWidth: '220'

      },
    ]
    },
    {title: 'Moderately Sensitive', id: 'moderate', visible: true, visibleModel: true, expanded: false,
      sublayers:  [
     
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
    {title: 'Disturbed Lands', id: 'ag', visible: true, visibleModel: true, expanded: false,
      sublayers:[
        {index: 13, elid: 'abandonedmines', filter: true, visible: false, visibleModel: false, 
          opacity: 0.9, category: 'both', title: 'Former Mine Lands',  inBuffer: false, inExtent: false, description: 'short description',
          longDescription: 'This layer identifies sites that operated as mines between 1977-2006. These sites may present an opportunity for renewable energy development after further site assessment and feasibility analysis. The mine lands layer uses the best available nationwide data on mines <a href="https://mrdata.usgs.gov/usmin/" target="_blank">(USGS geospatial database).</a> Users are advised that the data are of inconsistent quality and better data may be available from state mining agencies. Mines in the dataset include former coal mines, silica mines, iron pits, lignite pits, open pit mines, quarries, and strip mines.', 
          totalArea: 0, percentOfTotal: 0, legendImg: ''},
        {index: 14, elid: 'brownfields', filter: true, visible: false, visibleModel: false, opacity: 0.9,
          category: 'both', title: 'Brownfields over 10 acres', inBuffer: false, inExtent: false, description: 'short description',
          longDescription: 'This layer depicts sites (over 10 acres) which are identified as Brownfields by the US Environmental Protection Agency (EPA), defined as abandoned, underused, or idled commercial or industrial properties whose redevelopment or expansion may be complicated by the presence or potential presence of a hazardous pollutant. These sites may present an opportunity for renewable energy development after further site assessment and feasibility analysis. This data layer is a selection of the EPA’s RE-Powering America’s Land Initiative data. ', totalArea: 0, percentOfTotal: 0,  legendImg: ""},
	      ]   
    },
  ]},
  {header: 'Agricultural Values' , id: 'agriculture', expanded: false, 
   subheaders: [
  {title: 'Highest Quality Farmland', id: 'ag', visible: true, visibleModel: true, expanded: false,
      sublayers: [
       {index: 18, elid: 'ag2', serviceId: 'rasters',  filter: true, visible: true, visibleModel: false,
       opacity: 0.9, category: 'both', title: 'Highest Quality Farmland: 50-75th percentile', description: 'short description',
        longDescription: 'It is anticipated that 90% of utility-scale solar capacity will be installed in rural communities, much of that on farmland (<a href="https://www.energy.gov/sites/default/files/2021-09/Solar%20Futures%20Study.pdf" target="_blank">U.S. Department of Energy 2021 </a>). This layer identifies the top 90%, 75%, and 50% of farm and ranchland in each state based on the land’s productivity, versatility, and resiliency (PVR) values, as defined by the American Farmland Trust. These data are based on soil productivity and capacity, land cover and use, crop type, and length of the growing season (<a href="https://farmlandinfo.org/publications/farms-under-threat-the-state-of-the-states/" target="_blank"> Farms Under Threat 2020</a>). The American Farmland Trust recommends that high quality agricultural lands are maintained as farmland and not converted to large-scale solar development. However, agrivoltaics (co-location of solar and agriculture) are considered compatible with farmland (<a href="https://farmland.org/smart-solar" target="_blank">Smart Solar Principles</a>) as is wind development. <br/><br/>As with any large-scale analysis, local and on-the-ground verification is required. Sites mapped as high quality based on current crop production and soil characteristics might become unproductive if they are water-stressed or contain highly erodible soils. In these areas, renewable energy projects, if designed intentionally, can reduce water use, improve soil stability, and promote ecosystem recovery over time. For example, the California Energy Commission (CEC) developed a Cropland Index Model to identify low quality or water-limited agricultural lands (cropland suitability score < 7.7), which the CEC promotes as better suited for renewable energy development (<a href="https://www.energy.ca.gov/data-reports/california-energy-planning-library/land-use-screens/cec-2023-land-use-screens-electric" target="_blank">CEC Land-use Screens</a>). For this reason, we removed cropland with a CEC suitability score below 7.7 from the layer.',
        totalArea: 0, percentOfTotal: 0, inExtent: '',
        legendImg: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAGHaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj48dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCjw/eHBhY2tldCBlbmQ9J3cnPz4slJgLAAAAIklEQVQ4T2O8tn/efwYKABO6AKlg1IBRAxhGDWBgGBQGAAA4yQNSWk4GhAAAAABJRU5ErkJggg==", pngWidth: '100'
      },
         {index: 19, elid: 'ag3', serviceId: 'rasters',  filter: true, visible: true, visibleModel: false,
       opacity: 0.9, category: 'both', title: 'Highest Quality Farmland: 75-90th percentile', description: 'short description',
        longDescription: 'It is anticipated that 90% of utility-scale solar capacity will be installed in rural communities, much of that on farmland (<a href="https://www.energy.gov/sites/default/files/2021-09/Solar%20Futures%20Study.pdf" target="_blank">U.S. Department of Energy 2021 </a>). This layer identifies the top 90%, 75%, and 50% of farm and ranchland in each state based on the land’s productivity, versatility, and resiliency (PVR) values, as defined by the American Farmland Trust. These data are based on soil productivity and capacity, land cover and use, crop type, and length of the growing season (<a href="https://farmlandinfo.org/publications/farms-under-threat-the-state-of-the-states/" target="_blank"> Farms Under Threat 2020</a>). The American Farmland Trust recommends that high quality agricultural lands are maintained as farmland and not converted to large-scale solar development. However, agrivoltaics (co-location of solar and agriculture) are considered compatible with farmland (<a href="https://farmland.org/smart-solar" target="_blank">Smart Solar Principles</a>) as is wind development. <br/><br/>As with any large-scale analysis, local and on-the-ground verification is required. Sites mapped as high quality based on current crop production and soil characteristics might become unproductive if they are water-stressed or contain highly erodible soils. In these areas, renewable energy projects, if designed intentionally, can reduce water use, improve soil stability, and promote ecosystem recovery over time. For example, the California Energy Commission (CEC) developed a Cropland Index Model to identify low quality or water-limited agricultural lands (cropland suitability score < 7.7), which the CEC promotes as better suited for renewable energy development (<a href="https://www.energy.ca.gov/data-reports/california-energy-planning-library/land-use-screens/cec-2023-land-use-screens-electric" target="_blank">CEC Land-use Screens</a>). For this reason, we removed cropland with a CEC suitability score below 7.7 from the layer.',
        totalArea: 0, percentOfTotal: 0, inExtent: '',
        legendImg: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAGHaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj48dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCjw/eHBhY2tldCBlbmQ9J3cnPz4slJgLAAAAIUlEQVQ4T2P8+0f/PwMFgAldgFQwasCoAQyjBjAwDAoDAAzFA0dLPJrOAAAAAElFTkSuQmCC", pngWidth: '100'
      },
        {index: 20, elid: 'ag4', serviceId: 'rasters',  filter: true, visible: true, visibleModel: false,
       opacity: 0.9, category: 'both', title: 'Highest Quality Farmland:   >=90th percentile', description: 'short description',
        longDescription: 'It is anticipated that 90% of utility-scale solar capacity will be installed in rural communities, much of that on farmland (<a href="https://www.energy.gov/sites/default/files/2021-09/Solar%20Futures%20Study.pdf" target="_blank">U.S. Department of Energy 2021 </a>). This layer identifies the top 90%, 75%, and 50% of farm and ranchland in each state based on the land’s productivity, versatility, and resiliency (PVR) values, as defined by the American Farmland Trust. These data are based on soil productivity and capacity, land cover and use, crop type, and length of the growing season (<a href="https://farmlandinfo.org/publications/farms-under-threat-the-state-of-the-states/" target="_blank"> Farms Under Threat 2020</a>). The American Farmland Trust recommends that high quality agricultural lands are maintained as farmland and not converted to large-scale solar development. However, agrivoltaics (co-location of solar and agriculture) are considered compatible with farmland (<a href="https://farmland.org/smart-solar" target="_blank">Smart Solar Principles</a>) as is wind development. <br/><br/>As with any large-scale analysis, local and on-the-ground verification is required. Sites mapped as high quality based on current crop production and soil characteristics might become unproductive if they are water-stressed or contain highly erodible soils. In these areas, renewable energy projects, if designed intentionally, can reduce water use, improve soil stability, and promote ecosystem recovery over time. For example, the California Energy Commission (CEC) developed a Cropland Index Model to identify low quality or water-limited agricultural lands (cropland suitability score < 7.7), which the CEC promotes as better suited for renewable energy development (<a href="https://www.energy.ca.gov/data-reports/california-energy-planning-library/land-use-screens/cec-2023-land-use-screens-electric" target="_blank">CEC Land-use Screens</a>). For this reason, we removed cropland with a CEC suitability score below 7.7 from the layer.',
        totalArea: 0, percentOfTotal: 0, inExtent: '',
        legendImg: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAGHaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj48dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCjw/eHBhY2tldCBlbmQ9J3cnPz4slJgLAAAAIUlEQVQ4T2P8u1X/PwMFgAldgFQwasCoAQyjBjAwDAoDAOzFAwAbfhr4AAAAAElFTkSuQmCC", 
      },
      
     
 	   ]
  },
  {title: 'Limitations to Farmland', id: '', visible: true, visibleModel: true, expanded: false,
      sublayers: [
        {index: 15, elid: 'abandonedag', serviceId: 'rasters',  filter: true, visible: true, visibleModel: false, opacity: 0.9, category: 'both', title: 'Abandoned Cropland',  inBuffer: false, inExtent: false, description: 'short description', 
          longDescription: 'This layer identifies croplands that were abandoned between 1986-2018 (<a href="https://iopscience.iop.org/article/10.1088/1748-9326/ad2d12" target="_blank"> Xie et al. 2024</a>). These areas are likely marginal for food production and therefore could be a suitable location for large-scale solar development, according to the American Farmland Trust. However, 20% of this area was enrolled in the Conservation Reserve Program as of 2020, and may be ecologically sensitive or susceptible to erosion, either of which may make these lands unsuitable for large-scale solar developments.',
          totalArea: 0, percentOfTotal: 0, legendImg:  "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGHaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj48dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCjw/eHBhY2tldCBlbmQ9J3cnPz4slJgLAAAAKElEQVQ4T2N8MqXmPwMVARO6AKVg1EDKwaiBlINRAykHowZSDga/gQAoQQMbGEmzEAAAAABJRU5ErkJggg=="},
       {index: 17, elid: 'waterLimited', serviceId: 'rasters',  filter: true, visible: true, visibleModel: false,
       opacity: 0.9, category: 'both', title: 'Surface Water-limited Lands', description: 'short description',
        longDescription: 'Surface water-limited lands are areas where water demand is approaching available supply. These water shortages may make farming infeasible, such that solar development may be more appropriate than agriculture. Renewable energy projects, if well-designed, could result in reduced water use and ecosystem stability over time. Water limitation across the lower 48 United States is shown as the average from 2010 to 2020 for each watershed (HUC12) from the <a href="https://water.usgs.gov/vizlab/water-availability/01-water-limitation" target="_blank">U.S. Geological Survey.</a> Only high and severe levels of water limitation are shown.',
        totalArea: 0, percentOfTotal: 0, inExtent: '',
        legendImg: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGHaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj48dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCjw/eHBhY2tldCBlbmQ9J3cnPz4slJgLAAAA9UlEQVQ4T52TIa6EMBBAHyCp2ASHqyQVOAQn4MSEEyBAN8g6MJAgQBK+YNkU8pcsPNnpzLy2U6fv+5U3xhiMMQBIKZFS7qED8zyjtWaaJlyAZVkYhgFjDF3XEcfxZXLbtjRNgxBiKzCOI0VRAJBlGa/X65z3QWtNWZakaYpSCqeu6/WuthACpRS+7+M+0U6SBN/3AbYj3NW2caWUBEGA53mHAO/OVVUxTRNRFBGG4afzjvtE28Y9L+xcads49iBxcdvfOBj8qr0zz/OxwK/aO1rr7Qh3tQ9/4Ym2vd/J83xtmoY0Tf995zNVVWHvd6+GxObbUP0B1TfSIusLipIAAAAASUVORK5CYII=", pngWidth: '100'
      },
      ]}
  ]},
  {header: 'Community Considerations' , id: 'community', expanded: false, 
   subheaders: [
    {title: 'Community Considerations', id: 'comm', selection: 'Low Income Percentile', visible: true, visibleModel: true, expanded: false,
      sublayers: [
  {
    index: 14, elid: 'cjest_lowincome', serviceId: 'vtl', filter: true, type: 'radio',
    visible: false, visibleModel: false, opacity: 0.9, category: 'both',
    title: 'Low Income Percentile', style: 'styles/P200_I_PFS.json',
    inBuffer: false, inExtent: false,
    description: 'short description',
    longDescription: 'The percentage of a census tract’s population living in households with incomes at or below 200% of the federal poverty level, excluding students enrolled in higher education.',
    totalArea: 0,
    percentOfTotal: 0,
    legendType: 'ramp',  lowLabel: 'Low Income', highLabel: 'High Income',  gradient: 'linear-gradient(to right, #f4edf7, #b56bc7)',
  },      
{
    index: 15, elid: 'cjest_climate', serviceId: 'vtl', filter: true, type: 'radio',
    visible: false, visibleModel: false, opacity: 0.9, category: 'both',
    title: 'Climate Burdened', style: 'styles/N_CLT_EOMI.json',
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
    title: 'Energy Burdened', style: 'styles/N_ENY_EOMI.json',
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
    title: 'Health Burdened', style: 'styles/N_HLTH_90.json',
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
    title: 'Housing Burdened', style: 'styles/N_HSG_EOMI.json',
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
    title: 'Pollution Burdened', style: 'styles/N_PLN_EOMI.json',
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
    title: 'Transportation Burdened', style: 'styles/N_TRN_EOMI.json',
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
    title: 'Water Burdened', style: '/styles/N_WTR_EOMI.json',
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
    title: 'Workforce Burdened', style: 'styles/N_WKFC_91.json',
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
  {header: 'Predicted Renewable Energy Buildout', id: 'renewable', expanded: false, 
   subheaders: [
    {title: 'Predicted Renewable Energy Buildout', id: 'renewable', visible: true, selection: 'Predicted Solar Buildout',visibleModel: true, expanded: false,
      sublayers:  [
        {index: 0, elid: 'lassoSolar', filter: true, visible: false, visibleModel: false, 
          opacity: 0.9, category: 'both', title: 'Predicted Solar Buildout',  inBuffer: false, inExtent: false, description: 'short description',
           longDescription: 'Communities can best respond to renewable energy project proposals with advance preparation on community values and conservation priorities. This layer is included to provide insights on areas of the country that may see solar development in the future. This map was created using past siting trends to model the likelihood of development in the future, also incorporating forward-looking data such as planned transmission and capacity (Wu et al. In press). Note that this map does not show a total forecasted footprint based on energy needs, but rather probabilities of development given site characteristics (i.e., the map shows more development than is likely needed in the U.S.). The analysis found that solar projects are more likely to be developed in areas with high infrastructure accessibility, closer to load centers, and lower environmental impacts (e.g., ecological sensitivities and forested land). ', type: 'radio', 
           totalArea: 0, percentOfTotal: 0},
        {index: 1, elid: 'lassoWind', filter: true, visible: false, visibleModel: false, opacity: 0.9,
           category: 'both', title: 'Predicted Wind Buildout', inBuffer: false, inExtent: false, description: 'short description',
            longDescription: 'Communities can best respond to renewable energy project proposals with advance preparation on community values and conservation priorities. This layer is included to provide insights on areas of the country that may see wind development in the future. This map was created using past siting trends to model the likelihood of development in the future, also incorporating forward-looking data such as planned transmission and capacity (Wu et al. In press). Note that this map does not show a total forecasted footprint based on energy needs, but rather probabilities of development given site characteristics (i.e., the map shows more development than is likely needed in the U.S.). The analysis found that wind projects are more likely to be developed in areas that are windier, have favorable land cover (agricultural and non-forested), closer to transmission lines, on more sloped terrain, and with lower land acquisition costs. ', type: 'radio', 
            legendType: 'ramp',  lowLabel: 'Low',  highLabel: 'High',  gradient: 'linear-gradient(to right, #e8ecff, #5b6fd6)'},
        ]   
  },
  ]},
  {header: 'Native Lands' , id: 'native', expanded: true, 
   subheaders: [
     {title: 'Native Lands', id: 'native', visible: true, visibleModel: true, expanded: false,
      sublayers: [
        {index: 0, elid: 'nativeLands', serviceId: 'rasters',  filter: true, visible: true, visibleModel: true,
       opacity: 0.9, category: 'both', title: 'American Indian, Alaska Native, and Native Hawaiian Areas', description: 'short description',
        longDescription: 
'This layer displays locations of the Federally Recognized Tribal entities in the contiguous U.S. and Alaska (<a href="https://www.arcgis.com/home/item.html?id=1d6231f4358c4e3781557e702c319d9a" target="_blank">National Geospatial Data Asset data from the U.S. Census Bureau</a>). Categories included are:<br/> <ul><li>American Indian Reservations (AIR). The Bureau of Indian Affairs (BIA) defines AIRs as "areas of land reserved for a tribe or tribes under treaty or other agreement with the United States, executive order, or federal statute or administrative action as permanent tribal homelands, and where the federal government holds title to the land in trust on behalf of the tribe".</li><br/><li>Federally Recognized Tribal Entities (FRTE). According to the BIA, an FRTE is "an American Indian or Alaska Native tribal entity that is recognized as having a government-to-government relationship with the United States, with the responsibilities, powers, limitations, and obligations attached to that designation."</li></ul>',        totalArea: 0, percentOfTotal: 0, inExtent: '',
        legendImg: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAMUlEQVR4nGNgGOyAEca4du3af0oM0tLSYmRgYGBgotRF6GDUwFEDRw0cNZA+Bg5+AADqfAQg5jR4QQAAAABJRU5ErkJggg=="      }]
  },
  ]}
  ],
  updateLayerOrder(layer) {
    const GROUP_RANGES = {
        'Highest Quality Farmland': 3, //0,1,2,3
        'Limitations To Farmland': 5, //4,5
        'Disturbed Lands': 7, //6,7
        'Community Considerations': 9, //8,9
        'Predicted Renewable Energy Buildout': 11, //10,11
        'Moderately Sensitive': 14, //12,13,14
        'Highly Sensitive': 24, //15-24
      }
    const map = document.querySelector('arcgis-map').map

    const topIndex = GROUP_RANGES[layer.title]

    if (topIndex === undefined) {
      console.warn('No group range defined for:', layer.title)
      return
    }

    layer.sublayers.forEach((sublayer, index) => {
      const mapLayer = map.findLayerById(sublayer.elid)

      const newIndex = topIndex - index

      console.log(
        `${sublayer.title} -> ${newIndex}`
      )

      if (mapLayer) {
        map.reorder(mapLayer, newIndex)
      }
    })
},

  //set overall group visibility
  setGroupVisibility(group){
    this.toggleGroupVisibility(group)
      // Custom behavior for expansion groups - allow native lands visible anytime
    if (group.header == 'Predicted Renewable Energy Buildout' && group.expanded == true){
      //when community is open close the other two groups
      this.layers[0].expanded = false;
      this.layers[1].expanded = false;
      this.layers[2].expanded = false;
      this.layers[3].expanded = false;
      this.toggleGroupVisibility(this.layers[0])
      this.toggleGroupVisibility(this.layers[1])
      this.toggleGroupVisibility(this.layers[2])
      this.toggleGroupVisibility(this.layers[3])

    }
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
    if (group.header == 'Disturbed Lands'  && group.expanded == true){
      //when community is open close the other two groups
      this.layers[0].expanded = false;
      this.layers[2].expanded = false;
      this.layers[3].expanded = false;
      this.layers[4].expanded = false;
      this.toggleGroupVisibility(this.layers[0])
      this.toggleGroupVisibility(this.layers[2])
      this.toggleGroupVisibility(this.layers[3])
      this.toggleGroupVisibility(this.layers[4])
    }
    if (group.header == 'Conservation Values' && group.expanded == true){
      this.layers[1].expanded = false;
      this.layers[2].expanded = false;
      this.layers[3].expanded = false;
      this.layers[4].expanded = false;
      this.toggleGroupVisibility(this.layers[1])
      this.toggleGroupVisibility(this.layers[2])
      this.toggleGroupVisibility(this.layers[3])
      this.toggleGroupVisibility(this.layers[4])
    }
    //update state overlays
    this.filterStateOverlays()
  },
  //turns off subgroup layers when group is toggled
  toggleGroupVisibility(group){
    let map = document.querySelector("arcgis-map").map;
    group.subheaders.forEach(subheader => {
      console.log(group)
      let visible = group.expanded
      subheader.visible = visible
      subheader.expanded = true
      subheader.sublayers.forEach(layer => {
        let sublayer = map.findLayerById(layer.elid);
        if(layer.elid.slice(0, 5) === 'cjest'){
          sublayer = map.findLayerById('cjest')
        }
        
        if(layer.filter){
        console.log('setting visibility for ' + layer.elid + ' to ' + visible)
        sublayer.visible = visible
        }

        layer.visibleModel = visible
        layer.visible = visible
        
      })
    })
  },
  //sets subgroup layer visibility (first checkbox)
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
    console.log(elid)
    console.log(layer)
    layer.visible = checked
  },
  //sets opacity
  setSublayerOpacity(elid, opacity){
    let map = document.querySelector("arcgis-map").map;
    let id = elid;
    if(elid.includes('cjest')){
      id = 'cjest'
    }
    let layer = map.findLayerById(id);
    layer.opacity = opacity
  },
  //filter layers
  filterLayers(cat){
    console.log(cat)
    this.category = cat
    let map = document.querySelector("arcgis-map").map;
    if (this.category == 'floating solar'){
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
    this.filterStateOverlays()
  },

  //these were used for the reporting these will all be updated
  //function to create the buffer
  // --- module scope (top of the store file) ---


  async createBuffer (e){
    if (e == 'current'){
    
      e = this.currentPoint
      console.log(e)
    }
    if(this.bufferSize > 36){
      alert('Buffer size cannot exceed 35 miles')
      return
    }
    const polySymbol = {
      type: 'simple-fill',
      color: [255, 255, 255, 0.3],
      outline: { color: [0, 0, 0, 0.5], width: 2 },
    }
    const pointSymbol = {
      type: 'simple-marker',
      color: [255, 0, 0],
      outline: { color: [255, 255, 255], width: 1 },
      size: 7,
    }

    const point = e.detail.mapPoint          // comes in as the map SR (Web Mercator)
    const ALBERS = new SpatialReference({ wkid: 5070 }); // NAD83 / Conus Albers
    this.currentPoint = e

    let map = document.querySelector("arcgis-map").map;
    let pointLayer  = map.findLayerById('pointLayer')
    let bufferLayer = map.findLayerById('bufferLayer')

    // point marker stays in the map's SR — fine for display
    if (pointLayer.graphics.length === 0) {
      pointLayer.add(new Graphic({ geometry: point, symbol: pointSymbol }))
    } else {
      pointLayer.graphics.getItemAt(0).geometry = point
    }

    // --- project the click to NAD83 / Conus Albers (5070) for honest area/distance ---
    if (!projectOperator.isLoaded()) {
      await projectOperator.load()
    }
    const pointAlbers = projectOperator.execute(point, ALBERS)

    // buffer in 5070 (equal-area) — distance still specified in miles
    const buffer = bufferOperator.execute(pointAlbers, this.bufferSize, { unit: 'miles' })

    if (bufferLayer.graphics.length === 0) {
      bufferLayer.add(new Graphic({ geometry: buffer, symbol: polySymbol }))
    } else {
      bufferLayer.graphics.getItemAt(0).geometry = buffer
    }

    this.getHistogram(buffer)   // buffer is now in 5070
    this.getIntersections(buffer)
    //zoom to buffer
    // at the end of createBuffer, after adding the buffer graphic:
  const view = document.querySelector("arcgis-map").view
  const padded = buffer.extent.clone().expand(1.3)

  view.goTo(
    { target: padded },
    { duration: 800, easing: "ease-in-out" }
  ).catch((err) => {
    // goTo rejects if interrupted by user interaction — safe to ignore
    if (err.name !== "AbortError") console.error(err)
  })

  },
  
  
    // Robust bin lookup — works whether min is 0, 0.5, -0.5, etc.
    sumValidPixels(hist) {
  if (!hist || !hist.counts?.length) return 0
  const binWidth = (hist.max - hist.min) / hist.size
  let total = 0
  hist.counts.forEach((count, idx) => {
    // value at the center of this bin
    const value = hist.min + (idx + 0.5) * binWidth
    if (Math.round(value) !== 0) total += count   // skip only the NoData / 0 bin
  })
  return total
},
  countForValue(hist, value) {
      if (!hist || !hist.counts?.length) return 0
      const binWidth = (hist.max - hist.min) / hist.size
      const idx = Math.floor((value - hist.min) / binWidth)
      return hist.counts[idx] ?? 0
    },
  async getHistogram(buffer) {
    
    const rasters = [

      { name: 'Bats_10_Final_02_NoCA_5070', elid: 'bats', values: [1,2] },
      { name: 'BigGame_08_NoCA_5070', elid: 'bigGameSolar', values: [1]},
      { name: 'Birds_05_NoCA_5070', elid: 'birds', values: [1] },
      { name: 'IntactHabitats_HMI200_20260518_NoCA_R_5070', elid: 'landscapeIntactness', values: [2] },
      { name: 'Migratory_Bird_Stopover_NoCA_5070', elid: 'migratoryBirdStopoverWind', values: [1] },
      { name: 'PrairieGrouseA_5070', elid: 'prairieGrouse', values: [1] },
      { name: 'ProtectedAreas_01_Final_NoCA_5070', elid: 'protectedAreas', values: [1] },
      { name: 'RCN_NoCal_20260728_5070_new', elid: 'resilientConnected', values: [1,2,3]},
      { name: 'TE_Species_03_20260630_NoCA_5070', elid: 'threatenedEndangeredSpecies', values: [1] },
      { name: 'Water_02_reclass_20260630_NoCA_5070', elid: 'floodPlainsWetlands', values: [1] },
      { name: 'WhoopingCraneSolar_20260408_NoCA_R_5070', elid: 'whoopingCraneSolar', values: [2] },
      { name: 'WhoopingCraneWind_20260408_NoCA_R_5070', elid: 'whoopingCraneWind', values: [1] },
      { name: 'abanDef2_rec_ur_5070_new', elid: 'abandonedag', values: [1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001, 2002, 2003, 2004, 2005, 2006, 2007,2008,2009,2010,2011,2012,2013,2014]},
      { name: 'pvr_val_2_GT_5070_new', elid: 'ag2', values: [2]},
      { name: 'pvr_val_3_GT_5070_new', elid: 'ag3', values:[3]},
      { name: 'pvr_val_4_GT_5070_new', elid: 'ag4', values:[4]},
    
    ]

    const map = document.querySelector('arcgis-map').map
    const imageLayer = map.findLayerById('imageLayer')
    this.reportLoading = true

    const radiusMeters = this.bufferSize * 1609.344     // miles → meters
    const bufferAreaM2 = Math.PI * radiusMeters * radiusMeters
    this.reportBufferAreaHa = +(bufferAreaM2 / 10000).toFixed(2)
    this.reportBufferAreaAc = +(bufferAreaM2 / 4046.8564224).toFixed(2)

    const PIXEL_SIZE   = 30
    const PIXEL_M2     = PIXEL_SIZE * PIXEL_SIZE   // 900   ← this is m², the value you're seeing
    const HA_PER_PIXEL = PIXEL_M2 / 10000          // 0.09  ✅ hectares
    const AC_PER_PIXEL = PIXEL_M2 / 4046.8564224   // 0.2224 acres
    const ALBERS=new SpatialReference({ wkid: 5070 }) // NAD83 / Conus Albers
    console.log('HA_PER_PIXEL =', HA_PER_PIXEL)  // should be 0.09

    
    const tasks = rasters.map(async ({ name, elid, values }) => {
      const valueList = Array.isArray(values) ? values : values != null ? [values] : [1]
      const mosaicRule = new MosaicRule({
        method: 'attribute',
        where: `Name = '${name}'`,        // use .name, not the object
        operation: 'first'
      })

      const params = new ImageHistogramParameters({
        geometry: buffer,                  // already in 5070
        mosaicRule,
        pixelSize: { x: PIXEL_SIZE, y: PIXEL_SIZE, spatialReference: ALBERS },
        renderingRule: null
      })

      try {
        const res = await imageLayer.computeStatisticsHistograms(params)
        const hist = res.histograms?.[0]

        // Total valid pixels = sum of all bins (NoData already excluded)
      // instead of: const pixelCount = hist?.counts?.reduce((a, b) => a + b, 0) ?? 0
       

        // Per-value breakdown (some rasters use 1, some use 2)
    // per-value breakdown for THIS raster's actual values
      const byValue = {}
      let pixelCount = 0
      for (const v of valueList) {
        const pc = this.countForValue(hist, v)
        byValue[v] = {
          pixelCount: pc,
          areaHa: +(pc * HA_PER_PIXEL).toFixed(2),
          areaAc: +(pc * AC_PER_PIXEL).toFixed(2),
        }
        pixelCount += pc          // total = sum of all this raster's values
      }
        console.log(elid, hist)
        return [elid, {
          ok: true,
          error: null,
          elid,
          rasterName: name,              // keep for debugging/traceability
          pixelCount,
          areaHa: +(pixelCount * HA_PER_PIXEL).toFixed(2),
          areaAc: +(pixelCount * AC_PER_PIXEL).toFixed(2),
          byValue,
          min: hist?.min ?? null,
          max: hist?.max ?? null
        }]
        
      } catch (err) {
        console.error(`Histogram failed for ${name} (${elid})`, err)
        return [elid, {
          ok: false,
          error: err.message,
          elid,
          rasterName: name,
          pixelCount: 0,
          areaHa: 0,
          areaAc: 0,
          byValue: { 1: { pixelCount: 0, areaHa: 0 }, 2: { pixelCount: 0, areaHa: 0 } },
          min: null,
          max: null
        }]
      }
    })

    const entries = await Promise.all(tasks)
    const reportResults = Object.fromEntries(entries)   // keyed by elid

    // 1) keep the full structured result in the store
    this.reportResults = reportResults
    this.reportGeneratedAt = Date.now()

    // 2) push areas onto the matching sublayers so the report renders unchanged
    this.applyResultsToLayers(reportResults)

    this.reportLoading = false
    return reportResults
  },
  applyResultsToLayers(reportResults) {
    this.layers.forEach((group) => {
      group.subheaders?.forEach((subheader) => {
        subheader.sublayers?.forEach((sublayer) => {
          const r = reportResults[sublayer.elid]
          if (!r) {
            sublayer.totalArea = 0
            sublayer.intersected = false
            sublayer.count = 0
            return
          }
          // raster layers
          if (r.areaHa != null) {
            sublayer.totalArea = r.areaHa
            sublayer.intersected = r.areaHa > 0
          }
          // vector/point layers
          if (r.summaryType) {
            sublayer.summaryType = r.summaryType
            sublayer.count = r.count ?? 0
            sublayer.intersected = r.intersected ?? false
          }
        })
      })
    })
  },

  fetchRasterIds() {
    const imageServerUrl =
      'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/Compass_MosaicRasters_Albers/ImageServer'


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

  //gets agol data for report
  async getIntersections(buffer) {
  const layers =  [
    {
      name: 'High Quality Watersheds', elid: 'qualitywater', 
      featureUrl: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/6',
      summaryType: 'boolean'
    },
  { name: 'Surface Water Limited Lands', elid: 'waterLimited',
    featureUrl: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_WaterLimitedLands_VTL/FeatureServer/0',
    summaryType: 'boolean' },

  { name: 'Former Mine Lands', elid: 'abandonedmines',
    featureUrl: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/7',
    summaryType: 'count' },

  { name: 'Brownfields over 10 acres', elid: 'brownfields',
    featureUrl: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/8',
    summaryType: 'count' },
  
  {name: 'Native Lands', elid: 'nativeLands',
    featureUrl: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/SRR_AGOL_Vector/FeatureServer/9',
    summaryType: 'boolean'
  },

 { name: 'Community Considerations',
  featureUrl: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/CJEST_SRR_VTL/FeatureServer/0',
  summaryType: 'attributes',
  fields: [
    { elid: 'cjest_workforce',      field: 'N_WKFC_91' },
    { elid: 'cjest_water',          field: 'N_WTR_EOMI' },
    { elid: 'cjest_transportation', field: 'N_TRN_EOMI' },
    { elid: 'cjest_pollution',      field: 'N_PLN_EOMI' },
    { elid: 'cjest_housing',        field: 'N_HSG_EOMI' },
    { elid: 'cjest_health',         field: 'N_HLTH_90' },
    { elid: 'cjest_energy',         field: 'N_ENY_EOMI' },
    { elid: 'cjest_climate',        field: 'N_CLT_EOMI' },
  ],
  whereQueries: [
    { elid: 'cjest_lowincome', where: 'P200_I_PFS <= 0.2' }, // ← percentile, server-filtered
  ],
}
]

  this.intersectLoading = true

  const tasks = layers.map(async (cfg) => {
    const featureLayer = new FeatureLayer({ url: cfg.featureUrl })

    try {
      // --- COUNT / BOOLEAN: just need how many features intersect ---
      if (cfg.summaryType === 'count' || cfg.summaryType === 'boolean') {
        const count = await featureLayer.queryFeatureCount({
          geometry: buffer,               // 5070 — server projects automatically
          spatialRelationship: 'intersects',
        })
        console.log({
          ok: true,
          error: null,
          elid: cfg.elid,
          name: cfg.name,
          summaryType: cfg.summaryType,
          intersected: count > 0,
          count,                          // meaningful for 'count', still handy for 'boolean'
        })
        const result = {
          ok: true,
          error: null,
          elid: cfg.elid,
          name: cfg.name,
          summaryType: cfg.summaryType,
          intersected: count > 0,
          count,                          // meaningful for 'count', still handy for 'boolean'
        }
        return [[cfg.elid, result]]       // wrapped in array for flatMap below
      }

      // --- ATTRIBUTES (Community Considerations): one query, fan out to sub-elids ---
// --- ATTRIBUTES (Community Considerations) ---
if (cfg.summaryType === 'attributes') {
  const fieldNames = cfg.fields.map((f) => f.field)

  // 1) single query → fan out the 8 boolean fields (value == 1)
  const res = await featureLayer.queryFeatures({
    geometry: buffer,
    spatialRelationship: 'intersects',
    returnGeometry: false,
    outFields: fieldNames,
  })
  const feats = res.features || []

  const fieldResults = cfg.fields.map((f) => {
    const isTrue = feats.some((feat) => Number(feat.attributes[f.field]) === 1)
    return [f.elid, {
      ok: true, error: null, elid: f.elid, name: cfg.name,
      summaryType: 'boolean', intersected: isTrue, count: isTrue ? 1 : 0,
    }]
  })

  // 2) separate where-based count query per special field (e.g. percentile)
  const whereResults = await Promise.all(
    (cfg.whereQueries || []).map(async (wq) => {
      const count = await featureLayer.queryFeatureCount({
        geometry: buffer,
        spatialRelationship: 'intersects',
        where: wq.where,               // server filters out null/off values
      })
      return [wq.elid, {
        ok: true, error: null, elid: wq.elid, name: cfg.name,
        summaryType: 'boolean', intersected: count > 0, count,
      }]
    })
  )

  return [...fieldResults, ...whereResults]   // both feed the flat() merge
}
    } catch (err) {
      console.error(`Intersection failed for ${cfg.name} (${cfg.elid || 'multi'})`, err)
      // Fail gracefully — one bad layer shouldn't blank the report
      if (cfg.summaryType === 'attributes') {
        return cfg.fields.map((f) => [f.elid, {
          ok: false, error: err.message, elid: f.elid, name: cfg.name,
          summaryType: 'boolean', intersected: false, count: 0,
        }])
      }
      return [[cfg.elid, {
        ok: false, error: err.message, elid: cfg.elid, name: cfg.name,
        summaryType: cfg.summaryType, intersected: false, count: 0,
      }]]
    }
  })

  const nested = await Promise.all(tasks)
  const intersectionResults = Object.fromEntries(nested.flat())   // flatten the fan-out

  // Merge with raster results (don't clobber) and apply to layers
  this.reportResults = { ...this.reportResults, ...intersectionResults }
  this.applyResultsToLayers(this.reportResults)

  this.intersectLoading = false
  return intersectionResults
},

  //responds to opacity slider in map, changes opacity of all layers
  changeOpacity(){
  let map = document.querySelector("arcgis-map").map;
  //let layersList = [avoid, minimize, opportunities]
  map.layers.forEach(layer => layer.opacity = this.opacity)
  },
  //these two functions respond to radio layers in toc
  changeCommunityStyle(style){
    let map = document.querySelector("arcgis-map").map;
    let layer = map.findLayerById('cjest');
    layer.loadStyle(style)
   
  },
  changeBuildoutLayer(elid){
    if(elid == 'lassoSolar'){
      let map = document.querySelector("arcgis-map").map;
      let layer = map.findLayerById(elid);
      layer.visible = true

      let layer2 = map.findLayerById('lassoWind');
      layer2.visible = false
    }
    if(elid == 'lassoWind'){
      let map = document.querySelector("arcgis-map").map;
      let layer = map.findLayerById(elid);
      layer.visible = true
      let layer2 = map.findLayerById('lassoSolar');
      layer2.visible = false
    }
  },
  //show hide state overlays with more info button 
  filterStateOverlays(){
    let map = document.querySelector("arcgis-map").map;
    let layer = map.findLayerById('states');
    //only show overlay on conservation values visible = true
    if(this.layers[0].expanded == false){
      layer.definitionExpression = "STATE_NAME = 'N/A'"
    }
    else{
       if(this.category == 'solar'){
        layer.definitionExpression = "STATE_NAME = 'Maine' or STATE_NAME = 'Georgia' or STATE_NAME = 'California'"
       } 
       if(this.category == 'wind'){
        layer.definitionExpression = "STATE_NAME = 'Maine' or STATE_NAME = 'California'"
       }
       if(this.category == 'floating solar'){
        layer.definitionExpression = "STATE_NAME = 'Maine' or STATE_NAME = 'California'"
       }
       
    }

  }

}
));
