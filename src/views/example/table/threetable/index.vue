<template>
  <div>
        <section class="app-main">
        <transition name="fade" mode="out-in">
           <router-view></router-view>
        </transition>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }

  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
