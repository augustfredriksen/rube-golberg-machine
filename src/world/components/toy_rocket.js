import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";

export function createAmmoRocket(rotation={x: 0, y: 0, z: 0}, position= {x: 10, y: 2, z: -22}) {
	const mass=15;
    const width = 1;
    const height =2;
    const depth = 1;
	// THREE:
	let geometry = new THREE.BoxGeometry( width, height, depth );
	let material = new THREE.MeshStandardMaterial( { color: colorScheme.yellow, side: THREE.DoubleSide } );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
    mesh.castShadow = true;
	mesh.name = 'rocket';

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(width/2, height/2, depth/2));
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 1, position, mass);

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