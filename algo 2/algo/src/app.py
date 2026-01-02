"""Flask application for Traffic ML Analysis."""
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from data_loader import DataLoader
from feature_engineering import FeatureEngineer
from model import TrafficModel
import os

app = Flask(__name__, 
            template_folder='../templates',
            static_folder='../static')
CORS(app)

# Global variables
data_loader = DataLoader()
feature_engineer = FeatureEngineer()
traffic_model = TrafficModel()
df_processed = None
df_raw = None

# Load data on startup
DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'torino.csv')

def load_data():
    """Load and process data on startup."""
    global df_raw, df_processed
    try:
        print("Loading data from:", DATA_PATH)
        df_raw = data_loader.load_csv(DATA_PATH)
        
        # Sample data for faster development (use 20% of data)
        # Comment out the next 2 lines to use full dataset
        sample_size = int(len(df_raw) * 0.2)
        df_raw = df_raw.sample(n=sample_size, random_state=42).reset_index(drop=True)
        print(f"Sampled {len(df_raw)} records for faster loading")
        
        df_raw = data_loader.handle_missing_values(df_raw)
        df_processed = feature_engineer.engineer_features(df_raw)
        print(f"Data loaded successfully: {len(df_processed)} records")
        return True
    except Exception as e:
        print(f"Error loading data: {e}")
        return False

# Load data on startup
load_data()

@app.route('/')
def index():
    """Render main page."""
    return render_template('index.html')

