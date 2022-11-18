import "../style.css";
import * as THREE from "three";
import { Vector3 } from "three";

import { createThreeScene, getRigidBodyFromMesh, handleKeys, onWindowResize, renderScene, updateThree } from "./helpers/myThreeHelper.js";

import { createAmmoWorld, updatePhysics } from "./helpers/myAmmoHelper.js";
import { createAmmoXZPlane, createWalls } from "./components/plane";
import { createAmmoGolfBall } from "./components/golf_ball";
import { createAmmoCube } from "./components/cube";
import { createAmmoGolfClub, createHingedArm, secondFunction } from "./components/golf_club";
import { createAmmoDomino } from "./components/domino";

//Globale variabler:
let g_clock;
const g_currentlyPressedKeys = [];

export async function main() {
	//Input - standard Javascript / WebGL:
	document.addEventListener("keyup", handleKeyUp, false);
	document.addEventListener("keydown", handleKeyDown, false);

	// three:
	createThreeScene();
	// ammo
	createAmmoWorld(true); //<<=== MERK!
	// three/ammo-objekter:
	addAmmoSceneObjects();

	// Klokke for animasjon
	g_clock = new THREE.Clock();

	//Håndterer endring av vindusstørrelse:
	window.addEventListener("resize", onWindowResize, false);
	//Input - standard Javascript / WebGL:
	document.addEventListener("keyup", handleKeyUp, false);
	document.addEventListener("keydown", handleKeyDown, false);

	// Start animasjonsløkka:
	animate(0);
}

function handleKeyUp(event) {
	g_currentlyPressedKeys[event.code] = false;
}

function handleKeyDown(event) {
	g_currentlyPressedKeys[event.code] = true;
}

function addAmmoSceneObjects() {
    createAmmoXZPlane();
	createWalls(1, 1, 1);
    createAmmoGolfBall();
    secondFunction();
    createAmmoCube();
	for(let i = 0; i < 25; i++) {
		createAmmoDomino(
			{x: 0, y: 0, z: 0},
			{x: -2, y: 0, z: -12 -i});
	}
	for(let i = 25; i >= 0; i--) {
		createAmmoDomino(
			{x: 0, y: -Math.PI/8 - i*0.1, z: 0},
			{x: -2 + (i + 1 * Math.cos(2*Math.PI * i / 10))*0.2, y: 0, z: -37 -(i + 1 * Math.sin(2 * Math.PI * i / 10))*0.8});
	}
	
}
function animate(currentTime, myThreeScene, myAmmoPhysicsWorld) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime, myThreeScene, myAmmoPhysicsWorld);
	});
	let deltaTime = g_clock.getDelta();


	//Oppdaterer grafikken:
	updateThree(deltaTime);
	//Oppdaterer fysikken:
	updatePhysics(deltaTime);
	//Sjekker input:
	handleKeys(deltaTime, g_currentlyPressedKeys);

	//Tegner scenen med gitt kamera:
	renderScene();
}
