// Get a reference to the ul element
const ul = document.querySelector('ul');

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