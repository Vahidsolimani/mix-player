const _menu = document.querySelector('#menu')
const _menu_show = document.querySelector('#show')
const sec1 = document.querySelector('.swiper-wrapper')
const sec2 = document.querySelector('.sec2')
const sec3 = document.querySelector('.sec3')
const sec4 = document.querySelector('.sec4')
const menu_close = document.querySelector('#close')

_menu.addEventListener('click', ()=>{
    _menu_show.classList.remove('show')
})
menu_close.addEventListener('click', ()=>{
    _menu_show.classList.add('show')
    })
//     ////////////////////////////////created to menu for mobile///////////////////////////////
const search = document.querySelector('#search');
const sec_search = document.querySelector('#show_search');
let new_song = 'new_songs';
let new_videos = 'new_videos';
let hot_songs = 'hot_songs';
let hot_videos = 'hot_videos';
let url = 'https://one-api.ir/radiojavan/?token=523926:679bd12de5e20&action=';

fetch(url+new_song)
  .then(res => {
    if (res.ok) return res.json();
    return Promise.reject('Error fetching data');
  })
  .then(data => {
    let clone = data.result; 
    data.result.forEach((val) => {
      let div = document.createElement('div');
      div.classList.add('swiper-slide', 'vahid');
      div.innerHTML = `
        <div class="flex flex-col items-center p-2 bg-gradient-to-r from-teal-400 to-indigo-500 rounded-xl shadow-lg">
          <figure>
            <img class="rounded-2xl img w-full h-48 object-cover shadow-md" src="${val.photo}" alt="${val.title}">
          </figure>
          <h4 class="mt-1 text-lg artist text-gray-200">${val.artist}</h4>
          <a href="${val.link}" target="_blank" class="mt-4 text-white bg-blue-600 hover:bg-blue-700 rounded-full py-1 px-4 text-sm transition">Download Now</a>
          <div class="flex *:cursor-default justify-between items-center w-full mt-2 text-white">
            <div class="flex items-center space-x-2">
              <i class="bi bi-hand-thumbs-up text-xl text-white"></i>
              <span class="text-sm">${val.likes}</span>
            </div>
            <div class="flex items-center space-x-2">
              <i class="bi bi-hand-thumbs-down text-xl text-white"></i>
              <span class="text-sm">${val.dislikes}</span>
            </div>
          </div>
        </div>
      `;
      sec1.appendChild(div);


      search.addEventListener('keyup', () => {
        let temp = search.value.trim().toLowerCase(); 
        sec_search.innerHTML = '';
        if (temp === '') {
          return; 
        }
        clone.map((item) => {
          if (item.title.toLowerCase().includes(temp)) {
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('result-item');
            resultDiv.innerHTML = `
              <div class="flex gap-x-5 justify-between items-center p-2">
                <img  src="${item.photo}" alt="${item.title}" class="w-24 h-24 object-cover rounded-full">
                <h4 class="md:text-lg hidden lg:flex">${item.title}</h4>
                <p class="text-sm">${item.artist}</p>
                <a href="${item.link}" target="_blank" class="text-blue-500">dowunlod</a>
              </div>
            `;
            sec_search.appendChild(resultDiv);

          }
        });

        if (sec_search.innerHTML === '') {
          sec_search.innerHTML = '<p>No results found</p>';
        }
      });
    });
  })
  .catch(err => console.log(err));
