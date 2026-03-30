const CHEVRON_UP = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
const CHEVRON_DOWN = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

/**
 * loads and decorates the accordion-my-pack block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  // Row 0 = accordion header title
  const [titleRow, ...contentRows] = rows;
  const titleText = titleRow.querySelector('p')?.textContent.trim() || 'My Pack';

  // Build header
  const header = document.createElement('div');
  header.className = 'accordion-header';
  header.setAttribute('role', 'button');
  header.setAttribute('aria-expanded', 'false');
  header.tabIndex = 0;
  header.innerHTML = `
    <span class="accordion-title">${titleText}</span>
    <span class="accordion-chevron" aria-hidden="true">${CHEVRON_DOWN}</span>
  `;

  // Build content wrapper
  const content = document.createElement('div');
  content.className = 'accordion-content';
  content.hidden = true;

  // Row 1 = table header (PACKS/CHANNELS | PRICE)
  const [tableHeaderRow, ...dataRows] = contentRows;
  if (tableHeaderRow) {
    const thCols = [...tableHeaderRow.querySelectorAll(':scope > div')];
    const theadDiv = document.createElement('div');
    theadDiv.className = 'pack-table-header';
    thCols.forEach((col) => {
      const cell = document.createElement('span');
      cell.textContent = col.textContent.trim();
      theadDiv.append(cell);
    });
    content.append(theadDiv);
  }

  // Remaining rows — detect the Pricing Details section boundary
  let pricingSection = null;
  let modifyRow = null;

  dataRows.forEach((row) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    const firstText = cols[0]?.textContent.trim() || '';

    // Pricing Details heading row
    if (firstText === 'Pricing Details' || row.querySelector('h3, h4, h5, h6')) {
      pricingSection = document.createElement('div');
      pricingSection.className = 'pack-pricing-details';
      const heading = document.createElement('h4');
      heading.textContent = firstText || row.querySelector('h3, h4, h5, h6')?.textContent.trim();
      pricingSection.append(heading);
      content.append(pricingSection);
      return;
    }

    // Modify My Pack button row
    if (firstText === 'Modify My Pack') {
      modifyRow = document.createElement('div');
      modifyRow.className = 'pack-modify-row';
      const btn = document.createElement('a');
      btn.className = 'btn-primary';
      btn.href = '#';
      btn.textContent = firstText;
      modifyRow.append(btn);
      return;
    }

    // Pricing details sub-rows
    if (pricingSection && !modifyRow) {
      const priceRow = document.createElement('div');
      priceRow.className = 'pack-pricing-row';
      const labelCol = cols[0];
      const valueCol = cols[1];
      const labels = [...(labelCol?.querySelectorAll('p') || [])];
      const values = [...(valueCol?.querySelectorAll('p') || [])];
      labels.forEach((lp, i) => {
        const item = document.createElement('div');
        item.className = 'pack-pricing-item';
        const label = document.createElement('span');
        label.className = 'pack-pricing-label';
        label.textContent = lp.textContent.trim();
        const value = document.createElement('span');
        value.className = 'pack-pricing-value';
        value.textContent = values[i]?.textContent.trim() || '';
        item.append(label, value);
        pricingSection.append(item);
      });
      return;
    }

    // Regular data rows (pack rows & summary rows)
    if (cols.length >= 2) {
      const leftCols = [...(cols[0]?.querySelectorAll('p') || [])];
      const rightCols = [...(cols[1]?.querySelectorAll('p') || [])];

      if (leftCols.length > 1) {
        // Summary row (Total Channels / Channels Cost)
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'pack-summary';
        leftCols.forEach((lp, i) => {
          const item = document.createElement('div');
          item.className = 'pack-summary-item';
          const label = document.createElement('span');
          label.className = 'pack-summary-label';
          label.textContent = lp.textContent.trim();
          const value = document.createElement('span');
          value.className = 'pack-summary-value';
          value.textContent = rightCols[i]?.textContent.trim() || '';
          item.append(label, value);
          summaryDiv.append(item);
        });
        content.append(summaryDiv);
      } else {
        // Single pack row
        const packRow = document.createElement('div');
        packRow.className = 'pack-row';
        const nameSpan = document.createElement('span');
        nameSpan.className = 'pack-name';
        nameSpan.textContent = leftCols[0]?.textContent.trim() || '';
        const priceSpan = document.createElement('span');
        priceSpan.className = 'pack-price';
        priceSpan.textContent = rightCols[0]?.textContent.trim() || '';
        const chevron = document.createElement('span');
        chevron.className = 'pack-row-chevron';
        chevron.innerHTML = CHEVRON_DOWN;
        packRow.append(nameSpan, priceSpan, chevron);
        content.append(packRow);
      }
    }
  });

  if (modifyRow) content.append(modifyRow);

  block.innerHTML = '';
  block.append(header, content);

  // Toggle
  const toggle = () => {
    const open = block.classList.toggle('open');
    content.hidden = !open;
    header.setAttribute('aria-expanded', String(open));
    header.querySelector('.accordion-chevron').innerHTML = open ? CHEVRON_UP : CHEVRON_DOWN;
  };
  header.addEventListener('click', toggle);
  header.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
}
