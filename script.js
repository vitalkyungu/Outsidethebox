// Initialize the photoData array with any previously uploaded photos from localStorage
const photoData = JSON.parse(localStorage.getItem('photoData')) || { collections: [] };

// Get references to the form and ul elements
const form = $('form');
const ul = $('ul');

// Add an event listener to the form's submit button
form.on('submit', (e) => {
    e.preventDefault();
    const file = e.target.elements.photo.files[0];
    const reader = new FileReader();

    reader.on('load', () => {
        const photo = {
            id: Date.now(),
            src: reader.result,
        };
        photoData.collections[0].photos.push(photo);
        localStorage.setItem('photoData', JSON.stringify(photoData));
        displayPhotos();
    });

    reader.readAsDataURL(file);
});

// Display the photos stored in photoData
function displayPhotos() {
    ul.empty();
    photoData.collections[0].photos.forEach((photo, index) => {
        const li = $('<li></li>');
        const img = $('<img>').attr('src', photo.src);
        const deleteButton = $('<button>Delete</button>');
        deleteButton.on('click', () => deletePhoto(index));
        const downloadButton = $('<button>Download</button>');
        downloadButton.on('click', () => downloadPhoto(photo.src));
        li.append(img, deleteButton, downloadButton);
        ul.append(li);
    });
}

// Call displayPhotos() to initially display any previously uploaded photos
displayPhotos();

// Delete a photo from photoData and localStorage
function deletePhoto(index) {
    photoData.collections[0].photos.splice(index, 1);
    localStorage.setItem('photoData', JSON.stringify(photoData));
    displayPhotos();
}

// Download a photo from the gallery
function downloadPhoto(photoSrc) {
    // Create a temporary anchor element to download the photo
    const downloadLink = $('<a>').attr('href', photoSrc).attr('download', 'photo.jpg');
    downloadLink[0].click();
}

// Get a reference to the create collection form
const createCollectionForm = $('#create-collection-form');

// Handle form submission to create a new collection
createCollectionForm.on('submit', (event) => {
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
    ul.empty();
    const collection = photoData.collections.find((c) => c.name === collectionName);
    if (collection) {
        collection.photos.forEach((photo, index) => {
            // Create the li and img elements
            const li = $('<li></li>');
            const img = $('<img>').attr('src', photo.src);

            // Add a new download button to download the photo
            const downloadButton = $('<button>Download</button>');
            downloadButton.on('click', () => downloadPhoto(photo.src));

            // Add the download button to the li element
            li.append(img, downloadButton);

            // Add the li element to the ul element
            ul.append(li);
        });
    }
}
