<template>
  <div :class="{}">
      {{msg}}
  </div>
</template>

<script>
export default {
    props: {
        msg: String,
        level: Number
    },
    data() {
        return {
            levelColors: [
                'debug',
                'info',
                'warn',
                'error'
            ]
        }
    }
}
</script>

<style>

</style>