<script>
  export let msg;
</script>

<style lang="scss">
  @use '../styles/base/colors';

  div {
    margin: 5% auto;
    text-align: center;
    overflow: hidden;
    i > svg {
      width: 50px;
      height: 50px;
      fill: colors.$red;
    }
    p {
      font-size: 2.7rem;
    }
  }
</style>

<div>
  <i>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        d="M2.93 17.07A10 10 0 1117.07 2.93 10 10 0 012.93 17.07zm12.73-1.41A8 8 0 104.34 4.34a8 8 0 0011.32 11.32zM9 5h2v6H9V5zm0 8h2v2H9v-2z"
      />
    </svg>
  </i>
  <p>{msg || 'Error!'}</p>
</div>
