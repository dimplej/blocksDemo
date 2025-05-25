import { createOptimizedPicture } from '../../scripts/aem.js';

import { fetchPlaceholders } from '../../scripts/aem.js';


export default async function decorate(block) {

  const placeholders = await fetchPlaceholders();
  console.log(placeholders);
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';

    });
    if (placeholders.clickHere) {
      const placeholderElement = document.createElement('button');
      placeholderElement.className = 'c';
      placeholderElement.textContent = placeholders.clickHere;
      li.append(placeholderElement);
    }
    ul.append(li);

  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}




