let selectedFilesArray = []; // Array to keep track of selected files

document.getElementById('files').addEventListener('change', function () {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = ''; // Clear previous file items

    selectedFilesArray = Array.from(this.files); // Update the array with selected files

    if (selectedFilesArray.length === 0) {
        fileList.innerHTML = '<li>No files selected.</li>'; // Message if no files are selected
        return;
    }

    selectedFilesArray.forEach((file, index) => {
        const li = document.createElement('li');

        // Shorten filename in case it is too big
        const result = normalizeText(file);

        li.className = 'document-item mr-5 mb-3 w-32 h-36 bg-white shadow-md rounded-xl flex flex-col items-center';
        li.innerHTML = `
            <button type="button" class="delete-button flex items-center justify-between w-full" onclick="deleteItem(event)">
                <div class="p-2 ml-auto bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 duration-300">
                    <i class="fas fa-trash text-purple-600 text-2xl hover:text-red-500 duration-300"></i>
                </div>
            </button>
            <i class="px-2 far fa-file-alt text-6xl text-black mb-3"></i>
            <span class="px-2 text-xs">${result}</span>
        `;
        li.dataset.index = index; // Store the file index in the list item
        fileList.appendChild(li);
    });

    updateFileInput();
});

function deleteItem(event) {
    const item = event.target.closest('.document-item');
    const index = parseInt(item.dataset.index); // Get the index from the data attribute

    if (item && index > -1) {
        selectedFilesArray.splice(index, 1); // Remove the file from the array
        item.remove(); // Remove the clicked item
        updateFileInput();

        if (selectedFilesArray.length === 0) {
            document.getElementById('fileList').innerHTML = '<li>No files selected.</li>'; // Show message if no files are left
        } else {
            updateFileList();
        }
    }
}

// Function to update the file input element based on selectedFilesArray
function updateFileInput() {
    const dataTransfer = new DataTransfer();
    selectedFilesArray.forEach(file => dataTransfer.items.add(file));
    document.getElementById('files').files = dataTransfer.files;
}

// Function to re-render the file list from the selectedFilesArray
function updateFileList() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = ''; // Clear the current list

    selectedFilesArray.forEach((file, index) => {
        const li = document.createElement('li');

        const result = normalizeText(file);

        console.log(result);

        li.className = 'document-item mr-5 mb-3 w-32 h-36 bg-white shadow-md rounded-xl flex flex-col items-center';
        li.innerHTML = `
            <button type="button" class="delete-button flex items-center justify-between w-full" onclick="deleteItem(event)">
                <div class="p-2 ml-auto bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 duration-300">
                    <i class="fas fa-trash text-purple-600 text-2xl hover:text-red-500 duration-300"></i>
                </div>
            </button>
            <i class="px-2 far fa-file-alt text-6xl text-black mb-3"></i>
            <span class="px-2 text-xs">${result}</span>
        `;
        li.dataset.index = index;
        fileList.appendChild(li);
    });
}

// Helper function to normalize or shorten file names
function normalizeText(file) {

    let original_filename = file.name;
    let split = original_filename.split('.');
    let fileName = split[0];
    let extension = split[1];
    if (fileName.length > 15) {
        fileName = fileName.substring(0, 15);
    }
    var result = fileName + '.' + extension;

    return result;
}

document.getElementById("upload_files_info").addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
        document.getElementById('loading').classList.remove('hidden');

        const response = await fetch('http://localhost:5001/api/process', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const contentDisposition = response.headers.get('content-disposition');
        const filename = contentDisposition
            ? contentDisposition.split('filename=')[1].split(';')[0].replace(/"/g, '')
            : 'Classification.txt';

        const blob = await response.blob();

        const link = document.getElementById('downloadLink');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;

        const downloadList = document.getElementById('downloadList');
        downloadList.innerHTML = ''; // Clear previous items

        const li = document.createElement('li');
        li.className = 'document-item mr-5 mb-3 w-32 h-36 bg-white shadow-md rounded-xl flex flex-col items-center';
        li.innerHTML = `
            <a href="${url}" download="${filename}" class="block w-full h-full text-center">
                <button type="button" class="delete-button flex items-center justify-between w-full">
                    <div class="p-2 ml-auto bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 duration-300">
                        <i class="fas fa-trash text-purple-600 text-2xl hover:text-red-500 duration-300"></i>
                    </div>
                </button>
                <i class="px-2 far fa-file-alt text-6xl text-black mb-3"></i>
                <span class="px-2 text-xs">${filename}</span>
            </a>
        `;
        downloadList.appendChild(li);

        document.getElementById('loading').classList.add('hidden');
        document.getElementById('download').classList.remove('hidden');


    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('result').innerText = 'Error: ' + error.message;
    }
});
