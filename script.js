let users = [];
let currentUser = null;
const defaultReceiptID = "bdbooster1309"; // Default receipt ID

document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        displayMessage('User already exists. Please log in.', 'error');
    } else {
        const newUser = {
            username,
            password,
            balance: 0
        };
        users.push(newUser);
        displayMessage('User registered successfully. Please log in.', 'success');
        this.reset();
    }
});

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    currentUser = users.find(user => user.username === username && user.password === password);
    if (currentUser) {
        displayMessage('Login successful!', 'success');
        showWalletSection();
    } else {
        displayMessage('Invalid username or password.', 'error');
    }
});

document.getElementById('transaction-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    if (amount > 0) {
        currentUser.balance += amount;
        updateBalance();
        this.reset();
        displayMessage('Funds added successfully!', 'success');
    } else {
        displayMessage('Please enter a valid amount.', 'error');
    }
});

// Update send money functionality
document.getElementById('send-money-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const receiptId = document.getElementById('recipient-username').value; // Now using receipt ID
    const sendAmount = parseFloat(document.getElementById('send-amount').value);

    if (receiptId === defaultReceiptID) {
        if (sendAmount > 0 && sendAmount <= currentUser.balance) {
            currentUser.balance -= sendAmount;
            updateBalance();
            createReceipt(receiptId, sendAmount);
            this.reset();
            displayMessage(`Sent ${sendAmount} Taka via receipt ID ${receiptId} successfully!`, 'success');
        } else if (sendAmount > currentUser.balance) {
            displayMessage('Insufficient balance to send money.', 'error');
        } else {
            displayMessage('Please enter a valid amount.', 'error');
        }
    } else {
        displayMessage('Invalid receipt ID. Please try again.', 'error');
    }
});

document.getElementById('logout').addEventListener('click', function () {
    currentUser = null;
    hideWalletSection();
    displayMessage('Logged out successfully.', 'success');
});

function showWalletSection() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('wallet-section').style.display = 'block';
    document.getElementById('welcome-username').textContent = currentUser.username;
    updateBalance();
}

function hideWalletSection() {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('wallet-section').style.display = 'none';
}

function updateBalance() {
    const balanceElement = document.getElementById('balance');
    balanceElement.textContent = currentUser.balance.toFixed(2);
    balanceElement.classList.add('balance-update');
    setTimeout(() => balanceElement.classList.remove('balance-update'), 1000);
}

function createReceipt(receiptId, sendAmount) {
    const receiptsDiv = document.getElementById('receipts');
    const receiptDiv = document.createElement('div');
    receiptDiv.classList.add('receipt');
    receiptDiv.textContent = `Sent ${sendAmount} Taka via receipt ID: ${receiptId}.`;
    receiptsDiv.prepend(receiptDiv);
}

function displayMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.style.color = type === 'error' ? 'red' : 'green';
}
