/**
 * INSTANT RECHARGE BLOCK — DishTV EDS
 *
 * Single block, DA table structure:
 * ┌────────────────────────────────┬──────────────┐
 * │  instant-recharge              │              │
 * ├────────────────────────────────┼──────────────┤
 * │  account                       │              │  ← section marker
 * ├────────────────────────────────┼──────────────┤
 * │  Welcome                       │  M*****i Z** │
 * │  Mobile Number                 │  ·····320    │
 * │  Status                        │  ACTIVE      │
 * │  Switch-off date               │  9 Apr 2026  │
 * │  Current Balance               │  ₹ 122       │
 * │  Full Month Recharge           │  ₹245        │
 * │  VC Number                     │  025362...   │
 * ├────────────────────────────────┼──────────────┤
 * │  plans                         │              │  ← section marker
 * ├────────────────────────────────┼──────────────┤
 * │  Recharge amount               │  245         │
 * │  Keep set-top box...           │  PROCEED     │
 * │  Plan title 1                  │  ₹ 666       │
 * │  Plan title 2                  │  ₹ 735       │
 * │  Plan title 3                  │  ₹ 1,290     │
 * ├────────────────────────────────┼──────────────┤
 * │  cashback                      │              │  ← section marker
 * ├────────────────────────────────┼──────────────┤
 * │  Cashback Offers               │              │
 * │  BHIM                          │  Pay Using...|
 * │  Paytm                         │  Assured...  │
 * │  ...                           │  ...         │
 * └────────────────────────────────┴──────────────┘
 *
 * Static now → API integration to be added later per section.
 */

const BRAND_COLORS = {
  bhim: '#00008B', paytm: '#002970', mobikwik: '#4F2D8A',
  phonepe: '#5F259F', rupay: '#E8490F',
};

const PLAN_DESCS = [
  'Recharge DishTV NOW with FLAT Rs666 & enjoy Cricket, Entertainment, and more.',
  'Recharge for 3 months & watch latest shows & movies uninterrupted.',
  'Get 6 months of uninterrupted DishTV service at one flat price.',
];

/* ── Helpers ──────────────────────────────────────────────── */
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

/** Escape DA-authored text before inserting into innerHTML — prevents XSS */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Detect which section this block instance renders ─────── */
function detectSection(block) {
  const rows = [...block.children];
  const first = rows[0]?.children[0]?.textContent?.trim().toLowerCase() || '';
  /* explicit marker row (optional, for future use) */
  if (first === 'account') return 'account';
  if (first === 'plans')   return 'plans';
  if (first === 'cashback') return 'cashback';
  /* auto-detect by content pattern */
  if (first === 'welcome' || first === 'mobile number') return 'account';
  if (first === 'recharge amount')  return 'plans';
  if (first === 'cashback offers')  return 'cashback';
  return 'all';
}

/* ── Parse account rows ───────────────────────────────────── */
function parseAccount(rows) {
  const d = {
    name: 'M*******i Z***o', mobile: '·······320', status: 'ACTIVE',
    switchOffDate: '9 Apr 2026', balance: '₹ 122',
    fullMonthRecharge: '₹245', vcNumber: '02536221882',
  };
  rows.forEach((row) => {
    const cells = [...row.children];
    const key = (cells[0]?.textContent?.trim() || '').toLowerCase().replace(/[\s-]/g, '');
    const val = cells[1]?.textContent?.trim() || '';
    if (!val) return;
    if (key === 'welcome')               d.name = val;
    else if (key === 'mobilenumber')     d.mobile = val;
    else if (key === 'status')           d.status = val;
    else if (key === 'switchoffdate')    d.switchOffDate = val;
    else if (key === 'currentbalance')   d.balance = val;
    else if (key === 'fullmonthrecharge') d.fullMonthRecharge = val;
    else if (key === 'vcnumber')         d.vcNumber = val;
  });
  return d;
}

/* ── Parse plans rows ─────────────────────────────────────── */
function parsePlans(rows) {
  const d = {
    bannerLabel: 'Recharge amount', amount: '245',
    note: 'Keep set-top box switched-on while you recharge',
    proceedLabel: 'PROCEED', items: [],
  };
  rows.forEach((row, i) => {
    const cells = [...row.children];
    const c0 = cells[0]?.textContent?.trim() || '';
    const c1 = cells[1]?.textContent?.trim() || '';
    if (i === 0) { d.bannerLabel = c0 || d.bannerLabel; d.amount = c1 || d.amount; }
    else if (i === 1) { d.note = c0 || d.note; d.proceedLabel = c1 || d.proceedLabel; }
    else if (c0) { d.items.push({ title: c0, price: c1, desc: PLAN_DESCS[i - 2] || '' }); }
  });
  return d;
}

