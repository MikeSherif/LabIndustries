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

const likes = document.querySelectorAll('.like');
likes.forEach(like => {
  like.addEventListener('click', (e) => {
    e.stopPropagation();
    const heart = e.currentTarget.querySelector('.heart');
    heart.classList.toggle('liked');
  })
})

