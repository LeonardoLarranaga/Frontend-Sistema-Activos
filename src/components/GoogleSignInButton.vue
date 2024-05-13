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

function parseJWT(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}

async function googleCredencialToToken(googleUser) {
    const jwtToken = await axios.post("https://localhost:4000/passport/crearJWT/", {credential: googleUser.credential})
    return jwtToken.data
}

async function onSuccess(googleUser) {
    const user = parseJWT(googleUser.credential)
    const jwtToken = await googleCredencialToToken(googleUser)

    globalStore.updateUser({
        name: user.name,
        image: user.picture,
        token: jwtToken
    })

    console.log(globalStore.user.token)    

    globalStore.updateIsSignedIn(true)
    globalStore.updateRail(true)

    const hora = new Date().getHours();
    let mensaje;

    if (hora >= 5 && hora < 12) {
        mensaje = `¡Buenos días, ${user.name}!`;
    } else if (hora >= 12 && hora < 18) {
        mensaje = `¡Buenas tardes, ${user.name}!`;
    } else {
        mensaje = `¡Buenas noches, ${user.name}!`;
    }

    globalStore.updateSaludo(mensaje)
}
</script>