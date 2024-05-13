<template>
  <v-container>
    <v-responsive class="align-centerfill-height mx-auto" max-width="900">

      <div class="text-center">
        <v-img class="d-block mx-auto" width="125" height="125" src="@/assets/logo.png" />
        <h1 class="text-h3 font-weight-bold">Sistema de Control de Activos</h1>

        <div style="height: 20px;" />

        <div v-if="store.isSignedIn">
          <h2 style="color: #283593;">{{ store.saludo }}</h2>
        </div>
      </div>

      <div style="height: 20px;" />
      <google-sign-in-button v-if="!store.isSignedIn" />
    </v-responsive>
  </v-container>
</template>

<script>
import GoogleSignInButton from "@/components/GoogleSignInButton.vue"
import { store } from "@/store"

export default {
  data() {
    return {
      store: store(),
    }
  }
}
</script>