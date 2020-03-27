<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';


  const dispatch = createEventDispatcher();

  let url = location.hash.substr(1).trim() || '';
  let inputIsFocused;

  // update hash with the url
  $: location.hash = url;

  const supportedSites = [
    'youtube.com',
    'youtu.be',
    'soundcloud.com',
    'twitter.com',
    'facebook.com',
    'instagram.com'
  ];

  function isValidURL(str) {
    if (str === '') {
      return false;
    }

    const matchRE = str.match(
      /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}[.]{0,1}/i
    );

    if (
      matchRE &&
      matchRE.length > 0 &&
      supportedSites.includes(
        matchRE[0].replace(/(http[s]?:\/\/)|(www\.)/gi, '')
      )
    ) {
      return true;
    }

    return false;
  }

  // copy input value
  function inputCopyValue() {
    if (!url) {
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.permissions.query({ name: 'clipboard' }).then(result => {
        if (result.state === 'granted' || result.state === 'prompt') {
          navigator.clipboard.writeText(url);
        }
      });
    } else {
      const input = document.createElement('input');

      input.value = url;
      input.style.display = 'none';
      document.body.appendChild(input);
      input.focus();
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
  }

  function pasteClipboardValue(node) {
    if (node.hasAttribute('not-supported')) {
      return;
    }

    navigator.permissions.query({ name: 'clipboard' }).then(result => {
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.clipboard.readText().then(text => {
          url = text.trim();
        });
      }
    });
  }

  function submitURL() {
    dispatch('urlSubmited', url);
  }
</script>

<style lang="scss">
  @use '../styles/base/colors';
  @use '../styles/base/defaults';
  @use '../styles/base/media-queries' as mq;

  div {
    position: relative;
    margin: auto;
    > input,
    > button {
      height: 42px;
      font-size: 2rem;
      border-width: 0;
    }
    > input {
      width: 85%;
      padding: defaults.$margin 38px defaults.$margin defaults.$margin;
      background-color: lighten(colors.$bg, 10%);
      color: colors.$white;
      border-top-left-radius: defaults.$borderRadius;
      border-bottom-left-radius: defaults.$borderRadius;
    }
    > button {
      width: 15%;
      background-color: colors.$main;
      color: colors.$white;
      border-top-right-radius: defaults.$borderRadius;
      border-bottom-right-radius: defaults.$borderRadius;
      transition: background-color 0.5s ease;
      &[disabled] {
        background-color: lighten(colors.$main, 25%);
        cursor: default;
      }
    }
    > i {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 27%;
      right: 16%;
      overflow: hidden;
      z-index: 2;
      @media (max-width: mq.$xs) {
        display: none !important;
      }
    }
  }
</style>

<div>
  <input
    type="text"
    autocomplete="off"
    spellcheck="false"
    on:focus={ev => ev.target.setAttribute('placeholder', '')}
    on:blur={ev => ev.target.setAttribute('placeholder', 'url...')}
    placeholder="url..."
    bind:value={url}
    on:dblclick={inputCopyValue} />

  <button disabled={!isValidURL(url)} on:click|preventDefault={submitURL}>
    Go!
  </button>

  {#if url.length > 0}
    <i on:click={() => (url = location.hash = '')} transition:fade>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path
          fill="#ff4d4d"
          d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414
          1.414L10 11.414l7.071 7.071 1.414-1.414L11.414
          10l7.071-7.071-1.414-1.414L10 8.586z" />
      </svg>
    </i>
  {:else if !!navigator.clipboard && !!navigator.clipboard.readText}
    <i on:click={pasteClipboardValue} transition:fade>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path
          fill="#fff"
          d="M7.03 2.6a3 3 0 015.94 0L15 3v1h1a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2
          0 01-2-2V6c0-1.1.9-2 2-2h1V3l2.03-.4zM5 6H4v12h12V6h-1v1H5V6zm5-2a1 1
          0 100-2 1 1 0 000 2z" />
      </svg>
    </i>
  {/if}
</div>
