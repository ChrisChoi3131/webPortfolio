'use strict'

let lastScrollY = 0;
const navbar = document.querySelector('#navbar');
const navbarLogo = document.querySelector('.navbar__logo');
const navbarMenu = document.querySelector('.navbar__menu');
const heightNavbar = navbar.getBoundingClientRect().height;
const sections = document.querySelectorAll('section');
const footerRight = document.querySelector('#footerRight');
let textFooterRight = "Home";
footerRight.innerHTML = textFooterRight
document.addEventListener('scroll', (e) => {
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

navbarLogo.addEventListener('click', ()=>{
  const element = document.getElementById("home");
  element.scrollIntoView({ behavior: "smooth", block: "start" });
})
navbarMenu.addEventListener('click', (e) => {
  let target = e.target;
  target.tagName !== 'LI' ? target = target.parentElement : null;
  if (!target.dataset.link) return;
  const element = document.getElementById(target.dataset.link);
  element.scrollIntoView({ behavior: "smooth", block: "start" });
})


const callbackObserver = (entries) => {
  entries.forEach(entry => {
    const text = entry.target.id.split('');
    text[0] = text[0].toUpperCase()
    if(entry.isIntersecting){
      footerRight.innerHTML = text.join('');
    }
  })
}
const optionsObserver = {
  threshold: 0.6
}
const observer = new IntersectionObserver(callbackObserver, optionsObserver);
sections.forEach(section => observer.observe(section));
