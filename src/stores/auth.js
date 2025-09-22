import { defineStore } from "pinia";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import IdentityManager from "@arcgis/core/identity/IdentityManager";
import Portal from "@arcgis/core/portal/Portal"
import PortalItem from "@arcgis/core/portal/PortalItem.js";
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
        //this.GetMyGroupsContent()
        //this.GetMyOrgsContent()
           
      } catch (error) {
        console.log(error);
        alert("There was a problem connecting to the site.");
      }
  },
  //id: '9de47e18a68743ff9beb0be82bc5c545', access
  GetMyContent() {
    this.userLoggedIn = true
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
              opacity: 1

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
  GetMyGroupsContent(){
    IdentityManager.checkSignInStatus("https://www.arcgis.com/sharing").then(() => {
      const portal = new Portal({
        url: "https://www.arcgis.com",
        authMode: "immediate"
      });

      portal.load().then(() => {
        const user = portal.user;

        user.fetchGroups().then((groups) => {
          console.log("User Groups:", groups);

          groups.forEach(group => {
            console.log(`Fetching content for group: ${group.title} (ID: ${group.id})`);
            const queryParams = new PortalQueryParams({
              query: `group:${group.id} AND (type:"Feature Layer" OR type:"Feature Service" OR type:"Hosted Feature Layer" OR type:"Image Service")`,
              sortField: "title",
              sortOrder: "asc",
              num: 50
            });


            portal.queryItems(queryParams).then((results) => {
              console.log(`Content from group "${group.title}":`, results.results);
            }).catch(error => {
              console.error(`Error querying group "${group.title}":`, error);
            });
          });
        });

    }).catch(error => {
      console.error("User not signed in:", error);
    });
    });
  },
  GetMyOrgsContent(){
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
          console.log("Organization Content:", results.results);
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