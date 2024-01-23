<template>
  <div>
    <button @click="shot_botton" class="round-button">発射</button>
    <p class="timer">残り時間: {{ remainingTime }}秒</p>
  </div>
      <!-- 十字キー -->
      <div class="arrow-keys">
      <div class="arrow-up" @click="moveUp"></div>
      <div class="arrow-down" @click="moveDown"></div>
      <div class="arrow-left" @click="moveLeft"></div>
      <div class="arrow-right" @click="moveRight"></div>
    </div>
  
</template>

<style scoped>
.round-button {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  position: absolute;
  bottom: 150px; /*top, bottom, left, right で変更可能*/ 
  left: 1100px; 
  font-size: 24px; /* 文字の大きさを変更するスタイル */
  
}

.timer {
  position: absolute;
  top: 30px;
  left: 700px;
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
</style>

<script setup lang="ts">
import { useAREngine } from './AREngine';
import { shot } from './scene';
import { ref, watchEffect } from 'vue';
import { group } from './AREngine'; 
import { Move } from './game';

const moveInstance = new Move();

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

// group へのアクセス
console.log(group.position);

const ar_engine = useAREngine(); // シングルトンを取得

const remainingTime = ref(10); // 初期値を設定（秒）

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
