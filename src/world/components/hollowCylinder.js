import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";

export function createAmmoHollowCylinder(rotation={x: Math.PI/2, y: Math.PI/2, z: 0}, position= {x: 1, y: 1.5, z: -12}) {
	const mass=10;
    const radius = 0.1*mass;
	// THREE:
	let geometry = new THREE.CylinderGeometry( radius, radius, 5, 32, 32, true, 0, Math.PI );
	let material = new THREE.MeshStandardMaterial( { color: colorScheme.blue, side: THREE.DoubleSide } );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
	mesh.name = 'hollowCylinder';
    addMeshToScene(mesh);
}