@app.route('/api/statistics')
def get_statistics():
    """Get basic statistics about the dataset."""
    try:
        if df_processed is None:
            return jsonify({'error': 'Data not loaded'}), 500
        
        # Apply filters if provided
        df_filtered = df_processed.copy()
        
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        detid = request.args.get('detid')
        hour_start = request.args.get('hour_start')
        hour_end = request.args.get('hour_end')
        
        if start_date:
            df_filtered = df_filtered[df_filtered['day'] >= start_date]
        if end_date:
            df_filtered = df_filtered[df_filtered['day'] <= end_date]
        if detid:
            df_filtered = df_filtered[df_filtered['detid'] == int(detid)]
        if hour_start:
            df_filtered = df_filtered[df_filtered['hour'] >= int(hour_start)]
        if hour_end:
            df_filtered = df_filtered[df_filtered['hour'] <= int(hour_end)]
        
        stats = data_loader.get_statistics(df_filtered)
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/data')
def get_data():
    """Get chart data with optional filters."""
    try:
        if df_processed is None:
            return jsonify({'error': 'Data not loaded'}), 500
        
        # Apply filters if provided
        df_filtered = df_processed.copy()
        
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        detid = request.args.get('detid')
        hour_start = request.args.get('hour_start')
        hour_end = request.args.get('hour_end')
        
        if start_date:
            df_filtered = df_filtered[df_filtered['day'] >= start_date]
        if end_date:
            df_filtered = df_filtered[df_filtered['day'] <= end_date]
        if detid:
            df_filtered = df_filtered[df_filtered['detid'] == int(detid)]
        if hour_start:
            df_filtered = df_filtered[df_filtered['hour'] >= int(hour_start)]
        if hour_end:
            df_filtered = df_filtered[df_filtered['hour'] <= int(hour_end)]
        
        # Calculate hourly flow
        hourly_flow = df_filtered.groupby('hour')['flow'].mean().to_dict()
        
        # Calculate traffic distribution
        traffic_dist = df_filtered['traffic_category'].value_counts().to_dict()
        
        return jsonify({
            'hourly_flow': hourly_flow,
            'traffic_distribution': traffic_dist,
            'total_records': len(df_filtered)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analysis')
def get_analysis():
    """Get advanced traffic analysis data."""
    try:
        if df_processed is None:
            return jsonify({'error': 'Data not loaded'}), 500
        
        # Apply filters if provided
        df_filtered = df_processed.copy()
        
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        detid = request.args.get('detid')
        hour_start = request.args.get('hour_start')
        hour_end = request.args.get('hour_end')
        
        if start_date:
            df_filtered = df_filtered[df_filtered['day'] >= start_date]
        if end_date:
            df_filtered = df_filtered[df_filtered['day'] <= end_date]
        if detid:
            df_filtered = df_filtered[df_filtered['detid'] == int(detid)]
        if hour_start:
            df_filtered = df_filtered[df_filtered['hour'] >= int(hour_start)]
        if hour_end:
            df_filtered = df_filtered[df_filtered['hour'] <= int(hour_end)]
        
        # Weekday vs Weekend comparison
        weekday_data = df_filtered[df_filtered['is_weekday'] == 1]
        weekend_data = df_filtered[df_filtered['is_weekday'] == 0]
        
        weekday_vs_weekend = {
            'weekday': {
                'avg_flow': float(weekday_data['flow'].mean()) if len(weekday_data) > 0 else 0,
                'avg_speed': float(weekday_data['speed'].mean()) if len(weekday_data) > 0 else 0,
                'avg_occ': float(weekday_data['occ'].mean()) if len(weekday_data) > 0 else 0,
                'avg_traffic_index': float(weekday_data['traffic_index'].mean()) if len(weekday_data) > 0 else 0
            },
            'weekend': {
                'avg_flow': float(weekend_data['flow'].mean()) if len(weekend_data) > 0 else 0,
                'avg_speed': float(weekend_data['speed'].mean()) if len(weekend_data) > 0 else 0,
                'avg_occ': float(weekend_data['occ'].mean()) if len(weekend_data) > 0 else 0,
                'avg_traffic_index': float(weekend_data['traffic_index'].mean()) if len(weekend_data) > 0 else 0
            }
        }
        
        # Hourly congestion profile
        hourly_congestion = df_filtered.groupby('hour')['traffic_index'].mean().to_dict()
        hourly_congestion = {str(k): float(v) for k, v in hourly_congestion.items()}
        
        # Daily congestion profile
        day_names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        daily_congestion = df_filtered.groupby('weekday')['traffic_index'].mean().to_dict()
        daily_congestion = {day_names[k]: float(v) for k, v in daily_congestion.items() if k < 7}
        
        # Peak hours (top 5)
        peak_hours_data = df_filtered.groupby('hour')['traffic_index'].mean().sort_values(ascending=False).head(5)
        peak_hours = [{'hour': int(h), 'index': float(idx)} for h, idx in peak_hours_data.items()]
        
        # Weekday vs Weekend hourly flow
        weekday_hourly = weekday_data.groupby('hour')['flow'].mean().to_dict() if len(weekday_data) > 0 else {}
        weekend_hourly = weekend_data.groupby('hour')['flow'].mean().to_dict() if len(weekend_data) > 0 else {}
        weekday_hourly_flow = {str(k): float(v) for k, v in weekday_hourly.items()}
        weekend_hourly_flow = {str(k): float(v) for k, v in weekend_hourly.items()}
        
        return jsonify({
            'weekday_vs_weekend': weekday_vs_weekend,
            'hourly_congestion': hourly_congestion,
            'daily_congestion': daily_congestion,
            'peak_hours': peak_hours,
            'weekday_hourly_flow': weekday_hourly_flow,
            'weekend_hourly_flow': weekend_hourly_flow
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/train', methods=['POST'])
def train_model():
    """Train the Random Forest model."""
    try:
        if df_processed is None:
            return jsonify({'error': 'Data not loaded', 'success': False}), 500
        
        # Prepare features and target
        X = df_processed[TrafficModel.FEATURE_COLUMNS]
        y = df_processed['flow']
        
        # Train model
        metrics = traffic_model.train(X, y)
        
        # Get feature importance
        feature_importance = traffic_model.get_feature_importance()
        
        return jsonify({
            'success': True,
            'metrics': metrics,
            'feature_importance': feature_importance
        })
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Make a prediction."""
    try:
        if not traffic_model.is_trained:
            return jsonify({'error': 'Model not trained yet'}), 400
        
        data = request.json
        hour = data.get('hour')
        weekday = data.get('weekday')
        detid = data.get('detid')
        
        # Get detector statistics from processed data
        detector_data = df_processed[df_processed['detid'] == detid]
        if len(detector_data) == 0:
            # Use overall averages if detector not found
            detector_mean_flow = df_processed['flow'].mean()
            detector_mean_speed = df_processed['speed'].mean()
            detector_mean_occ = df_processed['occ'].mean()
            avg_occ = df_processed['occ'].mean()
            avg_speed = df_processed['speed'].mean()
        else:
            detector_mean_flow = detector_data['flow'].mean()
            detector_mean_speed = detector_data['speed'].mean()
            detector_mean_occ = detector_data['occ'].mean()
            avg_occ = detector_data['occ'].mean()
            avg_speed = detector_data['speed'].mean()
        
        # Get hourly statistics
        hourly_data = df_processed[df_processed['hour'] == hour]
        hourly_mean_flow = hourly_data['flow'].mean() if len(hourly_data) > 0 else df_processed['flow'].mean()
        
        # Create feature vector
        is_rush_hour = feature_engineer.is_rush_hour(hour)
        is_weekday = feature_engineer.is_weekday(weekday)
        is_peak_traffic = feature_engineer.is_peak_traffic(is_rush_hour, is_weekday)
        
        # Prepare input DataFrame
        input_data = pd.DataFrame([{
            'hour': hour,
            'weekday': weekday,
            'month': 10,  # Default month
            'is_rush_hour': is_rush_hour,
            'is_weekday': is_weekday,
            'is_peak_traffic': is_peak_traffic,
            'detector_mean_flow': detector_mean_flow,
            'detector_mean_speed': detector_mean_speed,
            'detector_mean_occ': detector_mean_occ,
            'hourly_mean_flow': hourly_mean_flow,
            'occ': avg_occ,
            'speed': avg_speed,
            'detid': detid
        }])
        
        # Make prediction
        prediction_result = traffic_model.predict(input_data)
        
        # Calculate traffic index
        predicted_flow = prediction_result['prediction'][0]
        traffic_index = feature_engineer.calculate_traffic_index(
            predicted_flow, avg_occ, avg_speed
        )
        traffic_index = feature_engineer.normalize_index(traffic_index)
        traffic_category = feature_engineer.categorize_traffic(traffic_index)
        
        return jsonify({
            'prediction': float(predicted_flow),
            'confidence_low': float(prediction_result['confidence_low'][0]),
            'confidence_high': float(prediction_result['confidence_high'][0]),
            'traffic_index': float(traffic_index),
            'category': traffic_category
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/correlation')
def get_correlation():
    """Get feature correlations with target."""
    try:
        if not traffic_model.is_trained:
            return jsonify({'error': 'Model not trained yet'}), 400
        
        correlations = traffic_model.calculate_correlation(df_processed, 'flow')
        
        return jsonify({
            'correlations': correlations
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
