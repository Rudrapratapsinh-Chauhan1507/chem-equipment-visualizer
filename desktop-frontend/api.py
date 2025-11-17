import requests

API_BASE = "http://127.0.0.1:8000/api/"

def login(username, password):
    resp = requests.post(f"{API_BASE}auth/login/", json={"username": username, "password": password})
    resp.raise_for_status()
    return resp.json()["token"]

def upload_csv(file_path, token):
    with open(file_path, "rb") as f:
        resp = requests.post(
            f"{API_BASE}upload/",
            files={'file': f},
            headers={"Authorization": f"Token {token}"}
        )
    resp.raise_for_status()
    return resp.json()

def fetch_history(token):
    resp = requests.get(
        f"{API_BASE}history/",
        headers={"Authorization": f"Token {token}"}
    )
    resp.raise_for_status()
    return resp.json()

def fetch_summary(dataset_id, token):
    resp = requests.get(
        f"{API_BASE}summary/{dataset_id}/",
        headers={"Authorization": f"Token {token}"}
    )
    resp.raise_for_status()
    return resp.json()
