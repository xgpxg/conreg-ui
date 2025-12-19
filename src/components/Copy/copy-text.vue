<template>
  <svg-icon icon-class="copy" @click="copy(text)"
            class="cursor-pointer"></svg-icon>
</template>

<script setup lang="ts">


import SvgIcon from "@components/SvgIcon/index.vue";
import {copyText} from 'vue3-clipboard'
import {useI18n} from 'vue-i18n'
import {ElMessage} from "element-plus";

const {t} = useI18n()

defineProps({
  text: {
    type: String,
    default: ''
  }
})
const copy = (text: any) => {
  copyText(text, undefined, () => {
    ElMessage.success(t('已复制到剪贴板'))
  })
}
</script>


<style scoped lang="scss">

</style>