<script setup>

import CopyText from "../../components/Copy/copy-text.vue";
import SvgIcon from "../../components/SvgIcon/index.vue";
import {useRoute, useRouter} from "vue-router";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {CodeEditor} from 'monaco-editor-vue3';
import 'monaco-editor-vue3/dist/style.css';
import {R} from "../../utils/R";
import {ElMessage, ElMessageBox} from "element-plus";
import {useI18n} from 'vue-i18n';

const {t} = useI18n();

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
  format: 'yaml',
  description: null
})
const formRef = ref()
const rules = {
  id: [
    {required: true, message: t('请填写配置ID'), trigger: 'blur'}
  ],
  content: [
    {required: true, message: t('请填写配置内容'), trigger: 'blur'}
  ],
  format: [
    {required: true, message: t('请选择配置格式'), trigger: 'blur'}
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
    form.value.description = res.data.description
  })
}

const upsertConfig = () => {
  formRef.value.validate((ok) => {
    if (!ok) {
      return
    }
    ElMessageBox.confirm(t('配置变更将立即生效，确定发布配置？')).then(() => {
      R.postJson('/api/config/upsert', {
        namespace_id: namespace.value,
        id: form.value.id,
        content: form.value.content,
        format: form.value.format,
        description: form.value.description
      }).then(res => {
        if (res.code === 0) {
          setTimeout(() => {
            ElMessage.success(t('发布成功'))
            router.back()
          }, 100)
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
        <h1>{{ t('修改配置') }}</h1>
        <div class="ml50">
          {{ t('命名空间ID') }}：
          <el-tag effect="plain">
            {{ namespace }}
            <copy-text :text="namespace"></copy-text>
          </el-tag>
        </div>
      </div>
    </template>
    <div class="mt10">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item :label="t('配置ID')" prop="id">
          <el-input v-model="form.id" :placeholder="t('填写配置ID，如：database.yaml')" maxlength="100" show-word-limit
                    disabled></el-input>
        </el-form-item>
        <el-form-item :label="t('配置格式')" prop="format">
          <el-radio-group v-model="form.format" disabled>
            <el-radio-button label="yaml" value="yaml"></el-radio-button>
            <el-radio-button label="properties" value="properties" disabled></el-radio-button>
            <el-radio-button label="json" value="json" disabled></el-radio-button>
            <el-radio-button label="toml" value="toml" disabled></el-radio-button>
            <el-radio-button label="txt" value="txt" disabled></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('配置描述')" prop="description">
          <el-input v-model="form.description" :placeholder="t('请填写配置描述')" maxlength="200"
                    show-word-limit></el-input>
        </el-form-item>
        <el-form-item :label="t('配置内容')" prop="content">
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
            <el-button type="primary" @click="upsertConfig">{{ t('发布') }}</el-button>
            <el-button @click="router.back()">{{ t('取消') }}</el-button>
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