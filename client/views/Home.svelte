<script>
  import { fade } from 'svelte/transition';

  import InputBox from '../components/InputBox.svelte';
  import VideoCardThumbnail from '../components/VideoCardThumbnail.svelte';
  import VideoCardInfo from '../components/VideoCardInfo.svelte';
  import VideoCardDownload from '../components/VideoCardInfo.svelte';
  import Player from '../components/Player.svelte';
  import LoadingSpinner from '../components/LoadingSpinner.svelte';
  import ErrorBox from '../components/ErrorBox.svelte';

  let url = '';

  let fetchPromise;

  function setURL({ detail }) {
    url = detail;

    fetchPromise = fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });
  }
</script>

<style lang="scss">
  @use '../styles/base/media-queries' as mq;

  main {
    margin-top: 10%;
    @media (min-width: mq.$small) and (max-width: mq.$large) {
      margin-top: 15%;
    }
    @media (min-width: mq.$xs) and (max-width: (mq.$small - 1)) {
      margin-top: 20%;
    }
    @media (max-width: (mq.$xs - 1)) {
      margin-top: 30%;
    }
  }

  .output {
    margin: 0.5% auto;
    .video-card {
      display: flex;
      align-items: center;
      align-self: center;
      @media (max-width: mq.$xs) {
        flex-direction: column;
        > div {
          width: 100% !important;
          padding: 0 !important;
          margin: 2% auto;
          text-align: center;
        }
      }
    }
  }
  main .input-box,
  .output {
    width: 60%;
    @media (min-width: mq.$small) and (max-width: mq.$large) {
      width: 70%;
    }
    @media (min-width: mq.$xs) and (max-width: (mq.$small - 1)) {
      width: 90%;
    }
    @media (max-width: (mq.$xs - 1)) {
      width: 100%;
    }
  }
</style>

<main>
  <section class="input">
    <InputBox on:urlSubmited={setURL} />
  </section>
  {#if url.length > 0}
    {#await fetchPromise}
      <LoadingSpinner />
    {:then data}
      <section class="output" transition:fade>
        <VideoCardThumbnail
          thumbnail={data.thumbnail}
          duration={data.duration} />
        <VideoCardInfo title={data.title} {url} author={data.author} />
        <VideoCardDownload formats={data.formats} />
      </section>

      <section id="player" transition:fade>
        <Player />
      </section>
    {:catch err}
      <ErrorBox msg={err.msg} />
    {/await}
  {/if}
</main>
