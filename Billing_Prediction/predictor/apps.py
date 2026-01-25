# from django.apps import AppConfig


# class PredictorConfig(AppConfig):
#     name = 'predictor'


# predictor/apps.py
from django.apps import AppConfig
import os
import joblib
import gdown
from django.conf import settings

class PredictorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'predictor'

    model = None

    def ready(self):
        if PredictorConfig.model is not None:
            return  # already loaded

        model_path = os.path.join(settings.BASE_DIR, "billing_model_pipeline.joblib")
        file_id = os.getenv("GDRIVE_MODEL_ID")

        if not os.path.exists(model_path):
            if not file_id:
                raise RuntimeError("GDRIVE_MODEL_ID not set")

            url = f"https://drive.google.com/uc?id={file_id}"
            print("⬇️ Downloading model from Google Drive...")
            gdown.download(url, model_path, quiet=False)

        print("📦 Loading ML model into memory...")
        PredictorConfig.model = joblib.load(model_path)
        print("✅ Model loaded successfully")
