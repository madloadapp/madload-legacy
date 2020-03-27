<script>
  export let formats;

  function formatsListClickHandling(ev) {
    if (ev.target.childElementCount > 1) {
      if (ev.target.hasAttribute('data-list-open')) {
        ev.target.removeAttribute('data-list-open')
      } else {
        ev.target.setAttribute('data-list-open', '');
      }
    }
  }

  function formatsListChooseItem(ev) {
    if (ev.target !== ev.target.parentElement.firstElementChild) {
      ev.target.parentElement.firstElementChild.insertAdjacentElement(
        'beforebegin',
        ev.target
      );
    }
  }
</script>

<style lang="scss">
  @use '../styles/base/colors';
  @use '../styles/base/defaults';
  @use '../styles/base/media-queries' as mq;

  div {
    width: 70%;
    height: 45px;
    margin-top: 5%;
    position: relative;
    text-align: center;
    @media (min-width: mq.$small) and (max-width: mq.$large) {
      width: 78%;
    }
    @media (max-width: (mq.$small - 1)) {
      width: 100%;
    }
    > ul,
    > button {
      display: block;
      float: left;
      border: 1.5px solid colors.$main;
      cursor: pointer;
    }
    > ul {
      width: 70%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      color: colors.$main;
      background-color: transparent;
      border-top-left-radius: defaults.$borderRadius;
      border-bottom-left-radius: defaults.$borderRadius;
      user-select: none;
      transition: height 0.2s ease;
      &:not([data-list-open]) {
        height: 100%;
        overflow: hidden;
        > li:not(:first-of-type) {
          display: none;
        }
      }
      &[data-list-open] {
        height: auto;
        border-bottom-right-radius: defaults.$borderRadius;
        + .drop-icon {
          transform: rotate(180deg);
        }
        > li:not(:last-of-type) {
          border-bottom: 1px solid colors.$main;
        }
      }
      > li {
        width: 100%;
        font-size: 1.6rem;
        line-height: 42px;
        word-spacing: 3px;
        transition: padding-left 0.5s ease;
        &:not(:first-of-type):hover {
          padding-left: 7px;
        }
        > i.no-audio {
          display: inline-block;
          width: 20px;
          height: 20px;
          position: absolute;
          top: calc(50% - 10px);
          left: 10px;
          pointer-events: none;
          > svg {
            fill: colors.$red;
          }
        }
      }
    }
    > i.drop-icon {
      width: 25px;
      height: 25px;
      font-size: 1.6rem;
      position: absolute;
      top: 25%;
      right: 34%;
      transition: transform 0.4s ease-out;
      pointer-events: none;
      > svg {
        fill: colors.$main;
      }
    }
    > button {
      width: 30%;
      height: 100%;
      font-size: 2rem;
      color: colors.$white;
      background-color: colors.$main;
      border-top-right-radius: defaults.$borderRadius;
      border-bottom-right-radius: defaults.$borderRadius;
    }
  }
</style>

<div>
  <ul on:click={formatsListClickHandling}>
    {#each formats as format}
      <li
        data-url={format.url}
        data-ext={format.ext}
        title={format.formatText}
        class:no-audio={format.acodec === 'none'}
        on:click={formatsListChooseItem}
      >
        <span>
          {format.ext.toUpperCase()}
          (
            {#if format.ext === 'm4a' || format.ext === 'mp3'}
              audio
            {:else if format.formatNote}
              {format.formatNote}
            {:else if format.formatText}
              {format.formatText}
            {/if}
          )
        </span>
        {#if format.acodec == 'none'}
          <i>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path
                fill="#c8001d"
                d="M15 8.59l-2.12-2.13-1.42 1.42L13.6 10l-2.13 2.12 1.42 1.42L15 11.4l2.12 2.13 1.42-1.42L16.4 10l2.13-2.12-1.42-1.42L15 8.6zM4 7H0v6h4l5 5V2L4 7z"
              />
            </svg>
          </i>
        {/if}
      </li>
    {/each}
  </ul>
  {#if formats.length > 1}
    <i class="drop-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path
          d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
        />
      </svg>
    </i>
  {/if}
  <button class="get">Get</button>
</div>
