<template>
  <div id="buttonContainer" style="text-align: center; height: 100%; margin: 0 2em">
    <button v-on:click="connectWallet()" style="  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
font-size: 1.2em; width: 10em; height: 2em; background-color: darkorange; border-radius: .5em; border: 0; overflow: hidden">
      Cancel game
    </button>
  </div>
</template>

<script>
export default {
  name: "GameExists",
  created() {
    console.log(this.$route.path)
  },

}
</script>

<style scoped>

</style>