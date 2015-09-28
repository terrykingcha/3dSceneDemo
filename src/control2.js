(function() {

function SceneControl2(camera) {
    var isUserInteracting = false,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 270, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0,
    target = new THREE.Vector3();

    function onDocumentMouseDown( event ) {
        event.preventDefault();
        isUserInteracting = true;
        onPointerDownPointerX = event.clientX;
        onPointerDownPointerY = event.clientY;
        onPointerDownLon = lon;
        onPointerDownLat = lat;
    }

    function onDocumentMouseMove( event ) {
        if ( isUserInteracting === true ) {
            lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
            lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
        }
    }

    function onDocumentMouseUp( event ) {
        isUserInteracting = false;
    }

    function onDocumentMouseWheel( event ) {
        camera.fov -= event.wheelDeltaY * 0.05;
        camera.fov = Math.min(camera.fov, 100);
        camera.fov = Math.max(camera.fov, 45);
        camera.updateProjectionMatrix();
    }

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

    this.update = function() {
        if (isUserInteracting) {
            lat = Math.max( - 85, Math.min( 85, lat ) );
            phi = THREE.Math.degToRad( 90 - lat );
            theta = THREE.Math.degToRad( lon );

            target.x = 500 * Math.sin( phi ) * Math.cos( theta );
            target.y = 500 * Math.cos( phi );
            target.z = 500 * Math.sin( phi ) * Math.sin( theta );
            camera.lookAt( target );
        }
    }
}

window.SceneControl2 = SceneControl2;
})();