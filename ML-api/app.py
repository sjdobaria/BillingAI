from fastapi import FastAPI
from pydantic import BaseModel
from model_loader import get_model
import pandas as pd

app = FastAPI(title="Billing Prediction API")

model = get_model()

class InputData(BaseModel):
    Age: int
    Gender: str
    Blood_Type: str
    Medical_Condition: str
    Insurance_Provider: str
    Admission_Type: str
    Medication: str
    Test_Results: str
    Length_of_Stay: int


@app.get("/")
def health():
    return {"status": "ML API running"}

@app.post("/predict")
def predict(data: InputData):
    df = pd.DataFrame([data.dict()])
    prediction = model.predict(df)[0]
    return {"prediction": round(float(prediction), 2)}
