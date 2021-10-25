<template>
    {{ name }}
  <div :id="canvasId"></div>
  <img :src="streamUrl">
</template>

<script setup>
import {
    ref,
    getCurrentInstance,
    toRefs,
    onUnmounted,
    onMounted
} from "vue";
const {
    appContext
} = getCurrentInstance();

const props = defineProps({
    uri: String,
    name: String
});

const { uri, name } = toRefs(props);

const streamUrl = `http://192.168.152.131:11313/stream?type=ros_compressed&topic=${uri.value.substr(18)}`
const canvasId = ref("arkui_imagetransport_" + (Math.random() + 1).toString(36).substring(7))
/*
onMounted(() => {
    const viewer = new MJPEGCANVAS.Viewer({
        divID : canvasId.value,
        host : '192.168.152.131',
        port: 11313,
        width : 640,
        height : 640,
        topic : uri.value.substr(18)
    })
})
*/
</script>

<style>

</style>