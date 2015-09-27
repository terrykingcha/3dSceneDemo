(function() {
function SceneSample1(scene, visualizer) {
    /* 物体和材质 */
    var colors = [0xFF0000, 0xFFA500, 0xFFFF00, 0x00FF00,
        0x007FFF, 0x0000FF, 0x8B00FF
    ];

    var materials = [];
    for (var i = 0; i < colors.length; i++) {
        var material = new THREE.MeshBasicMaterial({
            color: colors[i],
            opacity: 0.15,
            side: THREE.DoubleSide,
            wireframe: false
        });
        materials.push(material);
    }

    var planes = [];
    var meshs = [];
    var planeUnit = 500;
    var planeLength = 5;
    var planeSegment = 5;
    var size = [planeLength * planeUnit * 2, planeLength * planeUnit / planeSegment];

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
    
    var textures = new Array(meshs.length);
    function setTexture(image, index) {
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

    function updateTexture() {
        for (var i = 0; i < textures.length; i++) {
            textures[i] && (textures[i].needsUpdate = true);
        }
    }

    var vCos = [0, 2, 3, 5, 8, 11, 14];
    visualizer.ready().then(function() {
        var vCosIndex = 0;
        for (var i = 0; i < meshs.length; i++) {
            var canvas = visualizer.cosCanvas[vCos[vCosIndex++]];
            vCosIndex %= vCos.length;
            setTexture(canvas, i);
        }
    });

    this.tick = function() {
        if (visualizer.isPlaying) {

            visualizer.analysis();
            visualizer.draw(window.innerWidth, window.innerWidth / 3);
            for (var i = 0; i < vCos.length; i++) {
                visualizer.drawCos(vCos[i]);
            }
            updateTexture();
        }
    }
}

window.SceneSample1 = SceneSample1;
})()