<script setup>

import CopyText from "../../components/Copy/copy-text.vue";
import SvgIcon from "../../components/SvgIcon/index.vue";
import {useRoute, useRouter} from "vue-router";
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {CodeEditor} from 'monaco-editor-vue3';
import 'monaco-editor-vue3/dist/style.css';
import {R} from "../../utils/R";
import {ElMessage, ElMessageBox} from "element-plus";
import {useI18n} from 'vue-i18n';

const {t} = useI18n();

const router = useRouter();
const route = useRoute()
const namespace = computed(() => {
  return route.query.namespace_id
})
const serviceId = computed(() => {
  return route.query.service_id
})
const instances = ref([])
onMounted(() => {
  loadInstances()
})
const loadInstances = () => {
  R.get(`/api/discovery/instance/list`, {
    namespace_id: namespace.value,
    service_id: serviceId.value
  }).then(res => {
    if (res.code === 0) {
      instances.value = res.data
    }
  })
}
const timer = setInterval(() => {
  loadInstances()
}, 5000)
onUnmounted(() => {
  clearInterval(timer)
})

const offline = (row) => {
  R.postJson(`/api/discovery/instance/offline`, {
    namespace_id: namespace.value,
    service_id: serviceId.value,
    instance_id: row.id
  }).then(res => {
    if (res.code === 0) {
      loadInstances()
    }
  })
}

const online = (row) => {
  R.postJson(`/api/discovery/instance/online`, {
    namespace_id: namespace.value,
    service_id: serviceId.value,
    instance_id: row.id
  }).then(res => {
    if (res.code === 0) {
      loadInstances()
    }
  })
}

</script>

<template>
  <el-card>
    <template #header>
      <div class="flex-v">
        <el-icon size="20" class="mr10 cursor-pointer" @click="router.back()">
          <svg-icon icon-class="back"></svg-icon>
        </el-icon>
        <h1>{{ serviceId }}</h1>
        <div class="ml50">
          {{ t('命名空间ID') }}：
          <el-tag effect="plain">
            {{ namespace }}
            <copy-text :text="namespace"></copy-text>
          </el-tag>
        </div>
      </div>
    </template>
    <div class="mt10">
      <div class="flex-space-between">
        <div>
          <h3>{{ t('服务实例') }}</h3>
        </div>
        <div class="half-width flex-v">
          <el-select :placeholder="t('实例状态')" class="mr10">
            <el-option :label="t('全部')" value=""></el-option>
            <el-option :label="t('正常')" value="up"></el-option>
            <el-option :label="t('异常')" value="sick"></el-option>
            <el-option :label="t('下线')" value="offline"></el-option>
          </el-select>
          <el-input :placeholder="t('IP/端口模糊搜索')" prefix-icon="search" class="mr10"></el-input>
          <el-button type="primary" @click="loadInstances">{{ t('查询') }}</el-button>
        </div>
      </div>
    </div>
    <div class="mt10">
      <el-table :data="instances" max-height="calc(100vh - 210px)">
        <el-table-column :label="t('IP')">
          <template #default="{ row }">
            {{ row.ip }}
          </template>
        </el-table-column>
        <el-table-column :label="t('端口')">
          <template #default="{ row }">
            {{ row.port }}
          </template>
        </el-table-column>
        <el-table-column :label="t('实例状态')">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'Up'" type="success" effect="dark" disable-transitions>{{ t('正常') }}</el-tag>
            <el-tag v-if="row.status === 'Offline'" type="info" effect="dark" disable-transitions>{{
                t('已下线')
              }}
            </el-tag>
            <el-tag v-if="row.status === 'Down'" type="info" effect="dark" disable-transitions>{{
                t('已离线，即将清理')
              }}
            </el-tag>
            <el-tag v-else-if="row.status['Sick']" type="warning" effect="dark" disable-transitions>Sick:
              {{ row.status['Sick'] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('元数据')">
          <template #default="{ row }">
            {{ row.meta ? row.meta : '-' }}
          </template>
        </el-table-column>
        <el-table-column :label="t('操作')" width="100">
          <template #default="{ row }">
            <el-button v-if="row.status==='Up'" type="primary" @click="offline(row)">{{ t('下线') }}</el-button>
            <el-button v-if="row.status==='Offline'" type="primary" @click="online(row)">{{ t('上线') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.code-editor {
  width: 100%;
  height: calc(100vh - 380px);
}
</style>