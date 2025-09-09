<template>
  <div class="fill-width editor" :style="{height:height}">
    <v-md-editor v-model="value"
                 :disabled-menus="disabledMenus"
                 :includeLevel="includeLevel"
                 :height="height"
                 @upload-image="handleUploadImage"
                 v-bind="$attrs"
                 v-on="$listeners"></v-md-editor>
  </div>
</template>

<script>


export default {
  name: "md-editor",
  components: {},
  props: {
    /**
     * 高度
     */
    height: String,
    /**
     * 目录级别
     */
    includeLevel: {
      type: Array,
      default: () => {
        return [1, 2, 3, 4]
      }
    },
    /**
     * 禁用的菜单
     */
    disabledMenus: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      value: ''
    }
  },
  watch: {
    value(newVal) {
      this.$emit('update:value', newVal)
    }
  },
  mounted() {
    document.addEventListener('keydown', this.saveByShortcut)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.saveByShortcut)
  },
  methods: {
    save() {
      this.$emit('save-content', this.value)
    },
    saveByShortcut(e) {
      const key = window.event.keyCode
      if (key === 83 && e.ctrlKey) {
        e.preventDefault()
        this.save()
      }
    },
    handleUploadImage(event, insertImage, files) {
      console.log(files);
      this.R.upload('/console/common/upload', files[0], {}).then(res => {
        insertImage({
          url:res.data,
          desc: '',
        });
      })

    },
  }
}
</script>


<style scoped lang="scss">
.editor{
  border: #eaeaea 1px solid;

}

</style>