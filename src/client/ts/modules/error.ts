import * as effects from './effects';

const videoCard = <HTMLDivElement>document.querySelector('#output .video-card');
const loadingWrap = <HTMLDivElement>document.querySelector('.loading');
const errBoxWrap = <HTMLDivElement>document.querySelector('.err-box');
const errBoxMsg = <HTMLParagraphElement>errBoxWrap.querySelector('.err-msg');

export default (msg: string): string | false => {
  if (!msg) return false;

  // hide loading spinner
  if (!loadingWrap.hasAttribute('hidden')) {
    effects.fadeOut(loadingWrap);
  }

  // hide video card
  if (!videoCard.hasAttribute('hidden')) {
    effects.fadeOut(videoCard);
  }

  setTimeout(() => effects.fadeIn(errBoxWrap), 300);

  if (
    !loadingWrap.hasAttribute('hidden') ||
    !videoCard.hasAttribute('hidden')
  ) {
    !loadingWrap.hasAttribute('hidden') && effects.fadeOut(loadingWrap);
    !videoCard.hasAttribute('hidden') && effects.fadeOut(errBoxWrap);
  } else {
    errBoxWrap.hasAttribute('hidden') && effects.fadeIn(errBoxWrap);
  }

  errBoxMsg.textContent = msg;
  return msg;
};
