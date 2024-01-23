<template>
  <div>
    <button @click="shot_botton" class="round-button">発射</button>
    <p class="timer">残り時間: {{ remainingTime }}秒</p>

    <div>

<canvas id="canvas"></canvas>
<div id="joystick" class="joystick">
  <div id="joystick-frame" class="joystick-frame">
    <div id="joystick-ball" class="joystick-ball"></div>
  </div>
</div>
</div>
</div>
  
</template>

<style scoped>
.round-button {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  position: absolute;
  top: 5vh; /*top, bottom, left, right で変更可能*/ 
  right: 10vw; 
  font-size: 24px; /* 文字の大きさを変更するスタイル */
  
}

.timer {
  position: absolute;
  top: 0vh;
  left: 50vw;
  transform: translateX(-50%);
  white-space: nowrap; /* 改行を無視して横に表示するスタイル */
  font-size: 24px; /* 文字の大きさを変更するスタイル */
}

.arrow-keys {
  position: absolute;
  top: 40px;
  left: 90px;
}

.arrow-up, .arrow-down, .arrow-left, .arrow-right {
  width: 0;
  height: 0;
  border-style: solid;
  display: inline-block;
  
 
}

.arrow-up {
  border-width: 0 50px 85px 50px;
  border-color: transparent transparent #007bff transparent;
  cursor: pointer;
  position: absolute;
  top: 415px; /* 位置を変更 */
  left: 80px; /* 位置を変更 */
  
}

.arrow-down {
  border-width: 85px 50px 0 50px;
  border-color: #007bff transparent transparent transparent;
  cursor: pointer;
  position: absolute;
  top: 600px; /* 位置を変更 */
  left: 80px; /* 位置を変更 */
  
}

.arrow-left {
  border-width: 50px 85px 50px 0;
  border-color: transparent #007bff transparent transparent;
  cursor: pointer;
  position: absolute;
  top: 500px; /* 位置を変更 */
  left: -5px; /* 位置を変更 */
  
}

.arrow-right {
  border-width: 50px 0 50px 85px;
  border-color: transparent transparent transparent #007bff;
  cursor: pointer;
  position: absolute;
  top: 500px; /* 位置を変更 */
  left: 180px; /* 位置を変更 */
  
}

