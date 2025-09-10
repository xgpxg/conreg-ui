<script setup lang="ts">
import {ref} from "vue";

</script>

<template>
  <div class="">
    <el-card>
      <template #header>
        <div class="flex-v flex-space-between">
          <h1>
            集群管理
          </h1>
          <div class="half-width flex-v">
            <el-input prefix-icon="search" class="mr10" placeholder="节点地址模糊搜索"></el-input>
            <el-button type="primary" @click="toCreate" icon="search">
              查询
            </el-button>
          </div>
        </div>
      </template>
      <div class="mt20">
        <el-table>
          <el-table-column label="节点地址">
            <template #default="{row}">
              <el-tag>{{ row.id }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态"></el-table-column>
          <el-table-column label="负载"></el-table-column>
          <el-table-column label="元数据"></el-table-column>
          <el-table-column label="操作">
            <template #default="{row}">
              <el-button type="danger" @click="del(row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">

</style>