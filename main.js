'use strict';

let lastScrollY = 0;
let isFixedHeader = false;
const navbar = document.querySelector('#navbar');
const navbarLogo = document.querySelector('.navbar__logo');
const navbarMenu = document.querySelector('.navbar__menu');
const heightNavbar = navbar.getBoundingClientRect().height;
const sections = document.querySelectorAll('section');
const footerRight = document.querySelector('#footerRight');
const footerLeft = document.querySelector('#footerLeft');
const switchFixHeader = document.querySelector('#switchFixHeader');
document.addEventListener('scroll', () => {
  if (isFixedHeader === true) return;
  if (lastScrollY < window.scrollY) {
    if (heightNavbar < window.scrollY) {
      navbar.classList.add('navbar__hide');
      lastScrollY = window.scrollY;
    }
  } else if (lastScrollY > window.scrollY) {
    navbar.classList.remove('navbar__hide');
    lastScrollY = window.scrollY;
  }
});
document.addEventListener('scroll', () => {
  if (window.innerHeight - sections[sections.length - 1].getBoundingClientRect().y > 30) {
    footerRight.style.color = 'white';
    for (const child of footerLeft.children) {
      child.style.color = 'white';
    }
  } else {
    footerRight.style.color = 'var(--color-pink)';
    for (const child of footerLeft.children) {
      child.style.color = 'var(--color-grey)';
    }
  }
});
switchFixHeader.addEventListener('click', e => {
  if (e.target.tagName !== 'INPUT') return;
  if (e.target.checked) isFixedHeader = true;
  else isFixedHeader = false;
});
navbarLogo.addEventListener('click', () => {
  const element = document.getElementById('home');
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
navbarMenu.addEventListener('click', e => {
  let target = e.target;
  target.tagName !== 'LI' ? (target = target.parentElement) : null;
  if (!target.dataset.link) return;
  const element = document.getElementById(target.dataset.link);
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
const sectionsId = Array.from(sections).map(section => section.id);
const navItems = new Map(
  sectionsId.map((sectionId, idx) => [
    sectionId,
    { idx, element: document.querySelector(`[data-link="${sectionId}"]`) },
  ])
);

const callbackObserver = entries => {
  if (entries.length > 1) {
    const currEntries = [];
    entries.forEach(entry => {
      const currentRatio = entry.intersectionRatio;
      const target = entry.target.id;
      if (currentRatio > 0) currEntries.push({ target, currentRatio, idx: navItems.get(target).idx });
    });
    console.log(currEntries);
    currEntries.sort((a, b) => {
      if (b.currentRatio > a.currentRatio) {
        return 1;
      } else if (b.currentRatio < a.currentRatio) {
        return -1;
      } else {
        if (a.idx < b.idx) {
          return -1;
        } else {
          return 1;
        }
      }
    });
    footerRight.innerText = currEntries[0].target;
  } else {
    const entry = entries[0];
    const currentRatio = entry.intersectionRatio;
    const target = entry.target.id;
  }
};
const optionsObserver = {
  threshold: 1,
};
const observer = new IntersectionObserver(callbackObserver, optionsObserver);
sections.forEach(section => observer.observe(section));
