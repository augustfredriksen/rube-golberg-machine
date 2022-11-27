import * as THREE from "three";
import { addMeshToScene, g_camera } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { intializeSpringBoard } from "../helpers/myAudioHelper.js";
import { createMaterials } from "../helpers/materials.js";

export async function createAmmoSpringBoard(
	width = 1,
	length = 0.1,
	depth = 3,
	mass = 10,
	rotation = { x: 0, y: 0, z: 0 },
	position = { x: 0, y: 7, z: -24.8 }
) {
	let isCollided = false;
	let materials = await createMaterials();
	let sphere = createAmmoSphere({ x: 0, y: 0, z: 0 }, { x: 0, y: 7.4, z: -23.5 }, materials.brickMaterial);
	let sphereRigidBody = sphere.threeMesh.userData.physicsBody;
	let geometry = new THREE.BoxGeometry(width, length, depth);
	let mesh = new THREE.Mesh(geometry, materials.basicMaterial);
	mesh.position.set(position.x, position.y, position.z);
	mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
	mesh.castShadow = true;
	mesh.name = "spring_board";
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(width / 2, length / 2, depth / 2));
	shape.setMargin(0.05);
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.1, 0.1, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(rigidBody);

	mesh.collisionResponse = async (mesh1) => {
		if (!isCollided) {
			intializeSpringBoard();
			sphereRigidBody.setLinearVelocity(new Ammo.btVector3(0, 10, 0));
			isCollided = true;
			setTimeout(() => {
				g_camera.position.x = 35;
			}, 500);
		}
	};

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}

function createAmmoSphere(rotation = { x: 0, y: 0, z: 0 }, position = { x: 0, y: 0, z: 0 }, material) {
	const mass = 2;
	const radius = 0.25;
	// THREE:
	let geometry = new THREE.SphereGeometry(radius);

	let mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(position.x, position.y, position.z);
	mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
	mesh.name = "sphere";

	// AMMO:
	let shape = new Ammo.btSphereShape(radius);
	shape.setMargin(0.05);
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.1, 0.1, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(rigidBody);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
	return rigidBody;
}
