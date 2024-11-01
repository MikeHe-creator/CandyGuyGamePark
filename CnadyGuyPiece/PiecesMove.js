const pictures = document.querySelectorAll('.picture');
let pictureID;
let inforRecord=[]
pictures.forEach((picture) => {
    picture.addEventListener('click', (event) => {
        const targetIMG = event.target;
        if (targetIMG.id === "picture04") {
            const newinput = document.createElement('input');
            newinput.type = "file";
            newinput.accept = 'image/*';
            newinput.onchange = () => {
                const addimg = newinput.files[0];
                const addimgE = document.createElement('img');
                addimgE.src = URL.createObjectURL(addimg);
                addimgE.id = "picture4";
                addimgE.style.width = "100%";
                addimgE.style.height = "100%";
                addimgE.style.objectFit = "cover";
                pictureID=addimgE.id;
                seclectDiff(pictureID)
                targetIMG.innerHTML = '';
                targetIMG.appendChild(addimgE);
            };
            newinput.click();
        }else{
            pictureID=targetIMG.id;
            seclectDiff(pictureID)
        }
    });
});

function seclectDiff(pictureID) {
    const guide=document.getElementById('guide');
    const paragraph = guide.querySelector('p');
    paragraph.textContent = "Please select a difficulty to challenge";
    const difficulty=document.querySelectorAll('.difficulty');
    const difficulty2=document.querySelector('#difficulty');
    const pictures=document.getElementById('pictures');
    difficulty2.style.display="flex";
    difficulty.forEach(nandu=> {
        nandu.addEventListener('click', (event) => {
            inforRecord.push(pictureID);
            inforRecord.push(event.target.textContent);
            GameSet(inforRecord)
            pictures.style.display="none";
            difficulty2.style.display="none";
        })
    })
}

function GameSet(inforRecord) {
    const gameplay = document.getElementById('gameplay');
    gameplay.style.display = "flex";
    const guide = document.getElementById('guide');
    guide.style.marginTop = "40px";
    const thisIMG = document.getElementById(inforRecord[0]);
    const IMGsrc = thisIMG.src;
    const gameScreen = document.getElementById("gameScreen");
    const difficultyT = inforRecord[1];

    let n;
    if (difficultyT === "Easy(4*4)") {
        n = 4;
    } else if (difficultyT === "Medium(10*10)") {
        n = 10;
    } else if (difficultyT === "Hard(20*20)") {
        n = 20;
    }
    const img = new Image();
    img.src = IMGsrc;

    img.onload = () => {
        const imgWidth = img.width;
        const imgHeight = img.height;
        const eachWidth = gameScreen.getBoundingClientRect().width*0.25;
        const eachHeight = gameScreen.getBoundingClientRect().height*0.25;
        let RandomWeizi = [];
        for (let i = 0; i < n; i++) {
            const weizi = i * eachWidth;
            RandomWeizi.push(weizi);
        }

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const canvas = document.createElement('canvas');
                canvas.width = eachWidth;
                canvas.height = eachHeight;
                const context = canvas.getContext('2d');
                if (context) {
                    context.drawImage(img, j * (imgWidth / n), i * (imgHeight / n), imgWidth / n, imgHeight / n, 0, 0, eachWidth, eachHeight);
                    const imgPiece = new Image();
                    imgPiece.src = canvas.toDataURL();
                    imgPiece.classList.add('piece');
                    imgPiece.dataset.pipei=`(${j*eachWidth},${i*eachHeight})`;
                    RandomPut(imgPiece, RandomWeizi);
                    gameScreen.appendChild(imgPiece);
                }
            }
        }
        LastStepToset(gameScreen,eachWidth,eachHeight,n);
    };
}

let RandomJilu = new Set();
let isPaused = false;
function RandomPut(imgPiece, RandomWeizi) {
    let x, y;
    do {
        x = RandomWeizi[Math.floor(Math.random() * RandomWeizi.length)];
        y = RandomWeizi[Math.floor(Math.random() * RandomWeizi.length)];
    } while (RandomJilu.has(`${x},${y}`)); // 防止重复位置
    imgPiece.style.position = 'absolute';
    imgPiece.style.marginLeft = x + 'px';
    imgPiece.style.marginTop = y + 'px';
    RandomJilu.add(`${x},${y}`);
}

function LastStepToset(gameScreen,eachWidth,eachHeight,n){
    const removed=document.createElement("div");
    removed.style.display="none";
    const gameplay=document.getElementById('gameplay');
    gameplay.appendChild(removed);
    const pieces = Array.from(gameScreen.children);
    const randomIndex = Math.floor(Math.random() * pieces.length);
    const randomPiece = pieces[randomIndex];
    console.log("randomPiece",randomPiece);
    let kongdangML = parseInt(getComputedStyle(randomPiece).marginLeft, 10);
    let kongdangMT = parseInt(getComputedStyle(randomPiece).marginTop, 10);
    randomPiece.id = "removed";
    console.log("kongdangML",kongdangML);
    console.log("kongdangMT",kongdangMT);
    removed.appendChild(randomPiece);
    const guide=document.getElementById('guide');
    const paragraph = guide.querySelector('p');
    paragraph.textContent = "Please move the pictures to the blank area until all pictures are in the correct area to win.";
    jishi()

    gameScreen.addEventListener("click", (event)=>{
        if (isPaused) return;
        const targetE=event.target;
        const targetML = parseInt(getComputedStyle(targetE).marginLeft, 10);
        const targetMT = parseInt(getComputedStyle(targetE).marginTop, 10);
        if(targetMT === kongdangMT && Math.abs(targetML - kongdangML) === eachWidth){
            targetE.style.marginLeft = `${kongdangML}px`;
            kongdangML = targetML;
        }else if(targetML === kongdangML && Math.abs(targetMT - kongdangMT) === eachHeight){
            targetE.style.marginTop = `${kongdangMT}px`;
            kongdangMT = targetMT;
        }
        checkAnswer(gameScreen,n)
    });
    checkAnswer(gameScreen, n);
}

