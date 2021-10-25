<template>
<panel class="imu-panel">
    <template v-slot:header>
    </template>
    <template v-slot:body>
        <div class="canvas-wrapper">
            <Renderer ref="renderer" :orbitCtrl="true" resize="parent">
                <Camera ref="camera" :position="{ x:0, y: 2, z: 10 }" />
                <Scene ref="scene">
                    <AmbientLight :intensity="0.4"/>
                    <DirectionalLight color="#B1E1FF" :position="{x: 20, y: 20, z: 20}" :target="{x: 15, y: 10, z: 5}"/>
                    <Box ref="box" :scale="boxScale">
                        <LambertMaterial />
                    </Box>
                </Scene>
            </Renderer>
            <div class="canvas-wrapper-gui" ref="canvasGUI"></div>
        </div>
    </template>
</panel>
</template>

<script>
import * as THREE from 'three';
import {
    GUI
} from 'dat.gui'
const gui = new GUI({
    autoPlace: false
});
export default {
    name: 'ImuPanel',
    props: {
        topic: String
    },
    data() {
        return {
            boxScale: {
                x: 4.0,
                y: 6.0,
                z: 2.0
            }
        }
    },
    mounted() {
        const renderer = this.$refs.renderer;
        const scene = this.$refs.scene;
        const box = this.$refs.box.mesh;

        scene.add(new THREE.AxesHelper());
        scene.add(new THREE.GridHelper());

        this.initGUI();

        var IMUSubscriber = new ROSLIB.Topic({
            ros: this.$ros,
            name: this.topic,
            messageType: "sensor_msgs/Imu",
        });
        IMUSubscriber.subscribe(msg => box.quaternion.copy(msg.orientation));

    },
    methods: {
        initGUI() {
            let menuBoxSettings = gui.addFolder("Box Settings")
            menuBoxSettings.add(this.boxScale, "x").name("x");
            menuBoxSettings.add(this.boxScale, "y").name("y");
            menuBoxSettings.add(this.boxScale, "z").name("z");
            this.$refs.canvasGUI.appendChild(gui.domElement);
        }
    }
}
</script>

<style lang="less" scoped>
.canvas-wrapper {
    position: relative;
    width: 100%;

    min-height: 600px;

    &-gui {
        position: absolute;
        top: 0px;
    }
}
</style>
