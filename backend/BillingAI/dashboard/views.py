import joblib
import pandas as pd
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from datetime import datetime

from .mongo_client import get_predictions_collection

# -----------------------------------------------------------
# Load the ML model once at module level for performance
# -----------------------------------------------------------
try:
    model = joblib.load(settings.ML_MODEL_PATH)
    print(f"[OK] ML Model loaded successfully from {settings.ML_MODEL_PATH}")
except Exception as e:
    model = None
    print(f"[WARNING] Failed to load ML model: {e}")


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_view(request):
    """
    Accept patient data, run prediction through the ML pipeline,
    save the result to MongoDB, and return the predicted billing amount.
    """
    if model is None:
        return Response(
            {'error': 'ML model is not available. Please check the server logs.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    data = request.data

    # Validate required fields
    required_fields = [
        'Age', 'Gender', 'Blood_Type', 'Medical_Condition',
        'Insurance_Provider', 'Admission_Type', 'Medication',
        'Test_Results', 'Length_of_Stay'
    ]
    missing = [f for f in required_fields if f not in data or data[f] == '']
    if missing:
        return Response(
            {'error': f'Missing required fields: {", ".join(missing)}'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Build the input DataFrame matching the training pipeline
        input_df = pd.DataFrame([{
            'Age': int(data['Age']),
            'Gender': str(data['Gender']),
            'Blood_Type': str(data['Blood_Type']),
            'Medical_Condition': str(data['Medical_Condition']),
            'Insurance_Provider': str(data['Insurance_Provider']),
            'Admission_Type': str(data['Admission_Type']),
            'Medication': str(data['Medication']),
            'Test_Results': str(data['Test_Results']),
            'Length_of_Stay': int(data['Length_of_Stay']),
        }])

        # Run prediction
        prediction = model.predict(input_df)[0]
        predicted_amount = round(float(prediction), 2)

        # Save to MongoDB Atlas
        try:
            collection = get_predictions_collection()
            record = {
                'user_id': request.user.id,
                'username': request.user.username,
                'input_data': {
                    'Age': int(data['Age']),
                    'Gender': str(data['Gender']),
                    'Blood_Type': str(data['Blood_Type']),
                    'Medical_Condition': str(data['Medical_Condition']),
                    'Insurance_Provider': str(data['Insurance_Provider']),
                    'Admission_Type': str(data['Admission_Type']),
                    'Medication': str(data['Medication']),
                    'Test_Results': str(data['Test_Results']),
                    'Length_of_Stay': int(data['Length_of_Stay']),
                },
                'predicted_amount': predicted_amount,
                'created_at': datetime.utcnow().isoformat(),
            }
            collection.insert_one(record)
        except Exception as mongo_err:
            # Log but don't fail the prediction if MongoDB is down
            print(f"[WARNING] MongoDB save failed: {mongo_err}")

        return Response({
            'Predicted_Billing_Amount': predicted_amount,
            'message': 'Prediction successful',
        })

    except Exception as e:
        return Response(
            {'error': f'Prediction failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def prediction_history_view(request):
    """
    Retrieve the authenticated user's past predictions from MongoDB.
    Returns the most recent 20 predictions.
    """
    try:
        collection = get_predictions_collection()
        predictions = list(
            collection.find(
                {'user_id': request.user.id},
                {'_id': 0}  # Exclude the MongoDB _id field
            ).sort('created_at', -1).limit(20)
        )
        return Response(predictions)
    except Exception as e:
        return Response(
            {'error': f'Failed to fetch prediction history: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
