<template>
<div class="flex flex-col">
    <PlotPanel :topics="data" :selectedRowKeys="selectedRowKeys" />
    <div class="symbols">
        <a-table :columns="columns" :data-source="data" :row-selection="{ onChange: updateSymbolSelection, selections: data }">
            <template #title>
                <div class="float-right">
                    <a-button type="primary" shape="circle">
                        <template #icon><PlusOutlined /></template>
                    </a-button>
                    <a-button type="link" size="large">
                            <PlusOutlined />
                    </a-button>
                    <a-button type="link">
                        <template #icon>
                            <PlayCircleOutlined />
                        </template>
                    </a-button>
                    <a-button type="link">
                        <template #icon>
                            <PauseOutlined />
                        </template>
                    </a-button>
                    <a-button type="link">
                        <template #icon>
                            <CloseOutlined />
                        </template>
                    </a-button>
                </div>

            </template>

            <template #color="{ record }">
                <ColorPicker class="color-picker" theme="dark" style="width: 220px;" :color="color" :sucker-hide="false" @changeColor="color => updateColor(record, color)" v-if="record.showColorPicker">
                    <a-button @click="toggleColorPicker(record)" type="link">确定</a-button>
                </ColorPicker>
                <a-button :style="{ backgroundColor: record.color}" @click="toggleColorPicker(record)">{{ record.color }}</a-button>
            </template>
        </a-table>
    </div>
</div>
</template>

<script>
import PlotPanel from '../panel/PlotPanel.vue'

import {
    ColorPicker
} from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'

import {
    PlayCircleOutlined,
    PauseOutlined,
    CloseOutlined,
    PlusOutlined,

} from '@ant-design/icons-vue';
export default {
    name: 'GenericPlotView',
    components: {
        PlotPanel,
        PlayCircleOutlined,
        PauseOutlined,
        CloseOutlined,
        PlusOutlined,
        ColorPicker
    },
    computed: {
        topics() {

        }
    },
    data() {
        return {
            columns: [{
                    dataIndex: 'name',
                    key: 'name',
                    title: 'Name'
                },
                {
                    title: 'Color',
                    dataIndex: 'color',
                    key: 'color',
                    slots: {
                        customRender: 'color',
                    },
                },
                {
                    title: 'Topic',
                    dataIndex: 'topic',
                    key: 'topic',
                },
                {
                    title: 'Field',
                    dataIndex: 'field',
                    key: 'field',
                },
                {
                    title: 'Min',
                    key: 'min',
                    dataIndex: 'min',
                },
                {
                    title: 'Max',
                    key: 'max',
                    dataIndex: 'max',
                },
                {
                    title: 'Y Resolution',
                    key: 'resolution',
                    dataIndex: 'resolution',
                },
                {
                    title: 'Y Offset',
                    key: 'offset',
                    dataIndex: 'offset'
                }
            ],
            data: [],
            selectedRowKeys: []
        }
    },
    mounted() {
        this.data = [{
                key: '1',
                name: 'Oret.X',
                color: '#a31f42',
                topic: '/imu',
                topicType: 'sensor_msgs/Imu',
                field: 'orientation.x',
                min: '-',
                max: '-',
                resolution: 1,
                offset: 1,
                showColorPicker: false,
            },
            {
                key: '2',
                name: 'Oret.Y',
                color: '#123a11',
                topic: '/imu',
                topicType: 'sensor_msgs/Imu',
                field: 'orientation.y',
                min: '-',
                max: '-',
                resolution: 1,
                offset: 1,
                showColorPicker: false,
            },
        ];
    },
    methods: {
        toggleColorPicker(record) {
            record.showColorPicker = !record.showColorPicker
        },
        updateColor(record, color) {
            record.color = color.hex
        },
        updateSymbolSelection(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys
        }
    }
}
</script>

<style>
.symbols {
    font-family: 'Courier New', Courier, monospace;
}

.color-picker {
    position: absolute;
    top: -260px;
}
</style>
