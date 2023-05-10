<template>
  <div id="card-element"></div>
  <button @click="purchase">Purchase</button>
</template>

<script>
// let stripe = Stripe(`pk_test_51Mg4qcSHH6lTciJepNZxG7YQJvNYcnXm58AXGOrt3hzfyPaxofrhn3LvVBfTzFmkgTh9DPG8AaHEzmjeNQ65FaCM00v5XlKKXf`),
//   elements = stripe.elements(),
//   card = undefined;
// import {Stripe} from 'stripe';
export default {
  data() {
    return {
      stripe: Stripe('pk_test_51Mg4qcSHH6lTciJepNZxG7YQJvNYcnXm58AXGOrt3hzfyPaxofrhn3LvVBfTzFmkgTh9DPG8AaHEzmjeNQ65FaCM00v5XlKKXf'),
    }
  },
  mounted() {   
    const stripeData = this.stripe 
    var element = this.stripe.elements()
    var cardElement = element.create('card',{
      paymentMethodOrder: ['apple_pay', 'google_pay', 'card', 'klarna']
    });
    cardElement.mount('#card-element')
  },
  methods: {

    purchase() {
      stripe.createToken(card).then(function (result) {
        // Access the token with result.token
        if (result.error) {
          this.stripeValidationError = result.error.message;
        } else {
          var stripeObject = {
            amount: 1000,
            source: result.token
          }

          this.saveDataToFireStore(stripeObject)
        }
      });
    }
  }
};
</script>