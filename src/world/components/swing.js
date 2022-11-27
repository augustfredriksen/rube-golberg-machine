import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";
import { createConvexTriangleShapeAddToCompound } from "../helpers/triangleMeshHelper.js";
import { intializeDrop } from "../helpers/myAudioHelper.js";
import { createMaterials } from "../helpers/materials.js";

export async function createHingedSphere() {
	const sphere = createSphere();
	const anchor = createAnchor();

	const anchorPivot = new Ammo.btVector3(0, 0.5, 0);
	const anchorAxis = new Ammo.btVector3(1, 0, 0);
	const armPivot = new Ammo.btVector3(-2, 0, 0);
	const armAxis = new Ammo.btVector3(0, 1, 0);
	const hingeConstraint = new Ammo.btHingeConstraint(
		anchor,
		sphere,
		anchorPivot,
		armPivot,
		anchorAxis,
		armAxis,
		false
	);

	const lowerLimit = -Math.PI;
	const upperLimit = Math.PI;
	const softness = 5;
	const biasFactor = 1;
	const relaxationFactor = 0.1;
	hingeConstraint.setLimit(lowerLimit, upperLimit, softness, biasFactor, relaxationFactor);
	hingeConstraint.enableAngularMotor(true, 0.3, 0.01);
	g_ammoPhysicsWorld.addConstraint(hingeConstraint, true);
}

function createSphere(position = { x: 0, y: 5, z: -40 }) {
	let isCollided = false;
	const radius = 0.2;
	const mass = 0.2;

	//THREE
	const mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 32, 32),
		new THREE.MeshStandardMaterial({ color: colorScheme.gray, transparent: true, opacity: 1 })
	);
	mesh.name = "hinge_sphere";
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1) => {
		if (!isCollided) {
			intializeDrop();
			isCollided = true;
		}
	};
	//AMMO
	const shape = new Ammo.btSphereShape(mesh.geometry.parameters.radius);
	shape.setMargin(0.05);
	const rigidBody = createAmmoRigidBody(shape, mesh, 0.4, 0.6, position, mass);
	mesh.userData.physicsBody = rigidBody;
	g_ammoPhysicsWorld.addRigidBody(rigidBody);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	return rigidBody;
}

function createAnchor(position = { x: 0, y: 5.2, z: -40 }) {
	const radius = 0.2;
	const mass = 0;

	//THREE
	const mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 32, 32),
		new THREE.MeshStandardMaterial({ color: 0xb846db, transparent: true, opacity: 0 })
	);
	mesh.name = "anchor";
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	//AMMO
	const shape = new Ammo.btSphereShape(mesh.geometry.parameters.radius);
	shape.setMargin(0.05);
	const rigidBody = createAmmoRigidBody(shape, mesh, 0.4, 0.6, position, mass);
	mesh.userData.physicsBody = rigidBody;
	g_ammoPhysicsWorld.addRigidBody(rigidBody);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	return rigidBody;
}

export async function createSwingTriangleMesh(position = { x: 2.5, y: 4, z: -40 }) {
	const mass = 0;
	let compoundShape = new Ammo.btCompoundShape();
	let groupMesh = new THREE.Group();
	groupMesh.userData.tag = "swing";
	await createSwingParts(groupMesh, compoundShape);

	let rigidBody = createAmmoRigidBody(compoundShape, groupMesh, 0.4, 0.6, position, mass);
	groupMesh.userData.physicsBody = rigidBody;
	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(rigidBody);

	addMeshToScene(groupMesh);
	g_rigidBodies.push(groupMesh);
	rigidBody.threeMesh = groupMesh;
}

