(function () {
    document.addEventListener("mousemove", parallax);
    const elem = document.querySelector("#parallax");

    function parallax(e) {
        let hasDeviceGyro = document.querySelector("#hasDeviceGyro").value;
        if (hasDeviceGyro == 'false') {
            let _w = window.innerWidth / 2;
            let _h = window.innerHeight / 2;
            let _mouseX = e.clientX;
            let _mouseY = e.clientY;
            let _depth1 = `${50 - (_mouseX - _w) * 0.003}% ${50 - (_mouseY - _h) * 0.01}%`;
            let _depth2 = `${50 - (_mouseX - _w) * 0.005}% ${50 - (_mouseY - _h) * 0.02}%`;
            let _depth3 = `${50 - (_mouseX - _w) * 0.015}% ${50 - (_mouseY - _h) * 0.06}%`;
            let x = `${_depth3}, ${_depth2}, ${_depth1}`;
            elem.style.backgroundPosition = x;
        }
    }
})();
