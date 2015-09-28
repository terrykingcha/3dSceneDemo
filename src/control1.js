(function() {
function SceneControl1(camera) {
    var controls;
    
    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = true;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [65, 83, 68];

    // controls.addEventListener('change', function() {
    //     that.render();
    // });

    this.update = function() {
        controls.update();
    } 
}

window.SceneControl1 = SceneControl1;
})()