/* ── Parse cashback rows ──────────────────────────────────── */
function parseCashback(rows) {
  const d = { heading: 'Cashback Offers', offers: [] };
  rows.forEach((row, i) => {
    const cells = [...row.children];
    const c0 = cells[0]?.textContent?.trim() || '';
    const c1 = cells[1]?.textContent?.trim() || '';
    if (i === 0) { d.heading = c0 || d.heading; return; }
    if (!c0) return;
    const color = BRAND_COLORS[c0.toLowerCase().replace(/\s/g, '')] || '#333';
    d.offers.push({ brand: c0, text: c1, color });
  });
  return d;
}

/* ── parseDA: dispatches to section parsers ───────────────── */
function parseDA(block) {
  const rows = [...block.children];
  const section = detectSection(block);
  /* skip explicit marker row if present */
  const dataRows = ['account', 'plans', 'cashback'].includes(
    rows[0]?.children[0]?.textContent?.trim().toLowerCase(),
  ) ? rows.slice(1) : rows;

  return {
    account:  section === 'account'  ? parseAccount(dataRows)  : {},
    plans:    section === 'plans'    ? parsePlans(dataRows)    : { items: [] },
    cashback: section === 'cashback' ? parseCashback(dataRows) : { offers: [] },
    _section: section,
  };
}

/* ── Build: User Info Bar ────────────────────────────────── */
function buildUserBar(account) {
  const bar = el('div', 'ir-user-bar');
  const left = el('div', 'ir-user-bar__left');
  left.innerHTML = `
    <p class="ir-user-bar__welcome">Welcome: <span>${esc(account.name)}</span></p>
    <p class="ir-user-bar__mobile">Mobile Number: ${esc(account.mobile)}</p>
    <span class="ir-user-bar__badge">${esc(account.status)}</span>
    <div class="ir-user-bar__meta">
      <div class="ir-user-bar__meta-item">
        <span class="ir-user-bar__meta-label">Switch-off date</span>
        <span class="ir-user-bar__meta-value">${esc(account.switchOffDate)}</span>
      </div>
      <div class="ir-user-bar__meta-item">
        <span class="ir-user-bar__meta-label">Current Balance</span>
        <span class="ir-user-bar__meta-value">${esc(account.balance)}</span>
      </div>
      <div class="ir-user-bar__meta-item">
        <span class="ir-user-bar__meta-label">
          Full Month Recharge
          <span class="ir-info-icon" title="Monthly recharge amount">i</span>
        </span>
        <span class="ir-user-bar__meta-value">${esc(account.fullMonthRecharge)}</span>
      </div>
    </div>
  `;
  const vcBtn = el('button', 'ir-user-bar__vc-btn', `VC No. ${esc(account.vcNumber)}`);
  bar.append(left, vcBtn);
  return bar;
}

