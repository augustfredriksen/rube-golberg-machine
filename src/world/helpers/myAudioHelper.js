import * as THREE from "three";
import { g_camera } from "./myThreeHelper";

export function initializeBoing() {
	const listener = new THREE.AudioListener();
	g_camera.add(listener);
	const sound = new THREE.Audio(listener);
	const loader = new THREE.AudioLoader();
	loader.load('assets/sounds/Boing.mp3', (buffer) => {
		sound.setBuffer(buffer);
		sound.setVolume(.5);
		sound.play();
	})
}

export function intializeDomino() {
	const listener = new THREE.AudioListener();
	g_camera.add(listener);
	const sound = new THREE.Audio(listener);
	const loader = new THREE.AudioLoader();
	loader.load('assets/sounds/clack.mp3', (buffer) => {
		sound.duration = 1;
		sound.setBuffer(buffer);
		sound.setVolume(.5);
		sound.play();
	})
}

export function intializeGolfSwing() {
	const listener = new THREE.AudioListener();
	g_camera.add(listener);
	const sound = new THREE.Audio(listener);
	const loader = new THREE.AudioLoader();
	loader.load('assets/sounds/golf.mp3', (buffer) => {
		sound.duration = 1;
		sound.setBuffer(buffer);
		sound.setVolume(.5);
		sound.play();
	})
}

export function intializeBing() {
	const listener = new THREE.AudioListener();
	g_camera.add(listener);
	const sound = new THREE.Audio(listener);
	const loader = new THREE.AudioLoader();
	loader.load('assets/sounds/bing.mp3', (buffer) => {
		sound.duration = 1;
		sound.setBuffer(buffer);
		sound.setVolume(.5);
		sound.play();
	})
}

export function intializeButton() {
	const listener = new THREE.AudioListener();
	g_camera.add(listener);
	const sound = new THREE.Audio(listener);
	const loader = new THREE.AudioLoader();
	loader.load('assets/sounds/button.mp3', (buffer) => {
		sound.duration = 1;
		sound.setBuffer(buffer);
		sound.setVolume(.5);
		sound.play();
	})
}

export function intializeDrop() {
	const listener = new THREE.AudioListener();
	g_camera.add(listener);
	const sound = new THREE.Audio(listener);
	const loader = new THREE.AudioLoader();
	loader.load('assets/sounds/drop.mp3', (buffer) => {
		sound.duration = 1;
		sound.setBuffer(buffer);
		sound.setVolume(.5);
		sound.play();
	})
}

export function intializeSpringBoard() {
	const listener = new THREE.AudioListener();
	g_camera.add(listener);
	const sound = new THREE.Audio(listener);
	const loader = new THREE.AudioLoader();
	loader.load('assets/sounds/springboard.mp3', (buffer) => {
		sound.duration = 1;
		sound.setBuffer(buffer);
		sound.setVolume(.5);
		sound.play();
	})
}

export function intializeSwingBall() {
	const listener = new THREE.AudioListener();
	g_camera.add(listener);
	const sound = new THREE.Audio(listener);
	const loader = new THREE.AudioLoader();
	loader.load('assets/sounds/swingball.mp3', (buffer) => {
		sound.duration = 1;
		sound.setBuffer(buffer);
		sound.setVolume(.5);
		sound.play();
	})
}

export function intializeCar() {
	const listener = new THREE.AudioListener();
	g_camera.add(listener);
	const sound = new THREE.Audio(listener);
	const loader = new THREE.AudioLoader();
	loader.load('assets/sounds/car.mp3', (buffer) => {
		sound.setBuffer(buffer);
		sound.setVolume(.5);
		sound.play();
	})
}

export function intializeSwingDoor() {
	const listener = new THREE.AudioListener();
	g_camera.add(listener);
	const sound = new THREE.Audio(listener);
	const loader = new THREE.AudioLoader();
	loader.load('assets/sounds/swingdoor.mp3', (buffer) => {
		sound.setBuffer(buffer);
		sound.setVolume(.5);
		sound.play();
	})
}