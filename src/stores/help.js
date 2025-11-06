import { defineStore } from 'pinia';

export const useHelpStore = defineStore('helpStore', () => ({
    showDialog: true,
    doc: { 
        
        section: 'Area Explorer',
        bufferSize:  'Buffer size can be adjusted to align with the scale of the project',

    }

}))