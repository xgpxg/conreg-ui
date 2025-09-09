<template>
  <div class="menu">
    <div class="logo">
      <div class="flex-center" v-if="!collapse">
        CONREG 0.1.0
      </div>
      <div v-else>
        <el-image
            src="/images/logo_collapse.png"
            fit="cover" style="scale: 1.3" class="mt5"></el-image>
      </div>
    </div>
    <el-menu
        :default-active="'/'+$route.path.split('/')[1]"
        router
        :collapse="isCollapse"
        :collapse-transition="false"
    >

      <el-menu-item index="/config">
        <el-icon>
          <svg-icon icon-class="config"></svg-icon>
        </el-icon>
        <span>配置管理</span>
      </el-menu-item>
      <el-menu-item index="/service">
        <el-icon>
          <svg-icon icon-class="service"></svg-icon>
        </el-icon>
        <span>服务管理</span>
      </el-menu-item>
      <el-menu-item index="/namespace">
        <el-icon>
          <svg-icon icon-class="namespace"></svg-icon>
        </el-icon>
        <span>命名空间</span>
      </el-menu-item>
      <el-menu-item index="/cluster">
        <el-icon>
          <svg-icon icon-class="cluster"></svg-icon>
        </el-icon>
        <span>集群管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import SvgIcon from "../../components/SvgIcon/index.vue";

export default {
  components: {SvgIcon},
  props: {
    collapse: Boolean,
  },
  data() {
    return {
      isCollapse: false
    }
  },
  computed: {},
  watch: {
    collapse: {
      handler(newVal) {
        this.isCollapse = newVal
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {}
}
</script>
<style scoped lang="scss">
.menu {
  height: calc(100vh);
  background: #fafafa;
  border-right: #eeeeee 1px solid;

  :deep(.el-menu) {
    border-right: unset;
    background: #fafafa;

  }

  :deep(.el-menu-item) {
    background-color: unset !important;
    border: unset;
  }

  :deep(.el-menu-item):hover {
    color: unset !important;
  }

  :deep(.el-menu-item) {
    &.is-active {
      color: var(--el-color-primary);
      background: var(--el-color-primary-light-11) !important;
    }
  }

  .el-menu-item {

    &:hover {
      color: var(--el-color-primary) !important;
      background: #f1f1f1 !important;
    }

    .el-icon {
      > :hover {
        font-size: 1.5em;
        transition: all 0.3s;
      }
    }
  }

  :deep(.el-badge__content) {
    border: none;
    scale: 0.8;
  }
}

.collapse {
  position: fixed;
  bottom: 0;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  font-weight: bold;
  padding: 10px 20px;
  font-size: 18px;
  height: 35px;
}

</style>