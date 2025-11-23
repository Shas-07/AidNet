<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AidNet - Blood Banks & Donors</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <style>
    body {
      font-family: "Poppins", sans-serif;
      background: #f9fafb;
      color: #111827;
      margin: 0;
    }

    header {
      background: #1e40af;
      color: #fff;
      padding: 16px;
      text-align: center;
      font-size: 22px;
      font-weight: 600;
    }

    .container {
      padding: 16px;
      text-align: center;
    }

    .btn {
      display: inline-block;
      background: #2563eb;
      color: #fff;
      padding: 10px 18px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      transition: 0.2s;
    }

    .btn:hover {
      background: #1e3a8a;
    }

    iframe {
      width: 100%;
      height: 420px;
      border: none;
      border-radius: 12px;
      margin-top: 14px;
    }

    .bloodbank-list {
      margin-top: 22px;
      text-align: left;
    }

    .bloodbank-card {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 12px;
      padding: 12px 16px;
      transition: transform 0.2s;
    }

    .bloodbank-card:hover {
      transform: scale(1.02);
    }

    .bloodbank-name {
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 4px;
    }

    .bloodbank-address {
      color: #64748b;
      font-size: 0.9rem;
      margin-bottom: 8px;
    }

    .bloodbank-actions button {
      margin-right: 8px;
      padding: 6px 10px;
      background: #2563eb;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }

    /* 🔴 Find Donor Section */
    #findDonorSection {
      background: #fff;
      margin: 30px auto;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
      max-width: 500px;
      text-align: center;
    }

    #findDonorSection h2 {
      color: #1e40af;
      margin-bottom: 12px;
    }

    #findDonorSection select {
      padding: 10px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 15px;
      outline: none;
      width: 100%;
      margin-bottom: 10px;
    }

    #findDonorSection button {
      background: #2563eb;
      color: white;
      padding: 10px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: 0.2s;
      width: 100%;
    }

    #findDonorSection button:hover {
      background: #1e3a8a;
    }

    .donor-result {
      margin-top: 16px;
      text-align: left;
      background: #f1f5f9;
      border-radius: 8px;
      padding: 10px;
    }

    .donor-item {
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .donor-item:last-child {
      border-bottom: none;
    }

    .donor-name {
      color: #1e40af;
      font-weight: 600;
    }

    .donor-group {
      color: #ef4444;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <header>
    AidNet – Live Blood Banks & Donor Finder
  </header>

  <div class="container">
    <div class="actions">
      <button class="btn" onclick="scrollToFindDonor()">
        <i class="fas fa-hand-holding-heart"></i> Find a Donor
      </button>
      <button class="btn" onclick="openGoogleMaps()">
        <i class="fas fa-map-marker-alt"></i> Open in Google Maps
      </button>
    </div>

    <!-- Live Map -->
    <iframe id="liveMap" loading="lazy" allowfullscreen></iframe>

    <!-- Dynamic Nearby List -->
    <div class="bloodbank-list" id="bloodbankList">
      <p style="text-align:center;color:#6b7280;">Fetching nearby blood banks...</p>
    </div>
  </div>

  <!-- 🔴 Find Donor Section -->
  <section id="findDonorSection">
    <h2>Find a Blood Donor</h2>
    <select id="bloodGroupSelect">
      <option value="">Select Blood Group</option>
      <option value="A+">A+</option>
      <option value="A-">A-</option>
      <option value="B+">B+</option>
      <option value="B-">B-</option>
      <option value="O+">O+</option>
      <option value="O-">O-</option>
      <option value="AB+">AB+</option>
      <option value="AB-">AB-</option>
    </select>
    <button onclick="findDonor()">Find Donor</button>
    <div id="donorResults" class="donor-result"></div>
  </section>

  <script>
    const mapFrame = document.getElementById("liveMap");
    const listContainer = document.getElementById("bloodbankList");

    function loadLiveMap(lat, lng) {
      mapFrame.src = `https://www.google.com/maps?q=blood+banks+near+@${lat},${lng}&z=14&output=embed`;
      updateNearbyList(lat, lng);
    }

    function loadDefaultMap() {
      mapFrame.src = "https://www.google.com/maps?q=blood+banks+near+me&output=embed";
      updateNearbyList(12.9716, 77.5946); // Bengaluru default
    }

    // ✅ Nearby blood banks
    function updateNearbyList(lat, lng) {
      listContainer.innerHTML = `
        <div class="bloodbank-card">
          <div class="bloodbank-name">Basaveshwara Blood Centre</div>
          <div class="bloodbank-address">APMC Road, near Kotak Mahindra Bank</div>
          <div class="bloodbank-actions">
            <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=Basaveshwara+Blood+Centre')">
              <i class="fas fa-directions"></i> Directions
            </button>
            <button onclick="window.location.href='tel:0801234567'">
              <i class="fas fa-phone"></i> Call
            </button>
          </div>
        </div>
        <div class="bloodbank-card">
          <div class="bloodbank-name">Community Blood Centre</div>
          <div class="bloodbank-address">2 km away from your location</div>
          <div class="bloodbank-actions">
            <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=Community+Blood+Centre')">
              <i class="fas fa-directions"></i> Directions
            </button>
            <button onclick="window.location.href='tel:0807654321'">
              <i class="fas fa-phone"></i> Call
            </button>
          </div>
        </div>
        <div class="bloodbank-card">
          <div class="bloodbank-name">City Hospital Blood Bank</div>
          <div class="bloodbank-address">4 km from your location</div>
          <div class="bloodbank-actions">
            <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=City+Hospital+Blood+Bank')">
              <i class="fas fa-directions"></i> Directions
            </button>
            <button onclick="window.location.href='tel:0809876543'">
              <i class="fas fa-phone"></i> Call
            </button>
          </div>
        </div>
      `;
    }

    // 🧭 Detect location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => loadLiveMap(pos.coords.latitude, pos.coords.longitude),
        () => loadDefaultMap(),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      loadDefaultMap();
    }

    function openGoogleMaps() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            window.open(`https://www.google.com/maps/search/blood+bank/@${pos.coords.latitude},${pos.coords.longitude},14z`, "_blank");
          },
          () => window.open("https://www.google.com/maps/search/blood+bank+near+me", "_blank")
        );
      } else {
        window.open("https://www.google.com/maps/search/blood+bank+near+me", "_blank");
      }
    }

    function scrollToFindDonor() {
      document.getElementById("findDonorSection").scrollIntoView({ behavior: "smooth" });
    }

    // 🩸 Dummy donor data
    const donors = [
      { name: "Ravi Kumar", blood: "A+", city: "Bengaluru", phone: "9876543210" },
      { name: "Priya Sharma", blood: "O+", city: "Mysuru", phone: "9123456780" },
      { name: "Karan Patel", blood: "B+", city: "Hubballi", phone: "9765432109" },
      { name: "Anjali Mehta", blood: "AB+", city: "Dharwad", phone: "9345678901" }
    ];

    // 🔍 Find donor
    function findDonor() {
      const group = document.getElementById("bloodGroupSelect").value;
      const donorDiv = document.getElementById("donorResults");
      donorDiv.innerHTML = "";

      if (!group) {
        donorDiv.innerHTML = "<p style='color:#dc2626;'>Please select a blood group.</p>";
        return;
      }

      const filtered = donors.filter(d => d.blood === group);

      if (filtered.length === 0) {
        donorDiv.innerHTML = `<p style='color:#6b7280;'>No donors found for ${group}.</p>`;
        return;
      }

      donorDiv.innerHTML = filtered.map(d => `
        <div class="donor-item">
          <div class="donor-name">${d.name}</div>
          <div><span class="donor-group">${d.blood}</span> • ${d.city}</div>
          <div>📞 ${d.phone}</div>
        </div>
      `).join("");
    }
  </script>
</body>
</html>
