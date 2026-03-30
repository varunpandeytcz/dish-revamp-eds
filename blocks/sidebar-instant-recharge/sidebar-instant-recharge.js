/**
 * loads and decorates the sidebar-instant-recharge block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const col = row.querySelector(':scope > div');
  if (!col) return;

  const paragraphs = [...col.querySelectorAll('p')];
  // p[0] = "Enter recharge amount"
  // p[1] = "₹" + amount (strong = ₹, text = amount)
  // p[2] = "RECHARGE NOW"

  const labelText = paragraphs[0]?.textContent.trim() || 'Enter recharge amount';
  const amountEl = paragraphs[1];
  const symbol = amountEl?.querySelector('strong')?.textContent.trim() || '₹';
  const defaultAmount = amountEl?.childNodes[amountEl.childNodes.length - 1]?.textContent.trim() || '';
  const btnText = paragraphs[2]?.textContent.trim() || 'RECHARGE NOW';

  block.innerHTML = `
    <div class="recharge-inner">
      <p class="recharge-label">${labelText}</p>
      <div class="recharge-input-wrap">
        <span class="recharge-symbol">${symbol}</span>
        <input
          type="number"
          class="recharge-input"
          value="${defaultAmount}"
          min="1"
          aria-label="Recharge amount"
        />
      </div>
      <button class="recharge-btn">${btnText}</button>
    </div>
  `;
}
