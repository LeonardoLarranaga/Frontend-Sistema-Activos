import { defineStore } from "pinia"
import { useLocalStorage } from "@vueuse/core"

export const store = defineStore('store', {
    state: () => {
        return {
            isSignedIn: useLocalStorage('isSignedIn', false),
            rail: useLocalStorage('rail', false),
            user: useLocalStorage('user', {}),
            saludo: useLocalStorage('saludo', "")
        }
    },

    actions: {
        updateIsSignedIn(payload) {
            this.isSignedIn = payload
        },

        updateRail(payload) {
            this.rail = payload
        },

        updateUser(payload) {
            this.user = payload
        },

        updateSaludo(payload) {
            this.saludo = payload
        }
    }
})