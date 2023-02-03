<template>
  <div style="padding: 0 2em; text-align: center">
    <div v-if="!store.account" style="color: aliceblue; font-size: 2.2em">
      connect your wallet to start
    </div>
    <div v-if="store.account" style="text-align: center">
      <div id="imageArea" style="width: 40em; max-width: 90%; height: 40em; overflow-y: auto; margin: 0 auto;">
        <div v-for="token in store.tokens" :key="token" style="width: 33.33%; float: left; position: relative">
          <img v-bind:src="token.uri" style="width: 100%" v-on:click="selectNft(token)">
          <div v-if="token.selected" class="overlay"></div>
        </div>
      </div>
      <button type="button" class="btn btn-primary" v-on:click="this.start()">
        Start Game
      </button>
    </div>
  </div>
</template>

<script>
import {store} from '../../common/store.ts'
import {AptosClient} from 'aptos';



export default {
  name: "BodyComponent",
  data() {
    return {
      store,
      tokens: [],
      selected: undefined
    }
  },
  methods: {
    selectNft(token) {
      if (this.selected) {
        this.selected.selected = false;
      }

      console.log(store.tokens)
      console.log(token)
      const nft = store.tokens.filter(t => t.uri === token.uri)[0];
      nft.selected = true;
      this.selected = nft;
    },
    async start() {
      // const nft = store.tokens[0];
      // const creator = nft.creator_address;
      // const collection_name = nft.collection_name;
      // const token_name = nft.name;
      // const property_version = nft.property_version;
      // const join_amount_requirement = 1;

      const getAptosWallet = () => {
        if ('aptos' in window) {
          return window['aptos'];
        } else {
          window.open('https://petra.app/', `_blank`);
        }
      };
      console.log('getAptosWallet logging:')
      console.log(getAptosWallet());

      // const wallet = getAptosWallet(); // see "Connecting"

// Example Transaction, following an [EntryFunctionPayload](https://github.com/aptos-labs/aptos-core/blob/main/ecosystem/typescript/sdk/src/generated/models/EntryFunctionPayload.ts#L8-L21)
      const transaction = {
        arguments: ['0xa06411afe2bab2ae80338363dcf0bcdc2db55e3a2ef4acb369abad8d036d63c6','test','test: 197','0','1'],
        function: '0x948f30f10f6b90077db3215f9e71d8cf113ad2fd10d73563994dfff926a05c37::nftango::initialize_game',
        type: 'entry_function_payload',
        type_arguments: [],
      };
      console.log('transaction logging:')
      console.log(transaction);

      try {
        // const { account, signAndSubmitTransaction } = useWallet();
        // console.log(account);
        const pendingTransaction = await (
            window)['aptos'].signAndSubmitTransaction(transaction);
        // pendingTransaction.signAndSubmitTransaction(transaction);

        // In most cases a dApp will want to wait for the transaction, in these cases you can use the typescript sdk
        const client = new AptosClient('https://testnet.aptoslabs.com');
        const txn = await client.waitForTransactionWithResult(
            pendingTransaction.hash,
        );
        console.log(txn);
      } catch (error) {
        console.log(error)
      }


    }

  }
}
</script>

<style scoped>
.overlay {
  position: absolute;
  bottom: 0;
  background: rgb(0, 0, 0);
  background: rgba(0, 0, 0, 0.5); /* Black see-through */
  color: #f1f1f1;
  width: 100%;
  transition: .5s ease;
  opacity:0;
  color: white;
  font-size: 20px;
  padding: 20px;
  text-align: center;
}


</style>