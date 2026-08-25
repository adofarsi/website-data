(function () {
  var videos = document.querySelectorAll('[data-youtube-lite]');

  videos.forEach(function (video) {
    var button = video.querySelector('.video-poster');
    if (!button) return;

    button.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      var videoId = video.getAttribute('data-video-id');

      iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId)
        + '?autoplay=1&playsinline=1&rel=0';
      iframe.title = video.getAttribute('data-video-title') || 'YouTube video';
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';

      video.replaceChildren(iframe);
      iframe.focus();
    });
  });
}());
