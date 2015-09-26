// Start off by initializing a new context.
(function() {
var audioContext = new(window.AudioContext || window.webkitAudioContext)();

if (!audioContext.createGain)
    audioContext.createGain = audioContext.createGainNode;
if (!audioContext.createDelay)
    audioContext.createDelay = audioContext.createDelayNode;
if (!audioContext.createScriptProcessor)
    audioContext.createScriptProcessor = audioContext.createJavaScriptNode;

function loadSounds(obj, soundMap, callback) {
    // Array-ify
    var names = [];
    var paths = [];
    for (var name in soundMap) {
        var path = soundMap[name];
        names.push(name);
        paths.push(path);
    }
    bufferLoader = new BufferLoader(audioContext, paths, function(bufferList) {
        for (var i = 0; i < bufferList.length; i++) {
            var buffer = bufferList[i];
            var name = names[i];
            obj[name] = buffer;
        }
        if (callback) {
            callback();
        }
    });
    bufferLoader.load();
}

function BufferLoader(audioContext, urlList, callback) {
    this.audioContext = audioContext;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.audioContext.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length)
                    loader.onload(loader.bufferList);
            },
            function(error) {
                console.error('decodeAudioData error', error);
            }
        );
    }

    request.onerror = function() {
        alert('BufferLoader: XHR error');
    }

    request.send();
};

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
};


