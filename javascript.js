document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.querySelector('input[name="image"]');
    const previewImage = document.getElementById('previewImage');
    const submitButton = document.getElementById('submitButton');
    const notification = document.getElementById('notification');
    const downloadButton = document.getElementById('downloadButton');
    const outputImage = document.getElementById('outputImage');
    const loading = document.getElementById('loading');

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            previewImage.style.display = 'none';
        }
    });

    submitButton.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('upload gambar dulu boss 🤬😡.');
            return;
        }

        const formData = new FormData();
        formData.append('image_file', file);

        // Tampilkan notifikasi loading dan gambar loading
        notification.style.display = 'block';
        notification.textContent = 'Menghapus latar belakang, mohon tunggu...';
        notification.className = 'loading';
        loading.style.display = 'block';

        try {
            const response = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: {
                    'X-Api-Key': 'VwaXZEhUDMTCQE8AKNYJwwWL' // Ganti dengan API key remove.bg Anda
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Gagal menghapus latar belakang gambar');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Tampilkan hasil dan notifikasi sukses
            outputImage.src = url;
            notification.textContent = 'Latar belakang berhasil dihapus!';
            notification.className = 'success';

            // Tampilkan tombol download dan atur fungsinya
            downloadButton.style.display = 'inline-block';
            downloadButton.onclick = () => {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'output.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
        } catch (error) {
            console.error('Error:', error);
            notification.textContent = 'Terjadi kesalahan saat memproses gambar.';
            notification.className = 'error';
        } finally {
            // Sembunyikan gambar loading setelah proses selesai
            loading.style.display = 'none';
        }
    });
});
