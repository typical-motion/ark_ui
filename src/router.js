import { createRouter, createWebHashHistory } from 'vue-router'

import RosoutView from './views/RosoutView.vue'
import ImuView from './views/ImuView.vue'
import GenericPlotView from './views/GenericPlotView.vue'
import PidView from './views/PidView.vue'
import ArkUIView from './views/ArkUIView.vue'
const HelloWorld = { template: '<div>Home</div>' }

const routes = [
    { path: '/', component: HelloWorld },
    { path: '/imu', component: ImuView },
    { path: '/scope', component: GenericPlotView },
    { path: '/rosout', component: RosoutView },
    { path: '/pid', component: PidView },
    { path: '/arkui/:category', component: ArkUIView, name: "ArkUI" }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export { router }