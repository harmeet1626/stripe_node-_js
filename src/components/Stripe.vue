<template>
    <div>
        <h1>Subscription element</h1>
        <button @click="getData()">
            Start payment
        </button>
        <div id="payment-element">
            <!-- Elements will create form elements here -->
        </div>
        <button @click="pay()">pay</button>
    </div>
</template>
<script>
import { loadStripe } from '@stripe/stripe-js';
export default {
    data() {
        return {
            stripe: Stripe('pk_test_51Mg4qcSHH6lTciJepNZxG7YQJvNYcnXm58AXGOrt3hzfyPaxofrhn3LvVBfTzFmkgTh9DPG8AaHEzmjeNQ65FaCM00v5XlKKXf'),
            customerId: null,
            priceId: 'price_1N4J15SHH6lTciJeqY8n6mcF',
            element: null
        }
    },
    async mounted() {
        const stripe = await loadStripe('pk_test_51Mg4qcSHH6lTciJepNZxG7YQJvNYcnXm58AXGOrt3hzfyPaxofrhn3LvVBfTzFmkgTh9DPG8AaHEzmjeNQ65FaCM00v5XlKKXf')
        var secret = ''
        var client = ''
        secret = await await (await fetch('http://localhost:4242/create-customer', {
            method: 'POST'
        })).json()
        this.customerId = secret
        console.log(this.customerId, 'test')
        var elements = this.stripe.elements({ secret })
        this.card = elements.create('card')
        this.card.on('change', ({ error }) => { })
        // this.card.mount('#card-element')
    },
    methods: {
        async getData() {
            var clientSecret = null
            var subscriptionId = null
            fetch('http://localhost:4242/create-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: this.priceId,
                    customerId: this.customerId,
                }),
            }).then(res => res.json())
                .then(res => {
                    clientSecret = res.clientSecret
                    subscriptionId = res.subscriptionId
                    const options = {
                        clientSecret: clientSecret,
                        // Fully customizable with appearance API.
                        appearance: {/*...*/ },
                    };

                    // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 5
                    this.element = this.stripe.elements(options);

                    // Create and mount the Payment Element
                    const paymentElement = this.element.create('payment');
                    paymentElement.mount('#payment-element');
                })


        },
        async pay() {
            const elements = this.element
            await this.stripe.confirmPayment({
                //`Elements` instance that was used to create the Payment Element
                elements,
                confirmParams: {
                    return_url: "http://localhost:8080/",
                },
                redirect: 'if_required'

            });
        }
    }
}
</script>