<template>
<a-layout id="layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
        <div class="logo" />
        <a-menu theme="dark" mode="inline">
            <a-menu-item key="1">
                <router-link to="/rosout">
                    <user-outlined />
                    <span>实时日志</span>
                </router-link>
            </a-menu-item>
            <a-menu-item key="2">
                <router-link to="/imu">
                    <OneToOneOutlined />
                    <span>陀螺仪</span>
                </router-link>
            </a-menu-item>
            <a-menu-item key="3">
                <router-link to="/scope">
                    <LineChartOutlined />
                    <span>波形显示</span>
                </router-link>
            </a-menu-item>
            <a-menu-item key="4">
                <CameraOutlined />
                <span>相机</span>
            </a-menu-item>
            <a-menu-item key="5">
                <router-link to="/pid">
                <PercentageOutlined />
                <span>PID</span>
                </router-link>
            </a-menu-item>

            <a-menu-item v-for="category in arkui.categories" :key="category.key">
                <router-link :to="{ name: 'ArkUI', params: { category: category.key }}">
                <span>{{ category.name }}</span>
                </router-link>
            </a-menu-item>
        </a-menu>
    </a-layout-sider>
    <a-layout>
        <a-layout-header :style="{ padding: 0 }">
            <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
            <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
            <CheckCircleTwoTone twoToneColor="#52c41a" v-if="rosConnected" />
            <LoadingOutlined v-else />
        </a-layout-header>
        <a-layout-content :style="{ margin: '0', padding: '24px', background: '#111', minHeight: '280px' }">
            <router-view></router-view>
        </a-layout-content>
        <a-layout-footer :style="{ textAlign: 'center' }">
            Ark Interface
        </a-layout-footer>
    </a-layout>
</a-layout>
</template>

<style lang="less" scoped>
#layout {
    height: 100%;
    background: rgba(41,52,65,1);
}

#layout .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;

    &::hover {
        color: #1890ff;
    }
}

#layout .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
}
</style>

<script>
import {
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LoadingOutlined,
    CheckCircleTwoTone,
    LineChartOutlined,
    CameraOutlined,
    PercentageOutlined,
    OneToOneOutlined
} from '@ant-design/icons-vue';
import {
    notification
} from 'ant-design-vue';
import ImuPanel from './panel/ImuPanel.vue'
export default {
    components: {
        UserOutlined,
        MenuUnfoldOutlined,
        MenuFoldOutlined,
        LoadingOutlined,
        CheckCircleTwoTone,
        LineChartOutlined,
        CameraOutlined,
        PercentageOutlined,
        OneToOneOutlined
    },
    data() {
        return {
            collapsed: false,
            rosConnected: false,
            backendUrl: 'ws://192.168.152.131:11312',
            arkui: {
                categories: [],
            }
        }
    },
    mounted() {
        this.rosConnected = false
        this.$ros.connect(this.backendUrl)
        this.$ros.on('connection', () => {
            notification['success']({
                message: '连接成功',
                description: `Ark 已连接至后端 ${this.backendUrl}.`,
            });
            this.rosConnected = true

            // Fetch Renders
            let serviceArkUI = new ROSLIB.Service({
                ros: this.$ros,
                name: "/ark/bridge/arkui/update",
                serviceType: "ark_bridge/arkui_update"
            })
            serviceArkUI.callService(new ROSLIB.ServiceRequest({
                operation: 2,
                key: ""
            }), data => {
                this.arkui.categories = data.detials
            }, () => {
                notification['error']({
                    message: '无法读取设置',
                    description: `Ark 无法读取到后端UI。`,
                });
            })
        })
        this.$ros.on('disconnected', () => {
            notification['error']({
                message: '连接断开',
                description: `Ark 与后端链接断开，正在尝试重新连接。`,
            });
            this.rosConnected = false
            setTimeout(() => this.$ros.connect(this.backendUrl), 3000);
        })

        this.$ros.on('error', () => {
            notification['error']({
                message: '连接失败',
                description: `Ark 无法至后端 ${this.backendUrl}，请检查您的设置。`,
            });
            this.rosConnected = false
            setTimeout(() => this.$ros.connect(this.backendUrl), 3000);
        })
    }
}
</script>
