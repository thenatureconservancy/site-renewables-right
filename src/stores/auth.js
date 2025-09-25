import { defineStore } from "pinia";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import IdentityManager from "@arcgis/core/identity/IdentityManager";
import Portal from "@arcgis/core/portal/Portal"
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams.js";
import { ref } from 'vue'
import { useAgolStore } from "./arcGisOnline";
import { useSearchStore } from "./searchbar"


export const useAuthStore = defineStore("auth", () => ({
  
  buttonLabel: ref('Log in to ArcGIS Online'),
  userName: ref(''),
  userLoggedIn: false,
  loading: false,

  async login() {
    console.log('login')
      const info = new OAuthInfo({
        appId: "7weYTc9WhQGVB7Ju", // update per app
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
        this.GetMyContent()
        this.GetMyGroupsContent()
        this.GetMyOrgsContent()
        this.userLoggedIn = true   
      } catch (error) {
        console.log(error);
        alert("There was a problem connecting to the site.");
      }
  },
  GetMyContent() {
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
          num: 100
          });
          portal.queryItems(queryParams).then((results) => {
             
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
            agolStore.myContent = plainItems

          }).catch(error => {
            console.error("Error querying user content:", error);
          });
        });
      }).catch(error => {
        console.error("User not signed in:", error);
    });
  },
  SearchMyContent() {
    const searchStore = useSearchStore()
    IdentityManager.checkSignInStatus("https://www.arcgis.com/sharing").then(() => {
        const portal = new Portal({
          url: "https://www.arcgis.com",
          authMode: "immediate"
        });

        portal.load().then(() => {
        const username = portal.user.username;

        const queryParams = new PortalQueryParams({
          query: `(title:"${searchStore.searchTerm}" OR tags:"${searchStore.searchTerm}*" OR description:"${searchStore.searchTerm}") AND owner:${username} AND (type:"Feature Layer" OR type:"Feature Service" OR type:"Hosted Feature Layer" OR type:"Image Service")`,
          sortField: "title",
          sortOrder: "asc",
          num: 10
          });
          portal.queryItems(queryParams).then((results) => {
            searchStore.searchResults.total = results.total 
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
            searchStore.searchResults.results = plainItems
          }).catch(error => {
            console.error("Error querying user content:", error);
          });
        });
      }).catch(error => {
        console.error("User not signed in:", error);
    });
  },
  GetMyGroupsContent(){
    
    IdentityManager.checkSignInStatus("https://www.arcgis.com/sharing").then(() => {
      const portal = new Portal({
        url: "https://www.arcgis.com",
        authMode: "immediate"
      });

      portal.load().then(() => {
        const user = portal.user;
        let groupList = []
        let allGroupContent = []
        let groupContent = []
        const agolStore = useAgolStore()
        user.fetchGroups().then((groups) => {
          console.log("User Groups:", groups);

          groups.forEach(group => {
            console.log(`Fetching content for group: ${group.title} (ID: ${group.id})`);
            groupList.push(group.title)
            const queryParams = new PortalQueryParams({
              query: `group:${group.id} AND (type:"Feature Layer" OR type:"Feature Service" OR type:"Hosted Feature Layer" OR type:"Image Service")`,
              sortField: "title",
              sortOrder: "asc",
              num: 50
            });
            
            portal.queryItems(queryParams).then((results) => {
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
            groupContent[group.title] = plainItems
            }).catch(error => {
              console.error(`Error querying group "${group.title}":`, error);
            });
          });
          agolStore.allGroupContent = groupContent
          agolStore.groups = groupList
          agolStore.selectedGroup = groupList[0]
        });

        }).catch(error => {
          console.error("User not signed in:", error);
        });
    });
    
  },
  SearchMyGroupsContent(){
    
    IdentityManager.checkSignInStatus("https://www.arcgis.com/sharing").then(() => {
      const portal = new Portal({
        url: "https://www.arcgis.com",
        authMode: "immediate"
      });

      portal.load().then(() => {
        const user = portal.user;
        let groupContent = []
        const searchStore = useSearchStore()
        user.fetchGroups().then((groups) => {

          for (let i=0; i<groups.length; i++){
            const queryParams = new PortalQueryParams({
              query: `(title:"${searchStore.searchTerm}" OR tags:"${searchStore.searchTerm}*" OR description:"${searchStore.searchTerm}") AND group:${groups[i].id} AND (type:"Feature Layer" OR type:"Feature Service" OR type:"Hosted Feature Layer" OR type:"Image Service")`,
              sortField: "title",
              sortOrder: "asc",
              num: 10
            });
            
            portal.queryItems(queryParams).then((results) => {
              searchStore.searchResults.total = results.total 
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
          searchStore.searchResults.results = groupContent
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
  GetMyOrgsContent(){
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
          num: 100
        });

        portal.queryItems(queryParams).then((results) => {
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
            agolStore.orgContent = plainItems
        }).catch(error => {
          console.error("Error querying organization content:", error);
        });
      });
    }).catch(error => {
      console.error("User not signed in:", error);
    });
  },
  SearchMyOrgsContent(){
   const searchStore = useSearchStore()
    IdentityManager.checkSignInStatus("https://www.arcgis.com/sharing").then(() => {
      const portal = new Portal({
        url: "https://www.arcgis.com",
        authMode: "immediate"
      });

      portal.load().then(() => {
        const orgId = portal.id;

        const queryParams = new PortalQueryParams({
          query: `(title:"${searchStore.searchTerm}" OR tags:"${searchStore.searchTerm}*" OR description:"${searchStore.searchTerm}") AND orgid:${orgId} AND (type:"Feature Layer" OR type:"Feature Service" OR type:"Hosted Feature Layer" OR type:"Image Service")`,
          sortField: "title",
          sortOrder: "asc",
          num: 10
        });

        portal.queryItems(queryParams).then((results) => {
          searchStore.searchResults.total = results.total 
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
            searchStore.searchResults.results = plainItems
        }).catch(error => {
          console.error("Error querying organization content:", error);
        });
      });
    }).catch(error => {
      console.error("User not signed in:", error);
    });
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