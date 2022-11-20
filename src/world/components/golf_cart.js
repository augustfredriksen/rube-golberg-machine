import * as THREE from "three";
import { addMeshToScene, getRigidBodyFromMesh } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export async function createAmmoGolfCart(rotation = { x: 0, y: Math.PI/2, z: 0 }, position = { x: -10, y: 5, z: 10 }) {
	// THREE:
    const mass = 10;
    let rigidBody;
	const loader = new GLTFLoader();
	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath("/draco/");
	loader.setDRACOLoader(dracoLoader);
	return new Promise((resolve, reject) => {
		loader.load("assets/models/golf_cart/scene.gltf", (gltf) => {
			const golfCart = gltf.scene;
			golfCart.scale.set(0.12, 0.12, 0.12);
			golfCart.rotation.set(rotation.x, rotation.y, rotation.z);
			golfCart.position.set(position.x, position.y, position.z);
			addMeshToScene(golfCart);
			golfCart.traverse(function (child) {
				if (child.isMesh) {
                    console.log(child);
					child.receiveShadow = true;
					child.castShadow = true;

				}
                let shape = new Ammo.btBoxShape(new Ammo.btVector3(5, 0, 2.5));
                shape.setMargin( 0.05 );
                let rigidBody = createAmmoRigidBody(shape, child, .1, 0.9, position, mass);
            
                golfCart.userData.physicsBody = rigidBody;
            
                // Legger til physics world:
                g_ammoPhysicsWorld.addRigidBody(
                    rigidBody,
                    1,1 | 1 | 1);
            
                addMeshToScene(golfCart);
                g_rigidBodies.push(golfCart);
                rigidBody.threeMesh = golfCart;
                resolve(rigidBody);
			});

		});
	});
}
