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
    camera.position.set(0, 0, 1000); //放置位置
    scene.add(camera);
    this.camera = camera;


    /* 灯光 */
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100, 200, 100);
    scene.add(light);
    this.light = light;


    /* 物体和材质 */
    var colors = [0xFF0000, 0xFFA500, 0xFFFF00, 0x00FF00,
        0x007FFF, 0x0000FF, 0x8B00FF
    ];

    var materials = [];
    for (var i = 0; i < colors.length; i++) {
        var material = new THREE.MeshBasicMaterial({
            color: colors[i],
            side: THREE.DoubleSide,
            wireframe: false
        });
        materials.push(material);
    }
    this.materials = materials;


    var planes = [];
    var meshs = [];
    var planeUnit = 500;
    var planeLength = 3;
    var planeSegment = 3;
    var size = [planeLength * planeUnit, planeLength * planeUnit / planeSegment];

    var materialIndex = 0;
    var materialLength = materials.length;
    for (var i = 0; i < planeLength; i++) {
        for (var j = 0; j < planeSegment; j++) {
            var plane = new THREE.PlaneGeometry(size[0], size[1]);
            planes.push(plane);
            var mesh = new THREE.Mesh(plane, materials[materialIndex++ % materialLength]);
            meshs.push(mesh);
            scene.add(mesh);
            mesh.position.y = ((planeSegment / 2 - j) * planeUnit);
            mesh.position.z = ((planeLength / 2 - i) * planeUnit);
        }
    }
    this.planes = planes;
    this.meshs = meshs;

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

    var textures = new Array(meshs.length);

    this.setTexture = function(image, index) {
        var texture = new THREE.Texture(image, null, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, null, THREE.NearestFilter);
        textures[index] = texture;

        var mesh = meshs[index];
        mesh.material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            overdraw: 0.5,
        });
    }

    this.updateTexture = function() {
        for (var i = 0; i < textures.length; i++) {
            textures[i] && (textures[i].needsUpdate = true);
        }
    }
}

window.Scene = Scene;
})();