document.addEventListener("DOMContentLoaded", function () {
  sec1.addEventListener('click', (e) => {
      const clickedItem = e.target.closest('.vahid');
      if (!clickedItem) return;

      const myMusic = document.querySelectorAll('.vahid');
      const image = document.querySelector('#song-image');
      const artist = document.querySelector('#song-artist');
      const player = document.querySelector('#audio-player');
      const playPauseBtn = document.querySelector('#play-pause');
      const prevBtn = document.querySelector('#prev-song');
      const nextBtn = document.querySelector('#next-song');
      const seekbar = document.querySelector('#seekbar');
      const favoriteBtn = document.querySelector('#favorite-song');
      const currentTimeElem = document.querySelector('#current-time');
      const totalTimeElem = document.querySelector('#total-time');

      const song_img = clickedItem.querySelector('.img').src;
      const song_artist = clickedItem.querySelector('.artist').textContent;
      const song_link = clickedItem.querySelector('a').href;

      image.src = song_img;
      artist.textContent = song_artist;
      player.src = song_link;
      player.play();

      let currentSong = { song_img, song_artist, song_link };

      let currentSongIndex = 0;
      let songList = [];

      myMusic.forEach((val, index) => {
          const song_img = val.querySelector('.img').src;
          const song_artist = val.querySelector('.artist').textContent;
          const song_url = val.querySelector('a').href;
          songList.push({ song_img, song_artist, song_url });
      });
      playPauseBtn.innerHTML = '<i class="bi bi-pause-fill text-2xl"></i>';
      function playSong(index) {
          const song = songList[index];
          image.src = song.song_img;
          artist.textContent = song.song_artist;
          player.src = song.song_url;
          
          player.load();
          player.play();
          currentSong = song;
          updateHeartIcon();
      }

      playPauseBtn.addEventListener('click', () => {
          if (player.paused) {
              player.play();
              playPauseBtn.innerHTML = '<i class="bi bi-pause-fill text-2xl"></i>';
          } else {
              player.pause();
              playPauseBtn.innerHTML = '<i class="bi bi-play-fill text-2xl"></i>';
          }
      });

      nextBtn.addEventListener('click', () => {
          currentSongIndex = (currentSongIndex + 1) % songList.length;
          playSong(currentSongIndex);
      });

      prevBtn.addEventListener('click', () => {
          currentSongIndex = (currentSongIndex - 1 + songList.length) % songList.length;
          playSong(currentSongIndex);
      });

      player.addEventListener('loadedmetadata', () => {
          totalTimeElem.textContent = formatTime(player.duration);
      });

      player.addEventListener('timeupdate', () => {
          seekbar.value = (player.currentTime / player.duration) * 100;
          currentTimeElem.textContent = formatTime(player.currentTime);
      });

      seekbar.addEventListener('input', () => {
          const seekTime = (seekbar.value / 100) * player.duration;
          player.currentTime = seekTime;
      });

      function formatTime(seconds) {
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = Math.floor(seconds % 60);
          return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
      }



      // ** مدیریت علاقه‌مندی‌ها **
      let favoriteSongs = JSON.parse(localStorage.getItem("favorites")) || [];

      function toggleFavorite() {
          const index = favoriteSongs.findIndex(item => item.song_link === currentSong.song_link);

          if (index === -1) {
              favoriteSongs.push(currentSong);
          } else {
              favoriteSongs.splice(index, 1);
          }

          localStorage.setItem("favorites", JSON.stringify(favoriteSongs));
          updateHeartIcon();
      }

      function updateHeartIcon() {
          const isFavorite = favoriteSongs.some(item => item.song_link === currentSong.song_link);
          if (isFavorite) {
              favoriteBtn.classList.add("text-red-500");
          } else {
              favoriteBtn.classList.remove("text-red-500");
          }
      }

      favoriteBtn.addEventListener("click", toggleFavorite);

      updateHeartIcon();
      const save_song = document.querySelectorAll('.saveing')
         const liked_song = document.querySelector('#liked-list_songs')
         const close_favorites = document.querySelector('#close-favorites')
         const add_favorites_list = document.querySelector('#favorites-list')

      save_song.forEach((val)=>{
        val.addEventListener('click', ()=>{
          liked_song.classList.remove('hidden')
        })
      })
      favoriteSongs.forEach((song, ) => {
        const li = document.createElement('li')
        li.innerHTML = `

                  <div class="flex items-center gap-x-10">
                    <img src="${song.song_img}" class="w-12 h-12 rounded-md object-cover" alt="${song.song_artist}">
                    <div class =" text-center">
                        <p class="font-bold text-white">${song.song_artist} dowunlod song ⬇ </p>
                        <a href="${song.song_link}" target="_blank" class="text-blue-500 text-sm"> dowunlod </a>
                    </div>
                    <button class="remove-favorite cursor-pointer text-red-500" ">❌</button>
                </div>
             

        `
        add_favorites_list.appendChild(li)
      })

      document.querySelectorAll(".remove-favorite").forEach((btn) => {
        btn.addEventListener("click", function () {
      
          this.parentElement.parentElement.remove()
           
        });
    });
      close_favorites.addEventListener('click', ()=>{
        liked_song.classList.add('hidden')
        
      })



  });
});
// ///////////// new videos////////////////////////
fetch(url+new_videos)
.then(res => {
    if (res.ok) return res.json()
    Promise.reject(err)
})
.then(data => {
    data.result.map((val) => {
        let div = document.createElement('div')
        div.classList.add('swiper-slide')
        div.classList.add('section2')
        div.innerHTML = `
                        

                        <div class="flex justify-center flex-wrap items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md">
            <figure><img class="rounded logo"  src=${val.photo} alt=""></figure>
               <div class="flex *:text-white flex-col items-center bg-gradient-to-r from-blue-500 to-indigo-600 mt-4 p-4 rounded-lg shadow-lg w-full">
  
                <div class="text-center">
                   <h2 class="text-sm font-bold text-gray-800 mb-2 truncate">${val.song}</h2>
                 <p class="text-xs samon text-white">${val.artist}</p>
                      </div>

  
    <a href="${val.link}" target="dowunlod" class="mt-4 text-black a text-xs hover:underline"> Watch Video </a>
    <div class="flex justify-between items-center mt-4 w-full text-gray-700">
      <div class="flex items-center space-x-2">
        <i class="bi bi-hand-thumbs-up text-white text-sm"></i>
        <span class="text-xs font-medium">${val.likes}</span>
      </div>
      <div class="flex items-center space-x-2">
        <i class="bi bi-hand-thumbs-down text-white text-sm"></i>
        <span class="text-xs font-medium">${val.dislikes}</span>
      </div>
    </div>
  </div>
</div>
        `
        sec2.appendChild(div)
    })
})
.catch(err => console.log(err))

