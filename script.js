const volumeDial = document.getElementById('volume-dial');
const chanelDial = document.getElementById('chanel-dial');
const backgroundMusic = document.getElementById('background-music');
const pages = document.querySelectorAll('.page');
const pageList = document.getElementById('page-list');
const buttons = document.querySelectorAll('#buttons button'); // Select all buttons

let currentPageIndex = 0;
let volume = 0.5;

backgroundMusic.volume = volume;

function updateScreenContent() {
    const totalPages = pages.length;
    const prevIndex = (currentPageIndex - 1 + totalPages) % totalPages;
    const nextIndex = (currentPageIndex + 1) % totalPages;

    pageList.innerHTML = `
        <p class="prev">${pages[prevIndex].id.replace('-', ' ')}</p>
        <p class="current">${pages[currentPageIndex].id.replace('-', ' ')}</p>
        <p class="next">${pages[nextIndex].id.replace('-', ' ')}</p>
    `;
}

function rotateDial(dial, callback) {
    let startAngle = 0;
    let currentRotation = 0; // Track the current rotation

    const onMouseMove = (event) => {
        const rect = dial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);

        let deltaAngle = angle - startAngle;

        // Handle boundary crossing
        if (deltaAngle > 180) deltaAngle -= 360;
        if (deltaAngle < -180) deltaAngle += 360;

        // Update the current rotation and clamp it between 0 and 360
        currentRotation = Math.min(Math.max(currentRotation + deltaAngle, 0), 360);

        dial.style.transform = `rotate(${currentRotation}deg)`;
        callback(currentRotation);

        // Update the start angle for the next movement
        startAngle = angle;
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    dial.addEventListener('mousedown', (event) => {
        const rect = dial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

rotateDial(volumeDial, (rotation) => {
    volume = Math.min(Math.max((rotation % 360) / 360, 0), 1);
    backgroundMusic.volume = volume;
});

function changePage(newIndex) {
    const content = document.getElementById('content');
    pages[currentPageIndex]?.classList.remove('active'); // Remove active class from current page

    // Add static effect
    content.classList.add('static-effect');

    setTimeout(() => {
        currentPageIndex = newIndex; // Set the new page index
        pages[currentPageIndex]?.classList.add('active'); // Add active class to the new page
        updateScreenContent(); // Update the screen content

        // Remove static effect after animation
        content.classList.remove('static-effect');
    }, 500); // Match the duration of the static effect animation
}

// Update button click functionality
buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        if (index !== currentPageIndex) {
            changePage(index);
        }
    });
});

// Update channel dial functionality
rotateDial(chanelDial, (rotation) => {
    const newIndex = Math.floor((rotation / 90)) % pages.length; // Map rotation to page index
    if (newIndex !== currentPageIndex) {
        changePage(newIndex);
    }
});

// Initialize the screen content on page load
updateScreenContent();
