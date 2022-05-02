'use strict'

let lastScrollY = 0;
const navbar = document.querySelector('#navbar')
const heightNavbar = navbar.getBoundingClientRect().height;
document.addEventListener('scroll',()=> {
    if(lastScrollY < window.scrollY){
      if(heightNavbar < window.scrollY){
        
        navbar.classList.add('navbar__hide');
        lastScrollY = window.scrollY;
      }
    }else if(lastScrollY > window.scrollY){
      navbar.classList.remove('navbar__hide');
      
      lastScrollY = window.scrollY;
    }
});