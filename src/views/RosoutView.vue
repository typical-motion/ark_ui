<template>
<div class="terminal">
    <div class="terminal-header"></div>
    <div class="terminal-body">
        <log-prompt-component v-for="el in msgs" v-bind:key="el.header.seq" v-bind="el" />
    </div>
    <div class="terminal-footer"></div>
</div>
</template>

<script>
import LogPromptComponent from "../components/LogPromptComponent.vue";
export default {
    components: {
        LogPromptComponent,
    },
    inject: ['ros'],
    data() {
        return {
            rosoutSubscriber: undefined,
            msgs: [],
        };
    },
    mounted() {
        console.log(this.ros.value)
        this.rosoutSubscriber = new ROSLIB.Topic({
            ros: this.$ros,
            name: "/rosout",
            messageType: "rosgraph_msgs/Log",
        });
        this.rosoutSubscriber.subscribe((msg) => {
            if(this.msgs.length < 30) {
            } else {
                this.msgs.shift()
            }
            this.msgs.push(msg)
        });
    },
};
</script>

<style>
.terminal {
    color: #fff;
    font-family: "Proxima Nova", "Fira Code", "Helvetica Neue", helvetica, arial,
        sans-serif;
    font-weight: 300;
    font-size: 14px;
    line-height: 1.5;
    padding-top: 2rem;
    margin: 0 auto 2rem;
    box-shadow: 0 .25rem .5rem darken(#232323, 10%);
    border-radius: 0 0 .1rem .1rem;
    text-align: left;
}

.terminal-header {
    background: #191919;
    height: 36px;
    border-radius: 0.5rem 0.5rem 0 0;
}

.terminal-body {
    height: 50rem;
    background: #232323;
    padding: 18px;
    overflow-y: scroll;
}
</style>
