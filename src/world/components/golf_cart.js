import * as THREE from "three";
import { addMeshToScene, getRigidBodyFromMesh } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { intializeCar } from "../helpers/myAudioHelper.js";


export async function createAmmoGolfCart(rotation={x: -Math.PI/2, y: 0, z: Math.PI/2}, position= {x: 0, y: 7.5, z: -39}) {
    let isCollided = false;
    const mass = 100;
    let golfCartMesh;
	// THREE:
	const loader = new GLTFLoader();
	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath("/draco/");
	loader.setDRACOLoader(dracoLoader);
	return new Promise((resolve, reject) => {
		loader.load("assets/models/golf_cart/scene.gltf", (gltf) => {
			golfCartMesh = gltf.scene.children[0].children[0].children[0].children[1];
            golfCartMesh.name = "golf_cart";
            golfCartMesh.scale.set(0.01, 0.01, 0.01);
            golfCartMesh.position.set(position.x, position.y, position.z);
            golfCartMesh.rotation.set(rotation.x, rotation.y, rotation.z);
            golfCartMesh.receiveShadow = true;
            golfCartMesh.castShadow = true;

    
            let triangle_mesh = new Ammo.btTriangleMesh();
            let vecA = new Ammo.btVector3(0, 0, 0);
            let vecB = new Ammo.btVector3(0, 0, 0);
            let vecC = new Ammo.btVector3(0, 0, 0);
    
            let verticesPos = golfCartMesh.geometry.getAttribute('position').array;
            let triangles = [];
            for(let i = 0; i < verticesPos.length; i +=3) {
                triangles.push({
                    x: verticesPos[i],
                    y: verticesPos[i+1],
                    z: verticesPos[i+2],
                });
            }
    
            for(let i = 0; i < triangles.length - 3; i +=3) {
                vecA.setX(triangles[i].x);
                vecA.setY(triangles[i].y);
                vecA.setZ(triangles[i].z);
    
                vecB.setX(triangles[i + 1].x);
                vecB.setY(triangles[i + 1].y);
                vecB.setZ(triangles[i + 1].z);
    
                vecC.setX(triangles[i + 2].x);
                vecC.setY(triangles[i + 2].y);
                vecC.setZ(triangles[i + 2].z);
    
                triangle_mesh.addTriangle(vecA, vecB, vecC, true)
            }
            Ammo.destroy(vecA);
            Ammo.destroy(vecB);
            Ammo.destroy(vecC);
    
            const shape = new Ammo.btConvexTriangleMeshShape(triangle_mesh);
            golfCartMesh.geometry.verticesNeedUpdate = true;
            shape.getMargin( 0.05 );
            let rigidBody = createAmmoRigidBody(shape, golfCartMesh, 0.0, 0.3, position, mass);
            rigidBody.setDamping(0.1, 0.5);
            rigidBody.setActivationState(4);
    
            golfCartMesh.userData.physicsBody = rigidBody;
    
            // Legger til physics world:
            g_ammoPhysicsWorld.addRigidBody(
                rigidBody);

            golfCartMesh.collisionResponse = (mesh1) => {
                if(!isCollided) {
                    intializeCar();
                    isCollided = true;
                    let velocityVector = new Ammo.btVector3(0, 0, 14);
                    rigidBody.setLinearVelocity(velocityVector);
                }
                    
            };
        
            addMeshToScene(golfCartMesh);
            g_rigidBodies.push(golfCartMesh);
            rigidBody.threeMesh = golfCartMesh;
            resolve(rigidBody);

		});
	});
}
