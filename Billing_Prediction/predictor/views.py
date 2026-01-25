
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from datetime import datetime
from .mongo import predictions_collection

import pandas as pd
import joblib
import os
import gdown
from django.conf import settings

# =========================
# MODEL LOADING (SAFE)
# =========================

MODEL_PATH = os.path.join(settings.BASE_DIR, "billing_model_pipeline.joblib")
GDRIVE_FILE_ID = os.getenv("GDRIVE_MODEL_ID")
GDRIVE_URL = f"https://drive.google.com/uc?id={GDRIVE_FILE_ID}"

model = None

def load_model():
    global model
    if model is None:
        if not os.path.exists(MODEL_PATH):
            print("⬇️ Downloading ML model from Google Drive...")
            gdown.download(GDRIVE_URL, MODEL_PATH, quiet=False)
        model = joblib.load(MODEL_PATH)
        print("✅ Model loaded successfully")
    return model



@login_required
def predict_view(request):
    prediction = None
    model = load_model()

    if request.method == "POST":
        input_data = {
            "Age": int(request.POST["Age"]),
            "Gender": request.POST["Gender"],
            "Blood_Type": request.POST["Blood_Type"],
            "Medical_Condition": request.POST["Medical_Condition"],
            "Insurance_Provider": request.POST["Insurance_Provider"],
            "Admission_Type": request.POST["Admission_Type"],
            "Medication": request.POST["Medication"],
            "Test_Results": request.POST["Test_Results"],
            "Length_of_Stay": int(request.POST["Length_of_Stay"]),
        }

        df = pd.DataFrame([input_data])
        prediction = round(model.predict(df)[0], 2)

        # 🔥 SAVE TO MONGODB
        predictions_collection.insert_one({
            "username": request.user.username,
            "inputs": input_data,
            "prediction": prediction,
            "timestamp": datetime.utcnow()
        })

    return render(request, "predictor/predict.html", {
        "prediction": prediction,
        "form_data": request.POST
    })

