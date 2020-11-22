import * as BABYLON from 'babylonjs';
import {Texture} from "babylonjs";
import {getAngle, rotateAroundCenter, rotateAroundPoint} from './helper';
import planet_textures from './assets/*.jpg';
import skybox_textures from './assets/skybox/*.jpg';

// Check support
if (!BABYLON.Engine.isSupported()) {
    window.alert('Browser not supported');
} else {
    var canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    var engine = new BABYLON.Engine(canvas, true);

    var scene = new BABYLON.Scene(engine);

    // Reguläre Kamera mit festem Blickpunkt
    var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", -Math.PI / 4.0, 0.25 * Math.PI, 4.0, new BABYLON.Vector3(0, 0, 0), scene);


    // Kamera für VR mit Device Orientation zum Herumschauen 
    //var camera = new BABYLON.DeviceOrientationCamera("ArcRotateCamera", new BABYLON.Vector3(1, 1, 1), scene);
    //camera.setCameraRigMode(20,{interaxialDistance: 0.0637});

    var sun = BABYLON.Mesh.CreateSphere("Sun", 10.0, 0.05, scene);
    var earth = BABYLON.Mesh.CreateSphere("Earth", 30.0, 0.3, scene);
    var moon = BABYLON.Mesh.CreateSphere("Moon", 20.0, 0.15, scene);
    var mars = BABYLON.Mesh.CreateSphere("Mars", 30.0, 0.25, scene);
    var satellite = BABYLON.Mesh.CreateSphere("Satellite", 20.0, 0.05, scene);

    var material1 = new BABYLON.StandardMaterial("default1", scene);

    material1.diffuseTexture = new BABYLON.Texture(planet_textures.earth, scene);
    material1.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    material1.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    (material1.diffuseTexture as Texture).vScale = -1;
    (material1.diffuseTexture as Texture).uScale = -1;

    var material2 = new BABYLON.StandardMaterial("default2", scene);
    material2.diffuseTexture = new BABYLON.Texture(planet_textures.moon, scene);
    material2.specularColor = new BABYLON.Color3(0, 0, 0);
    material2.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    (material2.diffuseTexture as Texture).vScale = -1;
    (material2.diffuseTexture as Texture).uScale = -1;

    var material3 = new BABYLON.StandardMaterial("default3", scene);
    material3.diffuseTexture = new BABYLON.Texture(planet_textures.sun, scene);
    material3.specularColor = new BABYLON.Color3(0, 0, 0);
    material3.emissiveColor = new BABYLON.Color3(1, 1, 1);

    var material4 = new BABYLON.StandardMaterial("default4", scene);
    material4.diffuseTexture = new BABYLON.Texture(planet_textures.mars, scene);
    material4.specularColor = new BABYLON.Color3(0, 0, 0);
    material4.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    (material4.diffuseTexture as Texture).vScale = -1;
    (material4.diffuseTexture as Texture).uScale = -1;

    var material5 = new BABYLON.StandardMaterial("default5", scene);
    material5.diffuseTexture = new BABYLON.Texture(planet_textures.metal, scene);
    material5.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    material5.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    (material5.diffuseTexture as Texture).vScale = -1;
    (material5.diffuseTexture as Texture).uScale = -1;

    earth.material = material1;
    moon.material = material2;
    sun.material = material3;
    mars.material = material4;
    satellite.material = material5;

    // Show coordinate system, BabylonJS uses left-handed coordinates!
    // x-axis: red, y-axis: yellow, z-axis: green
    var cylinder1 = BABYLON.Mesh.CreateCylinder("cylinder1", 0.2, 0.01, 0.01, 4, scene);
    var cylinder2 = BABYLON.Mesh.CreateCylinder("cylinder2", 0.2, 0.01, 0.01, 4, scene);
    var cylinder3 = BABYLON.Mesh.CreateCylinder("cylinder3", 0.2, 0.01, 0.01, 4, scene);
    var cmat1 = new BABYLON.StandardMaterial("cmat1", scene);
    var cmat2 = new BABYLON.StandardMaterial("cmat2", scene);
    var cmat3 = new BABYLON.StandardMaterial("cmat3", scene);
    cmat1.emissiveColor = new BABYLON.Color3(1, 0, 0); // red
    cmat2.emissiveColor = new BABYLON.Color3(1, 1, 0); // yellow
    cmat3.emissiveColor = new BABYLON.Color3(0, 1, 0); // green
    cylinder1.material = cmat1;
    cylinder2.material = cmat2;
    cylinder3.material = cmat3;
    cylinder1.position.x = 0.1;
    cylinder1.rotation.z = 0.5 * Math.PI;
    cylinder2.position.y = 0.1;
    cylinder2.rotation.z = 0.0;
    cylinder3.position.z = 0.1;
    cylinder3.rotation.x = 0.5 * Math.PI;

    var light = new BABYLON.PointLight("dir01", new BABYLON.Vector3(-0.0, -0.0, 0.0), scene);
    light.diffuse = new BABYLON.Color3(1.0, 1.0, 1.0);

    scene.clearColor = new BABYLON.Color4(0.05, 0.05, 0.2);

    const textures = Object.keys(skybox_textures).map((obj) => skybox_textures[obj]);
    console.log(textures);
    

    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size: 1000.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = BABYLON.CubeTexture.CreateFromImages(textures, scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    var d = new Date();
    var startTime = d.getTime();
    var lastTime = startTime;

    var sim_year = 1;                               // one simulated earth year in minutes
    var sim_day = sim_year / 365.24;               // one simulated earth day in minutes
    var sim_month = sim_year / (365.24 / 27.3);      // one simulated moon loop in minutes
    var sim_mars_sol = sim_year * (687.0 / 354.24);	    // one simulated mars year in minutes

    var moon_local_pos = new BABYLON.Vector3(-1.0, 0, 0);
    var satellite_local_pos = new BABYLON.Vector3(-1.0, 0, 0);

    // Set initial earth position
    earth.position.x = 1.0;
    earth.position.y = 0.0;
    earth.position.z = 0.0;

    // Set initial moon position
    moon.position.x = earth.position.x - 0.5;
    moon.position.y = earth.position.y;
    moon.position.z = earth.position.z;

    // Set initial mars position
    mars.position.x = 2.0;
    mars.position.y = 0.0;
    mars.position.z = 0.0;

    // Set initial satellite position
    satellite.position.x = moon.position.x - 0.2;
    satellite.position.y = 0.0;
    satellite.position.z = 0.0;

    scene.beforeRender = function() {
        const time = (new Date).getTime();         // get milliseconds since 1970
        const passedTimeInMillis = time - startTime;    // milliseconds since start
        const delta_t = time - lastTime;              // milliseconds since last frame
        lastTime = time;

        var min2ms = 1000.0 * 60.0;        // milliseconds in minutes


        // Earth position and rotation
        const earthCoords = rotateAroundCenter(1, 0, getAngle(passedTimeInMillis, sim_day, 365.24));
        earth.position.x = earthCoords.x;
        earth.position.z = earthCoords.y;

        // Moon position and rotation
        const moonCoords = rotateAroundPoint(earth.position.x, earth.position.z, earth.position.x - 0.5, earth.position.z, getAngle(passedTimeInMillis, sim_day, 27));
        moon.position.x = moonCoords.x;
        moon.position.z = moonCoords.y;

        // Moon Satellite position and rotation
        const satelliteCoords = rotateAroundPoint(moon.position.x, moon.position.z, moon.position.x - 0.2, moon.position.z, getAngle(passedTimeInMillis, sim_day, 27 / 3));
        satellite.position.x = satelliteCoords.x;
        satellite.position.z = satelliteCoords.y;

        // Mars position and rotation
        const marsCoords = rotateAroundCenter(2, 0, getAngle(passedTimeInMillis, sim_day, 687));
        mars.position.x = marsCoords.x;
        mars.position.z = marsCoords.y;


        // new mooncoords = rotate(fromX, fromY, aroundX, aroundY, angle);
        /*
                // Earth position and rotation
                earth.position.x = ...... ;
                earth.position.z = ...... ;
        
                earth.rotation.y = ......;
        */
        // Moon position and rotation
        // ...

        // Satellite position and rotation
        // ...

        // Mars position and rotation
        // ...

        //			console.log(BABYLON.Tools.GetFps().toFixed() + " fps");
    };

    scene.activeCamera.attachControl(canvas);
    engine.runRenderLoop(() => {
        scene.render();
    })

    // Resize
    window.addEventListener("resize", function() {
        engine.resize();
    });
};