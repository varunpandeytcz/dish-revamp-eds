/**
 * loads and decorates the account-summary block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;
  row.classList.add('account-summary-row');

  const cols = [...row.querySelectorAll(':scope > div')];

  // Col 0: greeting + VC number
  const userCol = cols[0];
  if (userCol) {
    userCol.classList.add('account-summary-user');
    const paragraphs = userCol.querySelectorAll('p');
    if (paragraphs[0]) paragraphs[0].classList.add('account-summary-greeting');
    if (paragraphs[1]) {
      paragraphs[1].classList.add('account-summary-vc');
      const vcText = paragraphs[1].textContent.trim();
      paragraphs[1].innerHTML = `
        <span class="account-summary-vc-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </span>
        <span class="account-summary-vc-text">${vcText}</span>
        <span class="account-summary-vc-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      `;
    }
    // Divider after user col
    const divider = document.createElement('div');
    divider.className = 'account-summary-divider';
    userCol.after(divider);
  }

  // Cols 1–3: stats (label + value)
  const statIndices = [1, 2, 3];
  statIndices.forEach((i) => {
    const col = cols[i];
    if (!col) return;
    col.classList.add('account-summary-stat');
    const [labelP, valueP] = col.querySelectorAll('p');
    if (labelP) {
      labelP.classList.add('account-summary-label');
      // Add info icon only to monthly recharge (index 1)
      if (i === 1) {
        const info = document.createElement('span');
        info.className = 'account-summary-info';
        info.setAttribute('aria-label', 'More information');
        info.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        `;
        labelP.appendChild(info);
      }
    }
    if (valueP) valueP.classList.add('account-summary-value');
  });

  // Col 4: VIEW PROFILE button
  const profileCol = cols[4];
  if (profileCol) {
    profileCol.classList.add('account-summary-profile');
    const p = profileCol.querySelector('p');
    if (p) {
      const btn = document.createElement('a');
      btn.href = '/my-account/profile';
      btn.className = 'account-summary-btn';
      btn.textContent = p.textContent.trim();
      p.replaceWith(btn);
    }
  }
}
