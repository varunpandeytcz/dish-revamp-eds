/**
 * loads and decorates the quick-help-cards block
 * @param {Element} block The quick-help-cards block element
 */
export default function decorate(block) {
  // Loop through each row
  [...block.children].forEach((row) => {
    row.classList.add('quickhelp-row');

    // Loop through each column (card)
    [...row.children].forEach((col) => {
      // Each column = one card
      col.classList.add('quickhelp-card');

      // Get elements inside card
      const img = col.querySelector('img');
      const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
      const link = col.querySelector('a');
      const descs = col.querySelectorAll('p');

      descs.forEach((p) => {
        p.classList.add('quickhelp-card-desc');
        if (p.textContent.trim().toLowerCase() === 'allow 15 minutes for activation') {
          p.classList.add('quickhelp-card-pretext');
        }
      });

      // Add classes
      if (img) img.classList.add('quickhelp-card-icon');

      if (heading) heading.classList.add('quickhelp-card-title');

      if (link) {
        link.classList.add('quickhelp-card-btn');
      }
    });
  });
}
