const CHEVRON_UP = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
const CHEVRON_DOWN = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
const CALENDAR_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const DOWNLOAD_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
const EMAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;

/**
 * loads and decorates the accordion-my-invoices block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const titleText = rows[0].querySelector('p')?.textContent.trim() || 'My Invoices';

  const header = document.createElement('div');
  header.className = 'accordion-header';
  header.setAttribute('role', 'button');
  header.setAttribute('aria-expanded', 'false');
  header.tabIndex = 0;
  header.innerHTML = `
    <span class="accordion-title">${titleText}</span>
    <span class="accordion-chevron" aria-hidden="true">${CHEVRON_DOWN}</span>
  `;

  const content = document.createElement('div');
  content.className = 'accordion-content';
  content.hidden = true;

  if (rows[1]) {
    const cols = [...rows[1].querySelectorAll(':scope > div')];
    const contentInner = document.createElement('div');
    contentInner.className = 'invoices-content';

    const dateRange = document.createElement('div');
    dateRange.className = 'invoices-date-range';
    dateRange.innerHTML = `
      <input type="date" class="invoices-date-input" aria-label="From date" placeholder="From">
      <span class="invoices-date-separator">-</span>
      <input type="date" class="invoices-date-input" aria-label="To date" placeholder="To">
      <span class="invoices-calendar-icon" aria-hidden="true">${CALENDAR_ICON}</span>
    `;

    const actions = document.createElement('div');
    actions.className = 'invoices-actions';

    const buttonLabels = cols[1] ? [...cols[1].querySelectorAll('p')].map((p) => p.textContent.trim()) : ['View Statement', 'Download', 'Email'];
    buttonLabels.forEach((label, i) => {
      const btn = document.createElement('button');
      btn.className = i === 0 ? 'btn-primary' : 'btn-outline';
      if (label.toLowerCase().includes('download')) {
        btn.innerHTML = `${label} ${DOWNLOAD_ICON}`;
      } else if (label.toLowerCase().includes('email')) {
        btn.innerHTML = `${label} ${EMAIL_ICON}`;
      } else {
        btn.textContent = label;
      }
      actions.append(btn);
    });

    contentInner.append(dateRange, actions);
    content.append(contentInner);
  }

  block.innerHTML = '';
  block.append(header, content);

  const toggle = () => {
    const open = block.classList.toggle('open');
    content.hidden = !open;
    header.setAttribute('aria-expanded', String(open));
    header.querySelector('.accordion-chevron').innerHTML = open ? CHEVRON_UP : CHEVRON_DOWN;
  };
  header.addEventListener('click', toggle);
  header.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
}
