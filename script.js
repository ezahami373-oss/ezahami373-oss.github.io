/* script.js — you do not need to edit this file. Edit settings.js instead. */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }

  function setting(name) {
    var v = window[name];
    return (typeof v === "string") ? v.trim() : "";
  }

  function isPlaceholder(v) {
    return !v || v.indexOf("PASTE_") === 0;
  }

  /* ---------- Title, name, dates, message, footer ---------- */
  var title = setting("PAGE_TITLE");
  if (title) {
    $("pageTitle").textContent = title;
    document.title = title;
  }

  var fullName = setting("FULL_NAME");
  var fatherName = setting("FATHER_NAME");
  if (fullName) {
    $("fullName").textContent = fullName;
    $("fullName").hidden = false;
    if (fatherName) {
      var sub = document.createElement("span");
      sub.className = "father";
      sub.textContent = "فرزند " + fatherName;
      $("fullName").appendChild(sub);
    }
  }

  var birth = setting("BIRTH_DATE");
  var death = setting("DEATH_DATE");
  var parts = [];
  if (birth) parts.push("زادروز: " + birth);
  if (death) parts.push("درگذشت: " + death);
  if (parts.length) {
    $("dates").textContent = parts.join("  ــ  ");
    $("dates").hidden = false;
  }

  var message = setting("MEMORIAL_MESSAGE");
  if (message) {
    $("message").textContent = message;
  } else {
    $("message").hidden = true;
  }

  var footer = setting("FOOTER_TEXT");
  if (footer) {
    $("footerText").textContent = footer;
  } else {
    $("footerText").hidden = true;
  }

  /* ---------- Photo (with a soft silhouette if the file is missing) ---------- */
  var PLACEHOLDER =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">' +
      '<rect width="300" height="400" fill="#2a3746"/>' +
      '<circle cx="150" cy="158" r="56" fill="#3d4e60"/>' +
      '<path d="M40 400c0-92 50-142 110-142s110 50 110 142z" fill="#3d4e60"/>' +
      '</svg>'
    );

  var photo = $("photo");
  var photoUrl = setting("MEMORIAL_PHOTO");
  photo.onerror = function () {
    photo.onerror = null;
    photo.src = PLACEHOLDER;
  };
  photo.src = isPlaceholder(photoUrl) ? PLACEHOLDER : photoUrl;

  /* ---------- Video ---------- */
  var video = $("video");
  var wrap = $("videoWrap");
  var playBtn = $("playBtn");
  var playLabel = $("playLabel");
  var note = $("videoNote");
  var videoUrl = setting("VIDEO_URL");

  if (isPlaceholder(videoUrl)) {
    wrap.hidden = true;
    note.textContent = "ویدیوی یادبود به‌زودی در اینجا قرار خواهد گرفت.";
    note.hidden = false;
  } else {
    var poster = setting("VIDEO_POSTER");
    if (poster) video.poster = poster;
    video.src = videoUrl;

    // Match the box to the real video shape (works for wide or vertical videos)
    video.addEventListener("loadedmetadata", function () {
      if (video.videoWidth && video.videoHeight) {
        wrap.style.setProperty("--ratio", video.videoWidth + " / " + video.videoHeight);
      }
    });

    playBtn.addEventListener("click", function () {
      var p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(function () {
          // If the browser refuses, just show the normal video controls.
          playBtn.hidden = true;
        });
      }
    });

    video.addEventListener("play", function () {
      playBtn.hidden = true;
      pauseMusic();
    });

    video.addEventListener("ended", function () {
      playLabel.textContent = "پخش دوباره";
      playBtn.hidden = false;
    });

    video.addEventListener("error", function () {
      wrap.hidden = true;
      note.textContent = "متأسفانه ویدیو بارگذاری نشد. لطفاً صفحه را دوباره باز کنید.";
      note.hidden = false;
    });
  }

  /* ---------- Optional music (only starts when the visitor presses the button) ---------- */
  var music = $("music");
  var musicBtn = $("musicBtn");
  var musicUrl = setting("MUSIC_URL");

  function pauseMusic() {
    if (music && !music.paused) music.pause();
  }

  if (!isPlaceholder(musicUrl)) {
    music.src = musicUrl;
    $("musicSection").hidden = false;

    musicBtn.addEventListener("click", function () {
      if (music.paused) {
        if (video && !video.paused) video.pause();
        var p = music.play();
        if (p && typeof p.catch === "function") p.catch(function () {});
      } else {
        music.pause();
      }
    });

    music.addEventListener("play", function () { musicBtn.textContent = "توقف موسیقی"; });
    music.addEventListener("pause", function () { musicBtn.textContent = "پخش موسیقی"; });
    music.addEventListener("error", function () { $("musicSection").hidden = true; });
  }
})();
