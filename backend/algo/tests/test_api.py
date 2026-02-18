"""Unit tests for Flask API endpoints."""
import pytest
import sys
import os
import io
import pandas as pd
import numpy as np

sys.path.insert(0, 'src')
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def sample_csv():
    """Create sample CSV data."""
    data = []
    for i in range(100):
        data.append({
            'day': '2016-09-26',
            'interval': i * 300,
            'detid': 230,
            'flow': np.random.uniform(100, 300),
            'occ': np.random.uniform(1, 10),
            'speed': np.random.uniform(40, 80),
            'city': 'torino'
        })
    df = pd.DataFrame(data)
    return df.to_csv(index=False)

def test_index_page(client):
    """Test index page loads."""
    response = client.get('/')
    assert response.status_code == 200

def test_upload_no_file(client):
    """Test upload without file returns error."""
    response = client.post('/api/upload')
    assert response.status_code == 400
    assert b'error' in response.data

def test_upload_valid_csv(client, sample_csv):
    """Test upload with valid CSV."""
    data = {'file': (io.BytesIO(sample_csv.encode()), 'test.csv')}
    response = client.post('/api/upload', data=data, content_type='multipart/form-data')
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['success'] == True
    assert 'statistics' in json_data

def test_statistics_no_data(client):
    """Test statistics without data returns error."""
    # Reset global state
    import app as app_module
    app_module.current_data = None
    
    response = client.get('/api/statistics')
    assert response.status_code == 400

def test_train_no_data(client):
    """Test train without data returns error."""
    import app as app_module
    app_module.engineered_data = None
    
    response = client.post('/api/train')
    assert response.status_code == 400

def test_predict_no_model(client):
    """Test predict without trained model returns error."""
    import app as app_module
    app_module.traffic_model.is_trained = False
    
    response = client.post('/api/predict', json={'hour': 12, 'weekday': 0, 'detid': 230})
    assert response.status_code == 400

def test_features_no_model(client):
    """Test features without trained model returns error."""
    import app as app_module
    app_module.traffic_model.is_trained = False
    
    response = client.get('/api/features')
    assert response.status_code == 400
