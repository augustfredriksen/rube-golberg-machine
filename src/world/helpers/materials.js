
import * as THREE from "three";
import  {RGBELoader}  from "three/examples/jsm/loaders/RGBELoader"

export async function createMaterials(color = "#CFCAE6") {
    const textureLoader = new THREE.TextureLoader();

    // cubemap for loop inspirert av kodeeksempel fra "cubemap" av Werner Farstad
    const imagePrefix = "assets/cubemaps/";
    const directions = ["px", "nx", "py", "ny", "pz", "nz"];
    const imageSuffix = ".png";
    let materialArray = [];
    for (let i = 0; i < 6; i++) {
        materialArray.push(new THREE.MeshBasicMaterial({
            map: textureLoader.load(imagePrefix + directions[i] + imageSuffix),
            side: THREE.BackSide
        }))
    }

    const hdrEquirect = new RGBELoader().load(
        "assets/envmaps/grass.hdr", () => {
            hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
        });

    const fabricTexture = textureLoader.load("assets/textures/fabric/fabric.jpg");
    fabricTexture.wrapS = THREE.RepeatWrapping;
    fabricTexture.wrapT = THREE.RepeatWrapping;
    fabricTexture.repeat.set(4.5,25);
    const fabricNormalMapTexture = textureLoader.load("assets/textures/fabric/fabric_normal.jpg");
    fabricNormalMapTexture.wrapS = THREE.RepeatWrapping;
    fabricNormalMapTexture.wrapT = THREE.RepeatWrapping;
    fabricNormalMapTexture.repeat.set(3,3);
    let fabricMaterial = new THREE.MeshStandardMaterial( {
        color: new THREE.Color(0, 1.3, 0.8),
        map: fabricTexture,
        normalMap: fabricNormalMapTexture,
        flatShading: true,
        normalScale: new THREE.Vector2(5, 5),
         });

         const woodTexture = textureLoader.load("assets/textures/wood/wood.jpg");
         woodTexture.wrapT = THREE.RepeatWrapping;
         woodTexture.wrapS = THREE.RepeatWrapping;
         woodTexture.repeat.set(2,2);
         const woodNormalTexture = textureLoader.load("assets/textures/fabric/fabric_normal.jpg");
         woodNormalTexture.wrapS = THREE.RepeatWrapping;
         woodNormalTexture.wrapT = THREE.RepeatWrapping;
         woodNormalTexture.repeat.set(.5,.5);
         let woodMaterial = new THREE.MeshPhysicalMaterial( {
            normalMap: woodNormalTexture,
            clearcoatNormalMap: woodNormalTexture,
            flatShading: true,
            color: new THREE.Color(color),
            roughness: 0.1,
            metalness: 0.1,
            transmission: 1,
            thickness: 1.2,
            clearcoat: 0.5,
            clearcoatRoughness: 0.5,
            normalScale: new THREE.Vector2(2, 2),
            clearcoatNormalScale: new THREE.Vector2(0.3, 0.3),
            envMap: hdrEquirect,
            envMapIntensity: 1
              });

              const brickNormalMapTexture = textureLoader.load("assets/textures/brick/bricks_normalmap.jpg");
              brickNormalMapTexture.wrapS = THREE.RepeatWrapping;
              brickNormalMapTexture.wrapT = THREE.RepeatWrapping;
              
              let brickMaterial = new THREE.MeshPhysicalMaterial({
                  normalMap: brickNormalMapTexture,
                  clearcoatNormalMap: brickNormalMapTexture,
                  flatShading: true,
                  transparent: true,
                  opacity: 1,
                  color: new THREE.Color(Math.random()*0.5 + 0.5, Math.random()*0.5 + 0.5, Math.random()*0.5 + 0.5),
                  roughness: 0.7,
                  transmission: 1,
                  thickness: 1.2,
                  clearcoat: 1,
                  clearcoatRoughness: 0.1,
                  normalScale: new THREE.Vector2(6, 6),
                  clearcoatNormalScale: new THREE.Vector2(0.3, 0.3),
                  envMap: hdrEquirect,
                  envMapIntensity: 0.5
              });
              brickMaterial.displacementScale = -0.01
              brickMaterial.premultipliedAlpha = true;

              const metalTexture = textureLoader.load("assets/textures/metal/metal.jpg");
              metalTexture.wrapT = THREE.RepeatWrapping;
              metalTexture.wrapS = THREE.RepeatWrapping;
              metalTexture.repeat.set(15,15);

              const metalNormalMapTexture = textureLoader.load("assets/textures/metal/metal_normal.jpg");
              metalNormalMapTexture.wrapS = THREE.RepeatWrapping;
              metalNormalMapTexture.wrapT = THREE.RepeatWrapping;
              
              let metalMaterial = new THREE.MeshPhysicalMaterial({
                map: metalTexture,
                  normalMap: metalNormalMapTexture,
                  clearcoatNormalMap: metalNormalMapTexture,
                  flatShading: true,
                  transparent: true,
                  opacity: 1,
                  color: new THREE.Color(1, 1, 1),
                  roughness: 0.8,
                  metalness: 0.9,
                  transmission: 1,
                  thickness: 1.2,
                  clearcoat: 1,
                  clearcoatRoughness: 0.1,
                  normalScale: new THREE.Vector2(6, 6),
                  clearcoatNormalScale: new THREE.Vector2(0.3, 0.3),
                  envMap: hdrEquirect,
                  envMapIntensity: 1
              });
              metalMaterial.displacementScale = -0.01
              metalMaterial.premultipliedAlpha = true;

              let basicMaterial = new THREE.MeshPhongMaterial({
                color: new THREE.Color(color),
                flatShading: true,
              })


              let glassMaterial = new THREE.MeshPhysicalMaterial({
                normalMap: brickNormalMapTexture,
                clearcoatNormalMap: brickNormalMapTexture,
                flatShading: true,
                transparent: true,
                opacity: 1,
                roughness: 0.01,
                transmission: 1,
                thickness: 1.2,
                clearcoat: 1,
                clearcoatRoughness: 0.1,
                normalScale: new THREE.Vector2(6, 6),
                clearcoatNormalScale: new THREE.Vector2(0.3, 0.3),
                envMap: hdrEquirect,
                envMapIntensity: 0.5
            });
            glassMaterial.displacementScale = -0.01
            glassMaterial.premultipliedAlpha = true;

            const threeTone = textureLoader.load(("assets/gradientmaps/threeTone.jpg"))
            const textMaterial = new THREE.MeshToonMaterial()
            textMaterial.gradientMap = threeTone;
            textMaterial.color = new THREE.Color(0.0, 0.4, 0.2);
            textMaterial.flatShading = true;



    
    return {
        fabricMaterial,
        woodMaterial,
        brickMaterial,
        materialArray,
        metalMaterial,
        basicMaterial,
        glassMaterial,
        textMaterial,
    }
}