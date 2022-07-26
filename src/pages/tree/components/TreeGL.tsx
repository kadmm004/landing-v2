/* eslint-disable */
import React, { useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getPublicAssetPath, IS_MOBILE } from '../../../utils';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { PageType } from '../../app/App.config';
import {
    AppContext,
    loadingEE,
    LoadingSourceType,
    usePageVisible,
} from '../../app/App.utils';
import './TreeGL.less';


const POINT_DATA = [
    {
        position: new THREE.Vector3(1.6, 1.7, 0.3),
        camera: new THREE.Vector3(8, 2, 0),
        title: 'GameWorld1',
    },
    {
        position: new THREE.Vector3(2.3, 0, 1.3),
        camera: new THREE.Vector3(8, 2, 0),
        title: 'Swap',
    },
    {
        position: new THREE.Vector3(1.8, 0.3, -1.7),
        camera: new THREE.Vector3(0, 2, -8),
        title: 'Meritocracy',
    },
    {
        position: new THREE.Vector3(-1, 0.2, 1.5),
        camera: new THREE.Vector3(0, 2, 8),
        title: 'GameMaster',
    }
]
export const TreeGL = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    usePageVisible(PageType.Tree, () => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        let frameId: number = 0;
        let mixer: THREE.AnimationMixer;
        const clock = new THREE.Clock();
        let isAutoRotate: boolean = true;
        let root: THREE.Group;

        // FPS
        // const stats = new Stats();
        // container.appendChild( stats.dom );

        // 初始化render,背景透明
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        const pmremGenerator = new THREE.PMREMGenerator(renderer);

        // 初始化场景
        const scene = new THREE.Scene();
        // scene.background = new THREE.Color( 0xbfe3dd );
        scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

        root = new THREE.Group();
        scene.add(root);

        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(container.clientWidth, container.clientHeight);
        // labelRenderer.domElement.style.position = 'absolute';
        // labelRenderer.domElement.style.top = '0px';
        labelRenderer.domElement.style.pointerEvents = 'none';
        labelRenderer.domElement.className = 'vision-canvas';
        container.appendChild(labelRenderer.domElement);

        // 初始化相机
        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.set(5, 2, 8);


        // 初始化控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        //设置控制器的中心点
        controls.target.set(0, 0.5, 0);

        controls.enablePan = false;
        // 使动画循环使用时阻尼或自转 意思是否有惯性
        controls.enableDamping = true;
        //动态阻尼系数 就是鼠标拖拽旋转灵敏度
        // 阻尼系数
        controls.dampingFactor = 0.1;
        //是否可以缩放
        controls.enableZoom = false;
        controls.minPolarAngle = Math.PI * 0.5;
        controls.maxPolarAngle = Math.PI * 0.5;
        //是否自动旋转
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.5;
        let model: THREE.Group;

        const loader = new GLTFLoader();
        loader.load(
            getPublicAssetPath('files/tree/ThirdPersonExampleMap.gltf'), (gltf) => {
                const model = gltf.scene;
                model.position.set(0, -2, 0);
                model.scale.set(1, 1, 1);
                scene.add(model);
                mixer = new THREE.AnimationMixer(model);

                mixer = new THREE.AnimationMixer(model);
                mixer.clipAction(gltf.animations[0]).play();

                animate();
                loadingEE.emit(
                    `progress.${LoadingSourceType.TREE_MODEL}`,
                    1
                );
            }, function (xhr) {
                const loaded = xhr.loaded;
                const total = xhr.total;
                const percent = (loaded / total);

            }, function (e) {

                console.error(e);

            })

        // function load() {
        //     if (loaded || loading) {
        //         return;
        //     }
        //     loading = true;
        //     container?.classList.add('app-container-loading');
        //     container?.classList.add('loading');

        // }

        POINT_DATA.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'vision-label';
            div.innerHTML = `<div class="vision-label-text">${item.title}</div>`
            // div.textContent = 'test'
            const label = new CSS2DObject(div);
            label.position.set(item.position.x, item.position.y, item.position.z);
            root.add(label);

        })


        window.onresize = function () {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
            labelRenderer.setSize(window.innerWidth, window.innerHeight);

        };

        function animate() {
            frameId = requestAnimationFrame(animate);

            const delta = clock.getDelta();

            mixer.update(delta);

            controls.update();

            // stats.update();

            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);

        }

        /** 首页loading结束后，再开始loading */
        // loadingEE.on('loaded', () => setTimeout(load, 200));

        return {
            onVisible: () => {
                // load();
                animate();
            },
            onHide: () => {
                cancelAnimationFrame(frameId);
            },
            onDestroy: () => { },
        };
    });

    return (
        <div className='tree-gl' ref={containerRef}>
        </div>
    );
};
