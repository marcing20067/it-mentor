const hamburgerButton = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav-list__item-link");
const faqIconLines = document.querySelectorAll(
  ".faq-item__box-button-line--vertical"
);
const faqBoxes = document.querySelectorAll(".faq-item__box");
const faqTexts = document.querySelectorAll(".faq-item__text");
const faqContainers = document.querySelectorAll(".faq-item__container");
const inputs = document.querySelectorAll(".contact-form__field-input");
const form = document.querySelector("form");

const getFocusableChilds = (box) => {
  return box.querySelectorAll(
    'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
  );
};

const navFocusableChilds = getFocusableChilds(nav);
const navFirstFocusableChild = navFocusableChilds[0];
const navLastFocusableChild = navFocusableChilds[navFocusableChilds.length - 1];
let isTrappedTabulation = false;

// NAV
const handleNav = () => {
  hamburgerButton.classList.toggle("is-active");
  nav.classList.toggle("nav--active");
  nav.classList.toggle("nav--scroll-bgc", nav.classList.contains("nav--active") || window.scrollY > 0)
  document.body.classList.toggle("block-scroll");
  isTrappedTabulation = !isTrappedTabulation;
  updateNavLinksTabIndex();
};

const updateNavLinksTabIndex = () => {
  navLinks.forEach((link) => {
    link.tabIndex = isTrappedTabulation || window.innerWidth > 1024 ? 0 : -1;
  });
};

// FAQ
const handleFaq = (faqContainer, i, containerFocusableChilds) => {
  const faqItem = faqContainer.closest(".faq-item");

  faqIconLines[i].classList.toggle("faq-item__box-button-line--hide");
  faqItem.classList.toggle("faq-item--checked");

  const isActive = faqContainer.offsetHeight > 0;
  const textHeight = faqTexts[i].offsetHeight + "px";
  faqContainer.style["max-height"] = isActive ? "0px" : textHeight;
  toggleElementsTabIndex(containerFocusableChilds);
};

const updateFaqContainersHeight = () => {
  faqContainers.forEach((container, i) => {
    if (container.offsetHeight > 0) {
      container.style["max-height"] = faqTexts[i].offsetHeight + "px";
    }
  });
};

const toggleElementsTabIndex = (els) => {
  els.forEach((el) => {
    el.tabIndex = el.tabIndex === 0 ? -1 : 0;
  });
};

// OTHERS 

const handleInput = (e) => {
  const input = e.target;
  input.classList.toggle(
    "contact-form__field-input--not-empty",
    input.value.length > 0
  );
};
const toggleNavBackground = () => {
  nav.classList.toggle("nav--scroll-bgc", nav.classList.contains("nav--active") || window.scrollY > 0)
  nav.classList.toggle(
    "nav--scroll-border",
    window.scrollY > window.innerHeight
  );
};

const onResize = () => {
  updateNavLinksTabIndex();
  updateFaqContainersHeight();
};

// FORM REQUEST
const URL =
  "https://script.google.com/macros/s/AKfycbzJVlImiWTyC9aM7qWIbIa89svh76BXLKvf0yoSbcjiDbO2hTk70-H8pBkiEMl8-P8gJg/exec";

const success = document.querySelector(".contact-form__message--success");
const failed = document.querySelector(".contact-form__message--failed");
const onSubmit = async (e) => {
  e.preventDefault();
  success.style.display = "none";
  success.style.display = "none";
  try {
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    const res = await saveMessage(formObject);
    if (res.status === 200) {
      success.style.display = "block";
      form.reset();
    } else {
      failed.style.display = "block";
    }
  } catch (err) {
    failed.style.display = "block";
  }
};

const saveMessage = (data) => {
  return fetch(URL, {
    redirect: "follow",
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data),
  });
};

// TRAP TABULATION
const onKeydown = (e) => {
  if (!isTrappedTabulation || e.key !== "Tab" || window.innerWidth > 1024) {
    return;
  }

  if (e.shiftKey && document.activeElement === navFirstFocusableChild) {
    navLastFocusableChild.focus();
    e.preventDefault();
  }

  if (!e.shiftKey && document.activeElement === navLastFocusableChild) {
    navFirstFocusableChild.focus();
    e.preventDefault();
  }
};

// LISTENERS 
hamburgerButton.addEventListener("click", handleNav);
navLinks.forEach((link) => {
  link.addEventListener("click", handleNav);
});
faqBoxes.forEach((box, i) => {
  const container = faqContainers[i];
  const focusableChilds = getFocusableChilds(container);
  toggleElementsTabIndex(focusableChilds);
  box.addEventListener("click", () => handleFaq(container, i, focusableChilds));
});
inputs.forEach((input) => {
  input.addEventListener("blur", handleInput);
});
document.addEventListener("scroll", toggleNavBackground);
form.addEventListener("submit", onSubmit);
window.addEventListener("resize", onResize, {
  passive: true,
});
nav.addEventListener("keydown", onKeydown);
toggleNavBackground();
updateNavLinksTabIndex();
