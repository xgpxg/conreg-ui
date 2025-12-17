<script setup lang="ts">

import CopyText from "../../components/Copy/copy-text.vue";
import {onMounted, ref, watch} from "vue";
import {R} from "../../utils/R";
import {U} from "../../utils/util";
import NamespaceSegmented from "../namespace/namespace-segmented.vue";
import {useRouter} from "vue-router";
import {ElMessageBox, ElMessage} from "element-plus";
import {useI18n} from 'vue-i18n';
import axios from "axios";

const {t} = useI18n();

const router = useRouter()

const namespace = ref<string>('public')
const configs = ref([])
const page = ref({
  page_num: 1,
  page_size: 10,
  total: 0
})
const filterText = ref(null)
const selectedConfigs = ref([])
const fileInputRef = ref()

onMounted(() => {
  loadConfigs()
})

const loadConfigs = () => {
  R.get('/api/config/list', {
    ...page.value,
    namespace_id: namespace.value,
    filter_text: filterText.value
  }).then((res: any) => {
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
  ElMessageBox.confirm(t('删除配置立即生效，且无法恢复，确认删除该配置？'), t('提示'), {
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

const toConfigHistory = (row: any) => {
  router.push({
    name: 'ConfigHistory',
    query: {
      namespace_id: namespace.value,
      id: row.id,
    },
  })
}


const exportConfig = () => {
  if (selectedConfigs.value.length === 0) {
    ElMessage.warning(t('请选择要导出的配置'));
    return;
  }

  const fileName = `${namespace.value}.zip`
  R.download(`/api/api/config/export`, 'post', {
    namespace_id: namespace.value,
    ids: selectedConfigs.value.map(item => item.id),
    is_all: false
  }, null, {fileName})
}

const exportAllConfig = () => {
  const fileName = `${namespace.value}.zip`
  R.download(`/api/api/config/export`, 'post', {
    namespace_id: namespace.value,
    ids: [],
    is_all: true
  }, null, {fileName})
}

const importConfig = (isOverwrite: boolean) => {
  fileInputRef.value && fileInputRef.value.click()

  const handleChange = (event: any) => {
    const file = event.target.files[0]
    if (!file) return

    ElMessageBox.confirm(
        isOverwrite
            ? t('导入配置将覆盖同名配置，确认导入吗？')
            : t('导入配置将跳过同名配置，确认导入吗？'),
        t('提示'),
        {
          type: 'warning'
        }
    ).then(() => {
      R.upload(`/api/config/import`, file, {
        namespace_id: namespace.value,
        is_overwrite: isOverwrite
      }).then((res: any) => {
        if (res.code === 0) {
          ElMessage.success(t('导入成功'))
          loadConfigs()
        }
        // 清空文件输入框
        event.target.value = ''
      })
    }).catch(() => {
      // 取消导入时清空文件输入框
      event.target.value = ''
    })
  }

  // 创建临时文件输入元素
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.zip'
  input.onchange = handleChange
  input.click()
}

const handleSelectionChange = (val: []) => {
  selectedConfigs.value = val;
}
</script>

<template>
  <div class="">
    <el-card>
      <template #header>
        <div class="flex-v">
          <h2>{{ t('配置管理') }}</h2>
          <div class="ml50">
            {{ t('命名空间ID') }}：
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
          <h2>
            {{ t('配置列表') }}
          </h2>
          <div class="flex-v half-width">
            <el-input v-model="filterText" prefix-icon="search" class="mr10"
                      :placeholder="t('配置ID/内容模糊搜索')" @input="loadConfigs" clearable></el-input>
            <el-button type="primary" @click="loadConfigs" icon="search">
              {{ t('查询') }}
            </el-button>
            <el-button type="primary" @click="toAddConfig" icon="plus">
              {{ t('创建配置') }}
            </el-button>
          </div>
        </div>
      </div>
      <div class="mt20">
        <el-table :data="configs" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column :label="t('配置ID')">
            <template #default="{row}">
              {{ row.id }}
            </template>
          </el-table-column>
          <el-table-column :label="t('描述')">
            <template #default="{row}">
              <template v-if="row.description">
                {{ row.description }}
              </template>
              <template v-else>
                <el-text type="info">-</el-text>
              </template>
            </template>
          </el-table-column>
          <el-table-column :label="t('创建时间')" prop="create_time">
            <template #default="{row}">
              {{ U.dateUtil.formatDateDefault(new Date(row.create_time)) }}
            </template>
          </el-table-column>
          <el-table-column :label="t('最后修改时间')" prop="update_time">
            <template #default="{row}">
              {{ U.dateUtil.formatDateDefault(new Date(row.update_time)) }}
            </template>
          </el-table-column>
          <el-table-column :label="t('操作')" width="260">
            <template #default="{row}">
              <el-button type="primary" @click="toUpdateConfig(row)">{{ t('编辑') }}</el-button>
              <el-button type="primary" @click="toConfigHistory(row)">{{ t('历史') }}</el-button>
              <el-button type="danger" @click="deleteConfig(row)">{{ t('删除') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt10 fl mb10">
          <!--          <el-button type="primary" @click="exportConfig">{{ t('克隆') }}</el-button>-->
          <el-dropdown placement="bottom-start" class="mr10">
            <el-button type="primary">
              {{ t('导入') }}
              <el-icon class="el-icon--right">
                <arrow-down/>
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="importConfig(true)">{{ t('导入并覆盖') }}</el-dropdown-item>
                <el-dropdown-item @click="importConfig(false)">{{ t('导入不覆盖') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown placement="bottom-start">
            <el-button type="primary">
              {{ t('导出') }}
              <el-icon class="el-icon--right">
                <arrow-down/>
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="exportConfig">{{ t('导出所选') }}</el-dropdown-item>
                <el-dropdown-item @click="exportAllConfig">{{ t('导出全部') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <el-pagination
            background
            layout="prev, pager, next, total"
            :page-size="page.page_size"
            :current-page="page.page_num"
            :total="page.total"
            hide-on-single-page
            @current-change="(pageNum: number) => {page.page_num = pageNum; loadConfigs()}"
            class="mt10 fr mb10">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">

</style>