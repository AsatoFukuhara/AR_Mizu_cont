//画像処理で送られてくるデータを想定
//表示されるglbファイルの位置などを設定している
import * as THREE from 'three';

// オブジェクトごとのサイズ範囲を指定
const stationerySizeRanges: Record<string, { min: number, max: number }> = {
    pen: { min: 2, max: 4 },
    note: { min: 3, max: 6 },
    eraser: { min: 2, max: 3 },
    pen_case: { min:0.2, max:1 },
    ruler: { min:3, max:5 },
    pencil: { min:5, max:7 },
    // 他のオブジェクトに対する範囲を追加
};

let call_Count = 0.1;

export function generateRandomStationeryData() {
    const stationeryList: string[] = 
    [
        'pen', 'note','eraser','pen_case','ruler','pencil'
    ]; // 他のオブジェクトも追加
    const randomIndex: number = Math.floor(Math.random() * stationeryList.length);
    const selectedStationery: string = stationeryList[randomIndex];
    const sizeRange = stationerySizeRanges[selectedStationery];
    if (!sizeRange) {
        console.error('Invalid stationery type:', selectedStationery);
        return null; // またはデフォルトのサイズを指定するなど
    }

    // オブジェクトごとに異なるサイズの範囲からランダムで選ぶ
    const randomSize = Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min;

    // 回数に応じて表示位置をずらす
    const position = new THREE.Vector3(0, call_Count,0);
    call_Count += 0.1;


    // 生成されたランダムな文房具データ
    return {
        objectType: selectedStationery,
        position : position,
        rotation: new THREE.Euler(0, 0, 0),
        scale: new THREE.Vector3(randomSize, randomSize, randomSize),
        
    };
}
