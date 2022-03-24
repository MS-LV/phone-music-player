let file = document.getElementById('file'),
    right = document.querySelector('.list'),
    create,
    enable = false,
    trying = false,
    target,
    size,
    name,
    min,
    duration,
    result,
    targetting,
    minRange = document.querySelector('.minRange'),
    volumeRange = document.querySelector('.volume__range'),
    playBtn = document.querySelector('.player'),
    volumeBtn = document.querySelector('.icon__volume'),
    stop = document.querySelector('.stop'),
    timeout = document.querySelector('.timeout'),
    volumeOn = document.querySelector('.volume__icon'),
    allCoord = document.querySelector('.all__coords'),
    firstCoords = allCoord.querySelector('div.firstX__coords'),
    lastCoords = allCoord.querySelector('div.lastX__coords'),
    minuteBounding = minRange.getBoundingClientRect(),
    firstBounding = firstCoords.getBoundingClientRect(),
    lastBounding = lastCoords.getBoundingClientRect(),
    allBounding = allCoord.getBoundingClientRect(),
    firstComputed = getComputedStyle(firstCoords),
    lastComputed = getComputedStyle(lastCoords),
    startPlay = 0,
    endPlay,
    time,
    minEnable,
    volumeEnable,
    secondEnable = false,
    hightVolume,
    currentItem,
    mayStartX = false,
    mayStartY = false,
    reader,
    array = [],
    download = document.querySelector('.download'),
    audio = document.querySelector('audio');

file.onchange = () => {
    reader = new FileReader(),
        fls = file.files[0];
    reader.readAsDataURL(fls);
    name = fls.name;
    fakes = array.some((item) => {
        return item == fls.lastModified
    })
    array.push(fls.lastModified)
    if (!fakes && name.endsWith('.mp3')) {
        reader.onload = () => {
            result = reader.result;
            size = fls.size / (2 ** 20)
            download.innerHTML = 'UPLOAD'
            download.classList.add('past_down')
            create = document.createElement('block');
            right.style.cssText = `justify-content:flex-start;align-items:flex-start`
            create.classList.add('active')
            create.setAttribute('data-src', reader.result);
            create.innerHTML = `<i>${fls.name}</i> <i>${size.toFixed(2)}mb</i>`
            right.append(create)
            audio.setAttribute('src', reader.result);
            audio.setAttribute('autoplay', 'autoplay');
            playBtn.innerHTML = '<i class="demo-icon pauseicon-">&#xe893;</i>';
            musicPaused()
            create.onclick = audioPlay;
        }
    } else {
        if (name.endsWith('.mp3')) {
            audio.setAttribute('src', result);
            audio.setAttribute('autoplay', 'autoplay');
        }
    }
    firstCoords.style.left = '0px';
    lastCoords.style.left = minRange.clientWidth - 2 + "px";
    startPlay = 0;
    endPlay = audio.duration;
    mayStartX = false;
}
document.addEventListener('click', (e) => {
    enable = e.target.closest('.active');
    if (!!enable) {
        target = e.target
        audio.setAttribute('src', target.closest('.active').getAttribute('data-src'))
    }
    enable = false;
});

function rangeMusic() {
    val = minRange.value;
    audio.currentTime = val;
}


function musicPaused() {
    if (audio.paused) {
        audio.play();
        if (mayStartX) audio.currentTime = startPlay || 0;
        if (audio.currentTime == audio.duration) audio.currentTime = 0;
        playBtn.innerHTML = '<i class="demo-icon pauseicon-"></i>';
        duration = audio.duration;
        minRange.setAttribute('max', duration);
        audioPlay()
    } else {
        audio.pause();
        playBtn.innerHTML = '&#9658'
    }
}

playBtn.addEventListener('click', musicPaused)

stop.addEventListener('click', stopFunc)
function stopFunc() {
    //musicPaused()
    audio.pause();
    //if (mayStartX) audio.currentTime = startPlay;
    audio.currentTime = 0;
    playBtn.innerHTML = '&#9658';
}
volumeRange.addEventListener('mousedown', function (e) {
    volumeEnable = e.target.classList.contains('volume__range');
    if (volumeEnable) {
        hightVolume = volumeRange.value / 100;
        audio.volume = hightVolume;
    }
})
volumeRange.addEventListener('mousemove', function () {
    if (volumeEnable) {
        hightVolume = volumeRange.value / 100;
        audio.volume = hightVolume;
    }
})
minRange.onclick = () => {
    if (minRange.value < startPlay && minRange.value > endPlay) {
        minRange.value = startPlay;
    } else {
        audio.pause();
        startPlay = startPlay || 0;
        endPlay = endPlay || audio.duration;
        playBtn.innerHTML = '<i class="demo-icon pauseicon-"></i>'
        if (minRange.value >= startPlay && minRange.value <= endPlay) {
            audio.currentTime = minRange.value;
            audio.play()
        }
    }

}


