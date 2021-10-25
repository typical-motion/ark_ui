<template>
<a-tabs v-model:activeKey="activeKey">
    <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.name">
        <ArkUITab :tab="tab.key"/>
    </a-tab-pane>
</a-tabs>
</template>

<script setup>
import {
    ref,
    getCurrentInstance
} from 'vue';

import {
    notification
} from 'ant-design-vue'
import {
    useRoute
} from 'vue-router';

import ArkUITab from './ArkUITab.vue'

const route = useRoute();
// const id = route.params.id; // read parameter id (it is reactive) 

const {
    appContext
} = getCurrentInstance();
let activeKey = ref("default");

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
let fetchCategory = () => new Promise((resolve, reject) =>
    serviceArkUI.callService(new ROSLIB.ServiceRequest({
        operation: 2,
        key: route.params.category
    }), data => resolve(data.detials[0]), reject)
)
let fetchTab = key =>
    new Promise((resolve, reject) => {
        serviceArkUI.callService(new ROSLIB.ServiceRequest({
            operation: 2,
            key: key
        }), data => resolve(data.detials[0]), reject)
    })

let tabs = ref([])
fetchCategory().then(category => {
    console.log(category)
    return Promise.all(category.children.map(fetchTab))
})
.then(_tabs => {
    tabs.value = _tabs
    activeKey.value = _tabs[0].key
}).catch(fetchFailed)
</script>

<style>
</style>
