<script setup>
import {onMounted, ref} from "vue";
import {R} from "../../utils/R";

const value = defineModel()
const namespaces = ref([])

onMounted(() => {
  loadNamespaces()
})
const loadNamespaces = () => {
  R.get('/api/namespace/list', {
    page_num: 1,
    page_size: 10000
  }).then(res => {
    namespaces.value = res.data.list.sort((a, b) => new Date(a.create_time) - new Date(b.create_time)).map(item => item.id)
  })
}
</script>

<template>
  <el-segmented v-model="value" :options="namespaces">
  </el-segmented>
</template>

<style scoped lang="scss">

</style>