<script setup lang="ts">

import CopyText from "../../components/Copy/copy-text.vue";
import {onMounted, onUnmounted, ref, watch} from "vue";
import NamespaceSegmented from "../namespace/namespace-segmented.vue";
import {R} from "../../utils/R";
import {U} from "../../utils/util";
import {useRouter} from "vue-router";
import {ElMessageBox} from "element-plus";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const router = useRouter()
const namespace = ref<string>('public')
const services = ref([])
const page = ref({
  page_num: 1,
  page_size: 10,
  total: 0
})
onMounted(() => {
  loadServices()
})
const loadServices = () => {
  R.get('/api/discovery/service/list', {
    ...page.value,
    namespace_id: namespace.value,
  }).then(res => {
    services.value = res.data.list
    page.value.total = res.data.total
  })
}
watch(namespace, () => {
  loadServices()
})

const timer = setInterval(() => {
  loadServices()
}, 5000)
onUnmounted(() => {
  clearInterval(timer)
})

const toServiceDetail = (row: any) => {
  router.push({
    name: 'ServiceDetail',
    query: {
      namespace_id: namespace.value,
      service_id: row.service_id
    },
  })
}
const deleteService = (row: any) => {
  ElMessageBox.confirm(t('如果该服务下有存活的实例，仍然会自动注册，请先停止该服务下的所有实例后删除。'), t('提示'), {
    type: 'warning',
    confirmButtonText: t('确认并删除'),
  }).then(() => {
    R.postJson('/api/discovery/service/deregister', {
      namespace_id: namespace.value,
      service_id: row.service_id,
    }).then(res => {
      if (res.code === 0) {
        loadServices()
      }
    })
  })
}
</script>

<template>
  <div class="">
    <el-card>
      <template #header>
        <div class="flex-v">
          <h2>{{ t('服务管理') }}</h2>
          <div class="ml50">
            {{ t('命名空间ID') }}：
            <el-tag effect="plain" disable-transitions>public
              <copy-text :text="'public'"></copy-text>
            </el-tag>
          </div>
        </div>
      </template>
      <div>
        <namespace-segmented v-model="namespace"></namespace-segmented>
      </div>
      <div class="mt20">
        <div class="flex-space-between">
          <h2>
            {{ t('服务列表') }}
          </h2>
          <div class="flex-v half-width">
            <el-input prefix-icon="search" class="mr10" :placeholder="t('服务ID模糊搜索')"></el-input>
            <el-button type="primary" @click="loadServices" icon="search">
              {{ t('查询') }}
            </el-button>
          </div>
        </div>
      </div>
      <div class="mt20">
        <el-table :data="services">
          <el-table-column :label="t('服务ID')">
            <template #default={row}>
              {{ row.service_id }}
            </template>
          </el-table-column>
          <el-table-column :label="t('实例数量（健康 / 全部）')">
            <template #default={row}>
              <div class="number">
                {{ row.state.up_instances }} / {{ row.state.total_instances }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="t('注册时间')" prop="create_time">
            <template #default="{row}">
              {{ U.dateUtil.formatDateDefault(new Date(row.create_time)) }}
            </template>
          </el-table-column>
          <el-table-column :label="t('操作')" width="190">
            <template #default="{row}">
              <el-button type="primary" @click="toServiceDetail(row)">{{ t('详情') }}</el-button>
              <el-button type="danger" @click="deleteService(row)">{{ t('删除') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">

</style>