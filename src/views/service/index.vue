<script setup lang="ts">

import CopyText from "../../components/Copy/copy-text.vue";
import {onMounted, ref, watch} from "vue";
import NamespaceSegmented from "../namespace/namespace-segmented.vue";
import {R} from "../../utils/R";
import {U} from "../../utils/util";

const namespace = ref<string>('public')
const services = ref([])
const page = ref({
  page_num: 1,
  page_size: 10,
})
onMounted(() => {
  loadConfigs()
})
const loadConfigs = () => {
  R.get('/api/discovery/service/list', {
    ...page.value,
    namespace_id: namespace.value,
  }).then(res => {
    services.value = res.data.list
    page.value.total = res.data.total
  })
}
watch(namespace, () => {
  loadConfigs()
})
</script>

<template>
  <div class="">
    <el-card>
      <template #header>
        <div class="flex-v">
          <h1>服务管理</h1>
          <div class="ml50">
            命名空间ID：
            <el-tag effect="plain">public
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
          <h1>
            服务列表
          </h1>
          <div class="flex-v half-width">
            <el-select class="mr10" size="large" placeholder="服务状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="正常" value="normal"></el-option>
              <el-option label="丢失连接" value="abnormal"></el-option>
              <el-option label="不可用" value="disabled"></el-option>
            </el-select>
            <el-input prefix-icon="search" class="mr10" size="large" placeholder="服务ID模糊搜索"></el-input>
            <el-button type="primary" @click="toCreate" icon="search" size="large">
              查询
            </el-button>
          </div>
        </div>
      </div>
      <div class="mt20">
        <el-table :data="services">
          <el-table-column label="服务ID">
            <template v-slot={row}>
              {{ row.service_id }}
            </template>
          </el-table-column>
          <el-table-column label="实例数量">
            <template v-slot={row}>
              <div class="number">
                {{ row.state.up_instances }} / {{ row.state.total_instances }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="注册时间" prop="create_time">
            <template v-slot="{row}">
              {{ U.dateUtil.formatDateDefault(new Date(row.create_time)) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template v-slot="{row}">
              <el-button type="primary" @click="toEdit(row)">编辑</el-button>
              <el-button type="danger" @click="toDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">

</style>