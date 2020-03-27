<script>
  import ErrorBox from './ErrorBox.svelte';

  export let playSrc;
  export let mediaType;
</script>

<style lang="scss">

</style>

{#if mediaType === 'video'}
  <video src={playSrc}>

  </video>
{:else if mediaType === 'audio'}
  <audio src={playSrc}></audio>
{:else}
  <ErrorBox msg="Media type not supported" />
{/if}
