import * as THREE from "three";
import { Scene } from "three";
import { OrbitControls } from "./jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./jsm/loaders/GLTFLoader.js";

let robot, scene, camera, renderer, controls, light, light2, angle, x, y, z;

const socket = io();

init();

socket.on("gyr-data", (data) => {
  document.getElementById("data").innerHTML = data;
  angle = data.split("\t");
  x = parseInt(angle[1], 10);
  y = parseInt(angle[2], 10);
  z = parseInt(angle[3], 10);
});

let loader = new GLTFLoader();
loader.load("models/combine.glb", (object) => {
  robot = object.scene.children[0];
  robot.position.set(0, 0, 0);
  robot.castShadow = true;
  robot.receiveShadow = true;
  scene.add(robot);

  render();
});

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 10);

  light = new THREE.DirectionalLight(0xffffff);
  scene.add(light);

  light2 = new THREE.AmbientLight(0xffffff, 2);
  scene.add(light2);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("container").appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
}

function render() {
  robot.rotation.set((y * Math.PI) / 180, (x * Math.PI) / 180, (z * Math.PI) / 180);

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
