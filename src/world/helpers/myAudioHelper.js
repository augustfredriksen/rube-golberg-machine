import * as THREE from "three";
import { checked } from "../../script";
import { g_camera } from "./myThreeHelper";

export function initializeBoing() {
	if(checked) {
	const listener = new THREE.AudioListener();
	g_camera.add(listener);
	const sound = new THREE.Audio(listener);
	const loader = new THREE.AudioLoader();
	loader.load('assets/sounds/Boing.mp3', (buffer) => {
        sound.duration = 20;
		sound.setBuffer(buffer);
		sound.setVolume(.5);
		sound.play();
	})
	}
}

export function intializeDomino() {
	if(checked) {
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
}

export function intializeGolfSwing() {
	if(checked) {
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
}

export function intializeBing() {
	if(checked) {
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
}

export function intializeButton() {
	if(checked) {
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
}

export function intializeDrop() {
	if(checked) {
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
}

export function intializeSpringBoard() {
	if(checked) {
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
}

export function intializeSwingBall() {
	if(checked) {
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
}

export function intializeCar() {
	if(checked) {
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
}

export function intializeSwingDoor() {
	if(checked) {
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
}

export function intializeBrick() {
	if(checked) {
		const listener = new THREE.AudioListener();
		g_camera.add(listener);
		const sound = new THREE.Audio(listener);
		const loader = new THREE.AudioLoader();
		loader.load('assets/sounds/brick.mp3', (buffer) => {
			sound.setBuffer(buffer);
			sound.setVolume(.10);
			sound.play();
		})
	}
}