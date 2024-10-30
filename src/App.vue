<template>
  <div id="app">
    <ShortenURL />
    <URLStats />
  </div>
</template>

<script>
import ShortenURL from './components/ShortenURL.vue';
import URLStats from './components/URLStats.vue';

export default {
  components: {
    ShortenURL,
    URLStats,
  },
};
</script>
