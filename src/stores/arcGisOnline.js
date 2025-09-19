import { defineStore } from 'pinia';
import Portal from '@arcgis/core/portal/Portal.js'
import PortalQueryParams from '@arcgis/core/portal/PortalQueryParams.js'
import Layer from "@arcgis/core/layers/Layer.js";
export const useAgolStore = defineStore('agolStore', () => ({
    searchResults: [],
    searchTerm: '',
    showTooltip: false,
    userLoggedIn: false,
    tab: 'mycontent',
    recommendedLayers: [
    {
        title: 'USA Flood Hazard Areas',
        author: "CA Governor's Office of Emergency Services",
        icon: 'flood',
        description:
        'This feature layer displays Flood Hazard Areas from the Flood Insurance Rate Map created by the Federal Emergency Management Agency.',
        longDescription:
        "<div style='font-family: &quot;Avenir Next W01&quot;, &quot;Avenir Next W00&quot;, &quot;Avenir Next&quot;, Avenir, &quot;Helvetica Neue&quot;, sans-serif; font-size: 16px; margin: 0px; padding: 0px;'>The <a href='https://www.fema.gov/' rel='nofollow ugc' style='color: rgb(0, 121, 193); text-decoration-line: none; font-family: inherit;' target='_blank'>Federal Emergency Management Agency</a> (FEMA) produces <a href='https://www.fema.gov/flood-insurance-rate-map-firm' rel='nofollow ugc' style='color: rgb(0, 121, 193); text-decoration-line: none; font-family: inherit;' target='_blank'>Flood Insurance Rate maps</a> and identifies <a href='https://www.fema.gov/special-flood-hazard-area' rel='nofollow ugc' style='color: rgb(0, 121, 193); text-decoration-line: none; font-family: inherit;' target='_blank'>Special Flood Hazard Areas</a> as part of the <a href='https://www.fema.gov/national-flood-insurance-program' rel='nofollow ugc' style='color: rgb(0, 121, 193); text-decoration-line: none; font-family: inherit;' target='_blank'>National Flood Insurance Program's</a> floodplain management. Special Flood Hazard Areas have regulations that include the mandatory purchase of flood insurance.</div><div style='font-family: &quot;Avenir Next W01&quot;, &quot;Avenir Next W00&quot;, &quot;Avenir Next&quot;, Avenir, &quot;Helvetica Neue&quot;, sans-serif; font-size: 16px; margin: 0px; padding: 0px;'><br /></div><div style='font-family: &quot;Avenir Next W01&quot;, &quot;Avenir Next W00&quot;, &quot;Avenir Next&quot;, Avenir, &quot;Helvetica Neue&quot;, sans-serif; font-size: 16px; margin: 0px; padding: 0px;'><font size='4' style='font-family: inherit;'>Dataset Summary</font></div><div style='font-family: &quot;Avenir Next W01&quot;, &quot;Avenir Next W00&quot;, &quot;Avenir Next&quot;, Avenir, &quot;Helvetica Neue&quot;, sans-serif; font-size: 16px; margin: 0px; padding: 0px;'><font size='4' style='font-family: inherit;'><br /></font></div><div style='font-family: &quot;Avenir Next W01&quot;, &quot;Avenir Next W00&quot;, &quot;Avenir Next&quot;, Avenir, &quot;Helvetica Neue&quot;, sans-serif; font-size: 16px; margin: 0px; padding: 0px;'><div style='font-family: inherit; margin: 0px; padding: 0px;'><b>Phenomenon Mapped: </b>Flood Hazard Areas</div><div style='font-family: inherit; margin: 0px; padding: 0px;'><b>Coordinate System: </b>Web Mercator Auxiliary Sphere</div><div style='font-family: inherit; margin: 0px; padding: 0px;'><b>Extent: </b>50 United States plus Puerto Rico, the US Virgin Islands, Guam, the Northern Mariana Islands and American Samoa</div><div style='font-family: inherit; margin: 0px; padding: 0px;'><b>Visible Scale: </b>The layer is limited to scales of 1:1,000,000 and larger. Use the <a href='https://www.arcgis.com/home/item.html?id=11955f1b47ec41a3af86650824e0c634' rel='nofollow ugc' style='color: rgb(0, 121, 193); text-decoration-line: none; font-family: inherit;' target='_blank'>USA Flood Hazard Areas imagery layer</a> for smaller scales.</div><div style='font-family: inherit; margin: 0px; padding: 0px;'><b>Source:</b> <a href='https://www.fema.gov/' rel='nofollow ugc' style='color: rgb(0, 121, 193); text-decoration-line: none; font-family: inherit;' target='_blank'>Federal Emergency Management Agency</a></div><div style='font-family: inherit; margin: 0px; padding: 0px;'><b>Publication Date:</b> April 1, 2019</div><div style='font-family: inherit; margin: 0px; padding: 0px;'><div style='font-family: inherit; margin: 0px; padding: 0px;'><br /></div><div style='font-family: inherit; margin: 0px; padding: 0px;'>This layer is derived from the April 1, 2019 version of the <a href='https://www.fema.gov/national-flood-hazard-layer-nfhl' rel='nofollow ugc' style='color: rgb(0, 121, 193); text-decoration-line: none; font-family: inherit;' target='_blank'>National Flood Hazard Layer</a> feature class S_Fld_Haz_Ar. The data were aggregated into eight classes to produce the Esri Symbology field based on symbology provided by FEMA. All other layer attributes are derived from the National Flood Hazard Layer. The layer was projected to Web Mercator Auxiliary Sphere and the resolution set to 1 meter.</div><div style='font-family: inherit; margin: 0px; padding: 0px;'><br /></div><div style='font-family: inherit; margin: 0px; padding: 0px;'>To improve performance Flood Zone values &quot;Area Not Included&quot;, &quot;Open Water&quot;, &quot;D&quot;, &quot;NP&quot;, and No Data were removed from the layer. Areas with Flood Zone value &quot;X&quot; subtype &quot;Area of Minimal Flood Hazard&quot; were also removed. An <a href='https://www.arcgis.com/home/item.html?id=11955f1b47ec41a3af86650824e0c634' rel='nofollow ugc' style='color: rgb(0, 121, 193); text-decoration-line: none; font-family: inherit;' target='_blank'>imagery layer created from this dataset</a> provides access to the full set of records in the National Flood Hazard Layer.</div><div style='font-family: inherit; margin: 0px; padding: 0px;'><br /></div><div style='font-family: inherit; margin: 0px; padding: 0px;'>A <a href='https://www.arcgis.com/home/item.html?id=fedc7c080e7f434186e0e623e0062c5b' rel='nofollow ugc' style='color: rgb(0, 121, 193); text-decoration-line: none; font-family: inherit;' target='_blank'>web map featuring this layer</a> is available for you to use.</div><div style='font-family: inherit; margin: 0px; padding: 0px;'><br /></div></div><div style='font-family: inherit; margin: 0px; padding: 0px;'><div style='font-family: inherit; margin: 0px; padding: 0px;'><font size='4' style='font-family: inherit;'>What can you do with this Feature Layer?</font></div><div style='font-family: inherit; margin: 0px; padding: 0px;'><font size='4' style='font-family: inherit;'><br /></font></div><div style='font-family: inherit; margin: 0px; padding: 0px;'>Feature layers work throughout the ArcGIS system. Generally your work flow with feature layers will begin in ArcGIS Online or ArcGIS Pro. Below are just a few of the things you can do with a feature service in Online and Pro.</div><div style='font-family: inherit; margin: 0px; padding: 0px;'><br /></div><div style='font-family: inherit; margin: 0px; padding: 0px;'><b>ArcGIS Online</b></div><div style='font-family: inherit; margin: 0px; padding: 0px;'><ul><li>Add this layer to a map in the map viewer. The layer is limited to scales of approximately 1:1,000,000 or larger but an <a href='https://www.arcgis.com/home/item.html?id=11955f1b47ec41a3af86650824e0c634' rel='nofollow ugc' style='color: rgb(0, 121, 193); text-decoration-line: none; font-family: inherit;' target='_blank'>imagery layer</a> created from the same data can be used at smaller scales to produce a <a href='https://www.arcgis.com/home/item.html?id=fedc7c080e7f434186e0e623e0062c5b' rel='nofollow ugc' style='color: rgb(0, 121, 193); text-decoration-line: none; font-family: inherit;' target='_blank'>webmap</a> that displays across the full range of scales. The layer or a map containing it can be used in an application.</li></ul></div><div style='font-family: inherit; margin: 0px; padding: 0px;'><ul><li>Change the layer’s transparency and set its visibility range</li></ul><ul><li>Open the layer’s attribute table and make selections and apply filters. Selections made in the map or table are reflected in the other. Center on selection allows you to zoom to features selected in the map or table and show selected records allows you to view the selected records in the table.</li></ul><ul><li>Change the layer’s style and filter the data. For example, you could change the symbology field to Special Flood Hazard Area and set a filter for = “T” to create a map of only the special flood hazard areas. </li></ul><ul><li>Add labels and set their properties</li></ul><ul><li>Customize the pop-up</li></ul><ul><li>Use in <a href='https://doc.arcgis.com/en/arcgis-online/analyze/use-analysis-tools.htm' rel='nofollow ugc' style='color: rgb(0, 121, 193); text-decoration-line: none; font-family: inherit;' target='_blank'>analysis tools</a> to discover patterns in the data</li></ul></div><div style='font-family: inherit; margin: 0px; padding: 0px;'><b>ArcGIS Pro</b></div><div style='font-family: inherit; margin: 0px; padding: 0px;'><ul><li>Add this layer to a 2d or 3d map. The same scale limit as Online applies in Pro</li></ul><ul><li>Use as an input to geoprocessing. For example, copy features allows you to select then export portions of the data to a new feature class. Areas up to 1,000-2,000 features can be exported successfully.</li></ul><ul><li>Change the symbology and the attribute field used to symbolize the data</li></ul><ul><li>Open table and make interactive selections with the map</li></ul><ul><li>Modify the pop-ups</li></ul><ul><li>Apply Definition Queries to create sub-sets of the layer</li></ul></div></div><div style='font-family: inherit; margin: 0px; padding: 0px;'><div style='font-family: inherit; margin: 0px; padding: 0px;'>This layer is part of the <a href='https://livingatlas.arcgis.com/' rel='nofollow ugc' style='color: rgb(0, 121, 193); text-decoration-line: none; font-family: inherit;' target='_blank'>Living Atlas of the World</a> that provides an easy way to explore the landscape layers and many other beautiful and authoritative maps on hundreds of topics.</div></div></div>",
        id: '527151eb840d46f3aa5dcfa5ac13d561',
        visible: true,
        opacity: 1,
     
    },
    {
        title: 'Wildfire Hazard Potential, Version 2020 Classified (Image Service)',
        author: 'U.S. Forest Service',
        icon: 'local_fire_department',
        description:
        'This dataset is the wildfire hazard potential (WHP), version 2020, classified into 5 classes: very low, low, moderate, high, and very high. It is intended for use in strategic wildland fuels and land management planning at broad scales.',
        longDescription:
        "<font style='font-family:&quot;Avenir Next W01&quot;, &quot;Avenir Next W00&quot;, &quot;Avenir Next&quot;, Avenir, &quot;Helvetica Neue&quot;, sans-serif; font-size:16px;'><font color='#000000' style='font-family:inherit;'><span style='font-family:inherit;'>Wildfire hazard potential (WHP) is an index that depicts </span><span style='font-family:inherit;'>the relative potential for wildfire that would be difficult for suppression resources to contain, based on wildfire simulation modeling. This dataset produced by </span><span style='font-family:inherit;'>the USDA Forest Service, Fire Modeling Institute in 2020 shows WHP at </span>a spatial resolution of <span style='font-family:inherit;'>270 meters across the entire conterminous United States, classified into five </span><span style='font-family:inherit;'>WHP classes of very low, low, moderate, high, and very high. </span><span style='font-family:inherit;'>Areas mapped with higher WHP values represent fuels with a higher probability of experiencing torching, crowning, and other forms of extreme fire behavior under conducive weather conditions, based primarily on 2014 landscape conditions. This WHP dataset is based on </span></font></font><font style='font-family:&quot;Avenir Next W01&quot;, &quot;Avenir Next W00&quot;, &quot;Avenir Next&quot;, Avenir, &quot;Helvetica Neue&quot;, sans-serif; font-size:16px;'><a href='https://www.fs.usda.gov/rds/archive/catalog/RDS-2016-0034-2' style='color:rgb(0, 121, 193); text-decoration-line:none; font-family:inherit;' target='_blank' rel='nofollow ugc noopener noreferrer'>outputs of wildfire simulation modeling published in 2020</a><font color='#000000' style='font-family:inherit;'><span style='font-family:inherit;'>.</span></font></font><div style='font-family:&quot;Avenir Next W01&quot;, &quot;Avenir Next W00&quot;, &quot;Avenir Next&quot;, Avenir, &quot;Helvetica Neue&quot;, sans-serif; font-size:16px;'><div style='font-family:inherit;'><div style='font-family:inherit;'><div style='font-family:inherit;'><div style='font-family:inherit;'></div></div></div><font color='#000000' style='font-family:inherit;'><span style='font-family:inherit;'></span></font></div></div><div style='font-family:&quot;Avenir Next W01&quot;, &quot;Avenir Next W00&quot;, &quot;Avenir Next&quot;, Avenir, &quot;Helvetica Neue&quot;, sans-serif; font-size:16px;'><font color='#000000' style='font-family:inherit;'><br /></font></div><div style='font-family:&quot;Avenir Next W01&quot;, &quot;Avenir Next W00&quot;, &quot;Avenir Next&quot;, Avenir, &quot;Helvetica Neue&quot;, sans-serif; font-size:16px;'><font color='#000000' style='font-family:inherit;'>Starting with the 2020 version, the WHP dataset is integrated with the </font><a href='https://wildfirerisk.org/' style='color:rgb(0, 121, 193); text-decoration-line:none; font-family:inherit;' target='_blank' rel='nofollow ugc noopener noreferrer'>Wildfire Risk to Communities</a> <font color='#000000' style='font-family:inherit;'>project. The 2020 dataset is the first version to include Alaska and Hawaii. There is a spatially-refined, 30-m resolution version of the WHP as part of the downloadable </font><a href='https://www.fs.usda.gov/rds/archive/Catalog/RDS-2020-0016' style='color:rgb(0, 121, 193); text-decoration-line:none; font-family:inherit;' target='_blank' rel='nofollow ugc noopener noreferrer'>Wildfire Risk to Communities data</a><font color='#000000' style='font-family:inherit;'>, and related datasets that depict other components of wildfire hazard and risk to homes.</font></div><div style='font-family:&quot;Avenir Next W01&quot;, &quot;Avenir Next W00&quot;, &quot;Avenir Next&quot;, Avenir, &quot;Helvetica Neue&quot;, sans-serif; font-size:16px;'><font color='#000000' style='font-family:inherit;'><br /></font></div><div style='font-family:&quot;Avenir Next W01&quot;, &quot;Avenir Next W00&quot;, &quot;Avenir Next&quot;, Avenir, &quot;Helvetica Neue&quot;, sans-serif; font-size:16px;'><font color='#000000' style='font-family:inherit;'><b>This 2020 version supersedes all previous versions of Wildfire Hazard Potential (2018, 2014) or Wildland Fire Potential (2012, 2010, 2007)</b>. We generally do not advise direct comparisons between versions because changes can reflect improvements in methodology at all stages of the WHP calculation in addition to actual land cover changes.</font></div><div style='font-family:&quot;Avenir Next W01&quot;, &quot;Avenir Next W00&quot;, &quot;Avenir Next&quot;, Avenir, &quot;Helvetica Neue&quot;, sans-serif; font-size:16px;'><font color='#000000' style='font-family:inherit;'><br /></font></div><div style='font-family:&quot;Avenir Next W01&quot;, &quot;Avenir Next W00&quot;, &quot;Avenir Next&quot;, Avenir, &quot;Helvetica Neue&quot;, sans-serif; font-size:16px;'><font color='#000000' style='font-family:inherit;'>For more information and to download the raster data, please visit the </font><a href='https://www.firelab.org/project/wildfire-hazard-potential' style='color:rgb(0, 121, 193); text-decoration-line:none; font-family:inherit;' target='_blank' rel='nofollow ugc noopener noreferrer'>Wildfire Hazard Potential website</a><font color='#000000' style='font-family:inherit;'>.</font></div><div style='font-family:&quot;Avenir Next W01&quot;, &quot;Avenir Next W00&quot;, &quot;Avenir Next&quot;, Avenir, &quot;Helvetica Neue&quot;, sans-serif; font-size:16px;'><font color='#000000' style='font-family:inherit;'><br /></font></div><div style='font-family:&quot;Avenir Next W01&quot;, &quot;Avenir Next W00&quot;, &quot;Avenir Next&quot;, Avenir, &quot;Helvetica Neue&quot;, sans-serif; font-size:16px;'><font color='#000000' style='font-family:inherit;'>Map author: Greg Dillon, USDA Forest Service, Rocky Mountain Research Station, Fire Modeling Institute</font></div>",
        id: '55226e8547f84aae8965210a9801c357',
        visible: true,
        opacity: 1,

        },
    {
        title: 'CEQ_CEJScreen_Tool',
        author: 'HARC',
        icon: 'gavel',
        description: 'The Climate and Economic Justice Screening Tool provides important information by identifying communities that experience high burdens. These communities are considered disadvantaged. This information will be used for the Justice40 Initiative. The current version of the tool is 1.0. The tool will be regularly updated based on research, feedback, and the availability of new datasets.  This tool utilizes the census tract boundaries from 2010 because they match the datasets used in the tool. Last Update: 11/22/2022.',
        longDescription: "<div style='text-align:Left;'><div><div><p><span>The Climate and Economic Justice Screening Tool (“CEJST” or “tool”) is a critical component of the Biden- Harris Administration’s historic commitment to advancing environmental justice. In Executive Order 14008 on Tackling the Climate Crisis at Home and Abroad, President Biden directed the White House Council on Environmental Quality (CEQ) to develop a geospatial mapping tool to identify disadvantaged communities that face burdens. These communities have been marginalized by society, overburdened by pollution, and underserved by infrastructure and other basic services.Federal agencies will use the CEJST for the Justice40 Initiative. It will help them identify disadvantaged communities that should benefit from the Justice40 Initiative. The Justice40 Initiative seeks to deliver 40% of the overall benefits of certain Federal investments to disadvantaged communities. These investments relate to seven areas: climate change; clean energy and energy efficiency; clean transit; affordable and sustainable housing; the remediation and reduction of legacy pollution; the development of critical clean water and wastewater infrastructure; and training and workforce development. This task of delivering the benefits of hundreds of Federal programs to disadvantaged communities is challenging. It requires fundamental and sweeping changes to the ways in which the whole Federal government operates.On November 22, 2022, CEQ launched version 1.0 of the CEJST. Version 1.0 incorporates feedback that CEQ received on the beta—or draft—version of the tool. CEQ had previously launched the beta version of the tool on February 18, 2022 with support from the U.S. Digital Service, and in collaboration with other Federal agencies and departments. The tool was released in a beta version in order to solicit feedback from Federal agencies, Tribal Nations, state and local governments, the White House Environmental Justice Advisory Council (WHEJAC), key stakeholders, and the public. By the end of the public comment period, CEQ/USDS had received almost 3,000 comments on the tool. Feedback was gathered through a variety of methods during the beta period, including: a Request for Information posted in the Federal Register, which had a 90 day comment period; an email support inbox; a survey accessible via the CEJST; census tract level feedback that could be provided via the map, and listening sessions. CEQ and USDS also conducted three public trainings and two agency-only trainings on the tool. They also met one-on-one with nearly 20 agencies with Justice40 covered programs. In addition, CEQ held two Tribal consultations on the tool to provide Tribal Nations with meaningful opportunities for input, consistent with CEQ’s Action Plan for Consultation and Coordination with Tribal Nations, President Biden’s Memorandum on Tribal Consultation and Strengthening Nation-to-Nation Relationships, and Executive Order 13175 on Consultation and Coordination With Indian Tribal Governments.The CEJST is available at https://screeningtool.geoplatform.gov. The tool uses publicly-available, nationally-consistent datasets to identify disadvantaged communities. The datasets are indicators of burdens that disadvantaged communities face. These burdens are related to climate change, environment, health, and economic opportunity. Communities are considered disadvantaged if they are in census tracts that meet the thresholds for at least one of the tool’s categories of burden, or if they are on the lands of Federally Recognized Tribes. The CEJST features a user-friendly, searchable map of all 50 states, the District of Columbia, and the U.S. territories. The CEJST website also has data files, such as spreadsheets and shapefiles, available for download.This technical support document describes the data and methodology used in version 1.0 of the CEJST. It is organized as follows: Section II describes the methodology; Section III describes the data sources; Section IV describes changes to the user interface; and Section V concludes with next steps.</span></p></div></div></div>",
        id: '64fae3f01548437e81a04bfce1cdc0b8',
        visible: true,
        opacity: 1,

    },
    {
        title: 'HIFLD_US_Electric_Power_Transmission_Lines',
        author: 'HARC',
        icon: 'power',
        description: 'This feature class/shapefile is for the Homeland Infrastructure Foundation Level Database (HIFLD)  and the Energy modelling and simulation community.',
        longDescription: "This feature class/shapefile represents electric power transmission lines. Transmission Lines are the system of structures, wires, insulators and associated hardware that carry electric energy from one point to another in an electric power system. Lines are operated at relatively high voltages varying from 69 kV up to 765 kV, and are capable of transmitting large quantities of electricity over long distances. Underground transmission lines are included where sources were available. The following updates have been made since the previous release: 7,935 features added, geographic coverage expanded to include Alaska and Hawaii, the METHOD and DATE fields renamed to VAL_METHOD and VAL_DATE respectively, and new fields have been included, namely, TYPE, NAICS_CODE, NAICS_DESC, and SOURCEDATE. Disclaimer: This product is for informational purposes only and may not be suitable for legal, engineering, or surveying purposes. It does not represent an official survey and represents only the approximate relative location of features and boundaries. Mapping may not necessarily reflect on-the-ground conditions. This product and those involved in its production make no claims as to the accuracy or reliability of the data, and neither assumes, nor will accept liability for their use.",
        id: '13b4728b7403404cb72b52b5367a1ad6',
        visible: true,
        opacity: 1,
     
    },
    ],
    mapLayers: [],
    getOrganizationName: function(orgId, token = null) {
        const baseUrl = `https://www.arcgis.com/sharing/rest/portals/${orgId}`
        const params = new URLSearchParams({ f: 'json' })
        if (token) params.append('token', token)

        const url = `${baseUrl}?${params.toString()}`

        return fetch(url)
            .then((response) => {
            if (!response.ok) throw new Error('Failed to fetch portal info')
            return response.json()
            })
            .then((data) => {
            if (data.name) {
                return data.name
            }
        })
    },
    searchPortal: function() {
        const portal = new Portal()
        portal.load().then(() => {
            const queryParams = new PortalQueryParams({
            query: `(title:"${this.searchTerm}" OR tags:"${this.searchTerm}*" OR description:"${this.searchTerm}") AND (type:"Feature Service" OR type:"Image Service") AND access:public AND contentstatus:public_authoritative`,
            sortField: 'num_views',
            sortOrder: 'asc',
            num: 10,
            })
            portal.queryItems(queryParams).then((results) => {
            this.searchResults = [] // Clear previous results
            results.results.forEach((item) => {
                const orgId = item.sourceJSON.orgId
                this.getOrganizationName(orgId).then((orgName) => {
                console.log(item)
                this.searchResults.push({
                    id: item.id,
                    title: item.title,
                    description: item.snippet,
                    longDescription: item.description,
                    org: orgName || 'Unknown',
                    visible: true,
                    opacity: 1.0
                })
                })
            })
            })
        })
    },
    addLayerToMap: function(layer){
        console.log(layer)
        const portalItemId = layer.id; 
        const arcgisMap = document.querySelector('arcgis-map') 
        // Create a layer from the portal item
        Layer.fromPortalItem({
            portalItem: {
            id: portalItemId
            },
            id: 'layer0'
        })
        .then(function(layer) {
        // Add the created layer to the map
        arcgisMap.map.add(layer);
        console.log("Feature layer added from portal item:", layer.title);
        })
        .catch(function(error) {
            console.error("Error loading feature layer from portal item:", error);
        });
    },
    removeLayer: function(layerInfo,index){
        this.mapLayers.splice(index, 1);
        const arcgisMap = document.querySelector('arcgis-map')
        const mapLayer = arcgisMap.map.layers.find(layer => {
         return layer.portalItem && layer.portalItem.id === layerInfo.id; 
        })
        arcgisMap.map.remove(mapLayer);
    },
    toggleVisibility: function(layerInfo){
        const arcgisMap = document.querySelector('arcgis-map')
        const mapLayer = arcgisMap.map.layers.find(layer => {
         return layer.portalItem && layer.portalItem.id === layerInfo.id; 
        })
        if (mapLayer) {
            mapLayer.visible = !mapLayer.visible;
            layerInfo.visible = mapLayer.visible; 
        }
    },
    changeLayerOpacity: function(layerInfo){
        const arcgisMap = document.querySelector('arcgis-map')
        const mapLayer = arcgisMap.map.layers.find(layer => {
         return layer.portalItem && layer.portalItem.id === layerInfo.id; 
        })
        if (mapLayer) {
            mapLayer.opacity = layerInfo.opacity;
        }
    },
    logout: function(){
        this.tab = 'mycontent';
        this.userLoggedIn = false;
        this.searchResults = [];
        this.mapLayers.forEach((layerInfo) => {
            const arcgisMap = document.querySelector('arcgis-map') 
            const mapLayer = arcgisMap.map.layers.find(layer => {
             return layer.portalItem && layer.portalItem.id === layerInfo.id; 
            })
            if (mapLayer) {
                arcgisMap.map.remove(mapLayer);
            }
        })
        this.mapLayers = [];
    
    }   
}))