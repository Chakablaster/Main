document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.querySelector('.switch input[type="checkbox"]');
    const enterButton = document.getElementById('enter-btn');

    // Check for saved theme in localStorage or set default to dark mode
    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'dark');
    }

    // Apply saved theme or default to dark mode
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        toggleSwitch.checked = true;
    } else {
        document.body.classList.remove('light-mode');
        toggleSwitch.checked = false;
    }

    // Event listener for theme toggle switch
    toggleSwitch.addEventListener('change', () => {
        if (toggleSwitch.checked) {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Event listener for enter button to hide the landing screen
    enterButton.addEventListener('click', () => {
        document.body.classList.add('landing-hidden');
    });
});
