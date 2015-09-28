(function(){

function SceneSample2(scene, visualizer) {
    var wrapper = new THREE.Object3D();
    scene.add(wrapper);
    this.wrapper = wrapper;


    var sphere = new THREE.SphereGeometry(1);
    var sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF
    });

    /* 物体和材质 */
    var colors = [0xFF0000, 0xFFA500, 0xFFFF00, 0x00FF00,
        0x007FFF, 0x0000FF, 0x8B00FF
    ];

    var materials = [];
    for (var i = 0; i < colors.length; i++) {
        var material = new THREE.LineBasicMaterial({
            color: colors[i],
            linewidth: 5
        });
        materials.push(material);
    }

    var unit = {
        x: 500,
        y: 500,
        z: 500
    };
    var amount = {
        x: 4,
        y: 4,
        z: 10
    }

    var zLines = {};
    for (var x = 0; x < amount.x; x++) {
        for (var y = 0; y < amount.y; y++) {

            var zLine = zLines[x * unit.x + ',' + y * unit.y] = {
                minZOffset: 0,
                maxZOffset: unit.z * (amount.z - 3),
                material: materials[Math.floor(Math.random() * materials.length)],
                points: []
            };

            for (var z = 0; z < amount.z; z++) {
                zLine.points.push(new THREE.Vector3(x * unit.x, y * unit.y, z * unit.z));
            }
        }
    }

    function generatorLineObj(zLine, percent) {
        var lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(zLine.points[0].clone());

        var bufferPoint = new THREE.Vector3();
        var bezier = window.lib.cubicbezier.easeInOut;
        for (var i = 0; i < 1; i+= 0.01) {
            bufferPoint.x = zLine.startX;
            bufferPoint.y = zLine.startY + bezier(i) * zLine.yOffset;
            bufferPoint.z = zLine.startZ + i * zLine.zOffset;

            lineGeometry.vertices.push(bufferPoint.clone());
        }

        for (var i = 0; i < 1; i+=0.01) {
            bufferPoint.x = zLine.startX;
            bufferPoint.y = zLine.startY + bezier(1 - i) * zLine.yOffset;
            bufferPoint.z = zLine.startZ + (1 + i) * zLine.zOffset;

            lineGeometry.vertices.push(bufferPoint.clone());  
        }

        lineGeometry.vertices.push(zLine.points[amount.z - 1].clone());

        var obj = new THREE.Line(lineGeometry, zLine.material);
        obj.position = zLine.points[0].clone();
        return obj;
    }

    // var testing = false;
    // var PI = Math.PI;
    // var PI2 = PI * 2;
    // var HalfPI = PI / 2;
    function updateZLine(x, y, percent) {
        var zLine = zLines[x * unit.x + ',' + y * unit.y];

        if (zLine.obj) {
            wrapper.remove(zLine.obj);
        }

        if (!zLine.animate) {
            zLine.animate = true;

            var startVector = zLine.points[0];

            var yOffset = unit.y * percent;
            var zOffset = unit.z;
            zLine.yOffset = yOffset;
            zLine.zOffset = zOffset;

            var startX = startVector.x;
            var startY = startVector.y;
            var startZ = startVector.z + Math.random() * zLine.maxZOffset;

            zLine.startX = startX;
            zLine.startY = startY;
            zLine.startZ = startZ;

            zLine.obj = generatorLineObj(zLine);
        } else {
            zLine.startZ += 10;
            zLine.yOffset -= 10;
            zLine.yOffset = Math.max(0, zLine.yOffset);
            zLine.obj = generatorLineObj(zLine);
            if (zLine.yOffset === 0) {
                zLine.animate = false;
            }
        }

        wrapper.add(zLine.obj);
    }

    wrapper.position.set(-unit.x * (amount.x - 1) / 2, -unit.y * (amount.y - 1) / 2, -unit.z * (amount.z - 1) / 2);

    this.tick = function() {
        if (visualizer.isPlaying) {
            visualizer.analysis();
 
            var bitCount = visualizer.analyser.frequencyBinCount;
            var bitIndex = 0;
            for (var x = 0; x < amount.x; x++) {
                for (var y = 0; y < amount.y; y++) {
                    var percent = visualizer.times[(bitIndex++) % bitCount] / 256;
                    updateZLine(x, y, percent);
                }
            }
        }
    }
}   

window.SceneSample2 = SceneSample2;

})();