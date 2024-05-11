<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        v-if="store.isSignedIn"
        v-model="drawer"
        :rail="store.rail"
        permanent
        @click="store.updateRail(false)"
        width="300"
      >
      <v-list-item title="Sistema de Control de Activos" :subtitle="store.user.name" :prepend-avatar="store.user.image" nav height="100">
          <template v-slot:append>
            <v-btn :icon="store.rail ? 'mdi-chevron-right' : 'mdi-chevron-left'" variant="text" @click.stop="store.updateRail(!store.rail)"/>
          </template>
        </v-list-item>

        <v-divider/>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-package" title="Activos" link to="/activos"/>
          <v-list-item prepend-icon="mdi-account-tie" title="Responsables" link to="/responsables"/>
          <v-list-item prepend-icon="mdi-archive-marker" title="Ubicaciones" link to="/ubicaciones"/>
          <v-list-item prepend-icon="mdi-tag-multiple" title="Tags" link to="/tags"/>
          <v-list-item v-if="!store.rail" prepend-icon="mdi-account-remove" title="Cerrar sesión" style="position: fixed !important; bottom: 0 !important; width: 100%;" @click="cerrarSesion()"/>
        </v-list>
      </v-navigation-drawer>
      <v-main style="height: 100vh">
        <router-view/>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
import { store } from './store'

  export default {
    data () {
      return {
        store: store(),
        drawer: true,
      }
    },

    methods: {
      cerrarSesion() {
        this.store.updateRail(false)
        this.store.updateIsSignedIn(false)
        this.store.updateUser({})
        this.$router.push("/")
      }
    }
  }
</script>