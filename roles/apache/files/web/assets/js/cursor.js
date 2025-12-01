let currentFrame = 1;
const maxFrames = 14;
const elementsToUpdate = document.querySelectorAll('body, a, button');

function updateCursor() {
    const cursorImageUrl = `assets/img/cursor/frame${currentFrame}.gif`;
    const cursorCssValue = `url('${cursorImageUrl}'), auto`;
    elementsToUpdate.forEach(element => {
        element.style.cursor = cursorCssValue;
    });

    currentFrame = (currentFrame % maxFrames) + 1;
}

setInterval(updateCursor, 50);
