export function fadeIn(elm: HTMLElement, step: number = 0.1): boolean {
  if (!elm.hasAttribute('hidden')) return false;

  if (step >= 1) step /= 10 ** step.toString().length;

  let opacityVal: number;

  elm.style.opacity = '0';

  function fade() {
    opacityVal = +elm.style.opacity;

    if ((opacityVal += step) <= 1) {
      elm.style.opacity = opacityVal.toString();
      window.requestAnimationFrame(fade);
    } else {
      elm.style.opacity = '';
    }
  }

  window.requestAnimationFrame(fade);

  return true;
}

export function fadeOut(elm: HTMLElement, step: number = 0.1): boolean {
  if (elm.hasAttribute('hidden')) return false;

  if (step >= 1) {
    step /= 10 ** step.toString().length;
  }

  elm.style.opacity = '1';

  let opacityVal: number;
  function fade() {
    opacityVal = +elm.style.opacity;

    if ((opacityVal -= step) >= 0) {
      elm.style.opacity = opacityVal.toString();
      window.requestAnimationFrame(fade);
    } else {
      if (+elm.style.opacity !== 0) elm.style.opacity = '0';
      !elm.hasAttribute('hidden') && elm.setAttribute('hidden', '');
    }
  }

  window.requestAnimationFrame(fade);

  return true;
}

export function show(elm: HTMLElement): boolean {
  return (
    !elm.hasAttribute('not-supported') &&
    elm.hasAttribute('hidden') &&
    fadeIn(elm)
  );
}

export function hide(elm: HTMLElement): boolean {
  return !elm.hasAttribute('hidden') && fadeOut(elm);
}
