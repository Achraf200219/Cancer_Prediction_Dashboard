# Breast Cancer Prediction Dashboard

A web application for breast cancer risk prediction using FastAPI backend with machine learning and React frontend with TailwindCSS. The application provides real-time predictions using a Logistic Regression model, features an interactive dashboard with prediction history, and includes a RESTful API with automatic documentation.

## Technology Stack

Backend: Python 3.8+, FastAPI, Scikit-learn, Pandas, NumPy, Uvicorn
Frontend: React 18, Vite, TailwindCSS, Axios

## Quick Start

Backend: Navigate to `backend/`, create a virtual environment, install dependencies with `pip install -r requirements.txt`, and run `uvicorn main:app --reload --host 0.0.0.0 --port 8000`. Frontend: Navigate to `frontend/`, run `npm install`, then `npm run dev`. Access the application at http://localhost:5173 and API documentation at http://localhost:8000/docs.

## Note

This application is for educational and demonstrative purposes only and should not be used for actual medical diagnosis or treatment decisions.