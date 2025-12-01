const textElements = document.querySelectorAll('.glitchy');
textElements.forEach(el => {
    const originalText = el.textContent;
    const splitText = originalText.split("");
    const glitchContainer = document.createElement('div');
    glitchContainer.setAttribute('class', 'glitch');
    glitchContainer.setAttribute('data-text', originalText);
    el.textContent = "";

    splitText.forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.animationDelay = `${index * 0.05}s`;
        glitchContainer.appendChild(span);
    });

    el.appendChild(glitchContainer);
});
