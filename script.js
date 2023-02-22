// Initialize the photoData array with any previously uploaded photos from localStorage
const photoData = JSON.parse(localStorage.getItem('photoData')) || [];

// Get references to the form and ul elements
const form = document.querySelector('form');
const ul = document.querySelector('ul');

// Add an event listener to the form's submit button
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const file = e.target.elements.photo.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', () => {
        const photo = {
            id: Date.now(),
            src: reader.result,
        };
        photoData.push(photo);
        localStorage.setItem('photoData', JSON.stringify(photoData));
        displayPhotos();
    });

    reader.readAsDataURL(file);
});

// Display the photos stored in photoData
function displayPhotos() {
    ul.innerHTML = '';
    photoData.forEach((photo) => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = photo.src;
        li.appendChild(img);
        ul.appendChild(li);
    });
}

// Call displayPhotos() to initially display any previously uploaded photos
displayPhotos();


// Display the photos stored in photoData
function displayPhotos() {
    ul.innerHTML = '';
    photoData.forEach((photo) => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = photo.src;
        li.appendChild(img);
        ul.appendChild(li);
    });
}

// Call displayPhotos() to initially display any previously uploaded photos
displayPhotos();