const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const shuffleButton = document.getElementById('shuffle');
const progressBar = document.getElementById('progress-bar');
const speedControl = document.getElementById('speed-control');
const fileSelector = document.getElementById('file-selector');
const folderSelector = document.getElementById('folder-selector');
const selectFilesBtn = document.getElementById('select-files-btn');
const selectFolderBtn = document.getElementById('select-folder-btn');
const trackTitle = document.getElementById('track-title');
const trackTime = document.getElementById('track-time');
const playlist = document.getElementById('playlist');

let audio = new Audio();
let tracks = [];
let currentTrackIndex = 0;
let shuffleMode = false; // ランダム再生モード

// 再生ボタン
playButton.addEventListener('click', () => {
    audio.play();
    playButton.hidden = true;
    pauseButton.hidden = false;
});

// 一時停止ボタン
pauseButton.addEventListener('click', () => {
    audio.pause();
    playButton.hidden = false;
    pauseButton.hidden = true;
});

// 次の曲
nextButton.addEventListener('click', () => playNextTrack());

// 前の曲
prevButton.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(currentTrackIndex);
});

// ランダム再生のオン・オフ
shuffleButton.addEventListener('click', () => {
    shuffleMode = !shuffleMode;
    shuffleButton.textContent = shuffleMode ? '🔀 オン' : '🔀 オフ';
});

// シークバー
progressBar.addEventListener('input', (e) => {
    const seekTime = (audio.duration * e.target.value) / 100;
    audio.currentTime = seekTime;
});

// 再生速度の変更
speedControl.addEventListener('input', (e) => {
    audio.playbackRate = e.target.value;
});

// ファイル選択ボタン
selectFilesBtn.addEventListener('click', () => fileSelector.click());
fileSelector.addEventListener('change', (e) => loadTracks(e.target.files));

// フォルダ選択ボタン
selectFolderBtn.addEventListener('click', () => folderSelector.click());
folderSelector.addEventListener('change', (e) => loadTracks(e.target.files));

// 再生時間の更新
audio.addEventListener('timeupdate', () => {
    progressBar.value = (audio.currentTime / audio.duration) * 100 || 0;
    trackTime.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
});

// 曲が終わったら次の曲へ
audio.addEventListener('ended', () => playNextTrack());

// プレイリストの更新
function updatePlaylist() {
    playlist.innerHTML = '';
    tracks.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = track.name;
        li.addEventListener('click', () => playTrack(index));
        playlist.appendChild(li);
    });
}

// トラックの読み込み
function loadTracks(fileList) {
    const files = Array.from(fileList);
    tracks = files
        .filter(file => file.type.startsWith('audio'))
        .map(file => ({
            name: file.webkitRelativePath || file.name,
            url: URL.createObjectURL(file)
        }));
    updatePlaylist();
    if (tracks.length > 0) playTrack(0);
}

// 次の曲を再生
function playNextTrack() {
    if (shuffleMode) {
        const randomIndex = Math.floor(Math.random() * tracks.length);
        playTrack(randomIndex);
    } else {
        playTrack((currentTrackIndex + 1) % tracks.length);
    }
}

// 指定の曲を再生
function playTrack(index) {
    currentTrackIndex = index;
    audio.src = tracks[index].url;
    trackTitle.textContent = tracks[index].name;
    audio.play();
    playButton.hidden = true;
    pauseButton.hidden = false;
}

// 時間フォーマット
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}
