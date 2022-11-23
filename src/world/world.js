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
import { createAmmoDomino, createMultipleDominos, createOppositeTriangleDominos, createFullCircleDomino, createTriangleDominos, createHalfCircleDominoZ, createInverseHalfCircleDominoZ } from "./components/domino";
import { createAmmoGolfCart, createGolfCartTriangleMesh } from "./components/golf_cart";
import { createGolfCourse2 } from "./components/golfCourse2";
import { create6DofSphere, createHingedSphere, createSwingTriangleMesh } from "./components/swing";
import { createAmmoRamp } from "./components/ramp";
import { createFlipper, createFlipper2, createSeesaw } from "./components/flipper";
import { createAmmoSphere } from "./components/sphere";
import { createAmmoSeesaw } from "./components/seesaw";
import { createAmmoToyCar } from "./components/toy_car";
import { createAmmoToySoldier } from "./components/toy_soldier";
import { createAmmoRocket, createAmmoToyRocket } from "./components/toy_rocket";

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
    createAmmoGolfBall();
    secondFunction();
    await createHingedSphere();
    await createSwingTriangleMesh();
    createAmmoGolfCart();
    createAmmoRamp(
        0,
        {x: -Math.PI/10, y: 0, z: 0},
        {x: 0, y: 7, z: -36}
    )
    createAmmoRamp(
        10,
        {x: 0, y: 0, z: 0},
        {x: 0, y: 7, z: -24.8}
    )
    createAmmoSphere(
        {x: 0, y: 0, z: 0},
        {x: 0, y: 7.4, z: -23.5}
    )

    createFlipper({x: 12, y: 1.7, z:-22});
    //createAmmoCube();
    createMultipleDominos(35, {x: 14, y: 2, z: -22});
    createHalfCircleDominoZ(4, 40, 10, -5);
    createMultipleDominos(61, {x: 6, y: 2, z: -34.8});
    createInverseHalfCircleDominoZ(2, 20, 8, 35);
    createMultipleDominos(22, {x: 10, y: 2, z: -34.8});
    createAmmoSeesaw();
	createAmmoRocket();
    createGolfCourse2();


    /* createMultipleDominos(12, {x: 1.25, y: 7.5, z: -30})
    createMultipleDominos(12, {x: -1.25, y: 7.5, z: -30})
    createRotatedDomino(60, 360, 0, -10);
    createTriangleDominos(3, {x: 0, y: 7.5, z: -32.5})
    createOppositeTriangleDominos(3, {x: 0, y: 7.5, z: -23})
    createMultipleDominos(12, {x: 0, y: 7.5, z: -23}) */

	
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
