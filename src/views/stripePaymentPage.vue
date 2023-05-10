<template>
    <h1>Payment element</h1>
    <button @click="begin()">Start stripe payment $590</button>
    <div id="payment-element"></div>
    <button @click="pay()">Pay</button>
</template>
<script>
// import Stripe from 'stripe';

export default {
    data() {
        return {
            stripe: Stripe('pk_test_51Mg4qcSHH6lTciJepNZxG7YQJvNYcnXm58AXGOrt3hzfyPaxofrhn3LvVBfTzFmkgTh9DPG8AaHEzmjeNQ65FaCM00v5XlKKXf'),
            // clientSecret: null
            element: null
        }
    },
    methods: {
        async begin() {
            const client_Secret = await ((await fetch('http://localhost:4242/create-checkout-session')).json())
            const appearance = {
                theme: 'night',
                labels: 'floating'
            };

            this.element = this.stripe.elements({ clientSecret: client_Secret.client_secret, appearance });

            var paymentElement = this.element.create('payment', {
                paymentMethodOrder: ['apple_pay', 'google_pay', 'card', 'klarna'],
                layout: {
                    type: 'accordion',
                    defaultCollapsed: false,
                    radios: true,
                    spacedAccordionItems: false
                }
            });


            paymentElement.mount('#payment-element')
        },
        pay() {
            const elements = this.element
            this.stripe.confirmPayment({
                elements,
                confirmParams: {
                    // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
                    return_url: 'http://localhost:8080/stripe',
                },
                redirect: 'if_required'
            })
        }
    }
}
</script>