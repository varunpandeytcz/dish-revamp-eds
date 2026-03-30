/**
 * loads and decorates the offers-for-you block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  // Row 0: heading (icon + title)
  const headingRow = rows[0];
  headingRow.classList.add('offers-heading');
  const [headingCol] = headingRow.querySelectorAll(':scope > div');
  if (headingCol) {
    const img = headingCol.querySelector('picture, img');
    const titleEl = headingCol.querySelector('strong');
    headingCol.innerHTML = '';
    if (img) {
      const iconWrap = document.createElement('span');
      iconWrap.className = 'offers-icon';
      iconWrap.append(img.closest ? img.closest('picture') || img : img);
      headingCol.append(iconWrap);
    }
    if (titleEl) {
      const h2 = document.createElement('h2');
      h2.textContent = titleEl.textContent.trim();
      headingCol.append(h2);
    }
  }

  // Row 1: offer cards grid
  const cardsRow = rows[1];
  if (!cardsRow) return;
  cardsRow.classList.add('offers-cards');

  const cardCols = [...cardsRow.querySelectorAll(':scope > div')];
  cardCols.forEach((col) => {
    col.classList.add('offer-card');
    const paragraphs = [...col.querySelectorAll('p')];

    // p[0] = logo image, p[1] = title, p[2] = description, p[3] = price
    const logoP = paragraphs[0];
    const titleP = paragraphs[1];
    const descP = paragraphs[2];
    const priceP = paragraphs[3];

    // Build card structure
    const topRow = document.createElement('div');
    topRow.className = 'offer-card-top';
    if (logoP) {
      logoP.classList.add('offer-logo');
      topRow.append(logoP);
    }
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'offer-checkbox';
    checkbox.setAttribute('aria-label', 'Select offer');
    topRow.append(checkbox);

    if (titleP) titleP.classList.add('offer-title');
    if (descP) descP.classList.add('offer-desc');

    const footer = document.createElement('div');
    footer.className = 'offer-footer';
    if (priceP) {
      priceP.classList.add('offer-price');
      footer.append(priceP);
    }
    const infoBtn = document.createElement('button');
    infoBtn.className = 'offer-info';
    infoBtn.setAttribute('aria-label', 'More information');
    infoBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    footer.append(infoBtn);

    col.innerHTML = '';
    col.append(topRow);
    if (titleP) col.append(titleP);
    if (descP) col.append(descP);
    col.append(footer);
  });
}
