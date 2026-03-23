/**
 * loads and decorates the quick-help-hero block
 * @param {Element} block The quick-help-hero block element
 */
export default function decorate(block) {
  const outerRow = block.firstElementChild;
  const contentWrap = outerRow?.firstElementChild;
  const title = block.querySelector('h1, h2, h3, h4, h5, h6');

  if (outerRow) outerRow.classList.add('quick-help-hero-row');
  if (contentWrap) contentWrap.classList.add('quick-help-hero-content');
  if (title) title.classList.add('quick-help-hero-title');

  block.classList.add('quick-help-hero-ready');
}
