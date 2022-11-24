import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";
import { intializeSpringBoard } from "../helpers/myAudioHelper.js";


export function createAmmoSpringBoard(width = 1, length = .1, depth = 3, mass = 10 ,rotation={x: 0, y: 0, z: 0}, position= {x: 0, y: 7, z: -24.8}) {
	let isCollided = false;
    let geometry = new THREE.BoxGeometry(width, length, depth);
	let material = new THREE.MeshStandardMaterial( { color: colorScheme.blue, side: THREE.DoubleSide } );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
    mesh.castShadow = true;
	mesh.name = 'spring_board';
    let height = mesh.geometry.parameters.height
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(width/2, length/2, depth/2));
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.1, 0.1, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody);

    mesh.collisionResponse = (mesh1) => {
        if(!isCollided) {
            intializeSpringBoard();
            isCollided = true;
        }
    };


	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}