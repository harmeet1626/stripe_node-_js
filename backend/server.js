// This is your test secret API key.
const stripe = require('stripe')('sk_test_51Mg4qcSHH6lTciJeaGNI4OHXueQleXieDaBKw4dQoPQWNBQMFOsplYfSTBVwdBStSJQLlFvFPphfFvIKUy3wAyyn008SW57vtP');
const express = require('express');
const bodyparser = require('body-parser')
const app = express();
const YOUR_DOMAIN = 'http://localhost:4242';
app.use(bodyparser.json())
app.get('/create-checkout-session', async (req, res) => {
  try {
    const intent = await stripe.paymentIntents.create({
      amount: 59000,
      currency: 'inr',
      metadata: { intigration_check: 'accept_a_payment' }
    })
    return res.json({ client_secret: intent.client_secret })
  }
  catch (error) {
    res.status(500).send(error)
  }
});



app.post('/create-customer', async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      email: 'harmeet@gmail.com',
      name: 'Harmeet Singh',
      shipping: {
        address: {
          city: 'Brothers',
          country: 'US',
          line1: '27 Fredrick Ave',
          postal_code: '97712',
          state: 'CA',
        },
        name: 'Harmeet',
      },
      address: {
        city: 'Brothers',
        country: 'US',
        line1: '27 Fredrick Ave',
        postal_code: '97712',
        state: 'CA',
      },
    })
    return res.json(customer.id)
  }
  catch { }
})

app.post('/create-subscription', async (req, res) => {

  const customerId = req.body.customerId
  const priceId = req.body.priceId;
  try {
    // Create the subscription. Note we're expanding the Subscription's
    // latest invoice and that invoice's payment_intent
    // so we can pass it to the front end to confirm the payment
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: priceId,
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // res.send({

    // });
    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    })
  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }
});

app.listen(4242, () => console.log('Running on port 4242'));