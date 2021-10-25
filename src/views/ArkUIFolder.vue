<template>
  <a-divider orientation="left" v-if="folder.children.length">{{ folder.name }}</a-divider>
  <template v-for="item in items" :key="item.key">
    <ArkUIValueWatch :uri="item.children[0]" :name="item.name" v-if="item.children[0].startsWith('ark_valuewatch://') && item.children.length == 1"/>
    <ArkUIValueWatchRangeSlider :uris="item.children" :name="item.name" v-if="item.children[0].startsWith('ark_valuewatch://') && item.children.length == 2"/>
    <ArkUIImageTransport :uri="item.children[0]" :name="item.name" v-if="item.children[0].startsWith('image_transport://')"/>
  </template>
</template>

<script setup>
import ArkUIValueWatch from '../components/arkui/ArkUIValueWatch.vue'
import ArkUIValueWatchRangeSlider from '../components/arkui/ArkUIValueWatchRangeSlider.vue'
import ArkUIImageTransport from '../components/arkui/ArkUIImageTransport.vue'

import { ref, getCurrentInstance, toRefs } from "vue";
const { appContext } = getCurrentInstance();

const props = defineProps({
  pkey: String,
});

const { pkey } = toRefs(props);
let serviceArkUI = new ROSLIB.Service({
  ros: appContext.config.globalProperties.$ros,
  name: "/ark/bridge/arkui/update",
  serviceType: "ark_bridge/arkui_update",
});

let fetchFolder = () =>
  new Promise((resolve, reject) =>
    serviceArkUI.callService(
      new ROSLIB.ServiceRequest({
        operation: 2,
        key: pkey.value,
      }),
      (data) => resolve(data.detials[0]),
      reject
    )
  );
let fetchItem = (key) =>
  new Promise((resolve, reject) => {
    serviceArkUI.callService(
      new ROSLIB.ServiceRequest({
        operation: 2,
        key: key,
      }),
      (data) => resolve(data.detials[0]),
      reject
    );
  });

let items = ref([]);
let folder = ref({
  children: []
});
fetchFolder()
  .then((_folder) => {
    folder.value = _folder;
    return Promise.all(_folder.children.map(fetchItem));
  })
  .then((_items) => {
    items.value = _items;
  });
</script>

<style>
</style>