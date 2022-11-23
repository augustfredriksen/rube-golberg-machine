import * as THREE from "three";
import { addMeshToScene, getRigidBodyFromMesh, initializeBoing } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";
import { createAmmoRamp } from "./ramp.js";
import { createAmmoCone } from "./cone.js";
import { createTorus } from "./torus.js";
import { createAmmoCube } from "./cube.js";
import { createAmmoSeesawSphere, sphereRigidBody } from "./seesaw.js";
import { createTrapDoorCube } from "./trapDoorCube.js";

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
            let velocityVector = new Ammo.btVector3(0, 0, -25);
            let velocityVector2 = new Ammo.btVector3(0, 25, 0); 
            let velocityVector3 = new Ammo.btVector3(0, -1, 0); 
            glassRigidBody.activate(true);
            glassRigidBody.setLinearVelocity(velocityVector);
            glassRigidBody.setAngularVelocity(velocityVector2);
            rocketRigidBody.activate(true);     
            rocketRigidBody.setLinearVelocity(velocityVector2);

            cubeRigidBody.activate(true);
            mesh1.material.color.setHex( 0xff0000);
            initializeBoing();
            hasCollided = true;
        }


	};

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	return rigidBody;
}

export function createGolfCourse2() {
	let golfCourse2 = new THREE.Group();
	let floor = createAmmoCubeShapes({ x: 0, y: 0, z: 0 }, { x: 20, y: 1, z: -22 }, 50, 9, 1, colorScheme.pink);
	let leftWall = createAmmoCubeShapes({ x: 0, y: 0, z: Math.PI / 2 }, { x: 25, y: 1, z: -22 }, 50, 2, 1, colorScheme.yellow);
	let rightWall = createAmmoCubeShapes({ x: 0, y: 0, z: Math.PI / 2 }, { x: 15, y: 1, z: -22 }, 50, 2, 1, colorScheme.yellow);
	let frontWall = createAmmoCubeShapes(
		{ x: 0, y: Math.PI / 2, z: Math.PI / 2 },
		{ x: 20, y: 1, z: 3 },
		11,
		2,
		1,
		colorScheme.yellow
	);
	let angledObstacle = createAmmoCubeShapes(
		{ x: 0, y: 0, z: 0 },
		{ x: 23, y: 1, z: -15 },
		7,
		2,
		2,
		colorScheme.yellow
	);
	let rightObstacle = createAmmoCubeShapes(
		{ x: 0, y: Math.PI / 2, z: Math.PI / 2 },
		{ x: -3, y: 1, z: -22 },
		5,
		2,
		0.5,
		colorScheme.yellow
	);
	let ramp = createAmmoCubeShapes({ x: Math.PI / 10, y: 0, z: 0 }, { x: 0, y: 2, z: -34 }, 6, 1, 0.2, colorScheme.blue);
	let rampSupport = createAmmoCubeShapes({ x: 0, y: 0, z: 0 }, { x: 0, y: 2, z: -37 }, 0.4, 1, 2, colorScheme.blue);
	let rampBox = createAmmoCubeShapes({ x: 0, y: 0, z: 0 }, { x: 0, y: 2, z: -39.5 }, 5, 9, 2, colorScheme.pink);
	let rampObstacleRight = createAmmoCubeShapes({ x: 0, y: 0, z: 0 }, { x: -2.5, y: 1.5, z: -33 }, 1, 4, 1, colorScheme.yellow);
	let rampObstacleLeft = createAmmoCubeShapes({ x: 0, y: 0, z: 0 }, { x: 2.5, y: 1.5, z: -33 }, 1, 4, 1, colorScheme.yellow);
	let goal = createTorus({ x: Math.PI / 2, y: 0, z: 0 }, { x: 20, y: 1.5, z: 1 });
    let startPos = createAmmoCube({x: 0, y: 0, z: 0}, {x: 20, y: 1.5, z: -44});
	let button = createAmmoButton({ x: 0, y: 0, z: 0 }, { x: 14.15, y: 1.3, z: -23.5 }, .5, .5, .5, colorScheme.blue)
    return golfCourse2;
}
export function createAmmoRocket(rotation={x: 0, y: 0, z: 0}, position= {x: 10, y: 2, z: -20}) {
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
		rigidBody);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
    return rigidBody
}

export function createAmmoGlass(rotation={x: 0, y: 0, z: 0}, position= {x: 10, y: 5, z: -23.5}) {

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
