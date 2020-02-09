const $ = (selector, parent = document) =>
  parent.querySelector && parent.querySelector(selector);

const $id = document.getElementById.bind(document);

module.exports = { $, $id };
