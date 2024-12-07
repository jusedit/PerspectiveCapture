let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let captureButton = document.getElementById('capture');
let yawElement = document.getElementById('yaw');
let pitchElement = document.getElementById('pitch');
let rollElement = document.getElementById('roll');

// Device orientation values
let currentOrientation = {
    yaw: 0,
    pitch: 0,
    roll: 0
};

// Request camera access
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' },
            audio: false 
        });
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Error accessing camera. Please ensure camera permissions are granted.');
    }
}

// Handle device orientation
function handleOrientation(event) {
    if (event.alpha !== null) {
        currentOrientation.yaw = Math.round(event.alpha);
        currentOrientation.pitch = Math.round(event.beta);
        currentOrientation.roll = Math.round(event.gamma);

        yawElement.textContent = currentOrientation.yaw;
        pitchElement.textContent = currentOrientation.pitch;
        rollElement.textContent = currentOrientation.roll;
    }
}

// Capture image and orientation
captureButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
        const formData = new FormData();
        formData.append('image', blob);
        formData.append('orientation', JSON.stringify(currentOrientation));
        
        // Send to server
        fetch('/save-capture', {
            method: 'POST',
            body: JSON.stringify({
                image: canvas.toDataURL('image/jpeg'),
                orientation: currentOrientation
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
    }, 'image/jpeg');
});

// Initialize
initCamera();

// Request device orientation permission and start listening
if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    // iOS 13+ requires permission
    document.body.addEventListener('click', async () => {
        try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation);
            }
        } catch (error) {
            console.error('Error requesting orientation permission:', error);
        }
    }, { once: true });
} else {
    // Non-iOS devices
    window.addEventListener('deviceorientation', handleOrientation);
}
