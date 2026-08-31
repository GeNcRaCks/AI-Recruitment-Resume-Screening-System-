from fastapi.testclient import TestClient

from src.api.main import app


client = TestClient(app)


def test_resend_verification_endpoint_exists_and_requires_auth():
    response = client.post("/auth/resend-verification")
    assert response.status_code == 401, response.text
