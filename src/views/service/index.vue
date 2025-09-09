<script setup lang="ts">

import CopyText from "../../components/Copy/copy-text.vue";
import {ref} from "vue";
import NamespaceSegmented from "../namespace/namespace-segmented.vue";

const namespace = ref<string>('public')
</script>

<template>
  <div class="">
    <el-card>
      <template #header>
        <div class="flex-v">
          <h1>服务管理</h1>
          <div class="ml50">
            命名空间：
            <el-tag effect="plain">public
              <copy-text :text="'public'"></copy-text>
            </el-tag>
          </div>
        </div>
      </template>
      <div>
        <namespace-segmented v-model="namespace"></namespace-segmented>
      </div>
      <div class="mt20">
        <div class="flex-space-between">
          <h1>
            服务列表
          </h1>
          <div class="flex-v half-width">
            <el-select class="mr10" size="large" placeholder="服务状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="正常" value="normal"></el-option>
              <el-option label="丢失连接" value="abnormal"></el-option>
              <el-option label="不可用" value="disabled"></el-option>
            </el-select>
            <el-input prefix-icon="search" class="mr10" size="large" placeholder="服务ID模糊搜索"></el-input>
            <el-button type="primary" @click="toCreate" icon="search" size="large">
              查询
            </el-button>
          </div>
        </div>
      </div>
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