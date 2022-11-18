import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";

export function createAmmoXZPlane(
	rotation={x: 0, y: 0, z: 0},
	position= {x: 0, y: 0, z: -22},
	width = 50,
	length = 10,
	depth = 2
	 ) {
	const mass=0;
	// THREE:
	let geometry = new THREE.BoxGeometry( length, depth, width, 1, 1 );
	let material = new THREE.MeshStandardMaterial( { color: 0xA8A8F8, side: THREE.DoubleSide } );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
	mesh.name = 'xzplane';

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(length/2, depth/2, width/2));
	//shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		1,
        1 | 1 | 1);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}

export function createWalls() {
	createAmmoXZPlane(
		{x: 0, y: 0, z: Math.PI/2},
		{x: 5, y: 1, z: -22},
		50, 2, 1
		);
	createAmmoXZPlane(
		{x: 0, y: 0, z: Math.PI/2},
		{x: -5, y: 1, z: -22},
		50, 2, 1
		);
}