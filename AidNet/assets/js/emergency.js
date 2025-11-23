async function ensureAuthed() {
    const auth = AidNet.getAuth();
    if (!auth) {
        window.location.href = 'login.html';
        return null;
    }
    return auth;
}

document.addEventListener('DOMContentLoaded', async () => {
    const auth = await ensureAuthed();
    if (!auth) return;

    const nameEl = document.getElementById('userName');
    const roleEl = document.getElementById('userRole');
    const pointsEl = document.getElementById('userPoints');
    if (nameEl) nameEl.textContent = auth.name;
    if (roleEl) roleEl.textContent = auth.role;
    if (pointsEl) pointsEl.textContent = auth.points ?? 0;

    const reportForm = document.getElementById('reportForm');
    const reportMessage = document.getElementById('reportMessage');
    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = new FormData(reportForm);
            const payload = {
                user_id: auth.id,
                title: form.get('title'),
                description: form.get('description'),
                lat: parseFloat(form.get('lat')),
                lng: parseFloat(form.get('lng')),
                severity: form.get('severity')
            };
            const res = await AidNet.post('report_emergency.php', payload);
            reportMessage.textContent = res.success ? 'Emergency reported.' : (res.error || 'Failed to report');
            if (res.success) reportForm.reset();
        });
    }

    const emergencyList = document.getElementById('emergencyList');
    if (emergencyList) {
        const res = await AidNet.get('list_emergencies.php');
        if (res.success && Array.isArray(res.data)) {
            emergencyList.innerHTML = res.data.map(e => `
                <div class="card">
                    <h4>${e.title} <small class="muted">(${e.severity})</small></h4>
                    <p class="muted">${e.description}</p>
                    <p class="muted">@ ${e.lat}, ${e.lng}</p>
                    <button class="button" data-id="${e.id}" onclick="offerHelp(${e.id})">Offer Help</button>
                </div>
            `).join('');
        } else {
            emergencyList.textContent = res.error || 'No emergencies found.';
        }
    }
});

async function offerHelp(emergencyId) {
    const auth = AidNet.getAuth();
    if (!auth) return (window.location.href = 'login.html');
    const res = await AidNet.post('offer_help.php', { user_id: auth.id, emergency_id: emergencyId });
    alert(res.success ? 'Offer recorded. Thank you!' : (res.error || 'Failed to offer help'));
}


