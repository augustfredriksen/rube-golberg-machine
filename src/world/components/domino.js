import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";

export function createAmmoDomino(rotation = {x: 0, y: 0, z: 0}, position= {x: 0, y: 0, z: 0}) {
	const mass=2;
    const width = mass*0.4;
    const height = mass*0.8;
    const depth = mass*0.1;
	// THREE:
	let geometry = new THREE.BoxGeometry( width, height, depth, 1, 1 );
	let material = new THREE.MeshStandardMaterial( { color: "darkslategray", side: THREE.DoubleSide } );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.position.set(position.x, position.y, position.z);
    mesh.collisionResponse = (mesh1) => {
		mesh1.material.color.setHex(0xFF0000);
	};

	mesh.receiveShadow = true;
    mesh.castShadow = true;
	mesh.name = 'domino';

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(width/2, height/2, depth/2));
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, .1, .5, position, mass);

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