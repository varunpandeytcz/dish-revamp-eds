export default function decorate(block) {
    [...block.children].forEach((row, r) => {
      row.classList.add("instant-recharge-header-div");
    });
  }