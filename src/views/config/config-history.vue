<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {R} from '../../utils/R'
import {U} from '../../utils/util'
import {useI18n} from 'vue-i18n'
import CopyText from '../../components/Copy/copy-text.vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import ConfigDiff from "@/views/config/config-diff.vue";

const {t} = useI18n()
const route = useRoute()
const router = useRouter()

const configId = ref<string>(route.query.id as string || '')
const namespaceId = ref<string>(route.query.namespace_id as string || 'public')
const histories = ref([])
const page = ref({
  page_num: 1,
  page_size: 10,
  total: 0
})

// 对比功能相关变量
const compareDialogVisible = ref(false)
const currentConfig = ref<any>(null)
const historyConfig = ref<any>(null)

onMounted(() => {
  if (configId.value) {
    loadHistories()
  }
})

const loadHistories = () => {
  R.get('/api/config/histories', {
    page_num: page.value.page_num,
    page_size: page.value.page_size,
    namespace_id: namespaceId.value,
    id: configId.value
  }).then((res: any) => {
    histories.value = res.data.list
    page.value.total = res.data.total
  })
}

const formatDate = (dateString: string) => {
  return U.dateUtil.formatDateDefault(new Date(dateString))
}

const goBack = () => {
  router.back()
}

const handlePageChange = (pageNum: number) => {
  page.value.page_num = pageNum
  loadHistories()
}

const recoverConfig = (history: any) => {
  ElMessageBox.confirm(
      t('确定要恢复到该历史版本吗？'),
      t('确认恢复'),
      {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning',
      }
  ).then(() => {
    R.postJson('/api/config/recover', {
      id_: history.id_
    }).then((res: any) => {
      if (res.ok) {
        ElMessage.success(t('配置恢复成功'))
        // 延时加载，因为配置恢复是异步的，需要后端同步数据完成
        setTimeout(() => {
          loadHistories()
        }, 200)
      }
    })
  }).catch(() => {
    // 用户取消操作
  })
}

// 对比配置函数
const compareConfig = (history: any) => {
  historyConfig.value = history

  // 获取当前最新配置
  R.get('/api/config/get', {
    namespace_id: namespaceId.value,
    id: configId.value
  }).then((res: any) => {
    if (res.ok) {
      currentConfig.value = res.data
      compareDialogVisible.value = true
    } else {
      ElMessage.error(t('获取当前配置失败'))
    }
  }).catch(() => {
    ElMessage.error(t('获取当前配置失败'))
  })
}

// 关闭对比对话框
const closeCompareDialog = () => {
  compareDialogVisible.value = false
  currentConfig.value = null
  historyConfig.value = null
}
</script>

<template>
  <div class="">
    <el-card>
      <template #header>
        <div class="flex-v">
          <h2>{{ t('配置历史记录') }}</h2>
          <div class="ml50">
            {{ t('命名空间ID') }}：
            <el-tag effect="plain" disable-transitions>
              {{ namespaceId }}
              <copy-text :text="namespaceId"></copy-text>
            </el-tag>
          </div>
          <div class="ml50">
            {{ t('配置ID') }}：
            <el-tag effect="plain" disable-transitions>
              {{ configId }}
              <copy-text :text="configId"></copy-text>
            </el-tag>
          </div>
        </div>
      </template>

      <div class="mb20">
        <el-button type="primary" @click="goBack" icon="back">
          {{ t('返回') }}
        </el-button>
      </div>

      <div>
        <el-table :data="histories" stripe>
          <el-table-column :label="t('配置ID')" prop="id">
            <template #default="{row}">
              {{ row.id }}
            </template>
          </el-table-column>
          <el-table-column :label="t('描述')" prop="description" width="150">
            <template #default="{row}">
              <template v-if="row.description">
                {{ row.description }}
              </template>
              <template v-else>
                <el-text type="info">{{ t('-') }}</el-text>
              </template>
            </template>
          </el-table-column>
          <el-table-column :label="t('MD5')" prop="md5" width="280">
            <template #default="{row}">
              {{ row.md5 }}
            </template>
          </el-table-column>
          <el-table-column :label="t('创建时间')" prop="create_time" width="160">
            <template #default="{row}">
              {{ formatDate(row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column :label="t('更新时间')" prop="update_time" width="160">
            <template #default="{row}">
              {{ formatDate(row.update_time) }}
            </template>
          </el-table-column>
          <el-table-column :label="t('操作')" width="180">
            <template #default="{row}">
              <el-button size="small" type="primary" @click="recoverConfig(row)">
                {{ t('恢复') }}
              </el-button>
              <el-button size="small" @click="compareConfig(row)">
                {{ t('对比') }}
              </el-button>
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
            @current-change="handlePageChange"
            class="mt10 fr mb10">
        </el-pagination>
      </div>
    </el-card>

    <!-- 配置对比对话框 -->
    <el-dialog
        v-model="compareDialogVisible"
        :title="t('配置对比')"
        width="80%"
        top="50px"
        :before-close="closeCompareDialog"
    >
      <div v-if="currentConfig && historyConfig" class="config-compare">
        <div class="compare-content">
          <config-diff
              :old-content="historyConfig.content"
              :new-content="currentConfig.content"
              :old-title="t('选中配置')"
              :new-title="t('最新配置')"/>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeCompareDialog">{{ t('关闭') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.compare-content {
  max-height: 60vh;
}
</style>