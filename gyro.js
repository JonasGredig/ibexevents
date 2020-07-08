import {
    AbsoluteOrientationSensor,
    RelativeOrientationSensor
} from './motion-sensors.js';

const params = new URLSearchParams(new URL(window.location.href).search.slice(1));
const relative = !!Number(params.get("relative"));
const coordinateSystem = params.get("coord");
const elem = document.querySelector("#parallax");
let sensor;

if (navigator.permissions) {
    // https://w3c.github.io/orientation-sensor/#model
    Promise.all([navigator.permissions.query({ name: "accelerometer" }),
        navigator.permissions.query({ name: "magnetometer" }),
        navigator.permissions.query({ name: "gyroscope" })])
        .then(results => {
            if (results.every(result => result.state === "granted")) {
                initSensor();
            } else {
                console.log("Permission to use sensor was denied.");
            }
        }).catch(err => {
        console.log("Integration with Permissions API is not enabled, still try to start app.");
        initSensor();
    });
} else {
    console.log("No Permissions API, still try to start app.");
    initSensor();
}


function initSensor() {
    const options = { frequency: 60, coordinateSystem };
    console.log(JSON.stringify(options));
    sensor = relative ? new RelativeOrientationSensor(options) : new AbsoluteOrientationSensor(options);
    sensor.onreading = () => onReadingSensor(sensor);
    sensor.onerror = (event) => {
        if (event.error.name == 'NotReadableError') {
            console.log("Sensor is not available.");
        }
    }
    sensor.start();
}

function onReadingSensor(sensor) {
    console.log('Quaternion: ' + sensor.quaternion);
    let angles = quatToEulAngle(sensor.quaternion);
    console.log('Angles: ' + angles);

    let _w = window.innerWidth / 2;
    let _h = window.innerHeight / 2;
    let _mouseX = angles[1] * 10;
    console.log('X: ' + _mouseX + '   width: ' + _w);
    let _mouseY = angles[2] * 10;
    console.log('Y: ' + _mouseY + '   height: ' + _h);
    let _depth1 = `${50 - (_mouseX - _w) * 0.01}% ${50 - (_mouseY - _h) * 0.01}%`;
    let _depth2 = `${50 - (_mouseX - _w) * 0.02}% ${50 - (_mouseY - _h) * 0.02}%`;
    let _depth3 = `${50 - (_mouseX - _w) * 0.06}% ${50 - (_mouseY - _h) * 0.06}%`;
    let x = `${_depth3}, ${_depth2}, ${_depth1}`;
    elem.style.backgroundPosition = x;
}

function quatToEulAngle(quaternion) {
    let angles = [];
    angles[0] = Math.atan2(2 * (quaternion[1] * quaternion[0] - quaternion[2] * quaternion[3]), (quaternion[0] * quaternion[0] - quaternion[1] * quaternion[1] - quaternion[2] * quaternion[2] + quaternion[3] * quaternion[3]))*(180/Math.PI);
    angles[1] = Math.asin(2 * (quaternion[1] * quaternion[3] + quaternion[2] * quaternion[0]))*(180/Math.PI);
    angles[2] = Math.atan2(2 * (quaternion[3] * quaternion[0] - quaternion[1] * quaternion[2]), (quaternion[0] * quaternion[0] + quaternion[1] * quaternion[1] - quaternion[2] * quaternion[2] - quaternion[3] * quaternion[3]))*(180/Math.PI);
    return angles;
}