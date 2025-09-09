class VideoSwiperManager {
  constructor() {
    this.swiper = null;
    this.videos = [];
    this.likes = [];
    this.volumeButtons = [];
    this.isMuted = true;
    this.init();
  }

  init() {
    this.videos = document.querySelectorAll('.swiper-slide-video');
    this.likes = document.querySelectorAll('.like');
    this.volumeButtons = document.querySelectorAll('.volume-toggle'); // <-- добавлено

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

    this.videos.forEach((video, index) => {
      video.addEventListener('click', this.toggleVideoPlayPause.bind(this));

      // синхронизация кнопки громкости при инициализации
      const btn = this.volumeButtons[index];
      if (btn) {
        btn.classList.toggle('unmuted', !video.muted);

        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleVolume(index);
        });
      }
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
      video.currentTime = 0;
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

    if (video.muted) {
      video.muted = false;

      // обновляем кнопку при клике на видео
      const index = Array.from(this.videos).indexOf(video);
      const btn = this.volumeButtons[index];
      if (btn) btn.classList.add('unmuted');
    }
  }

  toggleVolume(index) {
    this.isMuted = !this.isMuted;

    this.videos.forEach((video, i) => {
      video.muted = this.isMuted;
    });

    this.volumeButtons.forEach((btn) => {
      btn.classList.toggle('unmuted', !this.isMuted);
    });

    // если включили звук и активное видео на паузе — воспроизвести
    const activeSlide = this.swiper.slides[this.swiper.activeIndex];
    const activeVideo = activeSlide.querySelector('.swiper-slide-video');
    if (!this.isMuted && activeVideo && activeVideo.paused) {
      activeVideo.play().catch(err => console.error(err));
    }
  }


  handleLikeClick(event) {
    event.stopPropagation();
    const likeElement = event.currentTarget;
    const heart = likeElement.querySelector('.heart');
    const countSpan = likeElement.querySelector('.like__count');
    const videoId = likeElement.closest('.swiper-slide').dataset.videoId;

    const isLiked = heart.classList.contains('liked');
    const likeMethod = isLiked ? this.unlikeVideo : this.likeVideo;

    likeMethod(videoId)
      .then(response => {
        countSpan.textContent = response.likes;
        heart.classList.toggle('liked');
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
