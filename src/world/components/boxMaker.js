import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";
import { intializeBrick, intializeDomino } from "../helpers/myAudioHelper.js";
import { createConvexTriangleShapeAddToCompound } from "../helpers/triangleMeshHelper.js";
import { createMaterials } from "../helpers/materials.js";

export async function createAmmoBox(width, height, depth, mass, position = { x: 0, y: 0, z: 0 }) {
	let hasCollided = false;
	// THREE:
    let geometry = new THREE.BoxGeometry(width, height, depth, 1, 1);
    const materials = await createMaterials();

	let mesh = new THREE.Mesh(geometry, materials.brickMaterial);
	mesh.position.set(position.x, position.y, position.z);

	mesh.receiveShadow = true;
	mesh.castShadow = true;
	mesh.name = "brick";

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(width / 2, height / 2, depth / 2));
	shape.setMargin(0.05);
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.1, 0.6, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(rigidBody);

	addMeshToScene(mesh);

	mesh.collisionResponse = (mesh1) => {
		if (!hasCollided) {
            console.log("firkant traff murstein")
			intializeBrick();
			rigidBody.setGravity(new Ammo.btVector3(0, -(9.80665 * 2), 0));
			hasCollided = true;
		}
	};

	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
	rigidBody.setGravity(new Ammo.btVector3(0, -(9.80665 * 3), 0));
}

export function createMultipleBoxesX(rowWidth, rowHeight, position = { x: 0, y: 0, z: 0 }) {
	let mass = 0.5;
	let width = 1.2;
	let height = width * 0.5;
	let depth = width * 0.5;
	let x0 = position.x - rowWidth * width * 0.5;

	for (let i = 0; i < rowHeight; i++) {
		let oddRow = i % 2 == 1;
		position.x = x0;
		if (oddRow) {
			position.x -= 0.25 * width;
		}
		let nRow = oddRow ? rowWidth + 1 : rowWidth;
		for (let j = 0; j < nRow; j++) {
			let currentWidth = width;
			let currentMass = mass;
			if (oddRow && (j == 0 || j == nRow - 1)) {
				currentWidth *= 0.5;
				currentMass *= 0.5;
			}
			let brick = createAmmoBox(currentWidth, height, depth, currentMass, {
				x: position.x,
				y: position.y,
				z: position.z,
			});
			if (oddRow && (j == 0 || j == nRow - 2)) {
				position.x += 0.75 * width;
			} else {
				position.x += width;
			}
		}
		position.y += height;
	}
}
