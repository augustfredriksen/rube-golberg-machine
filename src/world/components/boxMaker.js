import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";
import { intializeDomino } from "../helpers/myAudioHelper.js";

export function createAmmoBox(rotation = {x: 0, y: 0, z: 0}, position= {x: 0, y: 0, z: 0}) {
    let hasCollided = false;
	const mass=0.5;
    const width = 2 + Math.random()*1 - 0.5;
    const height = 0.65;
    const depth = 1.5;
	// THREE:
    const loader = new THREE.TextureLoader();
    const texture = loader.load("assets/textures/bricks.jpg");
    const normalTexture = loader.load("assets/textures/bricks_normalmap.jpg")
	let geometry = new THREE.BoxGeometry( width, height, depth, 1, 1 );
	let material = new THREE.MeshStandardMaterial( { map: texture } );
    material.normalMap = normalTexture;
	let mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.position.set(position.x, position.y, position.z);

	mesh.receiveShadow = true;
    mesh.castShadow = true;
	mesh.name = 'domino';

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(width/2, height/2, depth/2));
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, .1, .6, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody);

	addMeshToScene(mesh);

    mesh.collisionResponse = (mesh1) => {
        if(!hasCollided) {
            intializeDomino();
            rigidBody.setGravity(new Ammo.btVector3(0, -(9.80665*2), 0))
            hasCollided = true;
        }
    }
    
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
    rigidBody.setGravity(new Ammo.btVector3(0, -(9.80665*3), 0))
}

export function createMultipleBoxesX(steps, position={x: 11, y: 2, z: -22}) {
    for (let i = 0; i < steps; i++) {
        createAmmoBox(
            {x: 0, y: 0, z: 0},
            {x: position.x + i*2.16, y: position.y, z: position.z}
            )};
}

export function createMultipleBoxesY(steps, position={x: 11, y: 2, z: -22}) {
    for (let i = 0; i < steps; i++) {
        createMultipleBoxesX(4, {x: 7+Math.random()*1 - .5, y: position.y + i*0.7, z: position.z})
}
}