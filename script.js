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
    let currentRotation = 0;
    let touchStartAngle = 0;

    const getTouchAngle = (touch, element) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        return Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);
    };

    const onMouseMove = (event) => {
        const rect = dial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(event.clientY - centerY, event.clientX - centerY) * (180 / Math.PI);

        let deltaAngle = angle - startAngle;

        if (deltaAngle > 180) deltaAngle -= 360;
        if (deltaAngle < -180) deltaAngle += 360;

        currentRotation = Math.min(Math.max(currentRotation + deltaAngle, 0), 360);

        dial.style.transform = `rotate(${currentRotation}deg)`;
        callback(currentRotation);

        startAngle = angle;
    };

    const onTouchMove = (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        const angle = getTouchAngle(touch, dial);
        
        let deltaAngle = angle - touchStartAngle;
        
        if (deltaAngle > 180) deltaAngle -= 360;
        if (deltaAngle < -180) deltaAngle += 360;

        currentRotation = Math.min(Math.max(currentRotation + deltaAngle, 0), 360);
        dial.style.transform = `rotate(${currentRotation}deg)`;
        callback(currentRotation);

        touchStartAngle = angle;
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    const onTouchEnd = () => {
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
    };

    dial.addEventListener('touchstart', (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        touchStartAngle = getTouchAngle(touch, dial);
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);
    });

    dial.addEventListener('mousedown', (event) => {
        const rect = dial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerY) * (180 / Math.PI);
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
    
    pages.forEach(page => {
        page.style.display = 'none';
    });

    content.classList.add('static-effect');

    setTimeout(() => {
        currentPageIndex = newIndex;
        
        pages[currentPageIndex].style.display = 'block';
        pages[currentPageIndex].classList.add('active');
        
        updateScreenContent();

        content.classList.remove('static-effect');
    }, 500);
}

buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        if (index !== currentPageIndex) {
            changePage(index);
        }
    });
});

rotateDial(chanelDial, (rotation) => {
    const newIndex = Math.floor((rotation / 90)) % pages.length;
    if (newIndex !== currentPageIndex) {
        changePage(newIndex);
    }
});

updateScreenContent();
