<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {R} from "../../utils/R";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const metrics = ref({})
const nodes = ref([])
const filterText = ref('')

onMounted(() => {
  loadMetrics()
})
const loadMetrics = () => {
  nodes.value = []
  R.get('/api/cluster/metrics').then(res => {
    if (res.code === 0) {
      metrics.value = res.data

      const nodeMap = metrics.value['membership_config']['membership']['nodes'];
      for (const nodeId in nodeMap) {
        nodes.value.push({
          id: parseInt(nodeId),
          addr: nodeMap[nodeId]['addr']
        })
      }
      if (filterText.value) {
        nodes.value = nodes.value.filter(node => node.addr.includes(filterText.value))
      }
    }
  })
}

const timer = setInterval(() => {
  loadMetrics()
}, 5000)
onUnmounted(() => {
  clearInterval(timer)
})

</script>

<template>
  <div class="">
    <el-card>
      <template #header>
        <div class="flex-v flex-space-between">
          <h2>
            {{ t('集群管理') }}
          </h2>
          <div class="color-secondary">
            {{ t('Leader') }}：{{ metrics['current_leader'] }}
          </div>
          <div class="color-secondary">
            {{ t('Term') }}：{{ metrics['current_term'] }}
          </div>
          <div class="color-secondary">
            {{ t('Last Log Index') }}：{{ metrics['last_log_index'] }}
          </div>
          <div class="half-width flex-v">
            <el-input v-model="filterText" prefix-icon="search" class="mr10" :placeholder="t('节点地址模糊搜索')"
                      @input="loadMetrics"></el-input>
            <el-button type="primary" @click="loadMetrics" icon="search">
              {{ t('查询') }}
            </el-button>
          </div>
        </div>
      </template>
      <div v-if="metrics['current_leader'] === null">
        <el-alert :title="t('警告：当前集群状态异常')"
                  :description="t('当前集群状态异常，无法获取Leader节点，请检查集群节点是否宕机以及网络是否正常')"
                  type="warning"
                  show-icon
                  effect="dark"
                  :closable="false"></el-alert>
      </div>
      <div class="mt20">
        <el-table :data="nodes">
          <el-table-column :label="t('节点ID')">
            <template #default="{row}">
              {{ row.id }}
            </template>
          </el-table-column>
          <el-table-column :label="t('节点地址')">
            <template #default="{row}">
              {{ row.addr }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">

</style>