document.addEventListener("DOMContentLoaded", function () {

    const videoBar = document.querySelector('#video-bar');
    const videoPlayer = document.querySelector('#video-player');
    const videoSource = document.querySelector('#video-source');
    const exitFullScreenBtn = document.createElement('button');
    exitFullScreenBtn.textContent = 'Exit';
    exitFullScreenBtn.classList.add('exit-fullscreen-btn', 'bg-red-500', 'text-white', 'cursor-pointer', 'py-2', 'px-4', 'rounded', 'mt-4');

    // هنگامی که کاربر روی ویدیو کلیک می‌کند
    sec2.addEventListener('click', (e) => {
        const clickedItem = e.target.closest('.swiper-slide'); 
        if (!clickedItem) return;

        const videoLink = clickedItem.querySelector('a').href;  // لینک ویدیو

        // تغییر لینک ویدیو و نمایش نوار ویدیو
        videoSource.src = videoLink;
        videoPlayer.load();  // بارگذاری ویدیو جدید
        videoPlayer.play();  // پخش ویدیو

        // نمایش نوار ویدیو در پایین
        videoBar.classList.remove('hidden');  // نوار ویدیو رو نمایان می‌کنیم

        // نمایش ویدیو در حالت بزرگ (Fullscreen)
        if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
        } else if (videoPlayer.mozRequestFullScreen) { // Firefox
            videoPlayer.mozRequestFullScreen();
        } else if (videoPlayer.webkitRequestFullscreen) { // Chrome, Safari and Opera
            videoPlayer.webkitRequestFullscreen();
        } else if (videoPlayer.msRequestFullscreen) { // IE/Edge
            videoPlayer.msRequestFullscreen();
        }

        // اضافه کردن دکمه بستن به نوار ویدیو
        videoBar.appendChild(exitFullScreenBtn);
    });

    // دکمه برای قطع ویدیو و خروج از حالت fullscreen
    exitFullScreenBtn.addEventListener('click', () => {
        // توقف پخش ویدیو
        videoPlayer.pause();
        videoPlayer.currentTime = 0;  // ریست کردن ویدیو به ابتدای آن

        // مخفی کردن نوار ویدیو
        videoBar.classList.add('hidden');

        // خروج از حالت fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    });
});




