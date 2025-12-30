

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type = 'info') {
    alert(message);
}

