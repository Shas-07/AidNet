async function ensureAuthedFund() {
    const auth = AidNet.getAuth();
    if (!auth) {
        window.location.href = 'login.html';
        return null;
    }
    return auth;
}

document.addEventListener('DOMContentLoaded', async () => {
    const auth = await ensureAuthedFund();
    if (!auth) return;

    const fundraiserForm = document.getElementById('fundraiserForm');
    const fundraiserMessage = document.getElementById('fundraiserMessage');
    const fundraiserList = document.getElementById('fundraiserList');

    if (fundraiserForm) {
        fundraiserForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = new FormData(fundraiserForm);
            const payload = {
                user_id: auth.id,
                title: form.get('title'),
                description: form.get('description'),
                target_amount: parseInt(form.get('target_amount'), 10)
            };
            const res = await AidNet.post('create_fundraiser.php', payload);
            fundraiserMessage.textContent = res.success ? 'Fundraiser created.' : (res.error || 'Failed');
            if (res.success) {
                fundraiserForm.reset();
                await loadFundraisers();
            }
        });
    }

    async function loadFundraisers() {
        const res = await AidNet.get('list_fundraisers.php');
        if (res.success && Array.isArray(res.data)) {
            fundraiserList.innerHTML = res.data.map(f => `
                <div class="card">
                    <h4>${f.title}</h4>
                    <p class="muted">${f.description}</p>
                    <p class="muted">Raised: $${f.raised} / $${f.target_amount}</p>
                    <div class="grid">
                        <input type="number" min="1" step="1" placeholder="Amount" id="donate-${f.id}">
                        <button class="button" onclick="donateTo(${f.id})">Donate</button>
                    </div>
                </div>
            `).join('');
        } else {
            fundraiserList.textContent = res.error || 'No fundraisers found.';
        }
    }

    window.donateTo = async function(fundraiserId) {
        const input = document.getElementById(`donate-${fundraiserId}`);
        const amount = parseInt(input.value, 10);
        if (!amount || amount < 1) return alert('Enter a valid amount');
        const res = await AidNet.post('donate.php', { user_id: auth.id, fundraiser_id: fundraiserId, amount });
        alert(res.success ? 'Donation recorded. Thank you!' : (res.error || 'Failed to donate'));
        if (res.success) loadFundraisers();
    }

    loadFundraisers();
});


