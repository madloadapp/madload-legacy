const effects = {
  fadeIn: (element, step = 0.1, showIt = true) => {
    if (step >= 1) step = +('.' + step);
    if (showIt)
      element.hasAttribute('hidden') && element.removeAttribute('hidden');

    let opacityVal;
    element.style.opacity = 0;
    function fade() {
      opacityVal = +element.style.opacity;

      if ((opacityVal += step) <= 1) {
        element.style.opacity = opacityVal;
        (window.requestAnimationFrame && requestAnimationFrame(fade)) ||
          setTimeout(fade, 16);
      } else {
        if (+element.style.opacity !== 1) element.style.opacity = 1;
      }
    }
    (window.requestAnimationFrame && requestAnimationFrame(fade)) ||
      setTimeout(fade, 16);

    return true;
  },
  fadeOut: (element, step = 0.1, hideIt = true) => {
    if (step >= 1) step = +('.' + step);
    element.style.opacity = 1;

    let opacityVal;
    function fade() {
      opacityVal = +element.style.opacity;

      if ((opacityVal -= step) >= 0) {
        element.style.opacity = opacityVal;
        (window.requestAnimationFrame && requestAnimationFrame(fade)) ||
          setTimeout(fade, 16);
      } else {
        if (+element.style.opacity !== 0) element.style.opacity = 0;
        if (hideIt)
          !element.hasAttribute('hidden') && element.setAttribute('hidden', '');
      }
    }
    (window.requestAnimationFrame && requestAnimationFrame(fade)) ||
      setTimeout(fade, 16);

    return true;
  },
  show: element =>
    !element.hasAttribute('not-supported') &&
    element.hasAttribute('hidden') &&
    effects.fadeIn(element),
  hide: element => !element.hasAttribute('hidden') && effects.fadeOut(element)
};

module.exports = effects;
