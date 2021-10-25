<template>
<a-form-item :label="name">
    <a-input-number v-model:value="form" @pressEnter="save()" @blur="save()" />
</a-form-item>
</template>

<script setup>
import {
    ref,
    getCurrentInstance,
    toRefs,
    onUnmounted
} from "vue";
const {
    appContext
} = getCurrentInstance();

const props = defineProps({
    uri: String,
    name: String
});

const {
    uri,
    name
} = toRefs(props);
const key = uri.value.substr(17);
const form = ref(0)
const last_value = ref(0)
const service = new ROSLIB.Service({
    ros: appContext.config.globalProperties.$ros,
    name: "/ark/bridge/valuewatcher/get",
    serviceType: "ark_bridge/value_get",
});
service.callService(
    new ROSLIB.ServiceRequest({
        key: key,
    }),
    (data) => {
        form.value = data.detial.value.value
        last_value.value = data.detial.value.value
    },
    () => {

    }
);
const valueUpdated = data => {
    if (last_value.value == form.value) return;
    form.value = data.value.value
    last_value.value = form.value
}
const topic = new ROSLIB.Topic({
    ros: appContext.config.globalProperties.$ros,
    name: "/ark/bridge/valuewatcher/" + key,
    type: "ark_bridge/value_value",
})
topic.subscribe(valueUpdated)
const save = () => {
    if (last_value.value == form.value) return;
    let msg = new ROSLIB.Message({
        value: form.value
    });
    topic.publish(msg)
    last_value.value = form.value
};

onUnmounted(() => {
    topic.unsubscribe(valueUpdated)
})
</script>

<style>
</style>
