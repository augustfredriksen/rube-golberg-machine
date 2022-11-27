import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";
import { createAmmoRamp } from "./ramp.js";
import { createAmmoCone } from "./cone.js";
import { createTorus } from "./torus.js";
import { createMaterials } from "../helpers/materials.js";

export async function createGolfPlane() {
    const materials = await createMaterials();
    const terrainWidthExtents = 9;
    const terrainDepthExtents = 50;
    const terrainWidth = 9;
    const terrainHeight = 50;
    const position = {x: 0, y: 1, z: -22}
    const mass = 0;
    
    let imageLoader = new THREE.ImageLoader();
    imageLoader.load("assets/textures/grass/grass_height.png", async (image) => {
        const heightData = getHeigtdataFromImage(image, terrainWidth, terrainHeight, 150);
        let heightFieldData = createHeightFieldShape(heightData, terrainWidth, terrainHeight, terrainWidthExtents, terrainDepthExtents);
        let scaleX = terrainWidthExtents / (terrainWidth-1);
        let scaleZ = terrainDepthExtents / (terrainHeight - 1);
        heightFieldData.heightFieldShape.setLocalScaling(new Ammo.btVector3(scaleX, 1, scaleZ));
        heightFieldData.heightFieldShape.setMargin( 0.05 );
    
        let geometry = new THREE.PlaneGeometry( terrainWidth, terrainHeight, terrainWidth-1, terrainHeight-1 );
        geometry.rotateX( - Math.PI / 2 );
    
        let vertices = geometry.attributes.position.array;
            // Ammo-shapen blir (automatisk) sentrert om origo basert på this.terrainMinHeight og this.terrainMaxHeight.
            // Må derfor korrigere THREE-planets y-verdier i forhold til dette.
            // Flytter dermed three-planet NED, tilsvarende minHeigt + (maxHeight - minHeight)/2.
            let delta = (heightFieldData.terrainMinHeight + ((heightFieldData.terrainMaxHeight-heightFieldData.terrainMinHeight)/2));
            // Endrer høydeverdiene på geometrien:
            for ( let i = 0; i< heightData.length; i++) {
                // 1 + (i*3) siden det er y-verdien som endres:
                vertices[ 1 + (i*3) ] = heightData[i] - delta ;
            }
            // Oppdater normaler:
            geometry.computeVertexNormals();
            let mesh = new THREE.Mesh(geometry, materials.fabricMaterial);
            mesh.receiveShadow = true;
            let rigidBody = createAmmoRigidBody(heightFieldData.heightFieldShape, mesh, 0.7, 0.8, position, mass);
    
            mesh.userData.physicsBody = rigidBody;
        
            // Legger til physics world:
            g_ammoPhysicsWorld.addRigidBody(
                rigidBody);
        
            addMeshToScene(mesh);
            g_rigidBodies.push(mesh);
            rigidBody.threeMesh = mesh;
            return rigidBody;
    })
}

// FRA: http://kripken.github.io/ammo.js/examples/webgl_demo_terrain/index.html
// Lager en Ammo.btHeightfieldTerrainShape vha. minnebufret ammoHeightData.
// ammoHeightData FYLLES vha. heightData OG this.terrainWidth, this.terrainHeight - parametrene.
// Gjøres vha. brukes Ammo._malloc og Ammo.HEAPF32[].
function createHeightFieldShape(heightData, terrainWidth, terrainHeight, terrainWidthExtents, terrainDepthExtents) {

	// This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
	let heightScale = 1;

	// Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
	let upAxis = 1;

	// hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
	let hdt = "PHY_FLOAT";

	// Set this to your needs (inverts the triangles)
	let flipQuadEdges = false;

	// Creates height data buffer in Ammo heap
	const ammoHeightData = Ammo._malloc( 4 * terrainWidth * terrainHeight );

	// NB! Viktig å finne og sette this.terrainMaxHeight og this.terrainMinHeight:
	let p = 0;
	let p2 = 0;
	let terrainMaxHeight = Number.NEGATIVE_INFINITY;     //NB! setter til en lav (nok) verdi for å være sikker.
	let terrainMinHeight = Number.POSITIVE_INFINITY;      //NB! setter til en høy (nok) verdi for å være sikker.
	// Copy the javascript height data array to the Ammo one.
	for ( let j = 0; j < terrainHeight; j ++ ) {
		for ( let i = 0; i < terrainWidth; i ++ ) {
			if (heightData[p] < terrainMinHeight)
				terrainMinHeight = heightData[p];
			if (heightData[p] >= terrainMaxHeight)
				terrainMaxHeight = heightData[p];
			// write 32-bit float data to memory  (Se: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Right_shift)
			Ammo.HEAPF32[ammoHeightData + p2 >> 2] = heightData[ p ];   // >>  Signed right shift. Shifts right by pushing copies of the leftmost bit in from the left, and let the rightmost bits fall off.
			p ++;
			// 4 bytes/float
			p2 += 4;
		}
	}
	// Creates the heightfield physics shape
	let heightFieldShape = new Ammo.btHeightfieldTerrainShape(
		terrainWidth,
		terrainHeight,
		ammoHeightData,
		heightScale,
		terrainMinHeight,
		terrainMaxHeight,
		upAxis,
		hdt,
		flipQuadEdges
	);

	return {
		terrainMinHeight: terrainMinHeight,
		terrainMaxHeight: terrainMaxHeight,
		heightFieldShape: heightFieldShape
	};
}

//FRA WERNER FARSTAD
function getHeigtdataFromImage(image, width, height, divisor= 3) {
	// Lager et temporært canvas-objekt:
	let canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	// Henter ut en 2D-context som gjør at man kan tegne på canvaset:
	let context = canvas.getContext('2d');
	let size = width * height;
	// Lager et Float32Array som kan holde på alle pikslene til canvaset:
	let heightData = new Float32Array(size);
	// Tegner image på  canvaset:
	context.drawImage(image, 0, 0);
	// Nullstiller heightData-arrayet:
	for (let i = 0; i < size; i++) {
		heightData[i] = 0;
	}
	//imageData = et ImageData-objekt. Inneholder pikseldata. Hver piksel består av en RGBA-verdi (=4x8 byte).
	let imageData = context.getImageData(0, 0, width, height);
	let pixelDataUint8 = imageData.data;	//pixelDataUint8 = et Uint8ClampedArray - array. 4 byte per piksel. Ligger etter hverandre.
	let j = 0;
	//Gjennomløper pixelDataUint8, piksel for piksel (i += 4). Setter heightData for hver piksel lik summen av fargekomponentene / 3:
	for (let i = 0, n = pixelDataUint8.length; i < n; i += 4) {
		let sumColorValues = pixelDataUint8[i] + pixelDataUint8[i + 1] + pixelDataUint8[i + 2];
		heightData[j++] = sumColorValues / divisor;
	}
	return heightData;
}