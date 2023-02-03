<template>
  <div class="">
    <HeaderBar style="height: 5em"></HeaderBar>
    <BodyComponent style="height: calc(100vh - 5em)"></BodyComponent>
  </div>
</template>

<script>
import HeaderBar from "@/components/layout/HeaderComponent.vue";
import BodyComponent from "@/components/layout/BodyComponent.vue";

export default {
  name: 'HelloWorld',
  components: {BodyComponent, HeaderBar},
  props: {
    msg: String
  },
  async mounted() {
    const getAptosWallet = () => {
      if ('aptos' in window) {
        return window.aptos;
      } else {
        window.open('https://petra.app/', `_blank`);
      }
    };

    const wallet = getAptosWallet();
    try {
      const response = await wallet.connect();
      console.log(response); // { address: string, address: string }

      const account = await wallet.account();
      console.log(account); // { address: string, address: string }
    } catch (error) {
      // { code: 4001, message: "User rejected the request."}
    }
  }
}
</script>

<style scoped>

</style>
