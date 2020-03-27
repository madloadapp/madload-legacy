<script>
  export let thumbnail;
  export let duration;
</script>

<style lang="scss">
  @use '../styles/base/colors';
  @use '../styles/base/defaults';

  div {
    width: 272px;
    height: 180px;
    position: relative;
    border-radius: defaults.$borderRadius;
    overflow: hidden;
    > img {
      width: 100%;
      height: 100%;
      border-radius: defaults.$borderRadius;
      object-fit: cover;
    }
    > i {
      width: 25px;
      height: 25px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      > svg {
        fill: colors.$darkMarker;
        transition: fill 0.5s ease;
        &:hover {
          fill: darken(colors.$darkMarker, 50%);
        }
      }
    }
    > span {
      position: absolute;
      bottom: 0;
      right: 0;
      padding: (defaults.$padding / 3);
      font-size: 1.4rem;
      background-color: lighten(colors.$darkMarker, 5%);
      border-bottom-right-radius: defaults.$borderRadius;
      border-top-left-radius: defaults.$borderRadius;
      letter-spacing: 1px;
      pointer-events: none;
      user-select: none;
    }
  }
</style>

<div>
  <img src={thumbnail} alt="Thumbnail" />
  <i title="Play">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        d="M2.93 17.07A10 10 0 1117.07 2.93 10 10 0 012.93 17.07zm12.73-1.41A8 8
        0 104.34 4.34a8 8 0 0011.32 11.32zM7 6l8 4-8 4V6z" />
    </svg>
  </i>
  <span>{duration}</span>
</div>
