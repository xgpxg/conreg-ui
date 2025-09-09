<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {R} from "../../utils/R";
import {U} from "../../utils/util";
import {ElMessageBox} from "element-plus";

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
    {required: true, message: '请填写ID', trigger: 'blur'},
  ],
  name: [
    {required: true, message: '请填写名称', trigger: 'blur'},
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
      '删除后无法恢复，请确认操作。',
      '删除命名空间',
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
          <h1>
            命名空间
          </h1>
          <div class="">
            <el-button type="primary" icon="plus" size="large" @click="form={};isShowAdd=true">
              创建命名空间
            </el-button>
          </div>
        </div>
      </template>
      <div class="mt10">
        <el-table :data="namespaces">
          <el-table-column label="ID" width="250">
            <template v-slot="{row}">
              {{ row.id }}
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="描述" prop="description" show-overflow-tooltip>
            <template v-slot="{row}">
              {{ row.description ? row.description : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="create_time" width="200">
            <template v-slot="{row}">
              {{ U.dateUtil.formatDateDefault(new Date(row.create_time)) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template v-slot="{row}">
              <el-button type="primary" @click="form = row;isShowUpdate=true">编辑</el-button>
              <el-button type="danger" @click="del(row)" :disabled="row.id === 'public'">删除</el-button>
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

  <el-dialog v-model="isShowAdd" title="创建命名空间" width="500px" destroy-on-close>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="50px">
      <el-form-item label="ID" prop="id">
        <div class="fill-width flex-v">
          <el-input v-model="form.id" placeholder="请填写命名空间ID"></el-input>
          <el-button class="ml10" @click="randomId">随机生成</el-button>
        </div>
        <el-text size="small" type="info">命名空间ID用于配置/服务隔离，不能重复，创建后不可修改</el-text>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写命名空间名称"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" placeholder="请填写命名空间描述"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isShowAdd = false">取消</el-button>
      <el-button type="primary" @click="upsertNamespace">创建</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="isShowUpdate" title="修改命名空间" width="500px" destroy-on-close>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="50px">
      <el-form-item label="ID" prop="id">
        <div class="fill-width flex-v">
          <el-input v-model="form.id" placeholder="请填写命名空间ID" disabled></el-input>
        </div>
        <el-text size="small" type="info">命名空间ID用于配置/服务隔离，不能重复，创建后不可修改</el-text>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写命名空间名称"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" placeholder="请填写命名空间描述"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isShowUpdate = false">取消</el-button>
      <el-button type="primary" @click="upsertNamespace">修改</el-button>
    </template>
  </el-dialog>


</template>

<style scoped lang="scss">

</style>