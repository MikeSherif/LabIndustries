const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'vertical',
  // Navigation arrows
  navigation: {
    nextEl: '.button-next',
    prevEl: '.button-prev',
  },
  // slidesPerView: 'auto',  // оставляем размеры из CSS
  // spaceBetween: 10,       // расстояние между карточками
  // centeredSlides: true,  // не центрировать
  watchSlidesProgress: true,
  slidesPerView: 'auto',
  spaceBetween: 10,
  centeredSlides: true,
});
