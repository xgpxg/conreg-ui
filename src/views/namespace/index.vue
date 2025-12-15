<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {R} from "../../utils/R";
import {U} from "../../utils/util";
import {ElMessageBox} from "element-plus";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const namespaces = ref([])
const page = ref({
  page_num: 1,
  page_size: 10,
  total: 0
})

onMounted(() => {
  loadNamespaces()
})
const loadNamespaces = () => {
  R.get('/api/namespace/list', {
    ...page.value,
  }).then(res => {
    namespaces.value = res.data.list
    page.value.total = res.data.total
  })
}

const isShowAdd = ref(false)
const isShowUpdate = ref(false)
const form = ref({
  id: null,
  name: '',
  description: '',
})
const formRef = ref()
const rules = {
  id: [
    {required: true, message: t('请填写ID'), trigger: 'blur'},
  ],
  name: [
    {required: true, message: t('请填写名称'), trigger: 'blur'},
  ],
}
// 随机生成命名空间ID
const randomId = () => {
  let result = '';
  const characters = 'abcdef0123456789';
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  form.value.id = result.replace(/(\w{4})/g, '$1-').slice(0, -1);
}

const upsertNamespace = () => {
  formRef.value.validate((ok) => {
    if (!ok) {
      return
    }
    debugger
    R.postJson('/api/namespace/upsert', {
      id: form.value.id,
      name: form.value.name,
      description: form.value.description
    }).then(res => {
      if (res.code === 0) {
        loadNamespaces()
        isShowAdd.value = false
        isShowUpdate.value = false
      }
    })
  })
}

const del = (row: any) => {
  ElMessageBox.confirm(
      t('删除后无法恢复，请确认操作。'),
      t('删除命名空间'),
  ).then(() => {
    R.postJson('/api/namespace/delete', {
      id: row.id
    }).then(res => {
      if (res.code === 0) {
        loadNamespaces()
      }
    })
  })
}
</script>

<template>
  <div class="pdb20">
    <el-card>
      <template #header>
        <div class="flex-v flex-space-between">
          <h2>
            {{ t('命名空间') }}
          </h2>
          <div class="">
            <el-button type="primary" icon="plus" @click="form={};isShowAdd=true">
              {{ t('创建命名空间') }}
            </el-button>
          </div>
        </div>
      </template>
      <div class="mt10">
        <el-table :data="namespaces">
          <el-table-column :label="t('ID')" width="250">
            <template #default="{row}">
              {{ row.id }}
            </template>
          </el-table-column>
          <el-table-column :label="t('名称')" prop="name" show-overflow-tooltip>
          </el-table-column>
          <el-table-column :label="t('描述')" prop="description" show-overflow-tooltip>
            <template #default="{row}">
              {{ row.description ? row.description : '-' }}
            </template>
          </el-table-column>
          <el-table-column :label="t('创建时间')" prop="create_time" width="200">
            <template #default="{row}">
              {{ U.dateUtil.formatDateDefault(new Date(row.create_time)) }}
            </template>
          </el-table-column>
          <el-table-column :label="t('操作')" width="190">
            <template #default="{row}">
              <el-button type="primary" @click="form = row;isShowUpdate=true">{{ t('编辑') }}</el-button>
              <el-button type="danger" @click="del(row)" :disabled="row.id === 'public'">{{ t('删除') }}</el-button>
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
            @current-change="(pageNum: number) => {page.page_num = pageNum; loadNamespaces()}"
            class="mt10 fr">
        </el-pagination>
      </div>
    </el-card>
  </div>

  <el-dialog v-model="isShowAdd" :title="t('创建命名空间')" width="500px" destroy-on-close>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="auto">
      <el-form-item :label="t('ID')" prop="id">
        <div class="fill-width flex-v">
          <el-input v-model="form.id" :placeholder="t('请填写命名空间ID')"></el-input>
          <el-button class="ml10" @click="randomId">{{ t('随机生成') }}</el-button>
        </div>
        <el-text size="small" type="info" class="compact mt5">{{ t('命名空间ID用于配置/服务隔离，不能重复，创建后不可修改') }}</el-text>
      </el-form-item>
      <el-form-item :label="t('名称')" prop="name">
        <el-input v-model="form.name" :placeholder="t('请填写命名空间名称')"></el-input>
      </el-form-item>
      <el-form-item :label="t('描述')" prop="description">
        <el-input v-model="form.description" :placeholder="t('请填写命名空间描述')"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isShowAdd = false">{{ t('取消') }}</el-button>
      <el-button type="primary" @click="upsertNamespace">{{ t('创建') }}</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="isShowUpdate" :title="t('修改命名空间')" width="500px" destroy-on-close>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="auto">
      <el-form-item :label="t('ID')" prop="id">
        <div class="fill-width flex-v">
          <el-input v-model="form.id" :placeholder="t('请填写命名空间ID')" disabled></el-input>
        </div>
        <el-text size="small" type="info" class="compact mt5">{{ t('命名空间ID用于配置/服务隔离，不能重复，创建后不可修改') }}</el-text>
      </el-form-item>
      <el-form-item :label="t('名称')" prop="name">
        <el-input v-model="form.name" :placeholder="t('请填写命名空间名称')"></el-input>
      </el-form-item>
      <el-form-item :label="t('描述')" prop="description">
        <el-input v-model="form.description" :placeholder="t('请填写命名空间描述')"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isShowUpdate = false">{{ t('取消') }}</el-button>
      <el-button type="primary" @click="upsertNamespace">{{ t('修改') }}</el-button>
    </template>
  </el-dialog>


</template>

<style scoped lang="scss">

</style>