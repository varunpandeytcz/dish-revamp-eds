export default function decorate(block) {
    // 1. Convert table rows → object
    const data = {};
  
    [...block.children].forEach((row) => {
      const cols = [...row.children];
      if (cols.length < 2) return;
  
      const key = cols[0].textContent.trim().toLowerCase().replace(/\s+/g, '-');
      const value = cols[1].textContent.trim();
  
      data[key] = value;
    });
  
    // 2. Prepare values
    const vcList = data['vc-list']
      ? data['vc-list'].split(',').map((v) => v.trim())
      : [];
  
    // 3. Build HTML
    block.innerHTML = `
      <div class="recharge-container">
  
        <!-- User Info -->
        <div class="custom-select-mobile">
          <div class="userDetailsContainer">
            <div class="userNameIR-container">
              <h4 class="userNameIR-label">${data['user-name-label'] || ''}</h4>
              <div class="userNameIR">${data['user-name'] || ''}</div> 
            </div>
            <div class="userRMNir-container">
              <h4 class="userRMNir-label">${data['mobile-label'] || ''}</h4>
              <div class="userRMNir">${data['mobile-number'] || ''}</div>
            </div>
            ${
              data.status
                ? `<span class="active">${data.status}</span>`
                : ''
            }
          </div>
  
          <!-- VC Dropdown -->
          <div class="custom-select-mobile-container hide-icon">
            <select class="select-mobile" id="populate-vc-list-here">
              ${vcList
                .map(
                  (vc, i) =>
                    `<option value="${vc}" ${i === 0 ? 'selected' : ''}>
                      VC No. ${vc}
                    </option>`
                )
                .join('')}
            </select>
          </div>
        </div>
  
        <!-- Details Section -->
        <div class="details-card-mobile">
          <div class="details-row-mobile">
  
            <!-- Switch Off -->
            <div class="each-details-mobile">
              <div class="recharge-component recharge-component-first">
                <h4>${data['switch-label'] || ''}</h4>
                <p class="switchOffDate">${data['switch-date'] || ''}</p>
              </div>
            </div>
  
            <!-- Balance -->
            <div class="moredetails">
              <div class="each-details-mobile">
                <div class="recharge-component recharge-component-middle">
                  <h4>${data['balance-label'] || ''}</h4>
                  <p>₹ <span id="accountBalance">${data['balance'] || ''}</span></p>
                </div>
              </div>
            </div>
  
            <!-- Monthly Recharge -->
            <div class="moredetails">
              <div class="each-details-mobile">
                <div class="recharge-component recharge-component-last">
                  <h4>${data['recharge-label'] || ''}</h4>
                  <p>₹<span class="full-month-recharge-value">${data['recharge-value'] || ''}</span></p>
                </div>
  
                <div class="monthly-recharge-container">
                  <img 
                    class="amount-image" 
                    src="/content/dam/dishtv-aem-web-platform/quick-recharge-assets/Frame (3).png" 
                    alt="Information"
                  />
                  <div class="monthly-recharge-text" style="display:none;">
                    ${data['info-text'] || ''}
                    ${
                      data['info-link']
                        ? `<a class="link" href="${data['info-link']}"> My Account</a>`
                        : ''
                    }
                  </div>
                </div>
  
              </div>
            </div>
  
          </div>
        </div>
  
      </div>
    `;
}