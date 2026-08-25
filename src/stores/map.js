import { defineStore } from 'pinia';
import Graphic from '@arcgis/core/Graphic.js'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import * as bufferOperator from '@arcgis/core/geometry/operators/bufferOperator.js'
import MosaicRule from '@arcgis/core/layers/support/MosaicRule.js';
import ImageHistogramParameters from '@arcgis/core/rest/support/ImageHistogramParameters.js';
import * as projectOperator from "@arcgis/core/geometry/operators/projectOperator.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";

export const useMapStore = defineStore('mapStore', () => ({
  showHelpPanel: false,
  activeHelpElement: '', 
  selectedHelpSection: 'Highly Sensitive',
  opacity: 90,
  showOpacity: false,
  //check if this is needed, used in mapStore.showDemo = true
  showDemo: false,
  showReportDetails: true,
  category: 'solar',
  bufferSize: 1,
  currentPoint: '',
  currentMapExtent: '',
  checkboxHideSplash: false,
  reportBufferAreaHa: '',
  reportBufferAreaAc: '',
  statePolicy: null,
  reportResults: [],
  reportLoading: false,
  reportGeneratedAt: null,
  
  /*old layers*/
  /*layers: [
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
  {header: 'Agricultural Considerations' , id: 'agriculture', expanded: false, 
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
  ],*/
  /*cleaned layers*/

  //layers object used in layer list control and reporting
  layers: [
  {
    header: 'Conservation Values', id: 'avoid', expanded: false,
    subheaders: [
      {
        title: 'Highly Sensitive', id: 'high', visible: true, visibleModel: true, expanded: false, subheaderBlurb: 'This category includes wildlife, habitats and ecosystems to consider during wind and solar planning.', subheaderLayerBlurb: 'This category includes wildlife, habitats and ecosystems to consider during wind and solar planning.',
        sublayers: [
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
            infoAbout: `This layer presents the <a href="https://www.usgs.gov/programs/gap-analysis-project/science/pad-us-data-overview?qt-science_center_objects=0" target="_blank">U.S. Geological Survey’s Protected Areas database</a>, a national inventory of U.S. terrestrial protected areas that are dedicated to the preservation of biological diversity and other natural, recreational and cultural uses, and are managed for these values through legal or other means. It includes federal, state and local lands that are protected or managed for conservation purposes, such as national parks, national wildlife refuges, and most Bureau of Land Management land (e.g., BLM Areas of Critical Conservation Concern). We also included the <a href="https://www.conservationeasement.us/" target="_blank">National Conservation Easement Database</a> for additional areas protected by public agencies, private land trusts (including TNC preserves) and other organizations, and additional state-specific data as appropriate. For a detailed list of data sources, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `Development in these areas is generally restricted through legal protection. While renewable energy deployment is not always prohibited—for example, some projects may be permitted on federal lands with appropriate approvals (e.g., <a href="https://gbp-blm-egis.hub.arcgis.com/datasets/1d98d82820df49e5916aeb79837b69ab/about" target="_blank">Bureau of Land Management's 11-state solar planning area</a>; Department of Energy lands)—the regulatory complexity and high conservation value of these areas may present additional considerations or constraints for development.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: "This layer presents the <a href='https://www.usgs.gov/programs/gap-analysis-project/science/pad-us-data-overview?qt-science_center_objects=0#qt-science_center_objects' target='_blank'>US Geological Survey’s Protected Areas database</a>, a national inventory of U.S. terrestrial protected areas that are dedicated to the preservation of biological diversity and other natural, recreation and cultural uses, managed for these purposes through legal or other effective means. It includes all Federal and most State and local lands. We also included the <a href='https://www.conservationeasement.us/' target='_blank'>National Conservation Easement Database</a> for additional areas protected by agencies, land trusts (including TNC preserves), and other organizations, and additional state-specific data as appropriate.",
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
            infoAbout: `This layer identifies floodplains, rivers, open water and wetlands across the landscape. The data come from the <a href="https://www.fws.gov/program/national-wetlands-inventory" target="_blank">U.S. Fish and Wildlife Service National Wetlands Inventory</a> and Fathom’s modeled 1-in-20-year fluvial (river) and pluvial (rainfall-driven) floodplains. The layer also depicts <a href="https://codefornature.projects.earthengine.app/view/global-gde" target="_blank">groundwater-dependent ecosystems</a> for the western U.S., which are often biodiversity hotspots that support rare species. For a detailed list of data sources, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `Together, these data highlight where water systems support areas of high biodiversity and ecological function. Floodplains, wetlands and groundwater-fed systems provide critical habitat for fish and wildlife, support migratory birds and help reduce flood risk by slowly storing and releasing water.<br/><br/>Development near wetland complexes and riparian corridors may alter water flow or fragment habitat. Groundwater-dependent ecosystems are particularly susceptible to development because land use changes can disrupt the natural water supply that supports these biodiversity hotspots.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. The areas displayed could be appropriate for wind and solar development, as many impacts can be avoided, minimized or addressed through thoughtful project design, operations and mitigation measures. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
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
            title: 'Biodiversity, Resilience and Flow',
            infoAbout: `The Nature Conservancy’s Resilient and Connected Network analysis depicts areas with recognized biodiversity value and high resilience that are important for sustaining species and natural wildlife habitats in a changing climate (<a href="https://www.pnas.org/doi/10.1073/pnas.2204434119" target="_blank">Anderson et al. 2023</a>). These sites include representative geophysical environments and microclimates with relatively low levels of human modification, which comprise a network of lands most likely to retain biodiversity and ecosystem function in an altered climate. “Resilient, Biodiverse Areas” are sites with confirmed high levels of biodiversity that are resilient to climate change and may be valuable for connectivity. “Connectivity Pinch-points” are resilient but geographically restricted areas critical to facilitating the movement of species in response to changes in climate. “Coastal Migration Space” includes low-lying coastal land that is potentially suitable for supporting tidal habitats in the future, as sea levels rise. We excluded diffuse areas without biodiversity as these sites may be suitable for renewable energy development (<a href="https://www.maps.tnc.org/resilientland/" target="_blank">see the Resilient Land Mapper</a>). For more details, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `The Resilient and Connected Network analysis identifies and prioritizes landscapes that are most likely to sustain biodiversity over time, not just today. As a result, they represent some of the highest priority landscapes for long-term biodiversity conservation. Focusing on areas that are both climate-resilient and well-connected helps ensure that species can persist and move in response to changing conditions. TNC prioritizes conservation investments in these areas to support biodiversity conservation not just now, but in the face of a changing climate. Wind and solar development in these areas may affect habitat connectivity and ecological function, disrupting their ability to support biodiversity over the long term.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. The areas displayed could be appropriate for wind and solar development, as many impacts can be avoided, minimized, or addressed through thoughtful project design, operations and mitigation measures. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'Over the next century, climate change is expected to drive shifts in species ranges and increase stressors to natural ecosystems. To identify areas important to sustaining species and natural communities in a changing climate, we mapped the Resilient and Connected Network, including all areas with resilience and concentrated or diffuse flow, with or without recognized biodiversity. These sites include representative geophysical environments and microclimates with relatively low levels of human modification, which comprise a network of lands most likely to retain biodiversity and ecosystem function in altered climate conditions (<a href="https://www.pnas.org/doi/10.1073/pnas.2204434119" target="_blank">Anderson et al. 2023</a>).',
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
            infoAbout: `This layer depicts habitat for many terrestrial species that are federally listed as threatened or endangered, including <a href="https://ecos.fws.gov/ecp/report/critical-habitat" target="_blank">critical habitat</a> delineated by the U.S. Fish and Wildlife Service and Nature Serve’s “<a href="https://www.arcgis.com/home/item.html?id=6a41c957ed584ce4be8ccb71a2131116" target="_blank">Areas of Unprotected Biodiversity Importance</a>.” Also shown are current/recent species distributions, modeled priority habitats and occurrence records for at-risk species that are known to be sensitive to wind and/or solar infrastructure (e.g., gopher tortoise, pygmy rabbit, dune sagebrush lizard). For a detailed list of data sources, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>. Note that whooping crane and grouse habitat are displayed in other layers, due to their high sensitivity to wind and solar development.`,
            infoWhy: `Imperiled species often occur in small, fragmented populations and depend on specialized habitats, making them particularly sensitive to habitat loss, fragmentation or disturbance. This layer includes both broad indicators of threatened and endangered species, such as federally designated critical habitat and species diversity models, and selected datasets for species that are sensitive to the unique structural characteristics of wind or solar development, such as tall structures or large fenced areas. Additional land conversion and infrastructure can degrade or divide the limited habitats these species depend on (e.g., sandy uplands, intact shrublands, or dune systems), further isolating populations and reducing their ability to persist.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. The areas displayed could be appropriate for wind and solar development, as many impacts can be avoided, minimized or addressed through thoughtful project design, operations and mitigation measures. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: "Energy and infrastructure development are among the most significant threats to imperiled species in the U.S. We identified federally listed threatened and endangered species that are at-risk from renewable energy development due to their habitat and life history requirements (e.g., gopher and desert tortoise, golden-cheeked warbler, Preble's jumping mouse; full species list available in methods paper.), and then mapped locations of current/recent distributions, modeled priority habitats, and occurrence records. We also included <a href=\"https://ecos.fws.gov/ecp/report/critical-habitat\" target=\"_blank\">critical habitat</a> delineated by the U.S. Fish and Wildlife Service.",
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
            title: 'Prairie and Sage Grouse',
            infoAbout: `This layer depicts important habitat for the following prairie and sage grouse species: Attwater’s prairie-chicken (Endangered; <i>Tympanuchus cupido attwateri</i>), Columbian sharp-tailed grouse (<i>T. phasianellus columbianus</i>), greater prairie-chicken (<i>T. cupido</i>), greater sage-grouse (<i>Centrocercus urophasianus</i>), Gunnison sage-grouse (Threatened; <i>C. minimus</i>), lesser prairie-chicken (<i>T. pallidicinctus</i>) and plains sharp-tailed grouse (<i>T. phasianellus jamesi</i>). For a detailed list of data sources, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `Grouse species in the U.S. have experienced substantial population declines since the early 20th century and may be further threatened by improperly sited wind or solar development. They rely on large, intact habitats and are sensitive to disturbance, often avoiding human activity and structures, including wind turbines and other tall structures. Their breeding system makes them especially vulnerable because they gather at specific sites called leks year after year, and disturbance near these breeding areas can affect habitat use and population persistence.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. The areas displayed could be appropriate for wind and solar development, as many impacts can be avoided, minimized or addressed through thoughtful project design, operations and mitigation measures. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'Grouse species in the central U.S. have experienced substantial population declines since the early 20th century and may be further threatened by improperly sited energy development. To prevent grouse displacement, we mapped important habitat for the following species: Attwater’s prairie-chicken (Tympanuchus cupido attwateri), Columbian sharp-tailed grouse (T. phasianellus columbianus), greater prairie-chicken (T. cupido), greater sage-grouse (Centrocercus urophasianus), Gunnison sage-grouse (C. minimus), lesser prairie-chicken (T. pallidicinctus), and plains sharp-tailed grouse (T. phasianellus jamesi).',
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
            title: 'Whooping Cranes',
            infoAbout: `The federally endangered whooping crane, which has a current population of approximately 500 individuals, depends on wetlands in the central Great Plains during migration. In this layer, we display important whooping crane habitat including stopover sites, modeled suitable habitat, designated critical habitat and breeding areas. We delineated areas within 400 meters for solar development and 5 kilometers for wind development of whooping crane critical habitats and stopover sites as highly sensitive. For a detailed list of data sources, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `Whooping cranes may be displaced from otherwise suitable habitat near wind and solar infrastructure as they avoid areas around turbines, effectively reducing available stopover sites along migration routes. They may also face collision risk with tall structures during migration or while moving between roosting and foraging areas, particularly under low-visibility conditions. Although direct impacts of solar facilities on whooping cranes are less well understood, conversion or degradation of the limited wetlands and other stopover habitats they rely on may warrant additional consideration because of the species’ dependence on these habitats during migration.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. The areas displayed could be appropriate for wind and solar development, as many impacts can be avoided, minimized, or addressed through thoughtful project design, operations and mitigation measures. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'The federally endangered whooping crane (Grus americana), which has a current population of approximately 500 individuals, depends on wetlands in the central Great Plains during migration. Whooping cranes exhibit aversion to wind turbines and may be displaced from suitable habitats near wind and solar energy infrastructure. In addition, whooping cranes may be at risk of turbine collisions in low light conditions when ascending or descending from high altitude migration flights, or when travelling between roost and foraging areas. To address these concerns, we delineated areas within 400 meters and 5 km of whooping crane critical habitats and stopover sites to be avoided by solar and wind development, respectively. ',
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
            title: 'Whooping Cranes',
            infoAbout: `The federally endangered whooping crane, which has a current population of approximately 500 individuals, depends on wetlands in the central Great Plains during migration. In this layer, we display important whooping crane habitat including stopover sites, modeled suitable habitat, designated critical habitat and breeding areas. We delineated areas within 400 meters for solar development and 5 kilometers for wind development of whooping crane critical habitats and stopover sites as highly sensitive. For a detailed list of data sources, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `Whooping cranes may be displaced from otherwise suitable habitat near wind and solar infrastructure as they avoid areas around turbines, effectively reducing available stopover sites along migration routes. They may also face collision risk with tall structures during migration or while moving between roosting and foraging areas, particularly under low-visibility conditions. Although direct impacts of solar facilities on whooping cranes are less well understood, conversion or degradation of the limited wetlands and other stopover habitats they rely on may warrant additional consideration because of the species’ dependence on these habitats during migration.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. The areas displayed could be appropriate for wind and solar development, as many impacts can be avoided, minimized, or addressed through thoughtful project design, operations and mitigation measures. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'The federally endangered whooping crane (Grus americana), which has a current population of approximately 500 individuals, depends on wetlands in the central Great Plains during migration. Whooping cranes exhibit aversion to wind turbines and may be displaced from suitable habitats near wind and solar energy infrastructure. In addition, whooping cranes may be at risk of turbine collisions in low light conditions when ascending or descending from high altitude migration flights, or when travelling between roost and foraging areas. To address these concerns, we delineated areas within 400 meters and 5 km of whooping crane critical habitats and stopover sites to be avoided by solar and wind development, respectively.  ',
          },
          {
            index: 9,
            mapIndex: 10,
            elid: 'qualitywater',
            filter: true,
            visible: false,
            visibleModel: false,
            opacity: 0.9,
            category: 'floating solar',
            title: 'High Quality Watersheds (Floating solar only)',
            infoAbout: `This layer represents highly resilient and biodiverse watershed areas from TNC’s Freshwater Resilience and Resilient and Connected Network analyses (<a href="https://crcs.tnc.org/pages/frcn" target="_blank">Anderson et al. 2024</a>). This area covers 20.6% of the conterminous United States. This layer is only provided for floating solar technology; for wind and solar, see the layer entitled “Floodplains, Wetlands and Groundwater-fed Ecosystems” for relevant freshwater data. For more details, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `Floating solar in highly resilient and biodiverse areas could potentially alter habitat conditions and ecosystem processes in ways that may affect aquatic species. However, these impacts are not well understood, and available evidence suggests that ecological responses are highly site-specific and variable. Given this uncertainty and limited body of research, users may wish to carefully evaluate potential impacts in high-value watershed systems when considering floating solar development.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. The areas displayed could be appropriate for floating solar development, as many impacts can be avoided, minimized or addressed through thoughtful project design, operations and mitigation measures. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'This layer represents highly resilient and biodiverse watershed areas, containing lakes and ponds, from TNC’s Freshwater Resilience and Resilient and Connected Network (RCN) analyses (<a href="https://crcs.tnc.org/pages/frcn" target="_blank">Anderson et al. 2024</a>). This area covers 20.6% of the conterminous United States.',
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
            title: 'Big Game (Elk, Mule Deer, Moose, and Pronghorn Antelope) (solar only)',
            infoAbout: `This layer shows mapped migration routes for elk, mule deer, moose and pronghorn antelope across the western U.S. It includes annual ranges, migration corridors, stopover areas and winter ranges from the <a href="https://apps.usgs.gov/western-migrations/" target="_blank">U.S. Geological Survey Western Migrations</a> dataset, supplemented with additional data from wildlife agencies in North Dakota, Montana and New Mexico. Together, these data highlight the pathways and habitats that big game species rely on throughout the year. These data are not comprehensive, and wildlife agencies continue to collect tracking data for these migrating species. For a detailed list of data sources, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `Big game animals are an important part of a healthy, functioning ecosystem. They also play a significant role in local economies and cultures across the West. For many Tribal Nations, big game are also deeply connected to cultural traditions and ways of life.<br/><br/>These animals depend on large, connected landscapes to move between seasonal habitats. These habitats provide the food, breeding areas and shelter they need to survive, including protection from harsh winter conditions. Impediments to migration, such as fencing around solar developments, can fragment the landscape and influence how these animals move. Over time, disruptions to movement can affect feeding, breeding and overall population health.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. The areas displayed could be appropriate for solar development, as many impacts can be avoided, minimized or addressed through thoughtful project design, operations and mitigation measures. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: "Energy development may alter the movement of big game animals and increase rates of mortality, particularly along migration routes and in winter ranges. This layer includes migration areas for elk, mule deer, and pronghorn antelope across the Western United States, including annual ranges, corridors, stopovers, and winter ranges <a href='https://westernmigrations.net/' target='_blank'>(US Geological Survey Western Migrations)</a>, supplemented with state-specific data from North Dakota, Montana, and New Mexico state wildlife agency data.",
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
            title: 'Bats (Wind only)',
            infoAbout: `This layer represents the presence of bats, using data on both roost locations and acoustic detections from the <a href="https://www.nabatmonitoring.org/" target="_blank">North America Bat Monitoring Program</a>. Also depicted are Indiana bat forest habitats, northern long-eared bat maternity roosts and/or hibernacula, bonneted bat habitat and maternity roosts for Mexican free-tailed bats. Species that are federally listed as threatened or endangered are shown in blue, while unlisted species are shown in gray. For a detailed list of data sources, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.<br/><br/>Together, these data provide a broad picture of where bats have been observed to live, forage and migrate. They should be used in concert with other data layers in the Compass that depict intact wildlife habitat (e.g., Resilient and Connected Network, Landscape Intactness). Because the available bat data are presence-only, they don’t tell us how likely bats are to occur in unsampled areas or how frequently they use a site, which makes it difficult to estimate true risk. A reliable, nationwide assessment that combines species occurrence, rarity and collision risk with wind turbines is not currently available.`,
            infoWhy: `Bats provide essential ecosystem benefits—such as controlling insect populations, supporting agriculture and contributing to healthy ecosystems. Bats are vulnerable to wind energy development due to direct strikes, particularly because they gather in large numbers and may be attracted to turbines. Since bats have low reproductive rates, even small increases in adult mortality can have disproportionate population impacts.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. The areas displayed could be appropriate for wind development, as many impacts can be avoided, minimized or addressed through thoughtful project design, operations and mitigation measures. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: "Bat mortality has been documented at wind energy facilities across North America. Because bats concentrate in large numbers and have low reproductive rates, the viability of their populations is particularly vulnerable to adult mortality events. Therefore, caution is warranted when undertaking any activity that may adversely affect known bat populations. <br/><br/> To represent bat presence, we display roost and detection data (via acoustical recorders) collected from every state via the <a href='https://www.nabatmonitoring.org/' target='_blank'>North America Bat Monitoring Program.</a> Threatened and endangered species are shown in blue, non-listed species in gray. These areas on the map may pose a particular threat to bats from wind."
          },
        ],
      },
      {
        title: 'Moderately Sensitive', id: 'moderate', visible: true, visibleModel: true, expanded: false, subheaderBlurb: 'This category includes wildlife, habitats and ecosystems to consider during wind and solar planning.',
        sublayers: [
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
            infoAbout: `To delineate discrete patches of relatively undisturbed natural landcover, we used a human modification model (<a href="https://www.nature.com/articles/s41597-025-04892-2" target="_blank">Theobald 2022</a> data using a 1-kilometer radius moving window and selected areas with HM index values less than 0.2). We then eliminated areas fragmented by oil and natural gas development, defined as sites with 1.5 active wells per square kilometer or greater. We also excluded lands in the Great Plains bioregion altered by past tillage or other landscape disturbances (Ostlie 2003). Finally, we added core forest and core wetland areas to capture additional functionally intact habitats in heavily cultivated ecoregions of Illinois, Indiana, Iowa, Michigan, Minnesota, Missouri and Ohio. For a detailed list of data sources, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `Remaining intact landscapes provide the basis for long-term viability of many species of conservation concern. These areas support essential ecological processes, such as movement, gene flow and the pattern of fires, storms and other disturbances, that can be disrupted by wind and solar infrastructure, roads and transmission corridors. They also help maintain large, connected habitat blocks that are less fragmented and better able to absorb development pressures. Siting wind and solar projects in these areas can disproportionately reduce habitat quality and connectivity.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. The areas displayed could be appropriate for wind and solar development, as many impacts can be avoided, minimized, or addressed through thoughtful project design, operations and mitigation measures. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'Remaining intact landscapes provide the basis for long-term viability of many species of conservation concern. To delineate discrete patches of relatively undisturbed natural landcover for renewable energy avoidance, we used a human modification model (<a href="https://www.nature.com/articles/s41597-025-04892-2" target="_blank">Theobald 2022</a> data using a 1 km radius moving window and selected areas with HM index values less than 0.2). We then eliminated areas fragmented by oil and natural gas development, defined as sites with 1.5 active wells per km2 or greater.  <br/><br/> We also excluded lands in the Great Plains bioregion altered by past tillage or other landscape disturbances (Ostlie 2003). Finally, we added core forest and core wetland areas to capture additional, functionally intact habitats in Illinois, Indiana, Iowa, Michigan, Minnesota, Missouri, and Ohio.',
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
            title: 'Birds at Risk from Wind (Wind only)',
            infoAbout: `We include golden eagle nest data, ferruginous hawk presence and prairie dog complexes to account for raptor presence. To represent waterbird presence, we include playas, prairie potholes and other wetlands important to birds (<a href="https://whsrn.org/whsrn-sites/map-of-sites/" target="_blank">Western Hemisphere Shorebird Reserve Network sites, Global Important Bird Areas, Ramsar Convention Wetlands</a>). These datasets are best interpreted as indicators of important habitat, as many are based on expert delineation of habitat value rather than modeled or observed presence data. For a detailed list of data sources, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `Raptors, waterbirds and other large-bodied species may be particularly vulnerable to wind development due to both collision risk and sensitivity to disturbance. These species often fly at heights that overlap with the height of turbine blades or associated infrastructure, and their large size, flight behavior and limited maneuverability can increase the likelihood of collisions. Many also have long lifespans and low reproductive rates, so even small increases in adult mortality can have disproportionate population impacts. In addition, turbines can displace these species from otherwise suitable habitat, reducing available breeding, foraging or migratory stopover areas.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. The areas displayed could be appropriate for wind development, as many impacts can be avoided, minimized or addressed through thoughtful project design, operations and mitigation measures. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'Raptors, waterbirds, and other large species may be injured or killed by collisions with wind turbines, and rates of mortality at commercial wind facilities may be underestimated due to lack of rigorous monitoring and reporting. We include golden eagle nest data, ferruginous hawk presence, and prairie dog complexes to account for raptors. To represent waterbirds, we include playas, prairie potholes, and other wetlands important to birds <a href="https://whsrn.org/whsrn-sites/map-of-sites/" target="_blank">(Western Hemisphere Shorebird Reserve Network sites, Global Important Bird Areas, Ramsar Convention Wetlands).</a>',
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
            title: 'Migratory Bird Stopover (Wind only)',
            infoAbout: `Stopover habitats are places birds feed and rest on their migratory routes. This layer highlights high-density distributions of migratory landbirds in stopover habitat across the U.S., derived from remote sensing observations of skyglow as a positive predictor of bird migration stopover density (<a href="https://www.nature.com/articles/s41467-023-43046-z" target="_blank">Horton et al. 2023</a>). Artificial light at night attracts and concentrates nocturnally migrating birds, drawing them toward illuminated, often peri-urban areas. The resulting high-density areas therefore reflect where birds accumulate rather than where high-quality habitat necessarily exists, and these lit areas may even act as ecological traps that increase migration-related mortality (<a href="https://www.nature.com/articles/s41467-023-43046-z" target="_blank">Horton et al. 2023</a>). For more details, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `Billions of migratory birds cross North America twice each year, concentrating movement along predictable flyways and stopover habitats where they are more exposed to wind energy infrastructure. Because these species travel long distances and often fly at night or in low-visibility conditions, they face elevated collision risk with turbines and associated infrastructure. In addition, disturbance or habitat loss at key stopover sites can reduce the availability of critical resting and refueling areas, potentially affecting migration success and population viability over time.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. The areas displayed could be appropriate for wind development, as many impacts can be avoided, minimized or addressed through thoughtful project design, operations and mitigation measures. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'Billions of migratory birds cross North America twice a year, putting them at risk for wind collision. Stopover habitat—places the birds feed and rest on their journey—help delineate these migratory routes. This layer highlights high-density distributions of migratory landbirds in stopover habitat across the U.S. (<a href="https://www.nature.com/articles/s41467-023-43046-z" target="_blank">Horton et al. 2023</a>). ',
          },
        ],
      },
    ],
  },
  {
    header: 'Disturbed Lands', id: 'agriculture', expanded: false,
    subheaders: [
      {
        title: 'Disturbed Lands', id: 'ag', visible: true, visibleModel: true, expanded: false, subheaderBlurb: 'Former mining and contaminated sites that are less likely to encounter environmental and community concerns.',subheaderLayerBlurb: 'Former mining and contaminated sites that are less likely to encounter environmental and community concerns.',
        sublayers: [
          {
            index: 13, elid: 'abandonedmines', filter: true, visible: false, visibleModel: false,
            opacity: 0.9, category: 'both', title: 'Former Mine Lands',  
            infoAbout: `The mine lands layer uses the best available nationwide data on mine locations (<a href="https://mrdata.usgs.gov/usmin/" target="_blank">USGS geospatial database</a>). Users are advised that the data are of inconsistent quality and better data may be available from state mining agencies. Mines in the dataset include former coal mines, silica mines, iron pits, lignite pits, open pit mines, quarries and strip mines. For more details, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `This layer identifies sites that operated as mines between 1977 and 2006, which may present an opportunity for wind and solar development after further site assessment and feasibility analysis, including evaluation of current wildlife value. Older mine sites may have recovered and could provide important conservation value, such as habitat for grassland birds. Previously disturbed lands such as former mine sites often have reduced ecological integrity and lower biodiversity compared to intact landscapes and may present opportunities for redevelopment. Siting wind and solar development on these lands may provide opportunities to meet energy goals while minimizing impacts to high-value habitats, avoiding additional fragmentation of intact ecosystems and supporting local economic development through job creation, tax revenue and investment in communities with a history of resource extraction.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'This layer identifies sites that operated as mines between 1977-2006. These sites may present an opportunity for renewable energy development after further site assessment and feasibility analysis. The mine lands layer uses the best available nationwide data on mines <a href="https://mrdata.usgs.gov/usmin/" target="_blank">(USGS geospatial database).</a> Users are advised that the data are of inconsistent quality and better data may be available from state mining agencies. Mines in the dataset include former coal mines, silica mines, iron pits, lignite pits, open pit mines, quarries, and strip mines.',
          },
          {
            index: 14, elid: 'brownfields', filter: true, visible: false, visibleModel: false, opacity: 0.9,
            category: 'both', title: 'Brownfields Over 10 Acres',  
            infoAbout: `This layer depicts sites over 10 acres that are identified as brownfields by the U.S. Environmental Protection Agency (EPA), defined as abandoned, underused, or idled commercial or industrial properties whose redevelopment or expansion may be complicated by the presence or potential presence of a hazardous pollutant. This data layer is a selection of the <a href="https://www.epa.gov/re-powering/re-powering-mapper" target="_blank">EPA’s RE-Powering America’s Land Initiative</a> data. For more details, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `Brownfields are contaminated or previously developed industrial lands that are often unsuitable for other uses and may provide little ecological value. These sites may present an opportunity for wind and solar development after further site assessment and feasibility analysis, including evaluation of current wildlife value. Siting wind and solar development on these lands may provide opportunities to meet energy goals while minimizing impacts to high-value habitats, avoiding additional fragmentation of intact ecosystems and supporting local economic development through job creation, tax revenue and investment in communities with a history of resource extraction.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'This layer depicts sites (over 10 acres) which are identified as Brownfields by the US Environmental Protection Agency (EPA), defined as abandoned, underused, or idled commercial or industrial properties whose redevelopment or expansion may be complicated by the presence or potential presence of a hazardous pollutant. These sites may present an opportunity for renewable energy development after further site assessment and feasibility analysis. This data layer is a selection of the EPA’s RE-Powering America’s Land Initiative data. ',
          },
        ],
      },
    ],
  },
  {
    header: 'Agricultural Considerations', id: 'agriculture', expanded: false,
    subheaders: [
      {
        title: 'Highest Quality Farmland', id: 'ag', visible: true, visibleModel: true, expanded: false, subheaderBlurb: 'Areas where farmland is most productive, now and in the future.', subheaderLayerBlurb: 'Areas where farmland is most productive, now and in the future.',
        sublayers: [
          {
            index: 18, elid: 'ag2', serviceId: 'rasters', filter: true, visible: true, visibleModel: false,
            opacity: 0.9, category: 'both', title: 'Highest Quality Farmland: 50-75th percentile',  
            infoAbout: `It is anticipated that 90% of utility-scale solar capacity will be installed in rural communities, much of that on farmland (<a href="https://www.energy.gov/sites/default/files/2021-09/Solar%20Futures%20Study.pdf" target="_blank">U.S. Department of Energy</a> 2021). This layer identifies the top 50 to 75% of farm and ranchland in each state based on the land’s productivity, versatility and resiliency values, as defined by the American Farmland Trust. These data are based on soil productivity and capacity, land cover and use, crop type and length of the growing season (<a href="https://farmlandinfo.org/publications/farms-under-threat-the-state-of-the-states/" target="_blank">Farms Under Threat 2020</a>).`,
            infoWhy: `Including these data helps decision-makers consider how siting decisions may intersect with farmland values, supporting an informed approach to wind and solar development. Agrivoltaics (co-location of solar and agriculture) and wind development on agricultural land may offer opportunities to maintain agricultural uses while supporting renewable energy generation (<a href="https://farmland.org/smart-solar" target="_blank">Smart Solar Principles</a>), depending on local conditions and project design.<br/><br/>As with any large-scale analysis, on-the-ground verification is required. Sites mapped as high quality based on current crop production and soil characteristics might become unproductive if they are water-stressed or contain highly erodible soils. In these water-stressed areas, renewable energy projects, if designed intentionally, can reduce water use, improve soil stability and promote ecosystem recovery over time. For example, the California Energy Commission (CEC) developed a Cropland Index Model to identify low quality or water-limited agricultural lands (cropland suitability score &lt; 7.7), which the CEC promotes as better suited for renewable energy development (<a href="https://www.energy.ca.gov/data-reports/california-energy-planning-library/land-use-screens/cec-2023-land-use-screens-electric" target="_blank">CEC Land-use Screens</a>). For this reason, we removed cropland with a CEC suitability score below 7.7 from the layer in California.<br/><br/>For more details, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'It is anticipated that 90% of utility-scale solar capacity will be installed in rural communities, much of that on farmland (<a href="https://www.energy.gov/sites/default/files/2021-09/Solar%20Futures%20Study.pdf" target="_blank">U.S. Department of Energy 2021 </a>). This layer identifies the top 90%, 75%, and 50% of farm and ranchland in each state based on the land’s productivity, versatility, and resiliency (PVR) values, as defined by the American Farmland Trust. These data are based on soil productivity and capacity, land cover and use, crop type, and length of the growing season (<a href="https://farmlandinfo.org/publications/farms-under-threat-the-state-of-the-states/" target="_blank"> Farms Under Threat 2020</a>). The American Farmland Trust recommends that high quality agricultural lands are maintained as farmland and not converted to large-scale solar development. However, agrivoltaics (co-location of solar and agriculture) are considered compatible with farmland (<a href="https://farmland.org/smart-solar" target="_blank">Smart Solar Principles</a>) as is wind development. <br/><br/>As with any large-scale analysis, local and on-the-ground verification is required. Sites mapped as high quality based on current crop production and soil characteristics might become unproductive if they are water-stressed or contain highly erodible soils. In these areas, renewable energy projects, if designed intentionally, can reduce water use, improve soil stability, and promote ecosystem recovery over time. For example, the California Energy Commission (CEC) developed a Cropland Index Model to identify low quality or water-limited agricultural lands (cropland suitability score &lt; 7.7), which the CEC promotes as better suited for renewable energy development (<a href="https://www.energy.ca.gov/data-reports/california-energy-planning-library/land-use-screens/cec-2023-land-use-screens-electric" target="_blank">CEC Land-use Screens</a>). For this reason, we removed cropland with a CEC suitability score below 7.7 from the layer.',
          },
          {
            index: 19, elid: 'ag3', serviceId: 'rasters', filter: true, visible: true, visibleModel: false,
            opacity: 0.9, category: 'both', title: 'Highest Quality Farmland: 75-90th percentile', 
            infoAbout: `It is anticipated that 90% of utility-scale solar capacity will be installed in rural communities, much of that on farmland (<a href="https://www.energy.gov/sites/default/files/2021-09/Solar%20Futures%20Study.pdf" target="_blank">U.S. Department of Energy</a> 2021). This layer identifies the top 75 to 90% of farm and ranchland in each state based on the land’s productivity, versatility and resiliency values, as defined by the American Farmland Trust. These data are based on soil productivity and capacity, land cover and use, crop type and length of the growing season (<a href="https://farmlandinfo.org/publications/farms-under-threat-the-state-of-the-states/" target="_blank">Farms Under Threat 2020</a>).`,
            infoWhy: `Including these data helps decision-makers consider how siting decisions may intersect with farmland values, supporting an informed approach to wind and solar development. Agrivoltaics (co-location of solar and agriculture) and wind development on agricultural land may offer opportunities to maintain agricultural uses while supporting renewable energy generation (<a href="https://farmland.org/smart-solar" target="_blank">Smart Solar Principles</a>), depending on local conditions and project design.<br/><br/>As with any large-scale analysis, on-the-ground verification is required. Sites mapped as high quality based on current crop production and soil characteristics might become unproductive if they are water-stressed or contain highly erodible soils. In these water-stressed areas, renewable energy projects, if designed intentionally, can reduce water use, improve soil stability and promote ecosystem recovery over time. For example, the California Energy Commission (CEC) developed a Cropland Index Model to identify low quality or water-limited agricultural lands (cropland suitability score &lt; 7.7), which the CEC promotes as better suited for renewable energy development (<a href="https://www.energy.ca.gov/data-reports/california-energy-planning-library/land-use-screens/cec-2023-land-use-screens-electric" target="_blank">CEC Land-use Screens</a>). For this reason, we removed cropland with a CEC suitability score below 7.7 from the layer in California.<br/><br/>For more details, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'It is anticipated that 90% of utility-scale solar capacity will be installed in rural communities, much of that on farmland (<a href="https://www.energy.gov/sites/default/files/2021-09/Solar%20Futures%20Study.pdf" target="_blank">U.S. Department of Energy 2021 </a>). This layer identifies the top 90%, 75%, and 50% of farm and ranchland in each state based on the land’s productivity, versatility, and resiliency (PVR) values, as defined by the American Farmland Trust. These data are based on soil productivity and capacity, land cover and use, crop type, and length of the growing season (<a href="https://farmlandinfo.org/publications/farms-under-threat-the-state-of-the-states/" target="_blank"> Farms Under Threat 2020</a>). The American Farmland Trust recommends that high quality agricultural lands are maintained as farmland and not converted to large-scale solar development. However, agrivoltaics (co-location of solar and agriculture) are considered compatible with farmland (<a href="https://farmland.org/smart-solar" target="_blank">Smart Solar Principles</a>) as is wind development. <br/><br/>As with any large-scale analysis, local and on-the-ground verification is required. Sites mapped as high quality based on current crop production and soil characteristics might become unproductive if they are water-stressed or contain highly erodible soils. In these areas, renewable energy projects, if designed intentionally, can reduce water use, improve soil stability, and promote ecosystem recovery over time. For example, the California Energy Commission (CEC) developed a Cropland Index Model to identify low quality or water-limited agricultural lands (cropland suitability score &lt; 7.7), which the CEC promotes as better suited for renewable energy development (<a href="https://www.energy.ca.gov/data-reports/california-energy-planning-library/land-use-screens/cec-2023-land-use-screens-electric" target="_blank">CEC Land-use Screens</a>). For this reason, we removed cropland with a CEC suitability score below 7.7 from the layer.'
          },
          {
            index: 20, elid: 'ag4', serviceId: 'rasters', filter: true, visible: true, visibleModel: false,
            opacity: 0.9, category: 'both', title: 'Highest Quality Farmland:   >=90th percentile', 
            infoAbout: `It is anticipated that 90% of utility-scale solar capacity will be installed in rural communities, much of that on farmland (<a href="https://www.energy.gov/sites/default/files/2021-09/Solar%20Futures%20Study.pdf" target="_blank">U.S. Department of Energy</a> 2021). This layer identifies the top 90%+ of farm and ranchland in each state based on the land’s productivity, versatility and resiliency values, as defined by the American Farmland Trust. These data are based on soil productivity and capacity, land cover and use, crop type and length of the growing season (<a href="https://farmlandinfo.org/publications/farms-under-threat-the-state-of-the-states/" target="_blank">Farms Under Threat 2020</a>).`,
            infoWhy: `Including these data helps decision-makers consider how siting decisions may intersect with farmland values, supporting an informed approach to wind and solar development. Agrivoltaics (co-location of solar and agriculture) and wind development on agricultural land may offer opportunities to maintain agricultural uses while supporting renewable energy generation (<a href="https://farmland.org/smart-solar" target="_blank">Smart Solar Principles</a>), depending on local conditions and project design.<br/><br/>As with any large-scale analysis, on-the-ground verification is required. Sites mapped as high quality based on current crop production and soil characteristics might become unproductive if they are water-stressed or contain highly erodible soils. In these water-stressed areas, renewable energy projects, if designed intentionally, can reduce water use, improve soil stability and promote ecosystem recovery over time. For example, the California Energy Commission (CEC) developed a Cropland Index Model to identify low quality or water-limited agricultural lands (cropland suitability score &lt; 7.7), which the CEC promotes as better suited for renewable energy development (<a href="https://www.energy.ca.gov/data-reports/california-energy-planning-library/land-use-screens/cec-2023-land-use-screens-electric" target="_blank">CEC Land-use Screens</a>). For this reason, we removed cropland with a CEC suitability score below 7.7 from the layer in California.<br/><br/>For more details, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'It is anticipated that 90% of utility-scale solar capacity will be installed in rural communities, much of that on farmland (<a href="https://www.energy.gov/sites/default/files/2021-09/Solar%20Futures%20Study.pdf" target="_blank">U.S. Department of Energy 2021 </a>). This layer identifies the top 90%, 75%, and 50% of farm and ranchland in each state based on the land’s productivity, versatility, and resiliency (PVR) values, as defined by the American Farmland Trust. These data are based on soil productivity and capacity, land cover and use, crop type, and length of the growing season (<a href="https://farmlandinfo.org/publications/farms-under-threat-the-state-of-the-states/" target="_blank"> Farms Under Threat 2020</a>). The American Farmland Trust recommends that high quality agricultural lands are maintained as farmland and not converted to large-scale solar development. However, agrivoltaics (co-location of solar and agriculture) are considered compatible with farmland (<a href="https://farmland.org/smart-solar" target="_blank">Smart Solar Principles</a>) as is wind development. <br/><br/>As with any large-scale analysis, local and on-the-ground verification is required. Sites mapped as high quality based on current crop production and soil characteristics might become unproductive if they are water-stressed or contain highly erodible soils. In these areas, renewable energy projects, if designed intentionally, can reduce water use, improve soil stability, and promote ecosystem recovery over time. For example, the California Energy Commission (CEC) developed a Cropland Index Model to identify low quality or water-limited agricultural lands (cropland suitability score &lt; 7.7), which the CEC promotes as better suited for renewable energy development (<a href="https://www.energy.ca.gov/data-reports/california-energy-planning-library/land-use-screens/cec-2023-land-use-screens-electric" target="_blank">CEC Land-use Screens</a>). For this reason, we removed cropland with a CEC suitability score below 7.7 from the layer.',
          },
        ],
      },
      {
        title: 'Limitations to Farmland', id: '', visible: true, visibleModel: true, expanded: false,
        sublayers: [
          {
            index: 15, elid: 'abandonedag', serviceId: 'rasters', filter: true, visible: true, visibleModel: false, opacity: 0.9, category: 'both', title: 'Abandoned Cropland', 
            infoAbout: `This layer identifies croplands that were abandoned or unused for at least 5 years between 1986 and 2018 (<a href="https://iopscience.iop.org/article/10.1088/1748-9326/ad2d12" target="_blank">Xie et al. 2024</a>). The dataset was developed using Landsat satellite imagery and machine-learning classification to map annual cropland extent and identify pixels that transitioned out of cultivation over time at a 30-meter resolution. For more details, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `These areas are likely marginal for food production and therefore could be a suitable location for large-scale solar development, according to the American Farmland Trust. Repurposing abandoned or degraded agricultural lands may present opportunities for wind and solar development while reducing pressure to convert intact natural habitats or productive farmland. However, 20% of this area was enrolled in the Conservation Reserve Program as of 2020, and may be ecologically sensitive or susceptible to erosion, either of which could make these lands less suitable for large-scale solar developments (<a href="https://iopscience.iop.org/article/10.1088/1748-9326/ad2d12" target="_blank">Xie et al. 2024</a>). The potential for grassland restoration in some of these areas should be closely evaluated.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'This layer identifies croplands that were abandoned between 1986-2018 (<a href="https://iopscience.iop.org/article/10.1088/1748-9326/ad2d12" target="_blank"> Xie et al. 2024</a>). These areas are likely marginal for food production and therefore could be a suitable location for large-scale solar development, according to the American Farmland Trust. However, 20% of this area was enrolled in the Conservation Reserve Program as of 2020, and may be ecologically sensitive or susceptible to erosion, either of which may make these lands unsuitable for large-scale solar developments.',
          },
          {
            index: 17, elid: 'waterLimited', serviceId: 'rasters', filter: true, visible: true, visibleModel: false,
            opacity: 0.9, category: 'both', title: 'Water-limited Lands', 
            infoAbout: `This data layer combines information on surface and groundwater constraints. We defined areas as “surface water limited” when they are classified as moderately, highly or very highly limited in the U.S. Geological Survey’s <a href="https://water.usgs.gov/vizlab/water-availability/01-water-limitation" target="_blank">Water Limitation Surface Water Supply Use Index</a> (≥SUI 0.4). Groundwater constraints are based on an analysis in the arid western freshwater ecoregions of <a href="https://nasagrace.unl.edu/" target="_blank">NASA’s GRACE Shallow Groundwater Drought Indicator</a>. For more details, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `Water-limited lands are areas where surface or groundwater resources are being depleted. This layer displays where water shortages could affect long-term agricultural viability and where alternative land-use options, including wind and solar development, may be evaluated. Renewable energy projects have different water-use and land management implications than agricultural uses, depending on project design and local conditions. In these areas, renewable energy projects, if designed intentionally, can reduce water use, improve soil stability and promote ecosystem recovery over time.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'Surface water-limited lands are areas where water demand is approaching available supply. These water shortages may make farming infeasible, such that solar development may be more appropriate than agriculture. Renewable energy projects, if well-designed, could result in reduced water use and ecosystem stability over time. Water limitation across the lower 48 United States is shown as the average from 2010 to 2020 for each watershed (HUC12) from the <a href="https://water.usgs.gov/vizlab/water-availability/01-water-limitation" target="_blank">U.S. Geological Survey.</a> Only high and severe levels of water limitation are shown.',
           },
        ],
      },
    ],
  },
  {
    header: 'Community Considerations', id: 'community', expanded: false, 
    subheaders: [
      {
        title: 'Community Considerations', id: 'comm', selection: 'Low Income Percentile', visible: true, visibleModel: true, expanded: false, subheaderLayerBlurb: 'Community characteristics to consider in wind and solar development.', subheaderBlurb: `These layers display census tracts, which are statistical areas determined by the U.S. Census Bureau once every ten years (2010). The data are organized into eight categories of burden. A community is highlighted as burdened if it is in a census tract that is at or above the threshold for one or more environmental, climate or other burdens. For a detailed list of data sources, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.<br/><br/>If a census tract is identified as burdened in any of the burden categories <b>and</b> 70% or greater of the population live in households with income at or below twice the federal poverty level (see pop-up box after clicking a tract), the tract is also considered “disadvantaged” for that category. For example, a census tract that is energy burdened <b>and</b> at the 80th low-income percentile is considered “energy disadvantaged.”`,
        sublayers: [
          {
            index: 14, elid: 'cjest_lowincome', serviceId: 'vtl', filter: true, type: 'radio',
            visible: false, visibleModel: false, opacity: 0.9, category: 'both',
            title: 'Low Income Percentile', style: 'styles/P200_I_PFS.json',
            infoAbout: `The percentage of people in a census tract who live in households with incomes at or below twice the federal poverty level, excluding college or university students.`,
            infoWhy: `Spatial data play a growing role in identifying and addressing community-level considerations. By including community and socioeconomic indicators such as income, climate vulnerability, energy burden and more, the Clean Energy Compass offers a starting point for understanding community characteristics. Burden indicators may provide insight into how people experience the benefits, burdens and opportunities associated with wind and solar development in that place.<br/><br/>By bringing these datasets together, the Compass helps users identify places where additional engagement, partnership, benefit-sharing or project design considerations may be especially important. When used in combination to inform robust community engagement and benefit sharing, the tool can support more informed community-centered siting decisions.<br/><br/>For deeper context, users are encouraged to explore the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'The percentage of a census tract’s population living in households with incomes at or below 200% of the federal poverty level, excluding students enrolled in higher education.',
          },
          {
            index: 15, elid: 'cjest_climate', serviceId: 'vtl', filter: true, type: 'radio',
            visible: false, visibleModel: false, opacity: 0.9, category: 'both',
            title: 'Climate Burdened', style: 'styles/N_CLT_EOMI.json',
            infoAbout: `Communities are identified as climate burdened if they are in census tracts ranking at or above the 90th percentile nationally for one or more of the following indicators: expected agricultural loss rate, expected building loss rate, expected population loss rate, projected flood risk or projected wildfire risk.`,
            infoWhy: `Spatial data play a growing role in identifying and addressing community-level considerations. By including community and socioeconomic indicators such as income, climate vulnerability, energy burden and more, the Clean Energy Compass offers a starting point for understanding community characteristics. Burden indicators may provide insight into how people experience the benefits, burdens and opportunities associated with wind and solar development in that place.<br/><br/>By bringing these datasets together, the Compass helps users identify places where additional engagement, partnership, benefit-sharing or project design considerations may be especially important. When used in combination to inform robust community engagement and benefit sharing, the tool can support more informed community-centered siting decisions.<br/><br/>For deeper context, users are encouraged to explore the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'Communities are identified as disadvantaged if they are in census tracts that are at or above the 90th percentile for expected agriculture loss rate OR expected building loss rate OR expected population loss rate OR projected flood risk OR projected wildfire risk AND are at or above the 65th percentile for low income.',
          },
          {
            index: 16, elid: 'cjest_energy', serviceId: 'vtl', filter: true, type: 'radio',
            visible: false, visibleModel: false, opacity: 0.9, category: 'both',
            title: 'Energy Burdened', style: 'styles/N_ENY_EOMI.json',
            infoAbout: `Communities are identified as energy burdened if they are in census tracts ranking at or above the 90th percentile nationally for household energy costs or fine particulate matter (PM₂.₅) concentrations.`,
            infoWhy: `Spatial data play a growing role in identifying and addressing community-level considerations. By including community and socioeconomic indicators such as income, climate vulnerability, energy burden and more, the Clean Energy Compass offers a starting point for understanding community characteristics. Burden indicators may provide insight into how people experience the benefits, burdens and opportunities associated with wind and solar development in that place.<br/><br/>By bringing these datasets together, the Compass helps users identify places where additional engagement, partnership, benefit-sharing or project design considerations may be especially important. When used in combination to inform robust community engagement and benefit sharing, the tool can support more informed community-centered siting decisions.<br/><br/>For deeper context, users are encouraged to explore the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'Communities are identified as disadvantaged if they are in census tracts that are at or above the 90th percentile for energy cost OR PM2.5 in the air AND are at or above the 65th percentile for low income.',
          },
          {
            index: 21, elid: 'cjest_health', serviceId: 'vtl', filter: true, type: 'radio',
            visible: false, visibleModel: false, opacity: 0.9, category: 'both',
            title: 'Health Burdened', style: 'styles/N_HLTH_90.json',
            infoAbout: `Communities are identified as health burdened if they are in census tracts ranking at or above the 90th percentile nationally for asthma prevalence, diabetes prevalence, heart disease prevalence or low life expectancy.`,
            infoWhy: `Spatial data play a growing role in identifying and addressing community-level considerations. By including community and socioeconomic indicators such as income, climate vulnerability, energy burden and more, the Clean Energy Compass offers a starting point for understanding community characteristics. Burden indicators may provide insight into how people experience the benefits, burdens and opportunities associated with wind and solar development in that place.<br/><br/>By bringing these datasets together, the Compass helps users identify places where additional engagement, partnership, benefit-sharing or project design considerations may be especially important. When used in combination to inform robust community engagement and benefit sharing, the tool can support more informed community-centered siting decisions.<br/><br/>For deeper context, users are encouraged to explore the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'Communities are identified as disadvantaged if they are in census tracts that are at or above the 90th percentile for asthma OR diabetes OR heart disease OR low life expectancy AND are at or above the 65th percentile for low income.',
          },
          {
            index: 18, elid: 'cjest_housing', serviceId: 'vtl', filter: true, type: 'radio',
            visible: false, visibleModel: false, opacity: 0.9, category: 'both',
            title: 'Housing Burdened', style: 'styles/N_HSG_EOMI.json',
            infoAbout: `Communities are identified as housing burdened if they are in census tracts that experienced historic underinvestment (redlining risk score based on Homeowner’s Loan Corporation maps) or rank at or above the 90th percentile nationally for housing cost burden, limited access to green space, lack of indoor plumbing or housing units with lead paint risk.`,
            infoWhy: `Spatial data play a growing role in identifying and addressing community-level considerations. By including community and socioeconomic indicators such as income, climate vulnerability, energy burden and more, the Clean Energy Compass offers a starting point for understanding community characteristics. Burden indicators may provide insight into how people experience the benefits, burdens and opportunities associated with wind and solar development in that place.<br/><br/>By bringing these datasets together, the Compass helps users identify places where additional engagement, partnership, benefit-sharing or project design considerations may be especially important. When used in combination to inform robust community engagement and benefit sharing, the tool can support more informed community-centered siting decisions.<br/><br/>For deeper context, users are encouraged to explore the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'Communities are identified as disadvantaged if they are in census tracts that experienced historic underinvestment OR are at or above the 90th percentile for housing cost OR lack of green space OR lack of indoor plumbing OR lead paint AND are at or above the 65th percentile for low income.',
          },
          {
            index: 19, elid: 'cjest_pollution', serviceId: 'vtl', filter: true, type: 'radio',
            visible: false, visibleModel: false, opacity: 0.9, category: 'both',
            title: 'Pollution Burdened', style: 'styles/N_PLN_EOMI.json',
            infoAbout: `Communities are identified as pollution burdened if they are in census tracts containing at least one abandoned mine land site, at least one Formerly Used Defense Site, or rank at or above the 90th percentile nationally for proximity to hazardous waste facilities, proximity to National Priorities List (Superfund) sites or proximity to Risk Management Plan facilities.`,
            infoWhy: `Spatial data play a growing role in identifying and addressing community-level considerations. By including community and socioeconomic indicators such as income, climate vulnerability, energy burden and more, the Clean Energy Compass offers a starting point for understanding community characteristics. Burden indicators may provide insight into how people experience the benefits, burdens and opportunities associated with wind and solar development in that place.<br/><br/>By bringing these datasets together, the Compass helps users identify places where additional engagement, partnership, benefit-sharing or project design considerations may be especially important. When used in combination to inform robust community engagement and benefit sharing, the tool can support more informed community-centered siting decisions.<br/><br/>For deeper context, users are encouraged to explore the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'Communities are identified as disadvantaged if they are in census tracts that have at least one abandoned mine land OR Formerly Used Defense Sites OR are at or above the 90th percentile for proximity to hazardous waste facilities OR proximity to Superfund sites (National Priorities List (NPL)) OR proximity to Risk Management Plan (RMP) facilities AND are at or above the 65th percentile for low income.',
          },
          {
            index: 17, elid: 'cjest_transportation', serviceId: 'vtl', filter: true, type: 'radio',
            visible: false, visibleModel: false, opacity: 0.9, category: 'both',
            title: 'Transportation Burdened', style: 'styles/N_TRN_EOMI.json',
            infoAbout: `Communities are identified as transportation burdened if they are in census tracts ranking at or above the 90th percentile nationally for diesel particulate matter exposure or for transportation barriers.`,
            infoWhy: `Spatial data play a growing role in identifying and addressing community-level considerations. By including community and socioeconomic indicators such as income, climate vulnerability, energy burden and more, the Clean Energy Compass offers a starting point for understanding community characteristics. Burden indicators may provide insight into how people experience the benefits, burdens and opportunities associated with wind and solar development in that place.<br/><br/>By bringing these datasets together, the Compass helps users identify places where additional engagement, partnership, benefit-sharing or project design considerations may be especially important. When used in combination to inform robust community engagement and benefit sharing, the tool can support more informed community-centered siting decisions.<br/><br/>For deeper context, users are encouraged to explore the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'Communities are identified as disadvantaged if they are in census tracts that are at or above the 90th percentile for diesel particulate matter exposure OR transportation barriers OR traffic proximity and volume AND are at or above the 65th percentile for low income.',
          },
          {
            index: 20, elid: 'cjest_water', serviceId: 'vtl', filter: true, type: 'radio',
            visible: false, visibleModel: false, opacity: 0.9, category: 'both',
            title: 'Water Burdened', style: '/styles/N_WTR_EOMI.json',
            infoAbout: `Communities are identified as water burdened if they are in census tracts ranking at or above the 90th percentile nationally for underground storage tank releases or wastewater discharge impacts.`,
            infoWhy: `Spatial data play a growing role in identifying and addressing community-level considerations. By including community and socioeconomic indicators such as income, climate vulnerability, energy burden and more, the Clean Energy Compass offers a starting point for understanding community characteristics. Burden indicators may provide insight into how people experience the benefits, burdens and opportunities associated with wind and solar development in that place.<br/><br/>By bringing these datasets together, the Compass helps users identify places where additional engagement, partnership, benefit-sharing or project design considerations may be especially important. When used in combination to inform robust community engagement and benefit sharing, the tool can support more informed community-centered siting decisions.<br/><br/>For deeper context, users are encouraged to explore the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'Communities are identified as disadvantaged if they are in census tracts that are at or above the 90th percentile for underground storage tanks and releases OR wastewater discharge AND are at or above the 65th percentile for low income.',
          },
          {
            index: 22, elid: 'cjest_workforce', serviceId: 'vtl', filter: true, type: 'radio',
            visible: false, visibleModel: false, opacity: 0.9, category: 'both',
            title: 'Workforce Burdened', style: 'styles/N_WKFC_91.json',
            infoAbout: `Communities are identified as workforce burdened if they are in census tracts ranking at or above the 90th percentile nationally for linguistic isolation, low median income, poverty or unemployment and where more than 10% of residents age 25 or older have not earned a high school diploma.`,
            infoWhy: `Spatial data play a growing role in identifying and addressing community-level considerations. By including community and socioeconomic indicators such as income, climate vulnerability, energy burden and more, the Clean Energy Compass offers a starting point for understanding community characteristics. Burden indicators may provide insight into how people experience the benefits, burdens and opportunities associated with wind and solar development in that place.<br/><br/>By bringing these datasets together, the Compass helps users identify places where additional engagement, partnership, benefit-sharing or project design considerations may be especially important. When used in combination to inform robust community engagement and benefit sharing, the tool can support more informed community-centered siting decisions.<br/><br/>For deeper context, users are encouraged to explore the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'Communities are identified as disadvantaged if they are in census tracts that are at or above the 90th percentile for linguistic isolation OR low median income OR poverty OR unemployment AND more than 10% of people ages 25 years or older whose high school education is less than a high school diploma.',
          },
        ],
      },
    ],
  },
  {
    header: 'Probability of Renewable Energy Buildout', id: 'renewable', expanded: false,
    subheaders: [
      {
        title: 'Probability of Renewable Energy Buildout', id: 'renewable', visible: true, selection: 'Predicted Solar Buildout', visibleModel: true, expanded: false,
        subheaderBlurb:'Areas with a higher likelihood for future wind and solar development', subheaderLayerBlurb: 'Areas with a higher likelihood for future wind and solar development',
        sublayers: [
          {
            index: 0, elid: 'lassoSolar', filter: true, visible: false, visibleModel: false,
            opacity: 0.9, category: 'both', title: 'Probability of Solar Buildout', 
            infoAbout: `The map was created using past siting trends to model the likelihood of solar development in the future. It also takes into consideration forward-looking information on planned transmission lines and substations to predict the likelihood of future solar development (<a href="https://iopscience.iop.org/article/10.1088/1748-9326/ae5faa/meta" target="_blank">Wu et al. 2026</a>). Legally and technically unsuitable areas, e.g., protected areas, airports, and areas prohibited by zoning ordinances (as of 2023) were excluded. Note that this map <b>is not a depiction of the forecasted footprint of solar energy buildout,</b> but rather the probability of solar development in different areas given site and state characteristics. The map shows the potential for more development than will be needed to meet U.S. demand. The analysis found that solar projects are more likely to be developed in areas with high infrastructure accessibility, that are closer to load centers and have lower environmental impacts (e.g., ecological sensitivities and forested land). For more details, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `Early insight into where renewable energy could be developed can help communities identify areas suitable for solar energy and prepare for this development on their own terms. These data were included in direct response to feedback from 20 interviews conducted over a six-month period with energy experts, environmental justice community organizers, legal advocacy groups and coalition leads, in which interviewees identified potential buildout as useful information to help communities prepare for renewable energy projects.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'Communities can best respond to renewable energy project proposals with advance preparation on community values and conservation priorities. This layer is included to provide insights on areas of the country that may see solar development in the future. This map was created using past siting trends to model the likelihood of development in the future, also incorporating forward-looking data such as planned transmission and capacity (Wu et al. In press). Note that this map does not show a total forecasted footprint based on energy needs, but rather probabilities of development given site characteristics (i.e., the map shows more development than is likely needed in the U.S.). The analysis found that solar projects are more likely to be developed in areas with high infrastructure accessibility, closer to load centers, and lower environmental impacts (e.g., ecological sensitivities and forested land). ', type: 'radio',
          },
          {
            index: 1, elid: 'lassoWind', filter: true, visible: false, visibleModel: false, opacity: 0.9,
            category: 'both', title: 'Probability of Wind Buildout', 
            infoAbout: `The map was created using past siting trends to model the likelihood of wind development in the future, also incorporating forward-looking data such as planned transmission lines and substations (<a href="https://iopscience.iop.org/article/10.1088/1748-9326/ae5faa/meta" target="_blank">Wu et al. 2026</a>). Legally and technically unsuitable areas, e.g., protected areas, airports, and areas prohibited by zoning ordinances (as of 2023) were excluded. Note that this map <b>is not a depiction of the forecasted footprint of wind energy buildout,</b> but rather the probability of wind development in different areas given site and state characteristics. The map shows the potential for more development than is likely needed in the U.S. The analysis found that wind projects are more likely to be developed in areas that are windier, have favorable land cover (agricultural and non-forested), are closer to transmission lines, are situated on more sloped terrain, and have lower land acquisition costs. For more details, see the methods paper at the <a href="https://www.nature.org/cleanenergycompass" target="_blank">Compass Resource Hub</a>.`,
            infoWhy: `Early insight into where renewable energy buildout may occur can help communities identify areas suitable for wind energy and prepare for this development on their own terms. These data were included in direct response to feedback from 20 interviews conducted over a six-month period with energy experts, environmental justice community organizers, legal advocacy groups and coalition leads, in which interviewees identified potential buildout as useful information to help communities prepare for renewable energy projects.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'Communities can best respond to renewable energy project proposals with advance preparation on community values and conservation priorities. This layer is included to provide insights on areas of the country that may see wind development in the future. This map was created using past siting trends to model the likelihood of development in the future, also incorporating forward-looking data such as planned transmission and capacity (Wu et al. In press). Note that this map does not show a total forecasted footprint based on energy needs, but rather probabilities of development given site characteristics (i.e., the map shows more development than is likely needed in the U.S.). The analysis found that wind projects are more likely to be developed in areas that are windier, have favorable land cover (agricultural and non-forested), closer to transmission lines, on more sloped terrain, and with lower land acquisition costs. ', type: 'radio',
          },
        ],
      },
    ],
  },
  {
    header: 'Indigenous Lands', id: 'native', expanded: true,
    subheaders: [
      {
        title: 'Indigenous Lands', id: 'native', visible: true, visibleModel: true, expanded: false,
        subheaderBlurb: 'Federally recognized Tribal lands and jurisdictions', subheaderLayerBlurb: 'Federally recognized Tribal lands and jurisdictions',
        sublayers: [
          {
            index: 0, elid: 'nativeLands', serviceId: 'rasters', filter: true, visible: true, visibleModel: true,
            opacity: 0.9, category: 'both', title: 'American Indian, Alaska Native, and Native Hawaiian Areas', 
            infoAbout: `This layer displays locations of the Federally Recognized Tribal entities in the contiguous U.S. (<a href="https://www.arcgis.com/home/item.html?id=1d6231f4358c4e3781557e702c319d9a" target="_blank">National Geospatial Data Asset data from the U.S. Census Bureau</a>) to acknowledge Tribal Nations’ sovereignty status and jurisdiction. The data layer includes American Indian Reservations and Federally Recognized Tribal Entities, as identified by the BIA, as well as other Tribal lands, including off-reservation trust lands, allotted lands, Oklahoma Tribal Statistical Areas, Tribal Designated Statistical Areas and State-Designated Tribal Statistical Areas.<br/><br/>This layer was selected based on a year-long process of listening to Indigenous energy experts across the country about what information would be appropriate to include in the tool, especially in the context of data sovereignty. The layer is intentionally greyed out when the map is opened to signal that respecting and upholding Tribal sovereignty, self-determination and authority to manage land, resources and data is the baseline for any responsible use of spatial information. The layer can be turned off so that Tribes and Indigenous People can access the information.<br/><br/>In addition to these layers, users should be aware of several additional resources reflecting Tribal land interests including:<ul><li><a href="https://www.bia.gov/bia/ots/dris/bogs" target="_blank">BIA Branch of Geospatial Support</a></li><li>ESRI GIS Sources for Native American Tribal Governments</li><li>U.S. Forest Service’s “<a href="https://data-usfs.hub.arcgis.com/datasets/usfs::tribal-lands-ceded-to-the-united-states-feature-layer/about" target="_blank">Tribal Lands Ceded to the United States</a>” dataset</li><li><a href="https://native-land.ca/" target="_blank">Native-Land.ca</a></li></ul>`,
            infoWhy: `Including data about Federally Recognized Tribal entities is a necessary component to understanding Tribal sovereignty, Tribal land interests and unique considerations when engaging Indigenous People and Tribal Nations. However, no map or dataset can or should be taken to represent cultural values, governance priorities or ecological significance of lands to Indigenous Peoples. All renewable energy planning that impacts Tribal lands must incorporate these considerations.<br/><br/>For deeper context, users are encouraged to explore the <i>Resource List: Indigenous Data &amp; Energy Sovereignty</i> which provides additional resources on foundational frameworks and principles, legal context, evaluation and application of/on data and energy sovereignty. These resources can be found on the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            infoHow: `The Nature Conservancy developed the Clean Energy Compass to help accelerate a clean energy transition by improving outcomes for climate, conservation and communities—the 3Cs. The tool should be used as a starting point to identify potential conservation and community considerations early in the planning process, not as a standalone siting or decision-making tool. For practical guidance and resources to help navigate these considerations, visit the Compass Resource Hub at <a href="http://www.nature.org/cleanenergycompass" target="_blank">www.nature.org/cleanenergycompass</a>.`,
            longDescription: 'This layer displays locations of the Federally Recognized Tribal entities in the contiguous U.S. and Alaska (<a href="https://www.arcgis.com/home/item.html?id=1d6231f4358c4e3781557e702c319d9a" target="_blank">National Geospatial Data Asset data from the U.S. Census Bureau</a>). Categories included are:<br/> <ul><li>American Indian Reservations (AIR). The Bureau of Indian Affairs (BIA) defines AIRs as "areas of land reserved for a tribe or tribes under treaty or other agreement with the United States, executive order, or federal statute or administrative action as permanent tribal homelands, and where the federal government holds title to the land in trust on behalf of the tribe".</li><br/><li>Federally Recognized Tribal Entities (FRTE). According to the BIA, an FRTE is "an American Indian or Alaska Native tribal entity that is recognized as having a government-to-government relationship with the United States, with the responsibilities, powers, limitations, and obligations attached to that designation."</li></ul>',
          },
        ],
      },
    ],
  },
  ],

   /**functions for layers in panel */

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
    if (group.header == 'Agricultural Considerations'  && group.expanded == true){
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
    layer.visible = checked
  },
  //sets opacity for single layers
  setSublayerOpacity(elid, opacity){
    let map = document.querySelector("arcgis-map").map;
    let id = elid;
    if(elid.includes('cjest')){
      id = 'cjest'
    }
    let layer = map.findLayerById(id);
    layer.opacity = opacity
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
  //filter layers
  filterLayers(cat){
    this.category = cat
    this.currentPoint == '' ? "" : this.createBuffer ('current')
    let map = document.querySelector("arcgis-map").map;
    
    if (this.category == 'floating solar'){
      this.layers.forEach(layer => {
       if(layer.header == 'Conservation Values'){
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
       }
      });
    }
    else{
    this.layers.forEach(layer => {
      if(layer.header == 'Conservation Values'){
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
      }
    });
    }
    this.filterStateOverlays()
  },
  //show hide state overlays with more info button 
  filterStateOverlays(){
    let map = document.querySelector("arcgis-map").map;
    let layer = map.findLayerById('states');
    let layer2 = map.findLayerById('states2')
    //only show overlay on conservation values visible = true
    if(this.layers[0].expanded == false){
      layer.definitionExpression = "STATE_NAME = 'N/A'"
      layer2.definitionExpression = "STATE_NAME = 'N/A"
    }
    else{
       if(this.category == 'solar'){
        layer.definitionExpression = "STATE_NAME = 'Maine' or STATE_NAME = 'Georgia' or STATE_NAME = 'California'"
        layer2.definitionExpression = "STATE_NAME = 'California'"
       } 
       if(this.category == 'wind'){
        layer.definitionExpression = "STATE_NAME = 'Maine' or STATE_NAME = 'California'"
        layer2.definitionExpression = "STATE_NAME = 'California'"
       }
       if(this.category == 'floating solar'){
        layer.definitionExpression = "STATE_NAME = 'Maine'"
        layer2.definitionExpression = "STATE_NAME = 'N/A'"
       }
       
    }

  },
  //reorders layers in map based on group order
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

      if (mapLayer) {
        map.reorder(mapLayer, newIndex)
      }
    })
  },

  /**functions for report*/
  hideSiteReport() {
    const el = document.querySelector('arcgis-map')
    const map = el?.map
    const pointLayer = map?.findLayerById('pointLayer')
    const bufferLayer = map?.findLayerById('bufferLayer')
    if (bufferLayer) bufferLayer.visible = false
    if (pointLayer) pointLayer.visible = false
    this.showSiteReport = false
  },
  viewSiteReport() {
    const el = document.querySelector('arcgis-map')
    const map = el?.map
    const pointLayer = map?.findLayerById('pointLayer')
    const bufferLayer = map?.findLayerById('bufferLayer')
    if (bufferLayer) bufferLayer.visible = true
    if (pointLayer) pointLayer.visible = true
    this.showSiteReport = true
  },
  //called from map.vue to create a bufer around clicked point and calls historam and intersection functions
  async createBuffer (e){
    this.statePolicy = null
    let current = false
    if (e == 'current'){
      current = true
      e = this.currentPoint
      
    }
    //clear prior results
    this.reportResults = ''
    this.getStatePolicy(e.detail.mapPoint)
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
    if (!current){
    view.goTo(
      { target: padded },
      { duration: 800, easing: "ease-in-out" }
    ).catch((err) => {
      // goTo rejects if interrupted by user interaction — safe to ignore
      if (err.name !== "AbortError") console.error(err)
    })
  }

  },

  // functions for report raster histograms and area calculations
  async getHistogram(buffer) {
    
    const rasters = [

      { name: 'Bats_10_Final_02_NoCA_5070', elid: 'bats', values: [1,2] },
      { name: 'BigGame_08_NoCA_5070', elid: 'bigGameSolar', values: [1]},
      { name: 'Birds_05_NoCA_5070', elid: 'birdsWind', values: [1] },
      { name: 'IntactHabitats_HMI200_20260518_NoCA_R_5070', elid: 'landscapeIntactness', values: [2] },
      { name: 'Migratory_Bird_Stopover_NoCA_5070_8bit', elid: 'migratoryBirdStopoverWind', values: [255] },
      { name: 'PrairieGrouseA_5070', elid: 'prairieGrouse', values: [1] },
      { name: 'ProtectedAreas_01_Final_NoCA_5070_new2', elid: 'protectedAreas', values: [255] },
      { name: 'RCN_NoCal_20260728_5070_new', elid: 'resilientConnected', values: [1,2,3]},
      { name: 'TE_Species_03_20260630_NoCA_5070', elid: 'threatenedEndangeredSpecies', values: [1] },
      { name: 'Water_02_reclass_20260630_NoCA_5070', elid: 'floodPlainsWetlands', values: [1] },
      { name: 'WhoopingCraneSolar_20260408_NoCA_R_5070', elid: 'whoopingCraneSolar', values: [2] },
      { name: 'WhoopingCraneWind_20260408_NoCA_R_5070', elid: 'whoopingCraneWind', values: [1] },
      { name: 'abanDef2_rec_ur_5070_new', elid: 'abandonedag', values: [1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001, 2002, 2003, 2004, 2005, 2006, 2007,2008,2009,2010,2011,2012,2013,2014]},
      { name: 'pvr_val_2_GT_5070_new_mask', elid: 'ag2', values: [1]},
      { name: 'pvr_val_3_GT_5070_new_mask', elid: 'ag3', values:[1]},
      { name: 'pvr_val_4_GT_5070_new_mask', elid: 'ag4', values:[1]},
      { name: 'lasso_wind_5070_fix', elid: 'lassoWind', values: [1]},
      { name: 'lasso_solar_5070_fix_', elid: 'lassoSolar', values: [1]}
    
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
        renderingRule: null,
      })

      try {
        const res = await imageLayer.computeStatisticsHistograms(params)
        const hist = res.histograms?.[0]

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
    const histResults = Object.fromEntries(entries)   // keyed by elid 
  
    // 1) keep the full structured result in the store
    this.reportResults = {...this.reportResults, ...histResults}
    this.reportGeneratedAt = Date.now()

    // 2) push areas onto the matching sublayers so the report renders unchanged
    this.applyResultsToLayers(this.reportResults)

    this.reportLoading = false
    return this.reportResults
  },
  countForValue(hist, value) {
      if (!hist || !hist.counts?.length) return 0
      const binWidth = (hist.max - hist.min) / hist.size
      const idx = Math.floor((value - hist.min) / binWidth)
      return hist.counts[idx] ?? 0
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
            sublayer.min = null       // clear stats too on reset
            sublayer.max = null
            sublayer.mean = null
            return
          }
          // raster layers
          if (r.areaAc != null) {
            sublayer.totalArea = r.areaAc
            sublayer.intersected = r.areaAc > 0
          }
          // vector/point layers
          if (r.summaryType) {
            sublayer.summaryType = r.summaryType
            sublayer.count = r.count ?? 0
            sublayer.intersected = r.intersected ?? false

            // stats layers carry min / max / mean
            if (r.summaryType === 'stats') {
              sublayer.min = r.min ?? null
              sublayer.max = r.max ?? null
              sublayer.mean = r.mean ?? null
            }
          }
        })
      })
    })
  },

  //gets agol vector data for report
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
      statsQueries: [
      {
        elid: 'cjest_lowincome',
        field: 'P200_I_PFS',
        stats: ['min', 'max', 'avg'],   // avg = mean
      },
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

        // 2) statistics query → min / max / mean over intersecting polygons
        const statsResults = await Promise.all(
          (cfg.statsQueries || []).map(async (sq) => {
            const res2 = await featureLayer.queryFeatures({
              geometry: buffer,
              spatialRelationship: 'intersects',
              returnGeometry: false,
              outStatistics: [
                { statisticType: 'min', onStatisticField: sq.field, outStatisticFieldName: 'stat_min' },
                { statisticType: 'max', onStatisticField: sq.field, outStatisticFieldName: 'stat_max' },
                { statisticType: 'avg', onStatisticField: sq.field, outStatisticFieldName: 'stat_mean' },
              ],
            })
            const a = res2.features?.[0]?.attributes || {}
            const hasData = a.stat_mean != null
            return [sq.elid, {
              ok: true, error: null, elid: sq.elid, name: cfg.name,
              summaryType: 'stats',
              intersected: hasData,
              min:  hasData ? a.stat_min  : null,
              max:  hasData ? a.stat_max  : null,
              mean: hasData ? a.stat_mean : null,
            }]
          })
        )
        return [...fieldResults, ...statsResults]
        }
      } catch (err) {
        console.error(`Intersection failed for ${cfg.name} (${cfg.elid || 'multi'})`, err)
        // Fail gracefully — one bad layer shouldn't blank the report
        if (cfg.summaryType === 'attributes') {
          const boolFallback = cfg.fields.map((f) => [f.elid, {
            ok: false, error: err.message, elid: f.elid, name: cfg.name,
            summaryType: 'boolean', intersected: false, count: 0,
          }])
          const statsFallback = (cfg.statsQueries || []).map((sq) => [sq.elid, {
            ok: false, error: err.message, elid: sq.elid, name: cfg.name,
            summaryType: 'stats', intersected: false, min: null, max: null, mean: null,
          }])
          return [...boolFallback, ...statsFallback]
        }
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

  //does the intersection query for excluding states and returns policy html for the report
  async getStatePolicy(point) {
    const map = document.querySelector('arcgis-map').map
    const layer = map.findLayerById('states')
    if (!layer) { this.statePolicy = null; return null }

    try {
      const results = await layer.queryFeatures({
        geometry: point,
        spatialRelationship: 'intersects',
        returnGeometry: false,
        outFields: ['*'],
      })

      const feat = results.features?.[0]
      if (!feat) { this.statePolicy = null; return null }

      // ⚠️ adjust field name to your states layer (see question below)
      const state = feat.attributes.STATE_NAME
      const category = this.category   // 'wind' | 'solar' | 'floating solar'

      // eligibility: which categories trigger a message per state
      const rules = {
        California: ['wind', 'solar'],
        Georgia:    ['solar'],
        Maine:      ['wind', 'solar', 'floating solar'],
      }

      if (!rules[state] || !rules[state].includes(category)) {
        this.statePolicy = null
        return null
      }

      this.statePolicy = { state, html: this.statePolicyHtml(state) }
      return this.statePolicy
    } catch (err) {
      console.error('State policy query failed', err)
      this.statePolicy = null
      return null
    }
  },
  statePolicyHtml(state) {
  if (state === 'Maine') {
    return `<strong>Maine Policy Details:</strong>
      TNC recommends referring to <a href="https://www.maine.gov/dep/land/rules/index.html" target="_blank">
      Maine Department of Environmental Protection’s Chapter 375 rules</a> and permitting information for
      solar energy on <a href="https://www.maine.gov/dacf/ard/solar/solar-hval.shtml" target="_blank">
      high-value agricultural land.</a> These policies were supported by TNC and other partners and
      developed with extensive public input.`
  }
  if (state === 'Georgia') {
    return `<strong>Georgia Solar Details:</strong>
      TNC recommends use of the <a href="https://galowimpactsolar.tnc.org/" target="_blank">Georgia Low Impact Solar Siting Tool</a>
      as an environmental sensitivity screening tool to guide solar development to places of lower
      environmental impact. The tool was developed by TNC, United States Fish and Wildlife Service,
      Georgia Department of Natural Resources, industry stakeholders and others.`
  }
  if (state === 'California') {
    return `<strong>California Policy Details:</strong> TNC recommends use of the State of California’s
      screening tool for energy planning, developed with TNC and other stakeholders:
      <a href="https://www.energy.ca.gov/data-reports/california-energy-planning-library/land-use-screens/cec-2023-land-use-screens-electric" target="_blank">CEC 2023 Land-Use Screens for Electric System Planning</a>`
  }
  return ''
  }
  
}
));
