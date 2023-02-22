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
    photoData.forEach((photo, index) => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        const deleteButton = document.createElement('button');
        const downloadButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => deletePhoto(index));
        downloadButton.innerText = 'Download';
        downloadButton.addEventListener('click', () => downloadPhoto(photo.src));
        img.src = photo.src;
        li.appendChild(img);
        li.appendChild(deleteButton);
        li.appendChild(downloadButton);
        ul.appendChild(li);
    });
}

// Call displayPhotos() to initially display any previously uploaded photos
displayPhotos();

// Delete a photo from photoData and localStorage
function deletePhoto(index) {
    photoData.splice(index, 1);
    localStorage.setItem('photoData', JSON.stringify(photoData));
    displayPhotos();
}

// Download a photo from the gallery
function downloadPhoto(photoSrc) {
    // Create a temporary anchor element to download the photo
    const downloadLink = document.createElement('a');
    downloadLink.href = photoSrc;
    downloadLink.download = 'photo.jpg';
    downloadLink.click();
}

// Get a reference to the create collection form
const createCollectionForm = document.querySelector('#create-collection-form');

// Handle form submission to create a new collection
createCollectionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const collectionName = event.target.elements['collection-name'].value;
    if (collectionName) {
        photoData.collections.push({ name: collectionName, photos: [] });
        localStorage.setItem('photoData', JSON.stringify(photoData));
        event.target.reset();
        alert(`Collection "${collectionName}" created successfully!`);
    }
});

// Display the photos stored in photoData for a specific collection
function displayPhotos(collectionName) {
    ul.innerHTML = '';
    const collection = photoData.collections.find((c) => c.name === collectionName);
    if (collection) {
        collection.photos.forEach((photo, index) => {
            // Create the li, img and delete button elements
            // ...

            // Add a new download button to download the photo
            const downloadButton = document.createElement('button');
            downloadButton.innerText = 'Download';
            downloadButton.addEventListener('click', () => downloadPhoto(photo.src));
            // Add the download button to the li element
            li.appendChild(downloadButton);

            // Add the li element to the ul element
            ul.appendChild(li);
        });
    }
}

// Function to download a photo
function downloadPhoto(src) {
    const link = document.createElement('a');
    link.href = src;
    link.download = 'photo.jpg';
    link.click();
}

// Display the list of collections in the sidebar
function displayCollections() {
    const sidebar = document.querySelector('#sidebar');
    const collections = photoData.collections.map((c) => `
    <li>
      <button class="collection-button" data-collection="${c.name}">
        ${c.name} (${c.photos.length} photos)
      </button>
      <button class="download-button" data-collection="${c.name}">
        Download All
      </button>
    </li>
  `).join('');
    sidebar.innerHTML = `
    <h2>Collections</h2>
    <ul>${collections}</ul>
  `;

    // Add event listeners to collection buttons and download buttons
    const collectionButtons = document.querySelectorAll('.collection-button');
    collectionButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const collectionName = button.dataset.collection;
            displayPhotos(collectionName);
        });
    });

    const downloadButtons = document.querySelectorAll('.download-button');
    downloadButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const collectionName = button.dataset.collection;
            downloadCollection(collectionName);
        });
    });
}

// Function to download all photos in a collection
function downloadCollection(collectionName) {
    const collection = photoData.collections.find((c) => c.name === collectionName);
    if (collection) {
        const zip = new JSZip();
        const folder = zip.folder(collectionName);
        collection.photos.forEach((photo, index) => {
            const filename = `photo${index + 1}.jpg`;
            fetch(photo.src)
                .then((response) => response.blob())
                .then((blob) => folder.file(filename, blob));
        });
        zip.generateAsync({ type: 'blob' })
            .then((content) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = `${collectionName}.zip`;
                link.click();
            });
    }
}