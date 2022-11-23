/*
Denne koden er basert på kodeeksempel ammoShapes2/myThreeHelper.js
https://source.coderefinery.org/3d/threejs_std/-/blob/main/src/del4/ammoShapes2/myThreeHelper.js
*/

import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export let g_scene, g_renderer, g_camera, g_controls, g_lilGui, g_store, g_sounds;


export function createThreeScene() {
	const canvas = document.createElement("canvas");
	document.body.appendChild(canvas);

	// Renderer:
	g_renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
	g_renderer.setSize(window.innerWidth, window.innerHeight);
	g_renderer.setClearColor(0xbfd104, 0xff); //farge, alphaverdi.
	g_renderer.shadowMap.enabled = true; //NB!
	g_renderer.shadowMapSoft = true;
	g_renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap;

	// Scene
	g_scene = new THREE.Scene();
	g_scene.background = new THREE.Color(0xdddddd);

	// lil-gui kontroller:
	g_lilGui = new GUI();

	// Sceneobjekter
	//await addSceneObjects();
	addLights();

	// Kamera:
	g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
	g_camera.position.x = 30;
	g_camera.position.y = 15;
	g_camera.position.z = -25;

	// TrackballControls:
	g_controls = new OrbitControls(g_camera, g_renderer.domElement);
	g_controls.target = new THREE.Vector3(0, 10, -25);
	g_controls.addEventListener("change", renderScene);

}

export function addLights() {
	// Ambient:
	let ambientLight1 = new THREE.HemisphereLight(0xdddddd, 0xa8a8f8, 0.7);
	ambientLight1.visible = true;
	g_scene.add(ambientLight1);
	const ambientFolder = g_lilGui.addFolder("Ambient Light");
	ambientFolder.add(ambientLight1, "visible").name("On/Off");
	ambientFolder.add(ambientLight1, "intensity").min(0).max(1).step(0.01).name("Intensity");
	ambientFolder.addColor(ambientLight1, "color").name("Color");

	//** RETNINGSORIENTERT LYS (som gir skygge):
	let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.visible = true;
	directionalLight.position.set(0, 105, 0);
	// Viser lyskilden:
	const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 10, 0xff0000);
	directionalLightHelper.visible = true;
	g_scene.add(directionalLightHelper);
	directionalLight.castShadow = true; //Merk!
	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;
	directionalLight.shadow.camera.near = 5;
	directionalLight.shadow.camera.far = 110;
	directionalLight.shadow.camera.left = -50;
	directionalLight.shadow.camera.right = 50;
	directionalLight.shadow.camera.top = 50;
	directionalLight.shadow.camera.bottom = -50;
	g_scene.add(directionalLight);
	// Viser lyskildekamera (hva lyskilden "ser")
	const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
	directionalLightCameraHelper.visible = true;

	g_scene.add(directionalLightCameraHelper);

	//lil-gui:
	const directionalFolder = g_lilGui.addFolder("Directional Light");
	directionalFolder.add(directionalLight, "visible").name("On/Off");
	directionalFolder.add(directionalLight, "intensity").min(0).max(1).step(0.01).name("Intensity");
	directionalFolder.addColor(directionalLight, "color").name("Color");
}

//Sjekker tastaturet:
export function handleKeys(delta, g_currentlyPressedKeys) {

}

export function onWindowResize() {
	g_camera.aspect = window.innerWidth / window.innerHeight;
	g_camera.updateProjectionMatrix();
	g_renderer.setSize(window.innerWidth, window.innerHeight);
	g_controls.handleResize();
	renderScene();
}

export function updateThree(deltaTime) {
	//Oppdater trackball-kontrollen:
	g_controls.update();
}

export function addMeshToScene(mesh) {
	g_scene.add(mesh);
}

export function getMeshName(name) {
	g_scene.getObjectByName(name);
}

export function renderScene() {
	g_renderer.render(g_scene, g_camera);
}

export async function getRigidBodyFromMesh(meshName) {
	const mesh = g_scene.getObjectByName(meshName);
	if (mesh) return mesh.userData.physicsBody;
	else return null;
}

export function initializeBoing() {
	const listener = new THREE.AudioListener();
	g_camera.add(listener);
	const sound = new THREE.Audio(listener);
	const loader = new THREE.AudioLoader();
	loader.load('assets/sounds/Boing.mp3', (buffer) => {
		sound.offset = 0;
		sound.duration = .5;
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

export function addLineBetweenObjects(nameMeshStart, nameMeshEnd) {
	let lineMeshStartPosition = g_scene.getObjectByName(nameMeshStart, true);
	let lineMeshEndPosition = g_scene.getObjectByName(nameMeshEnd, true);

	// Wire / Line:
	// Definerer Line-meshet (beståemde av to punkter):
	const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
	const points = [];
	// Finner start- og endepunktmesh:
	const startPoint = new THREE.Vector3();
	const endPoint = new THREE.Vector3();
	// NB! Bruker world-position:
	lineMeshStartPosition.getWorldPosition(startPoint);
	lineMeshEndPosition.getWorldPosition(endPoint);
	points.push(startPoint);
	points.push(endPoint);
	const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
	const springLineMesh = new THREE.Line( lineGeometry, lineMaterial );
	springLineMesh.name = "springLineMesh";
	// NB! Linemeshet legges til scene-objektet.
	addMeshToScene(springLineMesh);
}
