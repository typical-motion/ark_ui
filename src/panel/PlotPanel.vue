<template>
<panel class="plot-panel">
    <template v-slot:header> </template>
    <template v-slot:body>
        <div class="chart-wrapper">
            <v-chart class="chart" :option="option" @datazoom="updateDataZoom" />
            <div class="chart-wrapper-gui" ref="chartGUI"></div>
        </div>
    </template>
</panel>
</template>

<script>
import {
    find,
    get,
    keys,
    map
} from "lodash";

import {
  registerTheme,
    use
} from "echarts/core";
import {
    CanvasRenderer
} from "echarts/renderers";
import {
    PieChart
} from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
} from "echarts/components";

import VChart, {
    THEME_KEY,
    UPDATE_OPTIONS_KEY
} from "vue-echarts";

import {
    ref,
    watch,
    defineComponent,
    getCurrentInstance
} from "vue";

import arkTheme from '../assets/ark.json'

use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);

registerTheme('ark', arkTheme)

export default defineComponent({
    name: "PlotPanel",
    components: {
        VChart,
    },
    provide: {
        [THEME_KEY]: "ark",
        [UPDATE_OPTIONS_KEY]: {
            notMerge: true,
        },
    },
    props: {
        topics: Array,
        selectedRowKeys: Array,
    },
    setup(props) {
        const {
            appContext
        } = getCurrentInstance();

        const dataZoom = ref({
            type: "inside",
            start: 80,
            end: 100,
        });
        const updateDataZoom = ({
            start,
            end,
            startValue,
            endValue
        }) => {
            dataZoom.value.start = start;
            dataZoom.value.end = end;
            dataZoom.value.startValue = startValue;
            dataZoom.value.endValue = endValue;
        };

        const series = ref([]);

        const option = ref({
            textStyle: {
                fontFamily: 'MonoLisa, Monaco, "DejaVu Sans Mono", "Lucida Console"'
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: "none",
                    },
                    restore: {},
                    saveAsImage: {},
                },
            },
            tooltip: {
                trigger: "axis",
                position: function (pt) {
                    return [pt[0], "10%"];
                },
            },
            title: {
                text: "Ark Scope",
                left: "center",
            },
            xAxis: {
                type: "time",
            },
            yAxis: {
                type: "value",
                boundaryGap: [0, "100%"],
            },
            dataZoom: [
                dataZoom.value,
                {
                    start: 0,
                    end: 20,
                },
            ],
            series: series,
        });
        const subscribedTopics = ref({});

        const bindSubscribers = (serie, topic) => {
            if (subscribedTopics[topic["topic"]] == undefined) {
                subscribedTopics[topic["topic"]] = {
                    topic: new ROSLIB.Topic({
                        ros: appContext.config.globalProperties.$ros,
                        name: topic["topic"],
                        type: topic["topicType"],
                    }),
                    fields: {},
                };
                subscribedTopics[topic["topic"]].topic.subscribe((msg) => {
                    const date = new Date();
                    keys(subscribedTopics[topic["topic"]].fields).forEach((field) => {
                        subscribedTopics[topic["topic"]].fields[field].data.value.push([
                            date.getTime(),
                            get(msg, field),
                        ]);
                    });
                });
            }
            if (
                subscribedTopics[topic["topic"]].fields[topic["field"]] == undefined
            ) {
                subscribedTopics[topic["topic"]].fields[topic["field"]] = {
                    serie: serie,
                    data: ref([]),
                };
            }

            serie.data =
                subscribedTopics[topic["topic"]].fields[topic["field"]].data.value;
        };

        const updateSeries = () => {
            let newSeries = [];
            for (let index = 0; index < props.selectedRowKeys.length; index++) {
                const key = props.selectedRowKeys[index];
                const topic = find(props.topics, {
                    key: key,
                });
                const serie = {
                    name: topic["name"],
                    type: "line",
                    smooth: false,
                    symbol: "none",
                    itemStyle: {
                        color: topic.color,
                    },
                    data: [],
                };
                newSeries.push(serie);
                bindSubscribers(serie, topic);
            }
            series.value = newSeries;
        };

        watch(() => props.selectedRowKeys, updateSeries);
        watch(() => map(props.topics, "color"), updateSeries);
        updateSeries();

        return {
            option,
            subscribedTopics,
            updateDataZoom,
        };
    },
});
</script>

<style lang="less">
.chart-wrapper .chart {
    height: 50vh;
}
</style>
