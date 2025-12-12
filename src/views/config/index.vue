<script setup lang="ts">

import CopyText from "../../components/Copy/copy-text.vue";
import {onMounted, ref, watch} from "vue";
import {R} from "../../utils/R";
import {U} from "../../utils/util";
import NamespaceSegmented from "../namespace/namespace-segmented.vue";
import {useRouter} from "vue-router";
import {ElMessageBox} from "element-plus";

const router = useRouter()

const namespace = ref<string>('public')
const configs = ref([])
const page = ref({
  page_num: 1,
  page_size: 10,
  total: 0
})
const filterText = ref(null)
onMounted(() => {
  loadConfigs()
})
const loadConfigs = () => {
  R.get('/api/config/list', {
    ...page.value,
    namespace_id: namespace.value,
    filter_text: filterText.value
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
const toUpdateConfig = (row: any) => {
  router.push({
    name: 'UpdateConfig',
    query: {
      namespace_id: namespace.value,
      id: row.id,
    },
  })
}
const deleteConfig = (row: any) => {
  ElMessageBox.confirm('删除配置立即生效，且无法恢复，确认删除该配置？', '提示', {
    type: 'warning',
  }).then(() => {
    R.postJson(`/api/config/delete`, {
      namespace_id: namespace.value,
      id: row.id
    }).then(() => {
      loadConfigs()
    })
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
            <el-tag effect="plain" disable-transitions>
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
            <el-input v-model="filterText" prefix-icon="search" class="mr10"
                      placeholder="配置ID/内容模糊搜索" @input="loadConfigs" clearable></el-input>
            <el-button type="primary" @click="loadConfigs" icon="search">
              查询
            </el-button>
            <el-button type="primary" @click="toAddConfig" icon="plus">
              创建配置
            </el-button>
          </div>
        </div>
      </div>
      <div class="mt20">
        <el-table :data="configs">
          <el-table-column label="配置ID">
            <template #default="{row}">
              {{ row.id }}
            </template>
          </el-table-column>
          <el-table-column label="关联服务"></el-table-column>
          <el-table-column label="创建时间" prop="create_time">
            <template #default="{row}">
              {{ U.dateUtil.formatDateDefault(new Date(row.create_time)) }}
            </template>
          </el-table-column>
          <el-table-column label="最后修改时间" prop="update_time">
            <template #default="{row}">
              {{ U.dateUtil.formatDateDefault(new Date(row.update_time)) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template #default="{row}">
              <el-button type="primary" @click="toUpdateConfig(row)">编辑</el-button>
              <el-button type="danger" @click="deleteConfig(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next, total"
            :page-size="page.page_size"
            :current-page="page.page_num"
            :total="page.total"
            hide-on-single-page
            @current-change="(pageNum: number) => {page.page_num = pageNum; loadConfigs()}"
            class="mt10 fr">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">

</style>