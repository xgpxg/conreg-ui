<template>
  <div>
    <v-md-preview ref="editor"
                  :text="content"
                  height="400px"
                  v-bind="$attrs" v-on="$listeners">
    </v-md-preview>
  </div>
</template>

<script>


export default {
  name: "code-preview",
  components: {},
  props: {
    code: String,
    language: String
  },
  data() {
    return {
      content: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.content = "```" + this.language + "\n" + this.code + "\n" + "```"
    }
  }
}
</script>


<style scoped lang="scss">
:deep(.github-markdown-body) {
  padding: 0 ;
}
</style>