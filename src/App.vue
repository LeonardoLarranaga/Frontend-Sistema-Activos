<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer v-if="store.isSignedIn" v-model="drawer" :rail="store.rail" permanent
        @click="store.updateRail(false)" width="300">
        <v-list-item title="Sistema de Control de Activos" :subtitle="store.user.name"
          :prepend-avatar="store.user.image" nav height="100" style="word-wrap: break-word;">
          <template v-slot:append>
            <v-btn :icon="store.rail ? 'mdi-chevron-right' : 'mdi-chevron-left'" variant="text"
              @click.stop="store.updateRail(!store.rail)" />
          </template>
        </v-list-item>

        <v-divider />

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-package" title="Activos" link to="/activos" />
          <v-list-item prepend-icon="mdi-account-tie" title="Responsables" link to="/responsables" />
          <v-list-item prepend-icon="mdi-archive-marker" title="Ubicaciones" link to="/ubicaciones" />
          <v-list-item prepend-icon="mdi-tag-multiple" title="Tags" link to="/tags" />

          <div style="position: fixed !important; bottom: 0 !important; width: 100%;">
            <v-list-item v-if="!store.rail" prepend-icon="mdi-folder-key-network" title="Cambiar permisos"
              @click="this.dialog = true" />
            <v-list-item v-if="!store.rail" prepend-icon="mdi-account-remove" title="Cerrar sesión"
              @click="cerrarSesion()" />
          </div>
        </v-list>
      </v-navigation-drawer>
      <v-main style="height: 100vh">
        <router-view />
      </v-main>
    </v-layout>
  </v-card>

  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>Cambiar permisos</v-card-title>
      <v-card-subtitle>{{ this.store.user.name }}</v-card-subtitle>

      <v-row>
        <v-col cols="12" sm="6">
          <v-checkbox label="Solo Lectura" v-model="leer" />
        </v-col>

        <v-col cols="12" sm="6">
          <v-checkbox label="Lectura y Escritura" v-model="leerEscribir" />
        </v-col>

        <v-col class="d-flex">
          <v-text-field v-model="pass" :type="showPassword ? 'text' : 'password'" label="Contraseña" style="margin-right: 16px; margin-left: 10px;"/>
          <v-btn icon @click="showPassword = !showPassword" style="margin-right: 8px">
            <v-icon>{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-card-actions>
        <v-spacer />
        <v-btn color="indigo-darken-2" variant="text" @click="dialog = false">Cancelar</v-btn>
        <v-btn color="indigo-darken-2" variant="tonal" @click="cambiarPermisos()">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="this.errorDialog" max-width="300px">
    <v-card color="red">
      <v-card-title style="color: white;" class="text-wrap text-center">{{ errorMessage }}</v-card-title>
      <v-btn variant="tonal" @click="errorDialog = false; error = ''" style="color: white;">OK</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
import { store } from './store'
import axios from 'axios'

export default {
  data() {
    return {
      store: store(),
      drawer: true,
      dialog: false,
      leer: false,
      leerEscribir: false,
      pass: "",
      errorDialog: false,
      errorMessage: "",
      showPassword: false
    }
  },

  watch: {
    async dialog(val) {
      if (val) {
        try {
          const permisos = (await axios.get(`https://localhost:4000/usuario/token/${this.store.user.token}`)).data.permisos
          if (permisos === "r") {
            this.leer = true
            this.leerEscribir = false
          } else {
            this.leer = false
            this.leerEscribir = true
          }
        } catch (error) {
          this.errorMessage = error.response.data || "Error de conexión."
          this.errorDialog = true
        }
      }
    },

    leer(val) {
      if (val) this.leerEscribir = false
    },

    leerEscribir(val) {
      if (val) this.leer = false
    }
  },

  methods: {
    cerrarSesion() {
      this.store.updateRail(false)
      this.store.updateIsSignedIn(false)
      this.store.updateUser({})
      this.store.updateSaludo("")
      this.store.updateHeaders({})
      this.$router.push("/")
    },

    async cambiarPermisos() {
      try {
        const permisos = this.leerEscribir ? "rw" : "r"

        const pass = this.pass.length === 0 ? "0000" : this.pass
        await axios.patch(`https://localhost:4000/usuario/${this.store.user.token}/${permisos}/${pass}/`)

        window.location.reload()
      } catch (error) {
        this.errorMessage = error.response.data || "Error de conexión."
        this.errorDialog = true
      }
    }
  }
}
</script>