// ====================================================================






function audioPlay(e) {
    duration = audio.duration;
    startPlay = startPlay || 0;
    endPlay = endPlay || duration;
    let third = parseInt(duration / 60),
        curren = parseInt(audio.currentTime),
        first = parseInt(curren / 60),
        second = curren % 60,
        fourth = parseInt(duration % 60);
    //first = first > 10 && first <= 0 || "0" + first;
    if (first < 10) first = "0" + first;
    if (second < 10) second = "0" + second;
    if (third < 10) third = "0" + third;
    if (fourth < 10) fourth = "0" + fourth;
    timeout.innerHTML = `${first}:${second}s/${(third)}:${fourth}m `;
    minRange.value = audio.currentTime;
    minRange.setAttribute('min', 0)
    minRange.setAttribute('max', duration);
    if (audio.currentTime == duration) {
        playBtn.innerHTML = '&#9658';
        audio.pause()
    }
    if (parseInt(audio.currentTime) >= parseInt(endPlay)) {
        playBtn.innerHTML = '&#9658';
        //stopFunc()
        audio.currentTime = startPlay;
        audio.pause()
    }
}
audio.addEventListener('timeupdate', audioPlay);

volumeOn.onclick = volumeOnFunc;
function volumeOnFunc() {
    volumeBtn.classList.toggle('remove');
    enable = volumeBtn.classList.contains('remove');
    if (enable) {
        volumeOn.src = 'icons/volume off.png'
        audio.volume = 0;
    } else {
        volumeOn.src = 'icons/volume on.png'
        audio.volume = volumeRange.value / 100;
    }
}
volumeBtn.onmouseover = () => {
    setTimeout(() => {
        timeout.style.visibility = 'hidden'
    }, 250)
}

volumeBtn.onmouseout = () => {
    setTimeout(() => {
        timeout.style.visibility = 'visible'
    }, 400)
}


function firstCoordsDown(e) {
    enable = e.target.classList.contains('firstX__coords');
    secondEnable = e.target.classList.contains('lastX__coords')
    if (enable) {
        currentItem = e.target;
        //if (startPlay >= minRange.value) audio.value = startPlay;
        currentItem.style.position = "absolute"
    }
    if (secondEnable) {
        currentItem = e.target;
        currentItem.style.position = "absolute"
    }
}
function firstCoordsMove(e) {
    if (enable && currentItem && e.clientX >= allBounding.left && e.clientX < lastBounding.left && parseInt(lastComputed.left) > parseInt(firstComputed.left)) {
        currentItem.style.left = (e.clientX - (firstBounding.left)) + 'px';
        //if (startPlay < minRange.value) currentItem.style.left = (e.clientX - (firstBounding.left)) + 'px';
        startPlay = (audio.duration / minRange.clientWidth) * (e.clientX - firstBounding.left) - 0.6516537571839081;
        mayStartX = true;
        //if (startPlay >= minRange.value) audio.currentTime = startPlay
    }
    if (secondEnable && currentItem && e.clientX < allBounding.right && e.clientX > firstBounding.right && parseInt(lastComputed.left) > parseInt(firstComputed.left)) {
        currentItem.style.left = (e.clientX - firstBounding.left) + 'px';
        endPlay = (audio.duration / minRange.clientWidth) * (e.clientX - firstBounding.left);
        //if (endPlay <= minRange.value) audio.currentTime = endPlay;
    }
}
document.addEventListener('mousedown', firstCoordsDown);
document.addEventListener('mousemove', firstCoordsMove);
document.addEventListener('mouseup', () => {
    enable = false;
    secondEnable = false;
})

document.onkeydown = (e) => {
    if (e.keyCode === 39) {
        audio.currentTime += 5;
    }
    if (e.keyCode == 37) {
        audio.currentTime -= 5;
    }
    if (e.keyCode == 38) {
        if (audio.volume <= 1) {
            audio.volume = audio.volume + 0.1;
            volumeRange.value += 1;
        }
    }
    if (e.keyCode == 40) {
        if (audio.volume >= 0.1) {
            audio.volume -= 0.1;
            volumeRange.value -= 10;
        }
    }
    if (e.keyCode == 80) {
        musicPaused()
    }
    if (e.keyCode == 77) {
        volumeOnFunc()
    }

}







