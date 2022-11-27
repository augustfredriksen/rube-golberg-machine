import * as THREE from "three";
import { addMeshToScene, getRigidBodyFromMesh } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";
import { createAmmoRamp } from "./ramp.js";
import { createAmmoCone } from "./cone.js";
import { createTorus } from "./torus.js";
import { createAmmoSeesawSphere, sphereRigidBody } from "./seesaw.js";
import { createTrapDoorCube } from "./trapDoorCube.js";
import { intializeButton } from "../helpers/myAudioHelper.js";

let hasCollided = false;

export function createAmmoCubeShapes(
	rotation = { x: 0, y: 0, z: 0 },
	position = { x: 0, y: 0, z: 0 },
	width = 1,
	length = 1,
	depth = 1,
	color = 0xa8a8f8
) {
	const mass = 0;
	// THREE:
	let geometry = new THREE.BoxGeometry(length, depth, width, 1, 1);
	let material = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide });
	let mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(position.x, position.y, position.z);
	mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
	mesh.name = "golf_course_2";

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(length / 2, depth / 2, width / 2));
	//shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(rigidBody);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	return rigidBody;
}

export function createAmmoButton(
	rotation = { x: 0, y: 0, z: 0 },
	position = { x: 0, y: 0, z: 0 },
	width = 1,
	length = 1,
	depth = 1,
	color = 0xa8a8f8
) {
    let rocket = createAmmoRocket();
    let glass = createAmmoGlass();
    let cube = createTrapDoorCube();
    let rocketRigidBody = rocket.threeMesh.userData.physicsBody;
    let glassRigidBody = glass.threeMesh.userData.physicsBody;
    let cubeRigidBody = cube.threeMesh.userData.physicsBody;
    console.log(glassRigidBody.threeMesh);

	const mass = 10;
	// THREE:
	let geometry = new THREE.BoxGeometry(length, depth, width, 1, 1);
	let material = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide });
	let mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(position.x, position.y, position.z);
	mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
	mesh.name = "button";

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(length / 2, depth / 2, width / 2));
	//shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.9, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(rigidBody);

	mesh.collisionResponse = async (mesh1) => {
        if(!hasCollided) {
            let velocityVector = new Ammo.btVector3(0, 0, -35);
            let velocityVector2 = new Ammo.btVector3(0, 25, 0); 
            let velocityVector3 = new Ammo.btVector3(0, -1, 0); 
            glassRigidBody.activate(true);
            glassRigidBody.setLinearVelocity(velocityVector);
            glassRigidBody.setAngularVelocity(velocityVector2);
            rocketRigidBody.activate(true);     
            rocketRigidBody.setLinearVelocity(velocityVector2);

            cubeRigidBody.activate(true);
            mesh1.material.color.setHex( 0xff0000);
            intializeButton();
            hasCollided = true;
        }


	};

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	return rigidBody;
}

export function createGolfCourse2() {

	let button = createAmmoButton({ x: 0, y: 0, z: 0 }, { x: 21, y: 1.3, z: -23.5 }, .5, .5, .5, colorScheme.blue)
}
export function createAmmoRocket(rotation={x: 0, y: 0, z: 0}, position= {x: -3, y: 2, z: -20}) {
	const mass=15;
    const width = 1;
    const height =2;
    const depth = 1;
	// THREE:
	let geometry = new THREE.BoxGeometry( width, height, depth );
	let material = new THREE.MeshStandardMaterial( { color: "brown", side: THREE.DoubleSide } );
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
		rigidBody);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
    return rigidBody
}

export function createAmmoGlass(rotation={x: 0, y: 0, z: 0}, position= {x: 10, y: 4, z: -23.5}) {

const mass = 1;
const width = 3;
const length = 0.1;
const depth = 3;
let geometry = new THREE.BoxGeometry(width, length, depth);
let material = new THREE.MeshStandardMaterial({color: colorScheme.blue, transparent: true, opacity: .2});
let mesh = new THREE.Mesh(geometry, material);
mesh.position.set(position.x, position.y, position.z)

mesh.receiveShadow = true;
mesh.castShadow = true;
mesh.name = 'glass';
let shape = new Ammo.btBoxShape(new Ammo.btVector3(width/2, length/2, depth/2));
shape.setMargin( 0.05 );
let rigidBody = createAmmoRigidBody(shape, mesh, 0.1, 1, position, mass);

mesh.userData.physicsBody = rigidBody;

// Legger til physics world:
g_ammoPhysicsWorld.addRigidBody(
    rigidBody);

addMeshToScene(mesh);
g_rigidBodies.push(mesh);
rigidBody.threeMesh = mesh;
console.log(rigidBody)

return rigidBody
}