function checkAnswer(gameScreen,n) {
    let correct = 0;
    const Allelement = gameScreen.children;
    for (const img of Allelement) {
        const imgML = parseInt(getComputedStyle(img).marginLeft, 10);
        const imgMT = parseInt(getComputedStyle(img).marginTop, 10);
        const pipeiValue = img.dataset.pipei.split(',');
        const x = parseInt(pipeiValue[0], 10);
        const y = parseInt(pipeiValue[1], 10);
        if (imgML === x && imgMT === y) {
            correct++;
        } else {
            console.log("出现一个元素不在它应该在的位置上！")
            break;
        }
    }
    if (correct === n*n-1 ){
        const removed=document.getElementById("removed");
        const romovedPipe=removed.dataset.pipei.split(',');
        const pipeix = parseInt(romovedPipe[0], 10);
        const pipeiy = parseInt(romovedPipe[1], 10);
        removed.style.marginLeft = `${pipeix}px`;
        removed.style.marginTop=`${pipeiy}px`;
        gameScreen.appendChild(removed);
        const guide=document.getElementById('guide');
        const gameplay=document.getElementById('gameplay');
        guide.style.display="none";
        gameplay.style.display="none";
        const gameOver=document.getElementById('gameOver');
        gameOver.style.display="block";

        const TongguanImgID=inforRecord[0];
        const TongguanImg0=document.getElementById(TongguanImgID);
        const HuoshengPIC=document.getElementById("HuoshengPIC");
        HuoshengPIC.src=TongguanImg0.getAttribute('src');
    }
}

let timerId;
let secondnum = 0;
let minutenum = 0;
let hournum = 0;
function jishi(){
    if (timerId) return;
    const second = document.getElementById("second");
    const minute = document.getElementById("minute");
    const hour = document.getElementById("hour");

    timerId = setInterval(() => {
        secondnum++;
        if (secondnum === 60) {
            secondnum = 0;
            minutenum++;
        }
        if (minutenum === 60) {
            minutenum = 0;
            hournum++;
        }
        second.textContent = secondnum.toString().padStart(2, "0"); // 显示两位数字
        minute.textContent = minutenum.toString().padStart(2, "0");
        hour.textContent = hournum.toString().padStart(2, "0");
    }, 1000);
}

function stop() {
    clearInterval(timerId);
    timerId = null;  // 将 timerId 设为 null，确保可以重新启动
    isPaused = true;
    const gameScreen = document.getElementById("gameScreen");
    const pauseClickHandler = () => {
        alert("You cannot play during the game pause! If you want to continue, please press 'KEEP GOING'");
    };
    gameScreen.addEventListener("click", pauseClickHandler);
    gameScreen.pauseClickHandler = pauseClickHandler;
}

function KeepGoing() {
    if (!timerId) {  // 仅在计时器未启动时重新启动
        jishi();
    }
    isPaused = false;
    const gameScreen = document.getElementById("gameScreen");
    if (gameScreen.pauseClickHandler) {
        gameScreen.removeEventListener("click", gameScreen.pauseClickHandler);
        gameScreen.pauseClickHandler = null;
    }
}

function Reset() {
    clearInterval(timerId);
    timerId = null;
    secondnum = 0;
    minutenum = 0;
    hournum = 0;
    const gameScreen = document.getElementById("gameScreen");
    while (gameScreen.firstChild) {
        gameScreen.removeChild(gameScreen.firstChild);
    }
    RandomJilu.clear();
    jishi();
    GameSet(inforRecord.slice());
}

function BackHome(){
    const gameplay=document.getElementById('gameplay');
    gameplay.style.display="none";
    const pictures=document.getElementById('pictures');
    pictures.style.display="block";
    setTimeout(() => {
        pictures.style.display = "flex";
    }, 0);

    // 清理计时器和其他游戏状态
    clearInterval(timerId);
    timerId = null;
    secondnum = 0;
    minutenum = 0;
    hournum = 0;
    const second = document.getElementById("second");
    const minute = document.getElementById("minute");
    const hour = document.getElementById("hour");
    second.textContent = "00";
    minute.textContent = "00";
    hour.textContent = "00";
    const gameScreen = document.getElementById("gameScreen");
    while (gameScreen.firstChild) {
        gameScreen.removeChild(gameScreen.firstChild);
    }
    const difficulty = document.querySelectorAll('.difficulty');
    difficulty.forEach(nandu => {
        const newNandu = nandu.cloneNode(true);
        nandu.parentNode.replaceChild(newNandu, nandu);
    });
    RandomJilu.clear();
}

function Reset2(){
    const gameOver=document.getElementById("gameOver");
    gameOver.style.display="none";
    const gameplay=document.getElementById('gameplay');
    gameplay.style.display="block";
    Reset()
}

function BackHome2(){
    const gameOver=document.getElementById("gameOver");
    gameOver.style.display="none";
    const pictures=document.getElementById('pictures');
    pictures.style.display="block";
    setTimeout(() => {
        pictures.style.display = "flex";
    }, 0);
    BackHome()
}


