import requests

API_BASE = "http://127.0.0.1:8000/api/"  # ⚠ Change if backend deployed


# -------------------- LOGIN -------------------- #
def login(username, password):
    try:
        resp = requests.post(
            f"{API_BASE}login/",
            json={"username": username, "password": password},
            headers={"Content-Type": "application/json"}
        )
        resp.raise_for_status()
        data = resp.json()

        if "token" not in data:
            raise Exception("Login failed: token not received")

        return data["token"]
    except Exception as e:
        raise Exception(f"Login error: {e}")


# -------------------- UPLOAD CSV -------------------- #
def upload_csv(file_path, token):
    try:
        with open(file_path, "rb") as f:
            resp = requests.post(
                f"{API_BASE}upload/",
                files={'file': f},
                headers={
                    "Authorization": f"Token {token}"
                }
            )
        resp.raise_for_status()

        data = resp.json()
        if "id" not in data:
            raise Exception("Upload failed: Missing dataset ID")

        return data
    except Exception as e:
        raise Exception(f"Upload error: {e}")


# -------------------- FETCH HISTORY -------------------- #
def fetch_history(token):
    try:
        resp = requests.get(
            f"{API_BASE}history/",
            headers={"Authorization": f"Token {token}"}
        )
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        raise Exception(f"History fetch error: {e}")


# -------------------- FETCH SUMMARY -------------------- #
def fetch_summary(dataset_id, token):
    try:
        resp = requests.get(
            f"{API_BASE}summary/{dataset_id}/",
            headers={"Authorization": f"Token {token}"}
        )
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        raise Exception(f"Summary fetch error: {e}")


# -------------------- DELETE DATASET -------------------- #
def delete_dataset(dataset_id, token):
    try:
        resp = requests.delete(
            f"{API_BASE}dataset/delete/{dataset_id}/",
            headers={"Authorization": f"Token {token}"}
        )
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        raise Exception(f"Delete error: {e}")
