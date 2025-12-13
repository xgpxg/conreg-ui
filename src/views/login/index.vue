<script setup lang="ts">
import {ref} from 'vue'
import {ElButton, ElForm, ElFormItem, ElInput} from 'element-plus'
import {User, Lock} from '@element-plus/icons-vue'
import SvgIcon from "../../components/SvgIcon/index.vue";
import {useRouter} from "vue-router";
import {R} from "../../utils/R";
import store from "@/store";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const router = useRouter()
const loginForm = ref({
  username: '',
  password: '',
})

const rules = {
  username: [
    {required: true, message: t('请输入用户名'), trigger: 'blur'}
  ],
  password: [
    {required: true, message: t('请输入密码'), trigger: 'blur'},
    {min: 6, message: t('密码长度至少6位'), trigger: 'blur'}
  ]
}

const loading = ref(false)
const formRef = ref()

const login = () => {
  formRef.value.validate(ok => {
    if (!ok) {
      return
    }
    loading.value = true

    R.postJson('/api/system/login', {
      username: loginForm.value.username,
      password: loginForm.value.password
    }).then(res => {
      if (res.code === 0) {
        store.commit('user/setToken', res.data.token)
        store.commit('user/setUsername', res.data.username)
        router.replace({name: 'Config'})
      }
      loading.value = false
    })

  })
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1 class="title">Conreg {{ t('登录') }}</h1>
        <p class="subtitle">{{ t('分布式服务配置和注册中心') }}</p>
      </div>

      <el-form
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          class="login-form"
          @keyup.enter="login"
      >
        <el-form-item prop="username">
          <el-input
              v-model="loginForm.username"
              :placeholder="t('请输入用户名')"
              size="large"
              :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
              v-model="loginForm.password"
              type="password"
              :placeholder="t('请输入密码')"
              size="large"
              :prefix-icon="Lock"
              show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              size="large"
              class="login-button fill-width"
              :loading="loading"
              @click="login"
              auto-insert-space
          >
            {{ t('登录') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <a href="https://github.com/xgpxg/conreg" target="_blank" class="github-link">
          <svg-icon icon-class="github" size="20"></svg-icon>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
  padding: 20px;

  .login-box {
    width: 100%;
    max-width: 350px;
    padding: 40px 30px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);

    .login-header {
      text-align: center;
      margin-bottom: 30px;

      .title {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        margin: 0 0 8px;
      }

      .subtitle {
        font-size: 14px;
        color: #666;
        margin: 0;
      }
    }

    .login-form {
      margin-bottom: 20px;


    }
  }
}

</style>