/*
 * Copyright 2013 Boris Smus. All Rights Reserved.
 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


// var WIDTH = 640;
// var HEIGHT = 360;

// Interesting parameters to tweak!
var SMOOTHING = 0.8;
var FFT_SIZE = 32; // 快速傅里叶变换

function Visualizer(callback) {
    var that = this;
    this.analyser = audioContext.createAnalyser();

    this.analyser.connect(audioContext.destination);
    this.analyser.minDecibels = -140;
    this.analyser.maxDecibels = 0;

    this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
    this.times = new Uint8Array(this.analyser.frequencyBinCount);

    this.isPlaying = false;
    this.startTime = 0;
    this.startOffset = 0;

    this.freqCanvas = document.createElement('canvas');
    this.timeCanvas = document.createElement('canvas');
    this.cosCanvas = [];
    for (var i = 0; i < FFT_SIZE; i++) {
        this.cosCanvas.push(document.createElement('canvas'));
    }
}

Visualizer.prototype.load = function(path, callback) {
    loadSounds(this, {
        buffer: path,
    }, callback);
}

// Toggle playback
Visualizer.prototype.togglePlayback = function() {
    if (this.isPlaying) {
        // Stop playback
        this.source[this.source.stop ? 'stop' : 'noteOff'](0);
        this.startOffset += audioContext.currentTime - this.startTime;
        console.log('paused at', this.startOffset);
        // Save the position of the play head.
    } else {
        this.startTime = audioContext.currentTime;
        console.log('started at', this.startOffset);
        this.source = audioContext.createBufferSource();
        // Connect graph
        this.source.connect(this.analyser);
        this.source.buffer = this.buffer;
        this.source.loop = true;
        // Start playback, but make sure we stay in bound of the buffer.
        this.source[this.source.start ? 'start' : 'noteOn'](0, this.startOffset % this.buffer.duration);
        // Start visualizer.
        // requestAnimFrame(this.draw.bind(this));
    }
    this.isPlaying = !this.isPlaying;
}

Visualizer.prototype.draw = function(width, height) {
    this.width = width;
    this.height = height;

    this.analyser.smoothingTimeConstant = SMOOTHING;
    this.analyser.fftSize = FFT_SIZE;

    // Get the frequency data from the currently playing music
    this.analyser.getByteFrequencyData(this.freqs); // 频率数据
    this.analyser.getByteTimeDomainData(this.times); // 波形数据

    // this.drawFreq();
    // this.drawTime();
    // this.drawSolar();
}

Visualizer.prototype.drawFreq = function() {
    var canvas = this.freqCanvas;
    var drawContext = canvas.getContext('2d');
    canvas.backgroundAlpha = 0;
    canvas.width = this.width;
    canvas.height = this.height;

    // Draw the frequency domain chart.
    for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
        var value = this.freqs[i];
        var percent = value / 256;
        var height = this.height * percent;
        var offset = this.height - height;
        var barWidth = this.width / this.analyser.frequencyBinCount;
        var hue = i / this.analyser.frequencyBinCount * 360;
        drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        drawContext.fillRect(i * barWidth, offset, barWidth, height);
    }

    return canvas;
}


Visualizer.prototype.drawCos = function(i) {
    var canvas = this.cosCanvas[i];
    var drawContext = canvas.getContext('2d');
    canvas.backgroundAlpha = 0;
    canvas.width = this.width;
    canvas.height = this.height;

    var value = this.freqs[i];
    var percent = value / 256;
    var height = this.height * percent / 2;
    var width = this.width / 720;

    var x = canvas.translateX || 0;
    canvas.translateX = (x + width) % width;

    var y = this.height / 2;
    var hue = i / this.analyser.frequencyBinCount * 360;

    drawContext.strokeStyle = 'hsl(' + hue + ', 100%, 50%)';
    drawContext.lineWidth = 4;
    drawContext.translate(-x, y);
    drawContext.beginPath();  
    for(var j = 0; j < 360 * 2; j += 0.1){
        drawContext.lineTo(
            j * width, 
            Math.sin(j * width * Math.PI / 180) * height
        ); 
    }
    drawContext.stroke();  
    drawContext.restore();  
}

Visualizer.prototype.drawTime = function() {
    var canvas = this.timeCanvas;
    var drawContext = canvas.getContext('2d');
    canvas.backgroundAlpha = 0;
    canvas.width = this.width;
    canvas.height = this.height;

    // Draw the time domain chart.
    for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
        var value = this.times[i];
        var percent = value / 256;
        var height = this.height * percent;
        var offset = this.height - height;
        var barWidth = this.width / this.analyser.frequencyBinCount;
        var hue = i / this.analyser.frequencyBinCount * 360;
        drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        drawContext.fillRect(i * barWidth, offset, barWidth, 2);
    }
}

var rotationSpeed = Math.PI / 180;
var rotationCount = 0;

Visualizer.prototype.drawSolar = function() {
    var canvas = document.querySelector('#c3');
    var drawContext = canvas.getContext('2d');
    canvas.width = this.width;
    canvas.height = this.height;

    var that = this;
    var lineBreak = false;

    for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
        var value = this.times[i];
        var percent = value / 256;
        var hue = i / this.analyser.frequencyBinCount * 360;
        var cx = this.width / 2;
        var cy = this.height / 2 / 2;
        var r = (Math.min(cx, cy) / 2) * (1 + (percent - 0.5) / 3);
        var angle = hue * Math.PI / 180 + rotationSpeed * rotationCount;
        var px = cx + r * Math.cos(angle);
        var py = cy - r * Math.sin(angle);

        drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        drawContext.fillRect(px, py, 2, 2);

        if (percent > 0.9) {
            lineBreak = true;
        }
    }

    if (lineBreak) {
        for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
            var cx = this.width / 2;
            var cy = this.height / 2 / 2;
            var value = this.times[i];
            var percent = value / 256;
            var lx = this.width / this.analyser.frequencyBinCount * i;

            var ly = cy + (percent - 0.5) * 50;
            var hue = i / this.analyser.frequencyBinCount * 360;
            drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
            drawContext.fillRect(lx, ly, 1, 3);
        }
    }
    rotationCount = (rotationCount + 1) % 360;
}

Visualizer.prototype.getFrequencyValue = function(freq) {
    var nyquist = audioContext.sampleRate / 2;
    var index = Math.round(freq / nyquist * this.freqs.length);
    return this.freqs[index];
}

window.Visualizer = Visualizer;
})();