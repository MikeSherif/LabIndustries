document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".info");
  const cards = document.querySelectorAll(".list__item");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach(card => card.classList.add("animate"));
        obs.unobserve(entry.target); // запускаем один раз
      }
    });
  }, {
    threshold: 0.3 // секция видна хотя бы на 30%
  });

  if (section) {
    observer.observe(section);
  }
});
