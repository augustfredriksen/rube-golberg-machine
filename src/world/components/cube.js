import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";

export function createAmmoCube(rotation={x: 0, y: 0, z: 0}, position= {x: 0, y: 1.5, z: 0}) {
	const mass=0;
    const width = 1;
    const length =0.1;
    const depth = 5;
	// THREE:
	let geometry = new THREE.BoxGeometry( width, length, depth, 1, 1 );
	let material = new THREE.MeshStandardMaterial( { color: colorScheme.blue, side: THREE.DoubleSide } );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
	mesh.name = 'cube';

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(width/2, length/2, depth/2));
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 1, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}