import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { createMaterials } from "../helpers/materials.js";

export async function createAmmoRamp(
	width,
	length,
	depth,
	mass,
	rotation = { x: Math.PI / 10, y: 0, z: 0 },
	position = { x: 0, y: 2, z: -40 }
) {
	let materials = await createMaterials();
	let geometry = new THREE.BoxGeometry(width, length, depth);
	let mesh = new THREE.Mesh(geometry, materials.basicMaterial);
	mesh.position.set(position.x, position.y, position.z);
	mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
	mesh.castShadow = true;
	mesh.name = "ramp";
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(width / 2, length / 2, depth / 2));
	shape.setMargin(0.05);
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.1, 0.1, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(rigidBody);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}
