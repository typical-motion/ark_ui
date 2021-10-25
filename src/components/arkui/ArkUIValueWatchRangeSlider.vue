<template>
  <a-form-item :label="name">
    <a-slider range v-model:value="form" @blur="save()" @change="save()" :min="min" :max="max"/>
  </a-form-item>
</template>

<script setup>
import { ref, getCurrentInstance, toRefs, onUnmounted } from "vue";
const { appContext } = getCurrentInstance();

const props = defineProps({
  uris: String,
  name: String,
});

const { uris, name } = toRefs(props);
const key = ref(uris.value.map((i) => i.substr(17)));
const form = ref(uris.value.map((i) => 0));
const last = ref(form.value.map((i) => 0));
const min = ref(0);
const max = ref(100);
const topics = [];
const service = new ROSLIB.Service({
  ros: appContext.config.globalProperties.$ros,
  name: "/ark/bridge/valuewatcher/get",
  serviceType: "ark_bridge/value_get",
});
key.value.map((el, i) => {
  service.callService(
    new ROSLIB.ServiceRequest({ key: el }),
    (data) => {
      form.value[i] = data.detial.value.value;
      last.value[i] = data.detial.value.value;
      min.value = data.detial.min_value
      max.value = data.detial.max_value
    },
    () => {}
  );
  topics[i] = new ROSLIB.Topic({
    ros: appContext.config.globalProperties.$ros,
    name: "/ark/bridge/valuewatcher/" + el,
    type: "ark_bridge/value_value",
  });
  topics[i].subscribe((data) => {
    if (last.value[i] == form.value[i]) return;
    form.value[i] = data.value.value;
    last.value[i] = data.value.value;
  });
});

const save = () => {
    console.log(form.value)
  form.value.forEach((el, i) => {
    if (last.value[i] == form.value[i]) return;
    let msg = new ROSLIB.Message({
      value: form.value[i],
    });
    topics[i].publish(msg);
    last.value[i] = form.value[i];
  });
};

onUnmounted(() => {
  topics.forEach((i) => i.unsubscribe());
});
</script>

<style>
</style>
