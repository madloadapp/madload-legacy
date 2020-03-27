<script>
  export let title;
  export let url;
  export let author;
</script>

<style lang="scss">
  @use '../styles/base/colors';
  @use '../styles/base/defaults';

  .info {
    display: flex;
    flex-flow: column nowrap;
    width: calc(100% - 272px);
    padding-left: defaults.$padding;
    .title,
    .author {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      letter-spacing: 1.5px;
    }
    .title {
      font-size: 1.6rem;
      margin-bottom: 10px;
    }
    .author {
      font-size: 1.12rem;
      font-weight: bold;
      color: #ddd;
      transition: color 0.5s ease;
      &:hover {
        color: colors.$white;
      }
    }
  }
</style>

<div class="info">
  <h5 class="title">
    <a href={ url } target="_blank">{ title }</a>
  </h5>
  <h6 class="author">
    <a href={ author.url } target="_blank">{ author.name }</a>
  </h6>
</div>
