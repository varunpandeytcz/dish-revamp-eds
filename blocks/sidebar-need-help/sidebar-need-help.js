/**
 * loads and decorates the sidebar-need-help block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  // Row 0 = heading "Need help with something?"
  const headingRow = rows[0];
  const headingText = headingRow.querySelector('p')?.textContent.trim() || 'Need help with something?';
  headingRow.classList.add('need-help-heading-row');
  headingRow.querySelector(':scope > div').innerHTML = `<h3 class="need-help-heading">${headingText}</h3>`;

  // Remaining rows = help items (icon + label)
  const itemRows = rows.slice(1);
  itemRows.forEach((row) => {
    row.classList.add('need-help-item');
    const col = row.querySelector(':scope > div');
    if (!col) return;
    const img = col.querySelector('picture, img');
    const labelP = [...col.querySelectorAll('p')].find((p) => !p.querySelector('picture') && p.textContent.trim());
    const labelText = labelP?.textContent.trim() || '';

    col.innerHTML = '';
    if (img) {
      const iconWrap = document.createElement('span');
      iconWrap.className = 'need-help-icon';
      iconWrap.append(img.closest ? img.closest('picture') || img : img);
      col.append(iconWrap);
    }
    if (labelText) {
      const label = document.createElement('span');
      label.className = 'need-help-item-label';
      label.textContent = labelText;
      col.append(label);
    }
  });
}
