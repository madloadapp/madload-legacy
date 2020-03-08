import * as effects from './modules/effects';
import * as url from './modules/url';
import request from './modules/request';
import error from './modules/error';
import type Format from '../../typings/Format';
import {APISuccessResponse, APIFailResponse} from '../../typings/APIResponse';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    let isProcessing: boolean = false;

    const urlInput = <HTMLInputElement>document.getElementById('url');
    const submitBtn = <HTMLButtonElement>document.getElementById('goBtn');
    const clipPaste = <HTMLElement>document.getElementById('clipPaste');
    const clrInput = <HTMLElement>document.getElementById('clrInput');
    const outputBox = <HTMLDivElement>document.getElementById('output');
    const videoCard = <HTMLDivElement>outputBox.querySelector('.video-card');
    const thumbnail = <HTMLImageElement>(
      videoCard.querySelector('.thumbnail img')
    );
    const vidDuration = <HTMLSpanElement>(
      videoCard.querySelector('.thumbnail .duration')
    );
    const infoTitle = <HTMLAnchorElement>(
      videoCard.querySelector('.info .title a')
    );
    const infoAuthor = <HTMLAnchorElement>(
      videoCard.querySelector('.info .author a')
    );
    const formatsList = <HTMLUListElement>(
      outputBox.querySelector('.download .formats-list')
    );
    const dropIcon = <HTMLElement>(
      document.querySelector('.download .drop-icon')
    );
    const getBtn = <HTMLButtonElement>outputBox.querySelector('.download .get');
    const loadingWrap = <HTMLDivElement>document.querySelector('.loading');
    const errBoxWrap = <HTMLDivElement>document.querySelector('.err-box');

    // hide the placeholder content
    urlInput.addEventListener(
      'focus',
      () => {
        if (!!urlInput.getAttribute('data-placeholder')) {
          urlInput.setAttribute('placeholder', '');
        }

        if (urlInput.value && urlInput.select) {
          urlInput.select();
        }
      },
      false
    );

    // show the placeholder content again
    urlInput.addEventListener(
      'blur',
      () => {
        if (
          !urlInput.getAttribute('placeholder') &&
          !!urlInput.getAttribute('data-placeholder')
        ) {
          urlInput.setAttribute(
            'placeholder',
            urlInput.getAttribute('data-placeholder') || ''
          );
        }
      },
      false
    );

    // copy input value
    urlInput.addEventListener(
      'dblclick',
      () => {
        if (!urlInput) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.permissions.query({ name: 'clipboard' }).then(result => {
            if (result.state === 'granted' || result.state === 'prompt') {
              navigator.clipboard.writeText(urlInput.value);
            }
          });
        } else {
          const input = <HTMLInputElement>document.createElement('input');
          input.value = urlInput.value;
          input.style.display = 'none';
          document.body.appendChild(input);
          input.focus();
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
        }
      },
      false
    );

    urlInput.addEventListener(
      'input',
      () => {
        // handle clear the input using backspace/delete
        if (!urlInput.value) {
          submitBtn.setAttribute('disabled', '');
          effects.hide(clrInput);
          effects.show(clipPaste);
          location.hash = '';
          return;
        }

        // hide the clipPaste & show the clrInput
        if (!clipPaste.hasAttribute('hidden')) {
          effects.hide(clipPaste);
        }

        if (clrInput.hasAttribute('hidden')) {
          effects.show(clrInput);
        }

        location.hash = urlInput.value;
      },
      false
    );

    urlInput.addEventListener(
      'change',
      () => {
        // !isProcessing &&
        if (!isProcessing) {
          if (url.isValid(urlInput.value)) {
            submitBtn.removeAttribute('disabled');
            submitBtn.click();
          }
        }
      },
      false
    );

    // get the url from the hash if exists
    if (location.hash) {
      urlInput.value = location.hash.substr(1).trim();
      // effects.hide(clipPaste);
      // effects.show(clrInput);
    }

    // check if browser supports clipboard readText
    if (navigator.clipboard && navigator.clipboard.readText) {
      if (!urlInput.value.trim()) {
        effects.show(clipPaste);
      }

      clipPaste.removeAttribute('not-supported');
    } else {
      clipPaste.setAttribute('not-supported', '');
      clipPaste.setAttribute('hidden', '');
    }

    clipPaste.addEventListener(
      'click',
      () => {
        if (clipPaste.hasAttribute('not-supported')) {
          return clipPaste.setAttribute('hidden', '');
        }

        navigator.permissions.query({ name: 'clipboard' }).then(result => {
          if (result.state === 'granted' || result.state === 'prompt') {
            navigator.clipboard.readText().then(text => {
              const urlVal: string = text.trim();

              if (!urlVal) {
                return;
              }

              urlInput.value = urlVal;

              if (url.isValid(urlVal)) {
                submitBtn.removeAttribute('disabled');
                submitBtn.click();
              }

              effects.fadeOut(clipPaste);

              const showClrInput = setTimeout(() => {
                effects.fadeIn(clrInput);
                // clipPaste.removeAttribute('style');
                clearTimeout(showClrInput);
              }, 300);
            });
          }
        });
      },
      false
    );

    clrInput.addEventListener(
      'click',
      () => {
        urlInput.value = '';
        location.hash = '';

        submitBtn.setAttribute('disabled', '');

        clrInput.style.transform = 'rotate(-90deg)';

        const hideClrInput = setTimeout(() => {
          effects.fadeOut(clrInput);
          clearTimeout(hideClrInput);
        }, 500);

        const showClipPaste = setTimeout(() => {
          if (!clipPaste.hasAttribute('not-supported')) {
            effects.fadeIn(clipPaste);
          }

          clearTimeout(showClipPaste);
        }, 600);
      },
      false
    );

    formatsList.addEventListener(
      'click',
      () => {
        if (formatsList.childElementCount > 1) {
          formatsList.hasAttribute('data-list-open')
            ? formatsList.removeAttribute('data-list-open')
            : formatsList.setAttribute('data-list-open', '');
        }
      },
      false
    );

    // hide the formats list menu when click wherever outside
    document.addEventListener(
      'click',
      () => {
        if (formatsList.hasAttribute('data-list-open')) {
          formatsList.removeAttribute('data-list-open');
        }
      },
      false
    );
    /*
    document.addEventListener(
      'click',
      ev => {
        if (
          formatsList.hasAttribute('data-list-open') &&
          formatsList !== ev.target.parentElement &&
          dropIcon !== ev.target.parentElement
        ) {
          formatsList.removeAttribute('data-list-open');
        }
      },
      false
    );
    */

    getBtn.addEventListener(
      'click',
      () => {
        const anchor = <HTMLAnchorElement>document.createElement('a');

        anchor.style.display = 'none';

        anchor.setAttribute(
          'download',
          formatsList?.firstElementChild?.getAttribute('data-filename') || ''
        );
        anchor.setAttribute('target', '_blank');

        document.body.appendChild(anchor);
        anchor.click();

        const removeAnchor = setTimeout(() => {
          document.body.removeChild(anchor);
          clearTimeout(removeAnchor);
        }, 16);
      },
      false
    );

    submitBtn.addEventListener(
      'click',
      async () => {
        const urlVal: string = urlInput.value.trim();

        if (isProcessing) return;

        if (!urlVal || !url.isValid(urlVal)) {
          isProcessing = false;
          submitBtn.setAttribute('disabled', '');
          return error('Please insert a valid url.');
        }

        isProcessing = true;

        submitBtn.removeAttribute('disabled');
        outputBox.removeAttribute('hidden');

        if (!videoCard.hasAttribute('hidden')) {
          effects.fadeOut(videoCard);
        }

        if (!errBoxWrap.hasAttribute('hidden')) {
          effects.fadeOut(errBoxWrap);
        }

        const showLoading = setTimeout(() => {
          effects.fadeIn(loadingWrap);
          clearTimeout(showLoading);
        }, 300);

        try {
          const data: APISuccessResponse | APIFailResponse = await request(urlVal);
          if (!data || !data.ok) {
            isProcessing = false;
            return error(data.msg || 'error occurred when getting info.');
          }

          if (data.duration) {
            vidDuration.textContent = data.duration;
            vidDuration.removeAttribute('hidden');
          } else {
            vidDuration.textContent = '';
            vidDuration.setAttribute('hidden', '');
          }

          infoTitle.textContent = data.title;
          infoTitle.setAttribute('href', data.url);

          infoAuthor.textContent = data.author.name;
          if (data.author.url) infoAuthor.setAttribute('href', data.author.url);

          // remove old formats list
          while (formatsList.firstElementChild) {
            formatsList.removeChild(formatsList.firstElementChild);
          }

          if (data.formats) {
            // hide or show drop down icon
            if (data.formats.length > 1) {
              dropIcon.removeAttribute('hidden');
            } else {
              dropIcon.setAttribute('hidden', '');
            }

            // create formats elements
            data.formats.forEach((format: Format) => {
              const item = <HTMLLIElement>document.createElement('li');

              // set the formats info
              item.setAttribute('data-url', format.url);
              item.setAttribute('data-ext', format.ext);
              item.setAttribute(
                'data-filename',
                `${data.title}.${data.formats[0].ext}`.replace(
                  /\|\\\/\*\+<>:\?"'/g,
                  '_'
                )
              );

              if (format.format) item.setAttribute('title', format.format);

              // set the item name
              item.textContent = format.ext.toUpperCase();

              // customize the the format name
              if (format.ext === 'm4a' || format.ext === 'mp3') {
                item.textContent += ' (audio)';
              } else if (format.formatNote) {
                item.textContent += ` (${format.formatNote})`;
              } else if (format.format) {
                item.textContent += ` (${format.format})`;
              }

              // add no-audio for formats
              if (format.acodec === 'none') item.classList.add('no-audio');

              item.addEventListener(
                'click',
                () => {
                  if (item !== formatsList?.firstElementChild) {
                    formatsList?.firstElementChild?.insertAdjacentElement(
                      'beforebegin',
                      item
                    );
                  }
                },
                false
              );

              formatsList.appendChild(item);
            });
          } else {
            isProcessing = false;
            error('connot get media data.');
          }

          // set the thumbnail image
          thumbnail.setAttribute('src', data.thumbnail);

          if (!loadingWrap.hasAttribute('hidden')) {
            effects.fadeOut(loadingWrap);

            effects.fadeIn(videoCard);
          }

          const showVideoCard = setTimeout(() => {
            effects.fadeIn(videoCard);
            clearTimeout(showVideoCard);
          }, 300);

          isProcessing = false;
        } catch (err) {
          isProcessing = false;
          error('request error occurred.');
          console.error(err);
        }
      },
      false
    );
  },
  false
);
