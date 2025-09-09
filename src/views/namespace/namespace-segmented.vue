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
    namespaces.value = res.data.list.sort((a, b) => new Date(a.create_time) - new Date(b.create_time)).map(item => item)
  })
}
</script>

<template>
  <div class="segmented">
    <el-segmented v-model="value" :options="namespaces" :props="{value: 'id', label:'name'}" size="large">
    </el-segmented>
  </div>
</template>

<style scoped lang="scss">
.segmented {
  overflow-x: auto;
  white-space: nowrap;
  // 美化滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: #e4e4e4;
  }
}
</style>