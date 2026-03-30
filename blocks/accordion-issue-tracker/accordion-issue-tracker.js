const CHEVRON_UP = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
const CHEVRON_DOWN = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
const SEARCH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
const EMPTY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e84c1e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><circle cx="17" cy="19" r="3"/><line x1="19.5" y1="21.5" x2="21" y2="23"/></svg>`;

/**
 * loads and decorates the accordion-issue-tracker block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const titleText = rows[0].querySelector('p')?.textContent.trim() || 'Issue Tracker';

  // Header
  const header = document.createElement('div');
  header.className = 'accordion-header';
  header.setAttribute('role', 'button');
  header.setAttribute('aria-expanded', 'false');
  header.tabIndex = 0;
  header.innerHTML = `
    <span class="accordion-title">${titleText}</span>
    <span class="accordion-chevron" aria-hidden="true">${CHEVRON_DOWN}</span>
  `;

  // Content
  const content = document.createElement('div');
  content.className = 'accordion-content';
  content.hidden = true;

  if (rows[1]) {
    const cols = [...rows[1].querySelectorAll(':scope > div')];
    // Col 0: Search label → search input
    // Col 1: Raise an issue → button

    const toolbar = document.createElement('div');
    toolbar.className = 'issue-toolbar';

    const searchWrap = document.createElement('div');
    searchWrap.className = 'issue-search';
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'issue-search-input';
    searchInput.placeholder = cols[0]?.querySelector('p')?.textContent.trim() || 'Search';
    searchInput.setAttribute('aria-label', 'Search issues');
    const searchIcon = document.createElement('span');
    searchIcon.className = 'issue-search-icon';
    searchIcon.innerHTML = SEARCH_ICON;
    searchWrap.append(searchInput, searchIcon);

    const raiseBtn = document.createElement('button');
    raiseBtn.className = 'btn-primary';
    raiseBtn.textContent = cols[1]?.querySelector('p')?.textContent.trim() || 'Raise an Issue';

    toolbar.append(searchWrap, raiseBtn);

    // Issues table
    const table = document.createElement('div');
    table.className = 'issue-table';

    const tableHeader = document.createElement('div');
    tableHeader.className = 'issue-table-header';
    tableHeader.innerHTML = `
      <span class="issue-col-issues">ISSUES</span>
      <span class="issue-col-status">
        STATUS
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </span>
    `;

    const emptyState = document.createElement('div');
    emptyState.className = 'issue-empty';
    emptyState.innerHTML = `
      ${EMPTY_ICON}
      <p class="issue-empty-title">No Results Found</p>
      <p class="issue-empty-sub">No issues found.</p>
    `;

    table.append(tableHeader, emptyState);
    content.append(toolbar, table);
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