.joystick {
      position: absolute;
      bottom: 10vw;
      left: 20vw;
      transform: translateX(-50%);
      z-index: 10;
    }
    .joystick-frame {
      width: 130px;
      height: 130px;
      border-radius: 100rem;
      border: 2px white solid;
      position: relative;
    }
    .joystick-ball {
      width: 60px;
      height: 60px;
      background: white;
      border-radius: 100rem;
      border: 2px white solid;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
</style>

<script setup lang="ts">

import { useAREngine } from './AREngine';
import { shot } from './scene';
import { onMounted, ref, watchEffect } from 'vue';
import { group } from './AREngine'; 
import { Move } from './game';
import * as THREE from 'three';
import {reactive} from "vue";

const moveInstance = new Move();

//AR_Mizurockより移植



let canvas: HTMLCanvasElement | null = null; // 初期値を null に設定
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let model: THREE.Mesh;
  let joystickBall: HTMLElement;
  let vectorMagnitude = 0;
  let updateRequestId: number;
  let joystickCenterX: number;
  let joystickCenterY: number;
  let joystickLimitNumber = 35;

  
onMounted(() => {
    init();
  });
  
  const init = (): void => {
    setUpScene();
    bindEvents();
    setupJoystick();
  };
  
  const setupJoystick = (): void => {
    joystickBall = document.getElementById("joystick-ball")!;
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
  
    if (joystickBall && canvas) {
      joystickCenterX =
        joystickBall.getBoundingClientRect().left + joystickBall.clientWidth / 2;
      joystickCenterY =
        joystickBall.getBoundingClientRect().top + joystickBall.clientHeight / 2;
      joystickBall.addEventListener("touchstart", dragStart);
      joystickBall.addEventListener("touchmove", dragMove);
      joystickBall.addEventListener("touchend", dragLeave);
    } else {
      console.error("Joystick ball or canvas not found");
    }
  };
  
  const dragStart = (): void => {
    if (!group) return;
    dragUpdate();
  };
  
  const dragUpdate = (): void => {
    if (vectorMagnitude !== 0) {
      group.translateZ(vectorMagnitude / 100000);
    }
    updateRequestId = requestAnimationFrame(dragUpdate);
  };
  
  const dragMove = (event: TouchEvent): void => {
    event.preventDefault();
  
    const pageX = event.touches[0].pageX;
    const pageY = event.touches[0].pageY;
  
    let touchX =
      Math.abs(pageX - joystickCenterX) < joystickLimitNumber
        ? pageX - joystickCenterX
        : pageX - joystickCenterX > 0
        ? joystickLimitNumber
        : -joystickLimitNumber;
  
    let touchY =
      Math.abs(pageY - joystickCenterY) < joystickLimitNumber
        ? pageY - joystickCenterY
        : pageY - joystickCenterY > 0
        ? joystickLimitNumber
        : -joystickLimitNumber;
  
    const vector2d = new THREE.Vector2(touchX, touchY);
  
    vectorMagnitude = vector2d.x * vector2d.x + vector2d.y * vector2d.y;
  
    const vector3d = new THREE.Vector3(vector2d.x * 1000, 0, vector2d.y * 1000);
    group.lookAt(vector3d);
  
    joystickBall.style.left = `calc(50% + ${touchX}px)`;
    joystickBall.style.top = `calc(50% + ${touchY}px)`;
  };
  
  const dragLeave = (): void => {
    joystickBall.style.top = "50%";
    joystickBall.style.left = "50%";
    cancelAnimationFrame(updateRequestId);
    vectorMagnitude = 0;
  };
  
  const setUpScene = (): void => {
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    setScene();
    //setCamera();
    setObjects();
    setLights();
    setRenderer();
  };
  
  const setScene = (): void => {
    scene = new THREE.Scene();
  };
  
  const setCamera = (): void => {
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 8, 8);
    camera.lookAt(new THREE.Vector3());
  };


  
  const setObjects = (): void => {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshPhongMaterial({ color: 0x7140ce });
  
    //model = new THREE.Mesh(geo, mat);
    //model.rotation.y = THREE.MathUtils.degToRad(45);
    //scene.add(model);
  };
  
  const setLights = (): void => {
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.5);
    frontLight.position.set(1, 10, 20);
    scene.add(frontLight);
    const backLight = new THREE.DirectionalLight(0xffffff, 0.2);
    backLight.position.set(-1, 10, -10);
    scene.add(backLight);
  };
  
  const setRenderer = (): void => {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas ?? undefined
    });
    renderer.setClearColor(0x8cafea);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setAnimationLoop(() => {
      renderStage();
    });
  };
  
  const renderStage = (): void => {
    renderer.render(scene, camera);
  };
  
  const bindEvents = (): void => {
    window.addEventListener("resize", () => {
      onResize();
    });
  };
  
  const onResize = (): void => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    joystickCenterX =
      joystickBall.getBoundingClientRect().left + joystickBall.clientWidth / 2;
    joystickCenterY =
      joystickBall.getBoundingClientRect().top + joystickBall.clientHeight / 2;
  };





//ここまで

/*
const moveUp = () => {
  // 上矢印がクリックされたときに Move クラスのメソッドを呼び出す
  moveInstance.moveUp();
};

const moveDown = () => {
  // 下矢印がクリックされたときに Move クラスのメソッドを呼び出す
  moveInstance.moveDown();
};

const moveLeft = () => {
  // 左矢印がクリックされたときに Move クラスのメソッドを呼び出す
  moveInstance.moveLeft();
};

const moveRight = () => {
  // 右矢印がクリックされたときに Move クラスのメソッドを呼び出す
  moveInstance.moveRight();
};
*/

// group へのアクセス
console.log(group.position);

const ar_engine = useAREngine(); // シングルトンを取得

const remainingTime = ref(180); // 初期値を設定（秒）

const shot_botton = () => {
    ar_engine.replaceScene(new shot());
}



// タイマーのカウントダウンロジック
const timerInterval = setInterval(() => {
  if (remainingTime.value <= 0) {
    clearInterval(timerInterval);
    alert('試合終了！');
    remainingTime.value = 180; // タイマーリセット(180秒)
  } else {
    remainingTime.value--;
  }
}, 1000);

// コンポーネントがアンマウントされたらタイマーをクリア
watchEffect(() => {
  return () => {
    clearInterval(timerInterval);
  };
});
</script>
