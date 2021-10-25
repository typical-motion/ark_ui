<template>
<div class="panel">
    <div class="panel-header">
        <slot name="header"></slot>
    </div>
    <div class="panel-body">
        <slot name="body"></slot>
    </div>
</div>
</template>

<script>
export default {

}
</script>

<style lang="less">
.panel {
    width: 100%;
    height: 100%;
    background-color: #08080a;

    &-body {
        width: 100%;
        height: 100%;
    }

}
</style>
