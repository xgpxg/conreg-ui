<script setup lang="ts">

import CopyText from "../../components/Copy/copy-text.vue";
import {ref} from "vue";

const namespace = ref<string>('public')
</script>

<template>
  <div class="">
    <el-card>
      <template #header>
        <div class="flex-v flex-space-between">
          <h1>
            命名空间
          </h1>
          <div class="">
            <el-button type="primary" @click="toCreate" icon="plus" size="large">
              创建命名空间
            </el-button>
          </div>
        </div>
      </template>
      <div class="mt20">
        <el-table>
          <el-table-column label="服务ID">
            <template v-slot="scope">
              <el-tag>{{ scope.row.id }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态"></el-table-column>
          <el-table-column label="实例数量"></el-table-column>
          <el-table-column label="创建时间"></el-table-column>
          <el-table-column label="最后修改时间"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button type="primary" @click="toEdit(scope.row)">编辑</el-button>
              <el-button type="danger" @click="toDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">

</style>