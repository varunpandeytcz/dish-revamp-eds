/**
 * loads and decorates the quick-help-nav block
 * @param {Element} block The quick-help-nav block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    row.classList.add('quick-help-nav-row');

    const columns = [...row.children];
    columns.forEach((col) => {
      col.classList.add('quick-help-nav-item');
      const label = col.querySelector('h1, h2, h3, h4, h5, h6, p, span');

      if (label) {
        label.classList.add('quick-help-nav-label');
      }
    });
  });

  const navLinks = [...block.querySelectorAll('a')];
  navLinks.forEach((link, index) => {
    const listItem = link.closest('li');

    link.classList.add('quick-help-nav-link');
    if (!link.querySelector('h1, h2, h3, h4, h5, h6, p, span')) {
      link.classList.add('quick-help-nav-label');
    }

    if (listItem) {
      listItem.classList.add('quick-help-nav-li');
    }

    if (index === 0) {
      link.classList.add('quick-help-nav-back-link');
      if (listItem) listItem.classList.add('quick-help-nav-li-back');
    }

    if (link.href.includes('/quick-help')) {
      link.classList.add('quick-help-nav-active-link');
      if (listItem) listItem.classList.add('quick-help-nav-li-active');
    }
  });

  block.classList.add('quick-help-nav-ready');
}
