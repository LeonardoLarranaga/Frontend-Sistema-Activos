<template>
    <div ref="googleSignInButton" style="display: flex; justify-content: center;" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { store } from '../store'

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
    const base64URL = token.split('.')[1]
    const base64 = base64URL.replace(/-/g, '+').replace(/_/g, '/')

    const payload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))

    return JSON.parse(payload)
}

async function onSuccess(googleUser) {
    const user = parseJWT(googleUser.credential)
    console.log(googleUser.credential)
    console.log(user)

    const blob = new Blob([googleUser.credential], {
        type: "text/plain"
    })

    console.log(blob)

    const text = await new Response(blob).text()
    console.log(text)

    globalStore.updateUser({
        name: user.name,
        image: user.picture
    })

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