<style lang="scss">
  @use '../styles/base/colors';
  @use '../styles/base/media-queries' as mq;
  @use '../styles/base/mixins';

  .top-linear {
    height: 5px;
    background-size: 400% 400%;
    animation: linearGradient 15s linear infinite alternate;
    @include mixins.addGradient;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5%;
    padding-right: 5%;
    user-select: none;
    h1 {
      font-size: 3.2rem;
      @media (max-width: mq.$xs) {
        margin-left: auto;
        margin-right: auto;
      }
      span {
        color: colors.$main;
        font-size: 1.1em;
      }
    }
    nav {
      font-size: 1.92rem;
      @media (max-width: mq.$xs) {
        display: none;
      }
      i.heart-icon {
        padding-left: 0.5rem;
        > svg {
          width: 1.5rem;
          height: 1.5rem;
          fill: colors.$red;
        }
      }
    }
  }
</style>

<div class="top-linear" />
<header>
  <h1>
    <a href="/" tabindex="-1">
      <span>M</span>
      ad
      <span>L</span>
      oad
    </a>
  </h1>
  <nav>
    <a
      href="https://twitter.com/osamaify"
      target="_blank"
      title="Follow Osama on Twitter!"
      tabindex="-1">
      @osamaify
      <i class="heart-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path
            d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5
            0 00-7.78-7.77l-.61.61z" />
        </svg>
      </i>
    </a>
  </nav>
</header>
