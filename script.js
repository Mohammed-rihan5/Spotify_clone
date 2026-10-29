function slideLeft() {
  document.getElementById("slider").scrollBy({
    left: -300,
    behavior: "smooth"
  });
}

function slideRight() {
  document.getElementById("slider").scrollBy({
    left: 300,
    behavior: "smooth"
  });
}

const slider = document.getElementById("slider");
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");

function updateArrows() {
  leftArrow.style.display = slider.scrollLeft > 0 ? "block" : "none";
  rightArrow.style.display =
    slider.scrollLeft + slider.clientWidth < slider.scrollWidth ? "block" : "none";
}

slider.addEventListener("scroll", updateArrows);
window.addEventListener("resize", updateArrows);
updateArrows();

// Music logic
let audio = null;
let currentSongIndex = -1;
let songs = [];

let songTitles = [
  "Garoor - Gulab Sidhu, Kavy Riyyaaz, Diamond",
  "Sajde - Faheem Abdullah, Huzaif Nazar, Aman Moroney",
  "TeamSideFeat.RCB - Alan Walker, Sofiloud",
  "Shake It To The Max - Gulab Sidhu, Kavy Riyyaaz",
  "Gulabi ankhein - Sanam",
  "Jhol - Rifat Karim",
  "Naam Chale - Vikram Sarkar",
  "Finding Her - Kushagra,Bharath,Saaheal",
  "Yeh Jawaani Hai Deewani - Pritam"
];

async function fetchSongs() {
  const res = await fetch("http://127.0.0.1:3000/spotify/music/");
  const text = await res.text();
  const div = document.createElement("div");
  div.innerHTML = text;
  const links = div.getElementsByTagName("a");

  songs = [];
  for (let link of links) {
    if (link.href.endsWith(".mp3")) {
      songs.push(link.href);
    }
  }
}

fetchSongs();

document.addEventListener("click", function (e) {
  const card = e.target.closest(".card1");
  if (card && card.hasAttribute("data-index")) {
    const index = parseInt(card.getAttribute("data-index"));
    if (!isNaN(index)) {
      playSong(index);
    }
  }
});

const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

function updateProgress() {
  if (!audio) return;
  const value = audio.currentTime;
  const max = audio.duration;
  progressBar.value = value;
  currentTimeEl.textContent = formatTime(value);

  const percent = (value / max) * 100;
  progressBar.style.background = `linear-gradient(to right, #1DB954 0%, #1DB954 ${percent}%, #555 ${percent}%, #555 100%)`;
}

progressBar.addEventListener("input", function () {
  if (audio) {
    audio.currentTime = this.value;
    const percent = (this.value / audio.duration) * 100;
    this.style.background = `linear-gradient(to right, #1DB954 0%, #1DB954 ${percent}%, #555 ${percent}%, #555 100%)`;
  }
});

document.querySelector(".play-button").addEventListener("click", function () {
  if (!audio) return;

  if (audio.paused) {
    audio.play();
    this.classList.add("pause");
  } else {
    audio.pause();
    this.classList.remove("pause");
  }
});

function playSong(index) {
  if (songs.length === 0) {
    console.error("Songs not loaded yet.");
    return;
  }

  if (audio) {
    audio.pause();
  }

  audio = new Audio(songs[index]);
  audio.play();
  currentSongIndex = index;

  // Show playbar
  document.querySelector(".playbar").style.display = "flex";

  // Load duration and total time
  audio.addEventListener("loadedmetadata", () => {
    progressBar.max = Math.floor(audio.duration);
    totalTimeEl.textContent = formatTime(audio.duration);
  });

  // Live progress update
  audio.addEventListener("timeupdate", updateProgress);

  // Auto hide playbar after song ends
  audio.addEventListener("ended", () => {
    document.querySelector(".playbar").style.display = "none";
  });

  // Show current song name
  document.querySelector(".singer").textContent = songTitles[index];

  document.querySelector(".play-button").classList.add("pause");
}

//not//not the build up 
 