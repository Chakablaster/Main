document.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.getElementById('enter-btn');

    enterBtn.addEventListener('click', () => {
        document.body.classList.add('landing-hidden');
    });
});
