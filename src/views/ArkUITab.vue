<template>
<a-row>
    <a-col :span="12">
        <ArkUIFolder v-for="folder in folders" :key="folder" :pkey="folder"/>
    </a-col>
</a-row>
</template>

<script setup>
import ArkUIFolder from './ArkUIFolder.vue'

import {
    ref,
    getCurrentInstance,
    toRefs
} from 'vue';

const props = defineProps({
  tab: String,
});

const { tab } = toRefs(props);
const {
    appContext
} = getCurrentInstance();
let serviceArkUI = new ROSLIB.Service({
    ros: appContext.config.globalProperties.$ros,
    name: "/ark/bridge/arkui/update",
    serviceType: "ark_bridge/arkui_update"
})

let fetchFailed = () => {
    notification['error']({
        message: '无法读取设置',
        description: `Ark 无法读取到后端UI。`,
    });
}
let fetchTab = () => new Promise((resolve, reject) =>
    serviceArkUI.callService(new ROSLIB.ServiceRequest({
        operation: 2,
        key: tab.value
    }), data => resolve(data.detials[0]), reject)
)
let fetchFolder = key =>
    new Promise((resolve, reject) => {
        serviceArkUI.callService(new ROSLIB.ServiceRequest({
            operation: 2,
            key: key
        }), data => resolve(data.detials[0]), reject)
    })

let folders = ref([])
fetchTab().then(tab => folders.value = tab.children)
/*
fetchTab().then(tab => Promise.all(tab.children.map(fetchFolder)))
.then(_folders => {
    console.log(_folders)
    folders.value = _folders
})
*/
</script>

<style>

</style>