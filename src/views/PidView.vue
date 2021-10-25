<template>
  <div>
    <a-table :dataSource="dataSource" :columns="columns">
      <template #P="{ text, record }">
        <div class="editable-cell" :ref="el => { editableInputs[record.key] = el }">
          <div
            v-if="editableData[record.key] && editableData[record.key]['P'] !== undefined"
            class="editable-cell-input-wrapper"
          >
            <a-input
              v-model:value="editableData[record.key].P"
              @pressEnter="save(record.key)"
              @blur="save(record.key)"
            />
          </div>
          <div v-else class="editable-cell-text-wrapper" @click="edit(record.key, 'P')">
            {{ text || "0" }}
          </div>
        </div>
      </template>
      <template #I="{ text, record }">
        <div class="editable-cell" :ref="el => { editableInputs[record.key] = el }">
          <div
            v-if="editableData[record.key] && editableData[record.key]['I'] !== undefined"
            class="editable-cell-input-wrapper"
          >
            <a-input
              v-model:value="editableData[record.key].I"
              @pressEnter="save(record.key)"
              @blur="save(record.key)"
            />
          </div>
          <div v-else class="editable-cell-text-wrapper" @click="edit(record.key, 'I')">
            {{ text || "0" }}
          </div>
        </div>
      </template>
      <template #D="{ text, record }">
        <div class="editable-cell" :ref="el => { editableInputs[record.key] = el }">
          <div
            v-if="editableData[record.key] && editableData[record.key]['D'] !== undefined"
            class="editable-cell-input-wrapper"
          >
            <a-input
              v-model:value="editableData[record.key].D"
              @pressEnter="save(record.key)"
              @blur="save(record.key)"
            />
          </div>
          <div v-else class="editable-cell-text-wrapper" @click="edit(record.key, 'D')">
            {{ text || "0" }}
          </div>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { onBeforeUpdate, nextTick, computed, reactive, ref, getCurrentInstance } from 'vue';
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';

const {
    appContext
} = getCurrentInstance();

let dataSource = ref([
  {
    key: "speedCircle",
    name: "速度环",
    P: 200,
    I: 1,
    D: 300,
  },
]);
let columns = [
  {
    title: "#",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "P",
    dataIndex: "P",
    key: "P",
    width: '30%',
    slots: {
      customRender: "P",
    },
  },
  {
    title: "I",
    dataIndex: "I",
    key: "I",
    width: '30%',
    slots: {
      customRender: "I",
    },
  },
  {
    title: "D",
    dataIndex: "D",
    key: "D",
    width: '30%',
    slots: {
      customRender: "D",
    },
  },
];
const editableInputs = ref([])


onBeforeUpdate(() => {
  editableInputs.value = [];
});

const editableData = reactive({});

const edit = async (key, prop) => {
  await nextTick()
  editableData[key] = {}
  await nextTick()
  editableData[key][prop] = dataSource.value.filter((item) => key === item.key)[0][prop]
  await nextTick()
  editableInputs.value[key].firstElementChild.firstElementChild.focus()
};
let topic = new ROSLIB.Topic({
    ros: appContext.config.globalProperties.$ros,
    name: "/ark/bridge/valuewatcher/bridge/dspark",
    type: "ark_bridge/value_update",
})
topic.advertise()

const save = (key) => {
  Object.assign(
    dataSource.value.filter((item) => key === item.key)[0],
    editableData[key]
  );
  
  topic.publish(new ROSLIB.Message({
    value: 233
  }))
  delete editableData[key];
  
};
</script>

<style lang="less">
.editable-cell {
  position: relative;
  font-size: 16px;

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
    border: 1px solid #434343;
    border-radius: 2px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>