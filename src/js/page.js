const hamburgerButton = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav-list__item-link");
const focusableChilds = nav.querySelectorAll(
  'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
);
const firstFocusableChild = focusableChilds[0];
const lastFocusableChild = focusableChilds[focusableChilds.length - 1];
let isTrappedTabulation = false;

const handleNav = () => {
  hamburgerButton.classList.toggle("is-active");
  nav.classList.toggle("nav--active");
  document.body.classList.toggle("block-scroll");
  isTrappedTabulation = !isTrappedTabulation;
  updateNavLinksTabIndex();
};

const onResize = () => {
  updateNavLinksTabIndex();
};

// TRAP TABULATION
const onKeydown = (e) => {
  if (!isTrappedTabulation || e.key !== "Tab" || window.innerWidth > 1024) {
    return;
  }

  if (e.shiftKey && document.activeElement === firstFocusableChild) {
    lastFocusableChild.focus();
    e.preventDefault();
  }

  if (!e.shiftKey && document.activeElement === lastFocusableChild) {
    firstFocusableChild.focus();
    e.preventDefault();
  }
};

const updateNavLinksTabIndex = () => {
  navLinks.forEach((link) => {
    link.tabIndex = isTrappedTabulation || window.innerWidth > 1024 ? 0 : -1;
  });
};

hamburgerButton.addEventListener("click", handleNav);
navLinks.forEach((link) => {
  link.addEventListener("click", handleNav);
});
window.addEventListener("resize", onResize, {
  passive: true,
});
nav.addEventListener("keydown", onKeydown);