/* ── Build: Recharge Banner + Plan Slider ────────────────── */
function buildBanner(plans) {
  const wrap = el('div', 'ir-banner-wrap');

  const left = el('div', 'ir-banner__amount');
  left.innerHTML = `
    <div>
      <p class="ir-banner__amount-label">${esc(plans.bannerLabel)}</p>
      <div class="ir-banner__amount-value">
        &#8377; ${esc(plans.amount)}
        <span class="ir-info-icon" style="border-color:rgba(255,255,255,.55);color:rgba(255,255,255,.7);width:18px;height:18px;font-size:10px;" title="Amount info">i</span>
      </div>
    </div>
    <hr class="ir-banner__divider" />
    <button class="ir-banner__proceed-btn">${esc(plans.proceedLabel)}</button>
    <p class="ir-banner__note">${esc(plans.note)}</p>
  `;

  const slider = el('div', 'ir-plan-slider');
  const arrowL = el('button', 'ir-plan-slider__arrow ir-plan-slider__arrow--left', '&#8249;');
  const arrowR = el('button', 'ir-plan-slider__arrow ir-plan-slider__arrow--right', '&#8250;');

  plans.items.forEach((plan, i) => {
    const card = el('div', `ir-plan-card${i === 1 ? ' ir-plan-card--accent' : ''}`);
    card.innerHTML = `
      <button class="ir-plan-card__info-btn" title="Plan info">i</button>
      <div>
        <p class="ir-plan-card__title">${esc(plan.title)}</p>
        ${plan.desc ? `<p class="ir-plan-card__desc">${esc(plan.desc)} <a class="ir-plan-card__view-more" href="#">View More</a></p>` : ''}
      </div>
      <div class="ir-plan-card__footer">
        <span class="ir-plan-card__price">${esc(plan.price)}</span>
        <button class="ir-plan-card__select-btn">Select</button>
      </div>
    `;
    slider.append(card);
  });

  slider.prepend(arrowL);
  slider.append(arrowR);

  let idx = 0;
  const cardW = () => (slider.querySelector('.ir-plan-card')?.offsetWidth || 280) + 16;
  arrowL.addEventListener('click', () => { idx = Math.max(0, idx - 1); slider.scrollLeft = idx * cardW(); });
  arrowR.addEventListener('click', () => { idx = Math.min(plans.items.length - 2, idx + 1); slider.scrollLeft = idx * cardW(); });
  slider.style.scrollBehavior = 'smooth';

  wrap.append(left, slider);
  return wrap;
}

/* ── Build: Cashback Carousel ────────────────────────────── */
function buildCashback(cashback) {
  const section = el('div', 'ir-cashback');
  section.innerHTML = `<h2 class="ir-cashback__heading">${esc(cashback.heading)}</h2>`;

  const trackWrap = el('div', 'ir-cashback__track-wrap');
  const track = el('div', 'ir-cashback__track');

  cashback.offers.forEach((offer) => {
    const card = el('div', 'ir-cb-card');
    card.innerHTML = `
      <div class="ir-cb-card__logo-text" style="color:${esc(offer.color)};">${esc(offer.brand)}</div>
      <p class="ir-cb-card__text">${esc(offer.text)}</p>
      <a class="ir-cb-card__tc" href="#">T&amp;C Apply</a>
    `;
    track.append(card);
  });

  trackWrap.append(track);

  if (cashback.offers.length < 2) { section.append(trackWrap); return section; }

  let page = 0;
  const visibleCount = () => Math.max(1, Math.floor(trackWrap.offsetWidth / 256));
  const totalPages = () => Math.ceil(cashback.offers.length / visibleCount());

  const dots = el('div', 'ir-cashback__dots');
  const prevBtn = el('button', 'ir-cashback__nav-btn', '&#8592;');
  const nextBtn = el('button', 'ir-cashback__nav-btn ir-cashback__nav-btn--active', '&#8594;');

  function renderDots() {
    dots.innerHTML = '';
    for (let i = 0; i < totalPages(); i += 1) {
      const d = el('button', `ir-cashback__dot${i === page ? ' ir-cashback__dot--active' : ''}`);
      d.addEventListener('click', () => goTo(i));
      dots.append(d);
    }
  }

  function goTo(p) {
    page = Math.max(0, Math.min(p, totalPages() - 1));
    const cw = (track.querySelector('.ir-cb-card')?.offsetWidth || 220) + 16;
    track.style.transform = `translateX(-${page * visibleCount() * cw}px)`;
    renderDots();
  }

  prevBtn.addEventListener('click', () => goTo(page - 1));
  nextBtn.addEventListener('click', () => goTo(page + 1));
  renderDots();

  const nav = el('div', 'ir-cashback__nav');
  nav.append(prevBtn, dots, nextBtn);
  section.append(trackWrap, nav);
  return section;
}

/* ── Main decorate ───────────────────────────────────────── */
export default function decorate(block) {
  const { account, plans, cashback, _section } = parseDA(block);
  block.textContent = '';

  if (_section === 'account') {
    block.append(buildUserBar(account));
  } else if (_section === 'plans') {
    block.append(
      buildBanner(plans),
      el('p', 'ir-banner-footnote', '*1 month is equal to 30 days'),
    );
  } else if (_section === 'cashback') {
    block.append(buildCashback(cashback));
  } else {
    /* 'all' fallback — single table with all sections */
    block.append(
      buildUserBar(account),
      buildBanner(plans),
      el('p', 'ir-banner-footnote', '*1 month is equal to 30 days'),
      buildCashback(cashback),
    );
  }
}
