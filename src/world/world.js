import "../style.css";
import * as THREE from "three";
import { Vector3 } from "three";

import { addLineBetweenObjects, createThreeScene, getRigidBodyFromMesh, handleKeys, onWindowResize, renderScene, updateThree } from "./helpers/myThreeHelper.js";

import { createAmmoWorld, updatePhysics } from "./helpers/myAmmoHelper.js";
import { createAmmoXZPlane} from "./components/plane";
import { createGolfCourse} from "./components/golfCourse1"
import { createAmmoGolfBall } from "./components/golf_ball";
import { createAmmoCube } from "./components/cube";
import { createAmmoGolfClub, createHingedArm, secondFunction } from "./components/golf_club";
import { createAmmoDomino, createMultipleDominos, createOppositeTriangleDominos, createRotatedDomino, createTriangleDominos } from "./components/domino";
import { createAmmoGolfCart } from "./components/golf_cart";
import { createGolfCourse2 } from "./components/golfCourse2";
import { create6DofSphere, createHingedSphere, createSwingTriangleMesh } from "./components/swing";

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

async function addAmmoSceneObjects() {
    createAmmoXZPlane();
	createGolfCourse();
    createGolfCourse2();
    createAmmoGolfBall();
    secondFunction();
    await createHingedSphere();
    await createSwingTriangleMesh();
    //createAmmoCube();
    createMultipleDominos(14);
    createMultipleDominos(12, {x: 1.25, y: 7.5, z: -30})
    createMultipleDominos(12, {x: -1.25, y: 7.5, z: -30})
    //createRotatedDomino(60, 360, 0, -10);
    createTriangleDominos(3, {x: 0, y: 7.5, z: -32.5})
    createOppositeTriangleDominos(3, {x: 0, y: 7.5, z: -23})
    createMultipleDominos(12, {x: 0, y: 7.5, z: -23})

    //createAmmoGolfCart();
	
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
