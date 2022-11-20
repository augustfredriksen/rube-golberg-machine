import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";


export function createTorus(rotation={x: 0, y: 0, z: 0}, position= {x: 0, y: 0, z: 0}) {
    const radius = .6;
    const tube = radius/3;
    let geometry = new THREE.TorusGeometry(radius, tube, 64, 64);
	let material = new THREE.MeshStandardMaterial( { color: colorScheme.yellow, side: THREE.DoubleSide } );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
    mesh.castShadow = true;
	mesh.name = 'torus';

	addMeshToScene(mesh);
}