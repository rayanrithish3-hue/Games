const PASSWORD = "5689";

let enteredPin = "";

const lockScreen = document.getElementById("lockScreen");
const introScreen = document.getElementById("introScreen");
const menuScreen = document.getElementById("menuScreen");

const pinDisplay = document.getElementById("pinDisplay");

const introVideo = document.getElementById("introVideo");

/* ---------------- SOUND SYSTEM ---------------- */

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playCollectSound() {

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "triangle";
  osc.frequency.value = 700;

  gain.gain.value = 0.05;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();

  osc.frequency.exponentialRampToValueAtTime(
    1200,
    audioCtx.currentTime + 0.1
  );

  osc.stop(audioCtx.currentTime + 0.1);
}

function playCrashSound() {

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sawtooth";
  osc.frequency.value = 200;

  gain.gain.value = 0.08;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();

  osc.frequency.exponentialRampToValueAtTime(
    50,
    audioCtx.currentTime + 0.3
  );

  osc.stop(audioCtx.currentTime + 0.3);
}

/* ---------------- PASSWORD ---------------- */

function pressKey(num){

  if(enteredPin.length < 4){

    enteredPin += num;

    pinDisplay.innerText =
      "*".repeat(enteredPin.length) +
      "-".repeat(4 - enteredPin.length);
  }
}

function clearPin(){

  enteredPin = "";
  pinDisplay.innerText = "----";
}

function checkPin(){

  if(enteredPin === PASSWORD){

    openIntro();

  }else{

    alert("Wrong Password");
    clearPin();
  }
}

/* ---------------- INTRO ---------------- */

function openIntro(){

  lockScreen.style.display = "none";

  introScreen.style.display = "flex";

  introVideo.play();

  introVideo.onended = () => {

    introScreen.style.display = "none";

    menuScreen.style.display = "flex";
  };
}

/* ---------------- MENU ---------------- */

function startCinoGame(){

  menuScreen.style.display = "none";

  document.getElementById("cinoGame").style.display = "block";

  startCino();
}

function startHinessGame(){

  menuScreen.style.display = "none";

  document.getElementById("hinessGame").style.display = "block";

  startHiness();
}

/* =======================================================
   CINO RIDER GAME
======================================================= */

const cinoCanvas = document.getElementById("cinoCanvas");
const cinoCtx = cinoCanvas.getContext("2d");

cinoCanvas.width = window.innerWidth;
cinoCanvas.height = window.innerHeight;

const fascinoImg = new Image();
fascinoImg.src = "assets/fascino.png";

const roadImg = new Image();
roadImg.src = "assets/road.png";

const heartImg = new Image();
heartImg.src = "assets/heart.png";

let player = {
  x: window.innerWidth / 2 - 40,
  y: window.innerHeight - 180,
  width: 80,
  height: 120
};

let hearts = [];

let score = 0;

function createHeart(){

  hearts.push({
    x: Math.random() * (window.innerWidth - 50),
    y: -60,
    width: 45,
    height: 45
  });
}

setInterval(createHeart, 1200);

function startCino(){

  function gameLoop(){

    cinoCtx.clearRect(
      0,
      0,
      cinoCanvas.width,
      cinoCanvas.height
    );

    cinoCtx.drawImage(
      roadImg,
      0,
      0,
      cinoCanvas.width,
      cinoCanvas.height
    );

    cinoCtx.drawImage(
      fascinoImg,
      player.x,
      player.y,
      player.width,
      player.height
    );

    hearts.forEach((heart,index)=>{

      heart.y += 5;

      cinoCtx.drawImage(
        heartImg,
        heart.x,
        heart.y,
        heart.width,
        heart.height
      );

      if(
        heart.x < player.x + player.width &&
        heart.x + heart.width > player.x &&
        heart.y < player.y + player.height &&
        heart.y + heart.height > player.y
      ){

        hearts.splice(index,1);

        score++;

        document.getElementById("score").innerText = score;

        playCollectSound();
      }

      if(heart.y > window.innerHeight){

        hearts.splice(index,1);
      }
    });

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

/* TOUCH CONTROLS */

window.addEventListener("touchmove",(e)=>{

  const touchX = e.touches[0].clientX;

  player.x = touchX - 40;

});

/* =======================================================
   HINESS RIDER GAME
======================================================= */

const hinessCanvas = document.getElementById("hinessCanvas");
const hinessCtx = hinessCanvas.getContext("2d");

hinessCanvas.width = window.innerWidth;
hinessCanvas.height = window.innerHeight;

const hinessImg = new Image();
hinessImg.src = "assets/hiness.png";

const curveRoadImg = new Image();
curveRoadImg.src = "assets/curve-road.png";

const carImg = new Image();
carImg.src = "assets/car.png";

const bikeImg = new Image();
bikeImg.src = "assets/bike.png";

let rider = {
  x: window.innerWidth / 2 - 45,
  y: window.innerHeight - 200,
  width: 90,
  height: 130
};

let traffic = [];

let distance = 0;

function createTraffic(){

  const randomVehicle =
    Math.random() > 0.5 ? carImg : bikeImg;

  traffic.push({
    img: randomVehicle,
    x: Math.random() * (window.innerWidth - 80),
    y: -150,
    width: 80,
    height: 120
  });
}

setInterval(createTraffic, 1500);

function startHiness(){

  function gameLoop(){

    hinessCtx.clearRect(
      0,
      0,
      hinessCanvas.width,
      hinessCanvas.height
    );

    hinessCtx.drawImage(
      curveRoadImg,
      0,
      0,
      hinessCanvas.width,
      hinessCanvas.height
    );

    hinessCtx.drawImage(
      hinessImg,
      rider.x,
      rider.y,
      rider.width,
      rider.height
    );

    traffic.forEach((vehicle,index)=>{

      vehicle.y += 8;

      hinessCtx.drawImage(
        vehicle.img,
        vehicle.x,
        vehicle.y,
        vehicle.width,
        vehicle.height
      );

      if(
        vehicle.x < rider.x + rider.width &&
        vehicle.x + vehicle.width > rider.x &&
        vehicle.y < rider.y + rider.height &&
        vehicle.y + vehicle.height > rider.y
      ){

        playCrashSound();

        alert("Crash! Game Over");

        location.reload();
      }

      if(vehicle.y > window.innerHeight){

        traffic.splice(index,1);

        distance++;

        document.getElementById("distance").innerText =
          distance;
      }
    });

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

/* TOUCH CONTROLS */

window.addEventListener("touchmove",(e)=>{

  const touchX = e.touches[0].clientX;

  rider.x = touchX - 45;

});
