<template>
<div class="flex">
    <imu-panel topic="/imu"></imu-panel>
</div>
</template>

<script>
import ImuPanel from '../panel/ImuPanel.vue'
export default {
    components: {
        ImuPanel
    },

}
</script>

<style>

</style>
