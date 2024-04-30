<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
      >
      <v-list-item
          title="Sistema de Control de Activos"
          subtitle="Usuario"
          nav
        >
          <template v-slot:append>
            <v-btn
              :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
              variant="text"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-key-chain" title="Login" value="home" link to="/"></v-list-item>
          <v-list-item prepend-icon="mdi-package" title="Activos" value="account" link to="/activos"></v-list-item>
          <v-list-item prepend-icon="mdi-account-tie" title="Responsables" value="users" link to="/responsables"></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main style="height: 100vh">
        <router-view/>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
  export default {
    data () {
      return {
        drawer: true,
        rail: true,
      }
    },
  }
</script>