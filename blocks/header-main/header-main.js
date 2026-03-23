export default function decorate(block) {
    [...block.children].forEach((row, r) => {
      row.classList.add("header-main-div");
      [...row.children].forEach((div, d) => {
        if (d === 0) {
          div.classList.add("header-main-logo");
        }
        else if (d === 1) {
          div.classList.add("header-main-nav");
          const ulTag = div.querySelector('ul');
          ulTag.classList.add("header-main-nav-list");
          [...ulTag.children].forEach((li) => {
            li.classList.add("header-main-nav-item");
          });
        }
        else if (d === 2) {
          div.classList.add("header-main-feat");
          const pTags = div.querySelectorAll('p');
          pTags.forEach((p, i) => {
            p.classList.add(`header-main-feat-item-${i}`);
          });
        }
      });
    });
  }