const { $, $id } = require('./dom');
const effects = require('./effects');
const validUrl = require('./validurl');

document.addEventListener('DOMContentLoaded', () => {
  let isProcessing = false;

  const urlInput = $id('url');
  const submitBtn = urlInput.nextElementSibling;
  const clipPaste = $id('clipPaste');
  const clrInput = $id('clrInput');
  const outputBox = $id('output');

  function prepareForm(url, getData = false) {
    submitBtn.hasAttribute('disabled') && submitBtn.removeAttribute('disabled');
    if (urlInput.value !== url) urlInput.value = url;
    if (location.hash !== url) location.hash = url;
    if (getData) submitBtn.click();
  }

  !urlInput.getAttribute('data-placeholder') &&
    urlInput.setAttribute(
      'data-placeholder',
      urlInput.getAttribute('placeholder')
    );

  // hide the placeholder content
  urlInput.addEventListener('focus', () => {
    urlInput.setAttribute('placeholder', '');
    if (urlInput.value.trim() && urlInput.select) urlInput.select();
  });

  // show the placeholder content again
  urlInput.addEventListener('blur', () =>
    urlInput.setAttribute(
      'placeholder',
      urlInput.getAttribute('data-placeholder')
    )
  );

  // copy input value
  urlInput.addEventListener('dblclick', () => {
    if (!urlInput) return;

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      const input = document.createElement('input');
      input.value = urlInput.value;
      input.style.display = 'none';
      document.body.appendChild(input);
      input.focus();
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      return;
    }

    navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
      if (result.state === 'granted' || result.state === 'prompt')
        navigator.clipboard.writeText(urlInput.value);
    });
  });

  urlInput.addEventListener('input', () => {
    const url = urlInput.value.trim();

    // handle clear the input using backspace/delete
    if (!url) {
      !submitBtn.hasAttribute('disabled') &&
        submitBtn.setAttribute('disabled', '');

      effects.hide(clrInput);

      effects.show(clipPaste);

      location.hash = '';
      return;
    }

    // hide the clipPaste & show the clrInput
    effects.hide(clipPaste);
    effects.show(clrInput);

    // check if the url is valid and get results
    if (validUrl(url)) prepareForm(url, true);
  });

  // urlInput.addEventListener('change', () => (!isProcessing && validUrl(urlInput.value.trim())) && submitBtn.click());

  // get the url from the hash if exists
  if (location.hash) {
    const url = location.hash.trim().substr(1);
    if (!urlInput.value.trim() && validUrl(url)) {
      // hide the clipPaste & show the clrInput
      effects.hide(clipPaste);
      effects.show(clrInput);

      prepareForm(url);
    }
  }

  // check if browser supports clipboard readText
  if (navigator.clipboard && navigator.clipboard.readText) {
    !urlInput.value.trim() && effects.show(clipPaste);

    clipPaste.hasAttribute('not-supported') &&
      clipPaste.removeAttribute('not-supported');
  } else {
    !clipPaste.hasAttribute('hidden') && clipPaste.setAttribute('hidden', '');
    !clipPaste.hasAttribute('not-supported') &&
      clipPaste.setAttribute('not-supported', '');
  }

  clipPaste.addEventListener('click', () => {
    if (clipPaste.hasAttribute('not-supported'))
      return (
        !clipPaste.hasAttribute('hidden') &&
        clipPaste.setAttribute('hidden', '')
      );

    navigator.permissions.query({ name: 'clipboard-read' }).then(result => {
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.clipboard.readText().then(text => {
          const url = text.trim();

          if (!url) return;

          urlInput.value = url;

          if (validUrl(url)) prepareForm(url, true);

          effects.fadeOut(clipPaste);
          setTimeout(() => {
            clrInput.hasAttribute('hidden') && effects.fadeIn(clrInput);
            clipPaste.hasAttribute('style') &&
              clipPaste.removeAttribute('style');
          }, 100);
        });
      }
    });
  });

  clrInput.addEventListener('click', () => {
    urlInput.value = '';
    location.hash = '';

    !submitBtn.hasAttribute('disabled') &&
      submitBtn.setAttribute('disabled', '');

    clrInput.style.transform = 'rotate(-90deg)';
    setTimeout(() => effects.fadeOut(clrInput), 500);
    setTimeout(() => {
      !clipPaste.hasAttribute('not-supported') &&
        clipPaste.hasAttribute('hidden') &&
        effects.fadeIn(clipPaste);
      clrInput.hasAttribute('style') && clrInput.removeAttribute('style');
    }, 600);
  });

  const videoCard = $('.video-card');

  const thumbnailImg = $('.thumbnail img');
  const vidDuration = $('.thumbnail .duration');
  const infoTitle = $('.info .title a');
  const infoAuthor = $('.author a');

  const formatsList = $('.download .formats-list');
  const dropIcon = $('.download .drop-icon');
  const getBtn = $('.download .get');

  const loadingWrap = $('.loading');

  const errBoxWrap = $('.errbox');
  const errBoxMsg = $('.errbox .err-msg');

  function setFormatItem(format, filename, cb) {
    const item = document.createElement('li');

    // set the formats info
    item.setAttribute('data-url', format.url);
    item.setAttribute('data-ext', format.ext);
    item.setAttribute(
      'data-filename',
      filename.replace(/\|\\\/\*\+<>:\?"'/g, '_')
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

    cb && cb(item);

    formatsList.appendChild(item);
  }

  function showErrorMsg(errmsg, disableProcessing = true) {
    if (!errmsg) return false;

    if (
      !loadingWrap.hasAttribute('hidden') ||
      !videoCard.hasAttribute('hidden')
    ) {
      !loadingWrap.hasAttribute('hidden') && effects.fadeOut(loadingWrap);
      !videoCard.hasAttribute('hidden') && effects.fadeOut(errBoxWrap);
      setTimeout(() => effects.fadeIn(errBoxWrap), 300);
    } else {
      errBoxWrap.hasAttribute('hidden') && effects.fadeIn(errBoxWrap);
    }

    if (disableProcessing) isProcessing = false;

    errBoxMsg.textContent = errmsg;
  }

  function getData(url) {
    const controller = new AbortController();

    const request = fetch('/api', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({ url })
    }).then(body => body.json());

    return {
      request,
      abort: controller.abort.bind(controller)
    };
  }

  formatsList.addEventListener('click', () => {
    if (formatsList.childElementCount <= 1) return;

    formatsList.hasAttribute('data-list-open')
      ? formatsList.removeAttribute('data-list-open')
      : formatsList.setAttribute('data-list-open', '');
  });

  // hide the formats list menu when click wherever outside
  document.addEventListener('click', ev => {
    if (
      formatsList.hasAttribute('data-list-open') &&
      formatsList !== ev.target.parentElement &&
      dropIcon !== ev.target.parentElement
    )
      formatsList.removeAttribute('data-list-open');
  });

  getBtn.addEventListener('click', () => {
    const selected = formatsList.firstElementChild;

    fetch(selected.getAttribute('data-url'), {
      mode: 'no-cors',
      headers: {
        'Content-Disposition': `attachment; filename="${selected.getAttribute(
          'data-filename'
        )}"`,
        'Content-Type': 'audio/m4a'
      }
    })
      .then(res => res)
      .then(data => {
        const anchor = document.createElement('a');

        anchor.style.display = 'none';
        anchor.setAttribute('download', selected.getAttribute('data-filename'));

        anchor.href = URL.createObjectURL(
          new Blob([data], { type: 'audio/m4a' })
        );
        document.body.appendChild(anchor);
        console.log(anchor);
        const clickAnchor = setTimeout(() => {
          anchor.click();
          URL.revokeObjectURL(anchor.href);
          document.body.removeChild(anchor);

          clearTimeout(clickAnchor);
        }, 66);
      });

    // anchor.setAttribute('target', '_blank');
  });

  submitBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();

    if (isProcessing) return;

    if (!url || !validUrl(url)) {
      !submitBtn.hasAttribute('disabled') &&
        submitBtn.setAttribute('disabled', '');
      return showErrorMsg('Please insert a valid url.');
    }

    isProcessing = true;

    submitBtn.hasAttribute('disabled') && submitBtn.removeAttribute('disabled');
    outputBox.hasAttribute('hidden') && outputBox.removeAttribute('hidden');

    if (
      !videoCard.hasAttribute('hidden') ||
      !errBoxWrap.hasAttribute('hidden')
    ) {
      effects.fadeOut(videoCard);
      effects.fadeOut(errBoxWrap);
      setTimeout(() => effects.fadeIn(loadingWrap), 300);
    } else {
      effects.fadeIn(loadingWrap);
    }

    const { request, abort } = getData(url);
    request
      .then(data => {
        if (!data || !data.ok)
          return showErrorMsg(
            (data && data.err) || 'error occurred when getting info.'
          );

        if (data.duration) {
          vidDuration.textContent = data.duration;
          vidDuration.hasAttribute('hidden') &&
            vidDuration.removeAttribute('hidden');
        } else {
          vidDuration.textContent = '';
          !vidDuration.hasAttribute('hidden') &&
            vidDuration.setAttribute('hidden', '');
        }

        infoTitle.textContent = data.title;
        infoTitle.setAttribute('href', data.url);

        infoAuthor.textContent = data.author.name;
        if (data.author.url) infoAuthor.setAttribute('href', data.author.url);

        // remove old formats list
        while (formatsList.firstElementChild)
          formatsList.removeChild(formatsList.firstElementChild);

        if (data.formats) {
          if (data.formats.length > 1) {
            // show the drop[down/up] icon
            dropIcon.hasAttribute('hidden') &&
              dropIcon.removeAttribute('hidden');

            // create formats elements
            data.formats.forEach(format => {
              setFormatItem(format, `${data.title}.${format.ext}`, item => {
                // selector
                item.addEventListener('click', () => {
                  if (item === formatsList.firstElementChild) return;
                  formatsList.firstElementChild.insertAdjacentElement(
                    'beforebegin',
                    item
                  );
                });
              });
            });
          } else {
            // hide the drop[down/up] icon
            !dropIcon.hasAttribute('hidden') &&
              dropIcon.setAttribute('hidden', '');

            // set the format item
            setFormatItem(
              data.formats[0],
              `${data.title}.${data.formats[0].ext}`
            );
          }
        } else {
          showErrorMsg('connot get media data.');
        }

        // set the thumbnail image
        thumbnailImg.setAttribute('src', data.thumbnail);

        if (!loadingWrap.hasAttribute('hidden')) {
          effects.fadeOut(loadingWrap);
          setTimeout(() => effects.fadeIn(videoCard), 300);
        } else {
          effects.fadeIn(videoCard);
        }

        isProcessing = false;
      })
      .catch(err => {
        showErrorMsg('request error occurred.');
        console.error(err);
      });
  });
});
