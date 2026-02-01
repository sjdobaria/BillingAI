import os
import joblib
import gdown
from dotenv import load_dotenv

load_dotenv()

MODEL_PATH = "billing_model_pipeline.joblib"
GDRIVE_FILE_ID = os.getenv("GDRIVE_MODEL_ID")

def get_model():
    if not os.path.exists(MODEL_PATH):
        url = f"https://drive.google.com/uc?id={GDRIVE_FILE_ID}"
        print("⬇️ Downloading model from Google Drive...")
        gdown.download(url, MODEL_PATH, quiet=False)

    print("✅ Loading ML model...")
    return joblib.load(MODEL_PATH)
