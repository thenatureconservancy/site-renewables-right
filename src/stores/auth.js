import { defineStore } from "pinia";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import IdentityManager from "@arcgis/core/identity/IdentityManager";
import Portal from "@arcgis/core/portal/Portal"
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams.js";
import { ref } from 'vue'
import { useAgolStore } from "./arcGisOnline";


export const useAuthStore = defineStore("auth", () => ({
  
  buttonLabel: ref('Log in to ArcGIS Online'),
  userName: ref(''),
  userLoggedIn: false,
  loading: false,

  async login() {
    console.log('login')
      const info = new OAuthInfo({
        appId: "e7NHuTIvSj0dRYPV", // update per app
        popup: false,
        expiration: 20160, // 14 days in mins
      });
      this.info = info
      IdentityManager.registerOAuthInfos([info]);
      try {
        const credentials = await IdentityManager.getCredential(
          info.portalUrl + "/sharing",
          {
            oAuthPopupConfirmation: false,
          }
        );
        console.log(credentials)
        this.buttonLabel = 'Logout of ArcGIS Online'
        
        //this.userName = credentials.userId
        this.GetMyContent(1)
        this.GetMyGroups()
        this.GetMyOrgsContent(1)
        this.userLoggedIn = true   
      } catch (error) {
        console.log(error);
        alert("There was a problem connecting to the site.");
      }
  },
  //authenticated functions
  GetMyContent(start) {
    const agolStore = useAgolStore()
    IdentityManager.checkSignInStatus("https://www.arcgis.com/sharing").then(() => {
        const portal = new Portal({
          url: "https://www.arcgis.com",
          authMode: "immediate"
        });

        portal.load().then(() => {
        const username = portal.user.username;

        const queryParams = new PortalQueryParams({
          query: `owner:${username} AND (type:"Feature Layer" OR type:"Feature Service" OR type:"Hosted Feature Layer" OR type:"Image Service")`,
          sortField: "title",
          sortOrder: "asc",
          num: 100,
          start: start
          });
          portal.queryItems(queryParams).then((results) => {
            agolStore.myContent.total = results.total
            const plainItems = results.results.map(item => ({
              id: item.id,
              title: item.title,
              type: item.type,
              url: item.url,
              snippet: item.snippet,
              owner: item.owner,
              description: item.description,
              visible: true,
              opacity: 1,
              iconUrl: item.iconUrl,
              displayName: item.displayName
            }));
            agolStore.myContent.results = plainItems

          }).catch(error => {
            console.error("Error querying user content:", error);
          });
        });
      }).catch(error => {
        console.error("User not signed in:", error);
    });
  },
  SearchMyContent(start) {
    const agolStore = useAgolStore()
    IdentityManager.checkSignInStatus("https://www.arcgis.com/sharing").then(() => {
        const portal = new Portal({
          url: "https://www.arcgis.com",
          authMode: "immediate"
        });

        portal.load().then(() => {
        const username = portal.user.username;

        const queryParams = new PortalQueryParams({
          query: `(title:"${agolStore.searchTerm}" OR tags:"${agolStore.searchTerm}*" OR description:"${agolStore.searchTerm}") AND owner:${username} AND (type:"Feature Layer" OR type:"Feature Service" OR type:"Hosted Feature Layer" OR type:"Image Service")`,
          sortField: "title",
          sortOrder: "asc",
          num: 10,
          start: start
          });
          portal.queryItems(queryParams).then((results) => {
            agolStore.searchResults.total = results.total 
            const plainItems = results.results.map(item => ({
              id: item.id,
              title: item.title,
              type: item.type,
              url: item.url,
              snippet: item.snippet,
              owner: item.owner,
              description: item.description,
              visible: true,
              opacity: 1,
              iconUrl: item.iconUrl,
              displayName: item.displayName
            }));
            agolStore.searchResults.results = plainItems
          }).catch(error => {
            console.error("Error querying user content:", error);
          });
        });
      }).catch(error => {
        console.error("User not signed in:", error);
    });
  },
  GetMyGroups(){
    IdentityManager.checkSignInStatus("https://www.arcgis.com/sharing").then(() => {
      const portal = new Portal({
        url: "https://www.arcgis.com",
        authMode: "immediate"
      });

      portal.load().then(() => {
        const user = portal.user;
        let groupList = []
        const agolStore = useAgolStore()
        user.fetchGroups().then((groups) => {
          console.log("User Groups:", groups);
           groups.forEach(group => {
             groupList.push({label: group.title, value: group.id})
           })
           agolStore.groups = groupList
           agolStore.selectedGroup = groupList[0]
           this.GetMyGroupsContent(groupList[0].value,1)
        })
      })
    })
  },
  GetMyGroupsContent(start){
    const agolStore = useAgolStore()
    let groupId = agolStore.selectedGroup.value
    IdentityManager.checkSignInStatus("https://www.arcgis.com/sharing").then(() => {
      const portal = new Portal({
        url: "https://www.arcgis.com",
        authMode: "immediate"
      });

      portal.load().then(() => {
        const queryParams = new PortalQueryParams({
          query: `group:${groupId} AND (type:"Feature Layer" OR type:"Feature Service" OR type:"Hosted Feature Layer" OR type:"Image Service")`,
          sortField: "title",
          sortOrder: "asc",
          num: 10,
          start: start
        });
            
        portal.queryItems(queryParams).then((results) => {
          agolStore.selectedGroupContent.total = results.total
          const plainItems = results.results.map(item => (
          {
          id: item.id,
          title: item.title,
          type: item.type,
          url: item.url,
          snippet: item.snippet,
          owner: item.owner,
          description: item.description,
          visible: true,
          opacity: 1,
          iconUrl: item.iconUrl,
          displayName: item.displayName
        }));
        agolStore.selectedGroupContent.results = plainItems
        }).catch(error => {
          console.error(`Error querying group :`, error);
        });
      });
    });
  },
  SearchMyGroupsContent(start){
    
    IdentityManager.checkSignInStatus("https://www.arcgis.com/sharing").then(() => {
      const portal = new Portal({
        url: "https://www.arcgis.com",
        authMode: "immediate"
      });

      portal.load().then(() => {
        const user = portal.user;
        let groupContent = []
        const agolStore = useAgolStore()
        user.fetchGroups().then((groups) => {

          for (let i=0; i<groups.length; i++){
            const queryParams = new PortalQueryParams({
              query: `(title:"${agolStore.searchTerm}" OR tags:"${agolStore.searchTerm}*" OR description:"${agolStore.searchTerm}") AND group:${groups[i].id} AND (type:"Feature Layer" OR type:"Feature Service" OR type:"Hosted Feature Layer" OR type:"Image Service")`,
              sortField: "title",
              sortOrder: "asc",
              num: 10,
              start: start
            });
            
            portal.queryItems(queryParams).then((results) => {
              agolStore.searchResults.total = results.total 
              if(results.results.length>0){
              const plainItems = results.results.map(item => (
              {
              id: item.id,
              title: item.title,
              type: item.type,
              url: item.url,
              snippet: item.snippet,
              owner: item.owner,
              description: item.description,
              visible: true,
              opacity: 1,
              iconUrl: item.iconUrl,
              displayName: item.displayName,
              group: groups[i].title
            }));
            console.log(plainItems)
            groupContent = [...groupContent, ...plainItems]
          }          
          agolStore.searchResults.results = groupContent
            }).catch(error => {
              console.error(`Error querying group "${groups[i].title}":`, error);
            });
          }

        });

        }).catch(error => {
          console.error("User not signed in:", error);
        });
    });
    
  },
  GetMyOrgsContent(start){
    const agolStore = useAgolStore()
    IdentityManager.checkSignInStatus("https://www.arcgis.com/sharing").then(() => {
      const portal = new Portal({
        url: "https://www.arcgis.com",
        authMode: "immediate"
      });

      portal.load().then(() => {
        const orgId = portal.id;

        const queryParams = new PortalQueryParams({
          query: `orgid:${orgId} AND (type:"Feature Layer" OR type:"Feature Service" OR type:"Hosted Feature Layer" OR type:"Image Service")`,
          sortField: "title",
          sortOrder: "asc",
          num: 10,
          start: start
        });

        portal.queryItems(queryParams).then((results) => {
          agolStore.orgContent.total = results.total
            const plainItems = results.results.map(item => ({
              id: item.id,
              title: item.title,
              type: item.type,
              url: item.url,
              snippet: item.snippet,
              owner: item.owner,
              description: item.description,
              visible: true,
              opacity: 1,
              iconUrl: item.iconUrl,
              displayName: item.displayName
            }));
            agolStore.orgContent.results = plainItems
        }).catch(error => {
          console.error("Error querying organization content:", error);
        });
      });
    }).catch(error => {
      console.error("User not signed in:", error);
    });
  },
  SearchMyOrgsContent(start){
   const agolStore = useAgolStore()
    IdentityManager.checkSignInStatus("https://www.arcgis.com/sharing").then(() => {
      const portal = new Portal({
        url: "https://www.arcgis.com",
        authMode: "immediate"
      });

      portal.load().then(() => {
        const orgId = portal.id;

        const queryParams = new PortalQueryParams({
          query: `(title:"${agolStore.searchTerm}" OR tags:"${agolStore.searchTerm}*" OR description:"${agolStore.searchTerm}") AND orgid:${orgId} AND (type:"Feature Layer" OR type:"Feature Service" OR type:"Hosted Feature Layer" OR type:"Image Service")`,
          sortField: "title",
          sortOrder: "asc",
          num: 10,
          start: start
        });

        portal.queryItems(queryParams).then((results) => {
          agolStore.searchResults.total = results.total 
            const plainItems = results.results.map(item => ({
              id: item.id,
              title: item.title,
              type: item.type,
              url: item.url,
              snippet: item.snippet,
              owner: item.owner,
              description: item.description,
              visible: true,
              opacity: 1,
              iconUrl: item.iconUrl,
              displayName: item.displayName
            }));
            agolStore.searchResults.results = plainItems
        }).catch(error => {
          console.error("Error querying organization content:", error);
        });
      });
    }).catch(error => {
      console.error("User not signed in:", error);
    });
  },
  //non authenticated functions
  searchPortal: function(start) {
    console.log(start)
    const agolStore = useAgolStore()
        const portal = new Portal()
        portal.load().then(() => {
            const queryParams = new PortalQueryParams({
            query: `(title:"${agolStore.searchTerm}" OR tags:"${agolStore.searchTerm}*" OR description:"${agolStore.searchTerm}") AND (type:"Feature Service" OR type:"Image Service") AND access:public AND contentstatus:public_authoritative`,
            sortField: 'num_views',
            sortOrder: 'asc',
            num: 10,
            start: start
            })
            portal.queryItems(queryParams).then((results) => {
            agolStore.searchResults.results = [] 
            agolStore.searchResults.total = results.total
            results.results.forEach((item) => {
                const orgId = item.sourceJSON.orgId
                this.getOrganizationName(orgId).then((orgName) => {
                      agolStore.searchResults.results.push({
                        id: item.id,
                        title: item.title,
                        snippet: item.snippet,
                        description: item.description,
                        owner: orgName || 'Unknown',
                        visible: true,
                        opacity: 1.0,
                        displayName: item.displayName,
                        iconUrl: item.iconUrl
                    })
                })
                
            })
        })
      })
  },
  getOrganizationName: async function(orgId) {
        const baseUrl = `https://www.arcgis.com/sharing/rest/portals/${orgId}`
        const params = new URLSearchParams({ f: 'json' })
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
  logout(){
    const agolStore = useAgolStore()
     //this resets the component and clears layers from the map
     agolStore.logout()
     // If already signed in, then destroy the credentials to sign out.
     this.buttonLabel = 'Log in to ArcGIS Online'
     IdentityManager.destroyCredentials();
     window.location.reload();
  }
  
}));