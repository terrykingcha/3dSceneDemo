/* 场景 */
(function() {

function Scene() {
    var that = this;
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;

    /* 场景 */
    var scene = new THREE.Scene();
    this.scene = scene;

    /* 渲染器 */
    var renderer = new THREE.WebGLRenderer(); //有Canvas，WebGL，SVG三种模式
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x00000, 1);
    this.renderer = renderer;

    /* 摄像头 */
    var VIEW_ANGLE = 30;
    var ASPECT = WIDTH / HEIGHT;
    var NEAR = 1;
    var FAR = 100000;
    var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR); /* 摄像机视角，视口长宽比，近切面，远切面 */
    camera.position.set(0, 0, 10000); //放置位置
    // camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    this.camera = camera;

    /* 灯光 */
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100, 200, 100);
    scene.add(light);
    this.light = light;

    this.resize = function() {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    }

    this.render = function () {
        renderer.render(scene, camera);
    }
}

window.Scene = Scene;
})();