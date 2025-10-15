from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import warnings

# Suppress warnings
warnings.filterwarnings("ignore", category=UserWarning)

app = FastAPI(
    title="Cancer Prediction API",
    description="API for breast cancer risk prediction",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and scaler
model = None
scaler = None
prediction_history: List[Dict[str, Any]] = []

# --- Pydantic Models ---
class PatientInput(BaseModel):
    age: int = Field(..., ge=20, le=90, description="Patient age in years")
    height_cm: float = Field(..., ge=140.0, le=200.0, description="Height in centimeters")
    weight_kg: float = Field(..., ge=40.0, le=150.0, description="Weight in kilograms")
    has_diabetes: bool = Field(..., description="Whether patient has diabetes")
    has_high_bp: bool = Field(..., description="Whether patient has high blood pressure")
    family_history: bool = Field(..., description="Family history of cancer")
    age_at_menarche: int = Field(..., ge=8, le=20, description="Age at first menstruation")

    class Config:
        json_schema_extra = {
            "example": {
                "age": 50,
                "height_cm": 165.0,
                "weight_kg": 70.0,
                "has_diabetes": False,
                "has_high_bp": False,
                "family_history": True,
                "age_at_menarche": 13
            }
        }

class PredictionResponse(BaseModel):
    cancer_chance: float = Field(..., description="Probability of cancer as percentage")
    risk_level: str = Field(..., description="Risk level: Low, Moderate, or High")
    risk_class: str = Field(..., description="CSS class for risk level")
    patient_data: Dict[str, Any] = Field(..., description="Input patient data")

class HistoryItem(BaseModel):
    age: int
    height: float
    weight: float
    risk: str
    chance: float

# --- Model Training ---
def train_model():
    """Trains and returns the ML model and scaler."""
    data = {
        'age': [45, 52, 58, 65, 38, 41, 68, 72, 35, 49, 55, 61, 75, 43, 50, 57, 63, 39, 48, 69],
        'height_cm': [160, 155, 162, 158, 165, 170, 153, 150, 168, 163, 157, 161, 154, 169, 164, 156, 159, 172, 166, 152],
        'weight_kg': [70, 85, 78, 90, 65, 72, 95, 100, 60, 75, 82, 88, 105, 68, 77, 86, 92, 63, 74, 98],
        'has_diabetes': [1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1],
        'has_high_bp': [1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1],
        'family_history': [1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0],
        'age_at_menarche': [12, 14, 13, 11, 15, 13, 12, 11, 14, 13, 12, 14, 12, 13, 15, 12, 11, 14, 13, 12],
        'has_cancer': [1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1]
    }
    df = pd.DataFrame(data)
    features = ['age', 'height_cm', 'weight_kg', 'has_diabetes', 'has_high_bp', 'family_history', 'age_at_menarche']
    X = df[features]
    y = df['has_cancer']
    scaler = StandardScaler().fit(X)
    X_scaled = scaler.transform(X)
    model = LogisticRegression(random_state=42).fit(X_scaled, y)
    return model, scaler

@app.on_event("startup")
async def startup_event():
    """Initialize model on startup"""
    global model, scaler
    model, scaler = train_model()

# --- API Endpoints ---
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Cancer Prediction API",
        "version": "1.0.0",
        "endpoints": {
            "predict": "/api/predict",
            "history": "/api/history",
            "docs": "/docs"
        }
    }

@app.post("/api/predict", response_model=PredictionResponse)
async def predict(patient: PatientInput):
    """
    Generate cancer risk prediction based on patient data
    """
    # Convert boolean inputs to integers
    diabetes_val = 1 if patient.has_diabetes else 0
    bp_val = 1 if patient.has_high_bp else 0
    family_history_val = 1 if patient.family_history else 0
    
    # Prepare input data
    input_data = np.array([[
        patient.age,
        patient.height_cm,
        patient.weight_kg,
        diabetes_val,
        bp_val,
        family_history_val,
        patient.age_at_menarche
    ]])
    
    # Scale and predict
    scaled_input_data = scaler.transform(input_data)
    probability = model.predict_proba(scaled_input_data)
    cancer_chance = float(probability[0][1] * 100)
    
    # Determine risk level
    if cancer_chance >= 70:
        risk_level = "High"
        risk_class = "high-risk"
    elif cancer_chance >= 30:
        risk_level = "Moderate"
        risk_class = "moderate-risk"
    else:
        risk_level = "Low"
        risk_class = "low-risk"
    
    # Create response
    response = PredictionResponse(
        cancer_chance=cancer_chance,
        risk_level=risk_level,
        risk_class=risk_class,
        patient_data={
            "age": patient.age,
            "height": f"{patient.height_cm} cm",
            "weight": f"{patient.weight_kg} kg",
            "diabetes": "Yes" if patient.has_diabetes else "No",
            "high_bp": "Yes" if patient.has_high_bp else "No",
            "family_history": "Yes" if patient.family_history else "No",
            "age_at_menarche": patient.age_at_menarche
        }
    )
    
    # Add to history (keep last 5)
    history_entry = {
        "age": patient.age,
        "height": patient.height_cm,
        "weight": patient.weight_kg,
        "risk": risk_level,
        "chance": cancer_chance
    }
    prediction_history.insert(0, history_entry)
    if len(prediction_history) > 5:
        prediction_history.pop()
    
    return response

@app.get("/api/history", response_model=List[HistoryItem])
async def get_history():
    """
    Get prediction history (last 5 predictions)
    """
    return prediction_history

@app.delete("/api/history")
async def clear_history():
    """
    Clear prediction history
    """
    global prediction_history
    prediction_history = []
    return {"message": "History cleared successfully"}

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None
    }
