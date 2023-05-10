<template>
  <div class="home">    
    <Stripe/>
  </div>
</template>

<script>
// @ is an alias to /src
import Stripe from '@/components/Stripe.vue'

export default {
  name: 'HomeView',
  components: {
    Stripe
  }
}
</script>
