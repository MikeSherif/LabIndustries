class VideoSwiperManager {
  constructor() {
    this.swiper = null;
    this.videos = [];
    this.likes = [];
    this.init();
  }

  init() {
    this.videos = document.querySelectorAll('.swiper-slide-video');
    this.likes = document.querySelectorAll('.like');
    this.swiper = new Swiper('.swiper', {
      direction: 'vertical',
      navigation: {
        nextEl: '.button-next',
        prevEl: '.button-prev',
      },
      watchSlidesProgress: true,
      slidesPerView: 'auto',
      spaceBetween: 10,
      centeredSlides: true,
      on: {
        slideChange: () => this.updateVideoState(),
      },
    });

    this.updateVideoState();

    this.videos.forEach(video => {
      video.addEventListener('click', this.toggleVideoPlayPause.bind(this));
    });

    this.likes.forEach(like => {
      like.addEventListener('click', this.handleLikeClick.bind(this));
    });
  }

  playActiveVideo() {
    const activeSlide = this.swiper.slides[this.swiper.activeIndex];
    const activeVideo = activeSlide.querySelector('.swiper-slide-video');
    if (activeVideo) {
      activeVideo.play().catch(error => console.error('Ошибка проигрывания видео:', error));
    }
  }

  pauseAllVideos() {
    this.videos.forEach(video => {
      video.pause();
      video.currentTime = 0; // Перемотка на начало
    });
  }

  updateVideoState() {
    this.pauseAllVideos();
    this.playActiveVideo();
  }

  toggleVideoPlayPause(event) {
    const video = event.target;
    if (video.paused) {
      video.play().catch(error => console.error('Ошибка проигрывания видео:', error));
    } else {
      video.pause();
    }
  }

  handleLikeClick(event) {
    event.stopPropagation(); // Предотвращаем всплытие события
    const likeElement = event.currentTarget;
    const heart = likeElement.querySelector('.heart');
    const countSpan = likeElement.querySelector('.like__count');
    const videoId = likeElement.closest('.swiper-slide').dataset.videoId; // Предполагаем, что у слайда есть data-videoId

    const isLiked = heart.classList.contains('liked');
    const likeMethod = isLiked ? this.unlikeVideo : this.likeVideo;

    likeMethod(videoId)
      .then(response => {
        countSpan.textContent = response.likes; // Обновляем счетчик
        heart.classList.toggle('liked'); // Переключаем класс
      })
      .catch(error => console.error('Ошибка при обработке лайка:', error));
  }

  likeVideo(videoId) {
    return fetch(`/api/videos/${videoId}/likes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (!response.ok) throw new Error('Ошибка запроса');
      return response.json();
    });
  }

  unlikeVideo(videoId) {
    return fetch(`/api/videos/${videoId}/likes`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (!response.ok) throw new Error('Ошибка запроса');
      return response.json();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new VideoSwiperManager();
});
