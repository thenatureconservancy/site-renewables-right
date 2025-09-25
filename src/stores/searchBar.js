import { defineStore } from 'pinia';
import Portal from '@arcgis/core/portal/Portal.js'
import PortalQueryParams from '@arcgis/core/portal/PortalQueryParams.js'


export const useSearchStore = defineStore('searchStore', () => ({
    searchResults: {results: [], total: 0},
    searchTerm: '',
    totalPages: 0,
    activePage: "1",
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
            this.searchResults.results = [] 
            this.searchResults.total = results.total
            results.results.forEach((item) => {
                const orgId = item.sourceJSON.orgId
                this.getOrganizationName(orgId).then((orgName) => {
                      this.searchResults.results.push({
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
  
}))