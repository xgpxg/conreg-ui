<script setup>
import {computed, ref} from "vue";
import store from "../../store";
import {R} from "../../utils/R";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";

const router = useRouter()
const isShow = ref(false)
const show = () => {
  isShow.value = true
}

const user = computed(() => {
  return store.state.user
})

defineExpose({
  show
})

const form = ref({
  password: '',
  confirmPassword: ''
})
let formRef = ref()
const confirmPassword = (rule, value, callback) => {
  if (value !== form.value.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}
const rules = ref({
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
  ],
  confirmPassword: [
    {required: true, validator: confirmPassword, trigger: 'blur'}
  ]
})

const updatePassword = () => {
  formRef.value.validate(ok => {
    if (!ok) {
      return
    }
    R.postJson('/api/system/update_password', form.value).then((res) => {
      if (res.code === 0) {
        isShow.value = false
        ElMessage.success('密码已修改，请重新登录')
        router.replace({name: 'Login'})
      }
    })
  })
}
</script>

<template>
  <el-dialog v-model="isShow" title="修改密码" width="500">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名">
        {{ user.username }}
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="form.password" type="password" show-password placeholder="请填写新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" show-password placeholder="请填写确认密码"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="updatePassword">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>