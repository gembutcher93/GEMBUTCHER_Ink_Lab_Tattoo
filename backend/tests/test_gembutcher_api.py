"""Backend API tests for GemButcher app."""
import os
import pytest
import requests
from datetime import datetime

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://neon-ink-lab-1.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Root greeting ---
class TestRoot:
    def test_root_greeting(self, api_client):
        r = api_client.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
        assert "studio" in data
        assert "Ozieri" in data["studio"] or "Podere" in data["studio"]


# --- Bookings ---
class TestBookings:
    created_id = None

    def test_create_booking_valid(self, api_client):
        payload = {
            "name": "TEST_Mario Rossi",
            "email": "test_mario@example.com",
            "style": "patutikon",
            "description": "TEST booking - full sleeve idea",
        }
        r = api_client.post(f"{API}/bookings", json=payload)
        assert r.status_code == 200, f"Body: {r.text}"
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert data["status"] == "pending"
        assert "created_at" in data
        # ISO timestamp validation
        try:
            datetime.fromisoformat(data["created_at"].replace("Z", "+00:00"))
        except Exception as e:
            pytest.fail(f"created_at not ISO: {data['created_at']} ({e})")
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["style"] == payload["style"]
        assert data["description"] == payload["description"]
        TestBookings.created_id = data["id"]

    def test_create_booking_invalid_email(self, api_client):
        payload = {
            "name": "TEST_Bad Email",
            "email": "not-an-email",
            "style": "anime",
            "description": "TEST invalid email",
        }
        r = api_client.post(f"{API}/bookings", json=payload)
        assert r.status_code == 422, f"Expected 422, got {r.status_code}: {r.text}"

    def test_create_booking_missing_required(self, api_client):
        payload = {"name": "TEST_Missing", "email": "test@example.com"}
        r = api_client.post(f"{API}/bookings", json=payload)
        assert r.status_code == 422

    def test_list_bookings(self, api_client):
        r = api_client.get(f"{API}/bookings")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # Verify our created booking is there
        if TestBookings.created_id:
            ids = [b["id"] for b in data]
            assert TestBookings.created_id in ids, "Created booking not found in list — persistence issue"
            found = next(b for b in data if b["id"] == TestBookings.created_id)
            assert found["status"] == "pending"
            assert found["email"] == "test_mario@example.com"

    def test_create_booking_all_styles(self, api_client):
        for style in ["polynesian", "cyberpunk", "anime", "patutikon"]:
            payload = {
                "name": f"TEST_style_{style}",
                "email": f"test_{style}@example.com",
                "style": style,
                "description": f"TEST style {style}",
                "language": "en",
            }
            r = api_client.post(f"{API}/bookings", json=payload)
            assert r.status_code == 200, f"Style {style} failed: {r.text}"
            assert r.json()["style"] == style
