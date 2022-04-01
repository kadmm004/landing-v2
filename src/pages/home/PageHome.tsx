import React, { useEffect, useRef, useState } from "react";
import { StyledPageHome } from "./styled/StyledPageHome";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { getPublicAssetPath } from "../../utils";

export const PageHome: React.FC = () => {
    const rendererContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let mixer: THREE.AnimationMixer;

        const clock = new THREE.Clock();
        const container = rendererContainerRef.current;
        if (!container) {
            return;
        }

        const renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        // renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        // const pmremGenerator = new THREE.PMREMGenerator(renderer);
        // scene.background = new THREE.Color(0xbfe3dd);
        // scene.environment = pmremGenerator.fromScene(
        //     new RoomEnvironment(),
        //     0.04
        // ).texture;

        const ambient = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambient);

        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(0, 10, 35);
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 0.1;
        spotLight.decay = 2;
        spotLight.distance = 200;

        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 512;
        spotLight.shadow.mapSize.height = 512;
        spotLight.shadow.camera.near = 10;
        spotLight.shadow.camera.far = 200;
        spotLight.shadow.focus = 1;
        scene.add(spotLight);

        const shadowCameraHelper = new THREE.CameraHelper(
            spotLight.shadow.camera
        );
        scene.add(shadowCameraHelper);

        const camera = new THREE.PerspectiveCamera(
            40,
            container.clientWidth / container.clientHeight,
            1,
            100
        );
        camera.position.set(5, 2, 8);

        const axesHelper = new THREE.AxesHelper(10);
        scene.add(axesHelper);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0.5, 0);
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;

        // const dracoLoader = new DRACOLoader();
        // dracoLoader.setDecoderPath("js/libs/draco/gltf/");

        const loader = new GLTFLoader();
        // loader.setDRACOLoader(dracoLoader);
        loader.load(
            getPublicAssetPath("assets/demo1/demo1.glb"),
            function (gltf) {
                console.log("gltf", gltf);
                const model = gltf.scene;
                model.position.set(0, 0, 0);
                model.scale.set(1, 1, 1);
                scene.add(model);

                mixer = new THREE.AnimationMixer(model);
                // mixer.clipAction(gltf.animations[0]).play();

                animate();
            },
            void 0,
            function (e) {
                console.error(e);
            }
        );

        function resize() {
            if (!container) {
                return;
            }
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        function animate() {
            requestAnimationFrame(animate);

            const delta = clock.getDelta();

            mixer.update(delta);

            controls.update();
            shadowCameraHelper.update();

            renderer.render(scene, camera);
        }

        container.addEventListener("resize", resize);
        return () => {
            container.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <StyledPageHome>
            <div ref={rendererContainerRef} className="renderer-wrap"></div>
        </StyledPageHome>
    );
};