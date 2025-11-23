# AidNet – Emergency Medical Aid App

Run locally on XAMPP (Apache + MySQL)

## Setup
1. Copy project folder to `C:\xampp\htdocs\aidnet` (or clone there).
2. Import DB:
   - Open phpMyAdmin at `http://localhost/phpmyadmin`.
   - Create DB `aidnet` or import `schema.sql`.
3. Access app at `http://localhost/AidNet/landing/` for the landing page.

## API Endpoints (JSON)
- `api/register.php` POST: { name, email, password, role }
- `api/login.php` POST: { email, password }
- `api/report_emergency.php` POST: { user_id, title, description, lat, lng, severity }
- `api/list_emergencies.php` GET
- `api/offer_help.php` POST: { user_id, emergency_id }
- `api/create_fundraiser.php` POST: { user_id, title, description, target_amount }
- `api/list_fundraisers.php` GET
- `api/donate.php` POST: { user_id, fundraiser_id, amount }
- `api/submit_feedback.php` POST: { name, email, feedback, user_id (optional) }
- `api/get_leaderboard.php` GET

All responses: `{ success, data, error }`.

## Notes
- PHP uses `mysqli` with prepared statements.
- Passwords are hashed via `password_hash`.
- Minimal PII stored; action logs for audit.


