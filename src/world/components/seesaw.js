import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";

let sphereCollided = false;

export function createAmmoSeesaw(rotation={x: 0, y: 0, z: 0}, position= {x: 4, y: 4.5, z: -23.5}) {
    createAmmoSeesawPlank();
    createAmmoSeesawSphere();
	const mass=0;
    const width = .2;
    const height =9;
    const depth = 1;
	// THREE:
	let geometry = new THREE.BoxGeometry( width, height, depth, 1, 1 );
	let material = new THREE.MeshStandardMaterial( { color: colorScheme.gray, side: THREE.DoubleSide, transparent: true, opacity: 0.0 } );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
	mesh.name = 'seesawPillar';

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

function createAmmoSeesawPlank(rotation={x: 0, y: 0, z: 0}, position= {x: 4, y: 9, z: -23.5}) {
	const mass=10;
    const width = 10;
    const height =.1;
    const depth = 1;
	// THREE:
	let geometry = new THREE.BoxGeometry( width, height, depth, 1, 1 );
	let material = new THREE.MeshStandardMaterial( { color: colorScheme.blue, side: THREE.DoubleSide, transparent: true, opacity: 0.1 } );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
    mesh.castShadow = true;

	mesh.name = 'seesawPlank';

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

function createAmmoSeesawSphere(rotation={x: 0, y: 0, z: 0}, position= {x: 4.2, y: 9.25, z: -23.5}) {
	const mass=15;
    const radius = 0.4;
	// THREE:
	let geometry = new THREE.SphereGeometry( radius );
	let material = new THREE.MeshStandardMaterial( { color: colorScheme.yellow, side: THREE.DoubleSide } );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
    mesh.castShadow = true;
	mesh.name = 'seesawSphere';

	// AMMO:
	let shape = new Ammo.btSphereShape(radius);
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, .2, 1, position, mass);
	rigidBody.setRollingFriction(1);

	mesh.userData.physicsBody = rigidBody;
	mesh.collisionResponse = (mesh1) => {
		sphereCollided = true;
		rigidBody.setGravity(new Ammo.btVector3(0, -20, 0));
	};


	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		1,
        1 | 1 | 1 | 15);

	addMeshToScene(mesh);
    
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

}

