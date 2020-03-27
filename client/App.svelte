<script>
  import Header from './layout/Header.svelte';
  import Footer from './layout/Footer.svelte';

  import Home from './views/Home.svelte';
</script>

<style lang="scss" global>
  @use 'styles/vendor/normalize';

  @use 'styles/partials/fonts';
  @use 'styles/partials/keyframes';
  @use 'styles/partials/reset';
  @use 'styles/partials/classes';
</style>

<div id="app">
  <Header />
  <Home />
  <Footer />
</div>
