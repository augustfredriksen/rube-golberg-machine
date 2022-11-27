import "../style.css";
import * as THREE from "three";
import { Vector3 } from "three";

import { addLineBetweenObjects, createThreeScene, getRigidBodyFromMesh, g_audio, handleKeys, onWindowResize, renderScene, updateThree } from "./helpers/myThreeHelper.js";

import { createAmmoWorld, updatePhysics } from "./helpers/myAmmoHelper.js";
import { createAmmoXZPlane, createPlaneTriangleMesh} from "./components/plane";
import { createGolfCourseTriangleMesh} from "./components/golfCourse1"
import { createAmmoGolfBall } from "./components/golf_ball";
import { createAmmoGolfClub, createHingedArm, secondFunction } from "./components/golf_club";
import { createAmmoDomino, createMultipleDominos, createOppositeTriangleDominos, createFullCircleDomino, createTriangleDominos, createHalfCircleDominoZ, createInverseHalfCircleDominoZ } from "./components/domino";
import { createAmmoGolfCart, createGolfCartTriangleMesh } from "./components/golf_cart";
import { createGolfCourse2 } from "./components/golfCourse2";
import { create6DofSphere, createHingedSphere, createSwingTriangleMesh } from "./components/swing";
import { createAmmoRamp } from "./components/ramp";
import { createFlipper, createFlipper2, createSeesaw } from "./components/flipper";
import { createAmmoSeesaw } from "./components/seesaw";
import { createTrapDoorTriangleMesh } from "./components/trapDoor";
import { createTrapDoorCube } from "./components/trapDoorCube";
import { createAmmoSpringBoard } from "./components/springBoard";
import { initializeBoing } from "./helpers/myAudioHelper";
import { createBoxTriangleMesh, createMultipleBoxes, createMultipleBoxesX, createMultipleBoxesY } from "./components/boxMaker";
import { createGolfPlane } from "./components/golfPlane";
import { createSkyBox } from "./components/skyBox";
import { createGoalTriangleMesh } from "./components/goal";
import { createCustomThing } from "./components/finish";

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
    await createGoalTriangleMesh();
    await createSkyBox();
    await createGolfCourseTriangleMesh();
    createGolfPlane();
    createAmmoXZPlane();
    await secondFunction();
    createAmmoGolfBall();
    await createSwingTriangleMesh();
    await createHingedSphere();
    createAmmoSpringBoard();

    await createAmmoGolfCart();
    createAmmoRamp(
        1,
        0.1,
        3,
        0,
        {x: -Math.PI/10, y: 0, z: 0},
        {x: 0, y: 7, z: -36}
    )
    createAmmoRamp(
        2,
        0.1,
        4,
        0,
        {x: -Math.PI/10, y: 0, z: 0},
        {x: 10, y: 1.5, z: -15}
    )

    createFlipper({x: 12, y: 1.7, z:-22});
    //createAmmoCube();
    createMultipleDominos(35, {x: 14, y: 1.1, z: -22});
    createHalfCircleDominoZ(4, 40, 10, -5);
    createMultipleDominos(60, {x: 6, y: 1.2, z: -34.8});
    createInverseHalfCircleDominoZ(2, 20, 8, 35);
    //createTrapDoorCube();

    //g_audio.play();
    createAmmoSeesaw();
    createGolfCourse2();
    createMultipleDominos(21, {x: 10, y: 1.2, z: -34.8});
    
    
    await createTrapDoorTriangleMesh();

	createMultipleBoxesX(4, 8, {x: 10.5, y: 1.2, z: -6});


	
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
