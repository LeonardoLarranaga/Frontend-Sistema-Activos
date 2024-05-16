<template>
    <div ref="googleSignInButton" style="display: flex; justify-content: center;" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { store } from '../store'
import { Buffer } from 'buffer'
import axios from 'axios'

const globalStore = store()

const googleSignInButton = ref(null)

onMounted(() => {
    window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_CLIENT_ID_GOOGLE,
        callback: onSuccess,
        context: 'signin',
        auto_select: false,
        referrerPolicy: {
            policy: 'strict-origin-when-cross-origin'
        }
    })

    window.google.accounts.id.renderButton(
        googleSignInButton.value, {
        text: 'continue_with',
        size: 'large',
        width: '400',
        theme: 'outline',
        logo_alignment: 'center'
    })
})

async function onSuccess(googleUser) {
    try {
        const response = await axios.post(`https://localhost:4000/passport/google/`, { googleUser: googleUser })

        globalStore.updateUser({
            name: response.data.user.name,
            email: response.data.user.email,
            image: response.data.user.image
        })

        globalStore.updateHeaders({ headers: { Authorization: `bearer ${response.data.token}` } })

        globalStore.updateIsSignedIn(true)
        globalStore.updateRail(true)

        const hora = new Date().getHours()
        let mensaje

        if (hora >= 5 && hora < 12) {
            mensaje = `¡Buenos días, ${globalStore.user.name}!`
        } else if (hora >= 12 && hora < 18) {
            mensaje = `¡Buenas tardes, ${globalStore.user.name}!`
        } else {
            mensaje = `¡Buenas noches, ${globalStore.user.name}!`
        }

        globalStore.updateSaludo(mensaje)
    } catch (error) {
        console.log(error)
    }
}
</script>