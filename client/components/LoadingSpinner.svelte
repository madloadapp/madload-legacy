<style lang="scss">
  @use '../styles/base/colors';

  div {
    width: 60px;
    height: 60px;
    margin: 5% auto;
    border-top: 2px solid colors.$main;
    border-bottom: 2px solid transparent;
    border-radius: 50%;
    animation: spinner 1s infinite linear;
    overflow: hidden;
    cursor: progress;
  }
</style>

<div></div>
