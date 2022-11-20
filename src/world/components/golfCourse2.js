import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";
import { createAmmoRamp } from "./ramp.js";
import { createAmmoCone } from "./cone.js";
import { createTorus } from "./torus.js";
import { createAmmoCube } from "./cube.js";

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
	mesh.name = "xzplane";

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(length / 2, depth / 2, width / 2));
	//shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(rigidBody, 1, 1 | 1 | 1);

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
    return golfCourse2;
}
