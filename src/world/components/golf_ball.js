import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export function createAmmoGolfBall(rotation = { x: 0, y: 0, z: 0 }, position = { x: 0, y: 2, z: 0 }) {
	const mass = 5;
	let golfBall;
	// THREE:
	const loader = new GLTFLoader();
	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath("/draco/");
	loader.setDRACOLoader(dracoLoader);
	loader.load("assets/models/golf_ball/golf_ball.glb", (gltf) => {
		golfBall = gltf.scene.children[0].children[0].children[0].children[0];
		golfBall.scale.set(0.3, 0.3, 0.3);
		golfBall.position.set(position.x, position.y, position.z);
		golfBall.rotation.set(rotation.x, rotation.y, rotation.z);
		golfBall.receiveShadow = true;
		golfBall.castShadow = true;
		golfBall.name = "golfball";

		let shape = new Ammo.btSphereShape(golfBall.geometry.boundingSphere.radius / 1.74);
		shape.setMargin(0.05);
		let rigidBody = createAmmoRigidBody(shape, golfBall, 0.2, 0.5, position, mass);

		golfBall.userData.physicsBody = rigidBody;

		// Legger til physics world:
		g_ammoPhysicsWorld.addRigidBody(rigidBody);

		golfBall.collisionResponse = (mesh1) => {
			let velocityVector = new Ammo.btVector3(0, 2, -20);
			rigidBody.setLinearVelocity(velocityVector);
		};

		addMeshToScene(golfBall);
		g_rigidBodies.push(golfBall);
		rigidBody.threeMesh = golfBall;
	});
}
