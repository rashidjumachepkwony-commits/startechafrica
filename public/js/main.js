// Load apps from server
async function loadApps() {
    try {
        const response = await fetch('/api/apps');
        const apps = await response.json();
        displayApps(apps);
    } catch (error) {
        console.error('Error loading apps:', error);
        document.getElementById('appsContainer').innerHTML = 
            '<p style="text-align:center;color:#e74c3c;">❌ Failed to load apps. Please refresh.</p>';
    }
}

// Display apps
function displayApps(apps) {
    const container = document.getElementById('appsContainer');
    container.innerHTML = apps.map(app => `
        <div class="app-card">
            <div class="app-icon">${app.icon}</div>
            <h3>${app.name}</h3>
            <p>${app.description}</p>
            <span class="app-price">KES ${app.price}</span>
            <button class="btn-buy" onclick="buyApp('${app.id}', '${app.name}', ${app.price})">
                Buy Now 💳
            </button>
        </div>
    `).join('');
}

// Buy button - Initialize Paystack Payment
async function buyApp(appId, appName, price) {
    // Show loading state
    const buttons = document.querySelectorAll('.btn-buy');
    buttons.forEach(btn => {
        btn.textContent = '⏳ Processing...';
        btn.disabled = true;
    });

    try {
        // Get customer email
        const email = prompt('Enter your email address for the download link:', 'customer@example.com');
        
        if (!email) {
            alert('Email is required to receive your download link.');
            buttons.forEach(btn => {
                btn.textContent = 'Buy Now 💳';
                btn.disabled = false;
            });
            return;
        }

        // Initialize payment with server
        const response = await fetch('/api/initialize-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                appId: appId,
                appName: appName,
                price: price,
                customerEmail: email
            })
        });

        const data = await response.json();

        if (data.authorization_url) {
            // Redirect to Paystack payment page
            window.location.href = data.authorization_url;
        } else {
            alert('Payment initialization failed: ' + (data.error || 'Unknown error'));
            buttons.forEach(btn => {
                btn.textContent = 'Buy Now 💳';
                btn.disabled = false;
            });
        }
    } catch (error) {
        console.error('Payment error:', error);
        alert('Error: ' + error.message);
        buttons.forEach(btn => {
            btn.textContent = 'Buy Now 💳';
            btn.disabled = false;
        });
    }
}

// Load apps when page loads
document.addEventListener('DOMContentLoaded', loadApps);