(() => {
  'use strict';
  const navbar = document.querySelector('#navbar');
  const navbarLogo = document.querySelector('.navbar__logo');
  const navbarMenu = document.querySelector('.navbar__menu');
  const heightNavbar = navbar.getBoundingClientRect().height;
  const sections = document.querySelectorAll('section');
  const footerRight = document.querySelector('#footerRight');
  const footerLeft = document.querySelector('#footerLeft');
  const switchFixHeader = document.querySelector('#switchFixHeader');
  const btnHamburger = document.querySelector('.navbar__btnHamburger');
  const hamburgerMenuContainer = document.querySelector('.navbar__hamburgerMenuContainer');
  const navbarHamburgerMenu = document.querySelector('.navbar__hamburgerMenu');
  const hamburgerMenuBlur = document.querySelector('.navbar__hamburgerMenuBlur');
  const btnCloseHamburgerMenu = document.querySelector('.hamburgerMenu__btnClose');
  const cardItems = document.querySelectorAll('.card__item');
  let lastScrollY = 0;
  let isFixedHeader = true;
  function openHamburgerMenu() {
    document.querySelector('.navbar__btnHamburgerContents').classList.remove('active');
    hamburgerMenuContainer.classList.add('active');
    hamburgerMenuBlur.classList.add('active');
    document.body.classList.add('blur');
    for (const child of btnCloseHamburgerMenu.children) {
      child.classList.add('active');
    }
  }
  function closeHamburgerMenu() {
    document.querySelector('.navbar__btnHamburgerContents').classList.add('active');
    hamburgerMenuContainer.classList.remove('active');
    hamburgerMenuBlur.classList.remove('active');
    document.body.classList.remove('blur');
    for (const child of btnCloseHamburgerMenu.children) {
      child.classList.remove('active');
    }
  }
  window.addEventListener('load', () => {
    document.body.classList.remove('before-load');
    initializeScrollPopUpElement();
    setTimeout(() => {
      document.querySelector('.loading').addEventListener('transitionend', e => {
        e.currentTarget.style.display = 'none';
      });
    }, 300);
  });
  window.addEventListener('resize', () => {
    initializeScrollPopUpElement();
  });
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
    const top = element.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  });
  navbarMenu.addEventListener('click', e => {
    let target = e.target;
    target.tagName !== 'LI' ? (target = target.parentElement) : null;
    if (!target.dataset.link) return;
    const element = document.getElementById(target.dataset.link);
    const top = element.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  });
  navbarHamburgerMenu.addEventListener('click', e => {
    let target = e.target;
    target.tagName !== 'LI' ? (target = target.parentElement) : null;
    if (!target.dataset.link) return;
    const element = document.getElementById(target.dataset.link);
    const top = element.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 100;
    window.scrollTo({ top, behavior: 'smooth' });
    closeHamburgerMenu();
  });
  const sectionsId = Array.from(sections).map(section => section.id);
  const navItems = new Map(
    sectionsId.map((sectionId, idx) => [
      sectionId,
      { idx, element: document.querySelector(`[data-link="${sectionId}"]`) },
    ])
  );
  btnHamburger.addEventListener('click', () => openHamburgerMenu());
  hamburgerMenuBlur.addEventListener('click', () => closeHamburgerMenu());
  btnCloseHamburgerMenu.addEventListener('click', () => closeHamburgerMenu());

  {
    const mapEntries = new Map();
    const callbackObserver = entries => {
      if (entries.length > 1) {
        const currEntries = [];
        entries.forEach(entry => {
          const currentRatio = entry.intersectionRatio;
          const target = entry.target.id;
          if (currentRatio > 0) {
            currEntries.push({ target, currentRatio, idx: navItems.get(target).idx });
            mapEntries.set(target, navItems.get(target).idx);
          } else {
            mapEntries.delete(target);
          }
        });
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
        const isIntersecting = entry.isIntersecting;
        const boundingClientRect = entry.boundingClientRect;
        const target = entry.target.id;
        const idx = sectionsId.indexOf(target);
        if (isIntersecting) {
          mapEntries.set(target, idx);
          const [sectionName, sectionIdx] = [...mapEntries].sort((a, b) => {
            return b[1] - a[1];
          })[0];

          footerRight.innerText = sectionName;
        } else if (!isIntersecting) {
          mapEntries.delete(target);
          if (boundingClientRect.y > 0) {
            const sectionName = idx !== 0 ? sectionsId[idx - 1] : sectionsId[idx];
            footerRight.innerText = sectionName;
          }
        }
      }
    };
    const footerObserverOptions = {
      threshold: 0.2,
    };
    const footerObserver = new IntersectionObserver(callbackObserver, footerObserverOptions);
    sections.forEach(section => footerObserver.observe(section));
  }
  function initializeScrollPopUpElement() {
    const callbackObserver = entries => {
      entries.forEach(entry => {
        const top = entry.boundingClientRect.top;
        const element = entry.target;
        console.log(element.id);
        if (top <= 0 || entry.isIntersecting) {
          element.classList.add('active');
        } else {
          element.classList.remove('active');
        }
      });
    };
    cardItems.forEach(cardItem => {
      const ratioElementHeight = cardItem.offsetHeight / window.innerHeight;
      let threshold = 0.9;
      if (ratioElementHeight >= 0.9) {
        threshold = 0.3;
      } else if (ratioElementHeight >= 0.5) {
        threshold = 0.5;
      }
      const cardItemObserver = new IntersectionObserver(callbackObserver, {
        threshold,
      });
      cardItemObserver.observe(cardItem);
    });
  }
})();
