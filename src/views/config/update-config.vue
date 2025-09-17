<script setup>

import CopyText from "../../components/Copy/copy-text.vue";
import SvgIcon from "../../components/SvgIcon/index.vue";
import {useRoute, useRouter} from "vue-router";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {CodeEditor} from 'monaco-editor-vue3';
import 'monaco-editor-vue3/dist/style.css';
import {R} from "../../utils/R";
import {ElMessage, ElMessageBox} from "element-plus";

const router = useRouter();
const route = useRoute()
const namespace = computed(() => {
  return route.query.namespace_id
})
const id = computed(() => {
  return route.query.id
})
const form = ref({
  namespace_id: namespace.value,
  id: null,
  content: '',
  format: 'yaml'
})
const formRef = ref()
const rules = {
  id: [
    {required: true, message: '请填写配置ID', trigger: 'blur'}
  ],
  content: [
    {required: true, message: '请填写配置内容', trigger: 'blur'}
  ],
  format: [
    {required: true, message: '请选择配置格式', trigger: 'blur'}
  ]
}

const editorOptions = {
  fontSize: 14,
  minimap: {enabled: true},
  automaticLayout: true,
  padding: {
    top: 10,
  }
};
const isShowCodeEditor = ref(true);
const format = computed(() => {
  return form.value.format
})
watch(format, () => {
  isShowCodeEditor.value = false
  nextTick(() => {
    isShowCodeEditor.value = true
  })
})
onMounted(() => {
  getConfig()
})

const getConfig = () => {
  R.get('/api/config/get', {
    namespace_id: namespace.value,
    id: id.value
  }).then(res => {
    form.value.id = res.data.id
    form.value.content = res.data.content
    form.value.format = res.data.format
  })
}

const upsertConfig = () => {
  formRef.value.validate((ok) => {
    if (!ok) {
      return
    }
    ElMessageBox.confirm('配置变更将立即生效，确定发布配置？').then(() => {
      R.postJson('/api/config/upsert', {
        namespace_id: namespace.value,
        id: form.value.id,
        content: form.value.content,
        format: form.value.format
      }).then(res => {
        if (res.code === 0) {
          ElMessage.success('发布成功')
          router.back()
        }
      })
    })
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
        <h1>修改配置</h1>
        <div class="ml50">
          命名空间ID：
          <el-tag effect="plain">
            {{ namespace }}
            <copy-text :text="namespace"></copy-text>
          </el-tag>
        </div>
      </div>
    </template>
    <div class="mt10">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="配置ID" prop="id">
          <el-input v-model="form.id" placeholder="填写配置ID，不包含后缀" maxlength="100" show-word-limit
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="配置格式" prop="format">
          <el-radio-group v-model="form.format" disabled>
            <el-radio-button label="yaml" value="yaml"></el-radio-button>
            <el-radio-button label="properties" value="properties" disabled></el-radio-button>
            <el-radio-button label="json" value="json" disabled></el-radio-button>
            <el-radio-button label="toml" value="toml" disabled></el-radio-button>
            <el-radio-button label="txt" value="txt" disabled></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配置内容" prop="content">
          <div class="code-editor">
            <CodeEditor
                v-if="isShowCodeEditor"
                v-model:value="form.content"
                :language="form.format"
                theme="vs-dark"
                :options="editorOptions"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <div>
            <el-button type="primary" @click="upsertConfig">发布</el-button>
            <el-button @click="router.back()">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.code-editor {
  width: 100%;
  height: calc(100vh - 380px);
}
</style>