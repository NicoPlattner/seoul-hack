<template>
  <div style="vertical-align: center">
      <div id="logo" style="font-size: 3em; float: left; top: auto; bottom: auto; height: 100%; vertical-align: center; color: aliceblue">
      NFTango
    </div>
    <div id="buttonContainer" style="float: right; height: 100%; margin: 0 2em">
      <button v-on:click="connectWallet()" style="  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
font-size: 1.2em; width: 10em; height: 2em; background-color: darkorange; border-radius: .5em; border: 0; overflow: hidden">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
import {store} from '/src/common/store.ts'

export default {

  name: "HeaderBar",
  data() {
    return {
      buttonText: 'Connect Wallet',
      connected: false,
      wallet: undefined,
      account: undefined
    }
  },
  methods: {
    async disconnectWallet() {
      // await this.wallet.disconnect();
    },
    async connectWallet() {
      const getAptosWallet = () => {
        if ('aptos' in window) {
          return window['aptos'];
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
        this.buttonText = account.address.substr(0, 4) + '...' + account.address.substr(account.address.length - 4, 4);

        this.connected = true;
        this.wallet = wallet;
        this.account = account;
        store.account = account;
        await this.getTokens(account.address);
        console.log(account.address)

      } catch (error) {
        // { code: 4001, message: "User rejected the request."}
      }
    },
    async getTokens(accountAddress) {
      const operationsDoc = `
  query MyQuery @cached {
    current_token_ownerships(
      where: {owner_address: {_eq: "` + accountAddress + `"}}
    ) {
      name
      collection_name
      creator_address
      property_version
      token_data_id_hash
    }
  }
`;

      const res = await fetch(
          "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql",
          {
            method: "POST",
            body: JSON.stringify({
              query: operationsDoc,
              variables: {},
              operationName: "MyQuery"
            })
          });

      const reader = res.body.getReader();
      let arr = ''

      let done = false;
      while (!done) {
        const {value, done} = await reader.read();
        if (done) break;
        console.log(new TextDecoder().decode(value))
        arr = arr + (new TextDecoder().decode(value))
      }

      console.log(JSON.parse(arr).data.current_token_ownerships)

      // @ts-ignore
      this.getImages(JSON.parse(arr).data.current_token_ownerships)
    },
    async getImages(tokens) {
      const tokens_with_images = [];

      for (let i = 0; i < tokens.length; i++) {
        const uri = await this.getImageUri(tokens[i])
        const updated = {
          name: tokens[i].name,
          collection_name: tokens[i].collection_name,
          creator_address: tokens[i].creator_address,
          property_version: tokens[i].property_version,
          uri: uri.data.token_datas[0].metadata_uri
        }

        tokens_with_images.push(updated);
        console.log(tokens_with_images)
        store.tokens = [...tokens_with_images]

      }
      console.log(tokens_with_images)
    },
    async getImageUri(token) {

      const operationsDoc = `
  query MyQuery {
    token_datas(
      where: {token_data_id_hash: {_eq: "` + token.token_data_id_hash + `"}}
    ) {
      metadata_uri
    }
  }
`;


      const res = await fetch(
          "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql",
          {
            method: "POST",
            body: JSON.stringify({
              query: operationsDoc,
              variables: {},
              operationName: "MyQuery"
            })
          });

      const reader = res.body.getReader();
      let arr = ''

      let done = false;
      while (!done) {
        const {value, done} = await reader.read();
        if (done) break;
        console.log(new TextDecoder().decode(value))
        arr = arr + (new TextDecoder().decode(value))
      }

      console.log(JSON.parse(arr))
      return JSON.parse(arr);
    }
  }
}
</script>

<style scoped>

</style>