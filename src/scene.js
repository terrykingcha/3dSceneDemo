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
    var VIEW_ANGLE = 100;
    var ASPECT = WIDTH / HEIGHT;
    var NEAR = 1;
    var FAR = 100000;
    var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR); /* 摄像机视角，视口长宽比，近切面，远切面 */
    camera.position.set(500, 500, 1000); //放置位置
    scene.add(camera);
    this.camera = camera;

    /* 灯光 */
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100, 200, 100);
    scene.add(light);
    this.light = light;

    /* 控制器 */
    var constrols;
    controls = new THREE.TrackballControls(camera);
    // controls.rotateSpeed = 1.0;
    // controls.zoomSpeed = 1.2;
    // controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = true;
    // controls.staticMoving = false;
    // controls.dynamicDampingFactor = 0.3;
    // controls.keys = [65, 83, 68];
    controls.addEventListener('change', function() {
        that.render();
    });
    this.controls = controls;

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

    this.updateControls = function() {
        controls.update();
    }
}

window.Scene = Scene;
})();