async function createSwingParts(groupMesh, compoundShape) {
	let materials = await createMaterials();
	let pillarDetailGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5);
	let pillarDetailMesh = new THREE.Mesh(pillarDetailGeometry, materials.metalMaterial);
	pillarDetailMesh.receiveShadow = true;
	pillarDetailMesh.castShadow = true;
	pillarDetailMesh.position.y = -1.5;
	groupMesh.add(pillarDetailMesh);

	let pillarDetailMesh2 = pillarDetailMesh.clone();
	pillarDetailMesh2.position.x = -5;
	groupMesh.add(pillarDetailMesh2);
	let pillarGeometry = new THREE.CylinderGeometry(0.25, 0.25, 5);
	let pillarMesh = new THREE.Mesh(pillarGeometry, materials.metalMaterial);
	pillarMesh.castShadow = true;
	pillarMesh.receiveShadow = true;
	pillarMesh.name = "pillar";
	groupMesh.add(pillarMesh);
	createConvexTriangleShapeAddToCompound(compoundShape, pillarMesh);

	let pillarMesh2 = pillarMesh.clone();
	pillarMesh2.position.set(-5, 0, 0);
	groupMesh.add(pillarMesh2);
	createConvexTriangleShapeAddToCompound(compoundShape, pillarMesh2);

	let topGeometry = new THREE.BoxGeometry(6, 0.5, 1);
	let topMesh = new THREE.Mesh(topGeometry, materials.metalMaterial);
	topMesh.castShadow = true;
	topMesh.receiveShadow = true;
	topMesh.name = "top";
	topMesh.position.set(pillarMesh2.position.x / 2, pillarMesh.geometry.parameters.height / 2, 0);
	groupMesh.add(topMesh);
	createConvexTriangleShapeAddToCompound(compoundShape, topMesh);

	let roofGeometry = new THREE.BoxGeometry(1, 0.5, 3);
	let roofMesh = new THREE.Mesh(roofGeometry, materials.metalMaterial);
	roofMesh.castShadow = true;
	roofMesh.receiveShadow = true;
	roofMesh.name = "roof";
	roofMesh.position.set(
		pillarMesh2.position.x / 2,
		pillarMesh.geometry.parameters.height / 2,
		roofMesh.geometry.parameters.depth / 1.5
	);
	groupMesh.add(roofMesh);
	createConvexTriangleShapeAddToCompound(compoundShape, roofMesh);

	let roofMesh2 = roofMesh.clone();
	roofMesh2.position.set(
		pillarMesh2.position.x / 2,
		pillarMesh.geometry.parameters.height / 2,
		roofMesh.geometry.parameters.depth * 5.5
	);
	groupMesh.add(roofMesh2);
	createConvexTriangleShapeAddToCompound(compoundShape, roofMesh2);

	let roofSupportGeometry = new THREE.CylinderGeometry(0.15, 0.15, 4);
	roofSupportGeometry.rotateZ(Math.PI / 2);
	let roofSupportMesh = new THREE.Mesh(roofSupportGeometry, materials.metalMaterial);
	roofSupportMesh.position.set(
		-roofMesh2.geometry.parameters.width * 5,
		pillarMesh.geometry.parameters.height / 2,
		roofMesh2.position.z
	);
	groupMesh.add(roofSupportMesh);

	let roofSupportSphereGeometry = new THREE.SphereGeometry(0.33);
	let roofSupportSphereMesh = new THREE.Mesh(roofSupportSphereGeometry, materials.metalMaterial);
	roofSupportSphereMesh.position.set(
		roofSupportMesh.position.x * 1.4,
		roofSupportMesh.position.y,
		roofSupportMesh.position.z
	);
	groupMesh.add(roofSupportSphereMesh);

	let roofSupportGeometry2 = new THREE.CylinderGeometry(0.15, 0.15, 5);
	let roofSupportMesh2 = new THREE.Mesh(roofSupportGeometry2, materials.metalMaterial);
	roofSupportMesh2.position.set(
		roofSupportSphereMesh.position.x,
		pillarMesh.geometry.parameters.height / 2 - roofSupportMesh2.geometry.parameters.height / 2,
		roofMesh2.position.z
	);
	groupMesh.add(roofSupportMesh2);

	let pillarDetailMesh3 = pillarDetailMesh.clone();
	pillarDetailMesh3.position.set(-7, -2, 16.5);
	groupMesh.add(pillarDetailMesh3);
}
