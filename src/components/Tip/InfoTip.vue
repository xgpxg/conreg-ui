<template>
  <div class="info-tip" :style="{fontSize:size==='small'?'13px':''}">
    <svg-icon icon-class="info" class="mr5" :color="'#888888'"></svg-icon>
    <slot>
    </slot>
  </div>
</template>

<script>
import SvgIcon from "../SvgIcon/index.vue";

export default {
  name: "InfoTip",
  components: {SvgIcon},
  props: {
    size: String
  }
}
</script>

<style scoped>
.info-tip {
  background: #EBEEF5;
  border-radius: 5px;
  padding: 5px 10px;
  line-height: 20px;
  font-size: 14px;
  color: #7e7e7e;
}
</style>