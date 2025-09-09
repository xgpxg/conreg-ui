<script setup lang="ts">

import CopyText from "../../components/Copy/copy-text.vue";
import {onMounted, ref, watch} from "vue";
import {R} from "../../utils/R";
import {U} from "../../utils/util";
import NamespaceSegmented from "../namespace/namespace-segmented.vue";
import {useRouter} from "vue-router";
const router = useRouter()

const namespace = ref<string>('public')
const configs = ref([])
const page = ref({
  page_num: 1,
  page_size: 10,
})
onMounted(() => {
  loadConfigs()
})
const loadConfigs = () => {
  R.get('/api/config/list', {
    ...page.value,
    namespace_id: namespace.value,
  }).then(res => {
    configs.value = res.data.list
    page.value.total = res.data.total
  })
}
watch(namespace, () => {
  loadConfigs()
})

const toAddConfig = () => {
  router.push({
    name: 'AddConfig',
    query: {
      namespace_id: namespace.value,
    },
  })
}
</script>

<template>
  <div class="">
    <el-card>
      <template #header>
        <div class="flex-v">
          <h1>配置管理</h1>
          <div class="ml50">
            命名空间ID：
            <el-tag effect="plain">
              {{ namespace }}
              <copy-text :text="namespace"></copy-text>
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
            配置列表
          </h1>
          <div class="flex-v half-width">
            <el-input prefix-icon="search" class="mr10" size="large" placeholder="配置ID/内容模糊搜索"></el-input>
            <el-button type="primary" @click="toAddConfig" icon="plus" size="large">
              创建配置
            </el-button>
          </div>
        </div>
      </div>
      <div class="mt20">
        <el-table :data="configs">
          <el-table-column label="配置ID">
            <template v-slot="{row}">
              {{ row.id }}
            </template>
          </el-table-column>
          <el-table-column label="关联服务"></el-table-column>
          <el-table-column label="创建时间" prop="create_time">
            <template v-slot="{row}">
              {{ U.dateUtil.formatDateDefault(new Date(row.create_time)) }}
            </template>
          </el-table-column>
          <el-table-column label="最后修改时间" prop="update_time">
            <template v-slot="{row}">
              {{ U.dateUtil.formatDateDefault(new Date(row.update_time)) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template v-slot="scope">
              <el-button type="primary" @click="toEdit(scope.row)">编辑</el-button>
              <el-button type="danger" @click="toDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">

</style>