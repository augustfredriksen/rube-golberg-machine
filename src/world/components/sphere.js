import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";

export function createAmmoSphere(rotation={x: 0, y: 0, z: 0}, position= {x: 0, y: 0, z: 0}) {
	const mass=2;
    const radius = .25;
	// THREE:
	let geometry = new THREE.SphereGeometry( radius );
	let material = new THREE.MeshStandardMaterial( { color: colorScheme.yellow, side: THREE.DoubleSide } );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
	mesh.name = 'sphere';

	// AMMO:
	let shape = new Ammo.btSphereShape(radius);
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.1, .1, position, mass);

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