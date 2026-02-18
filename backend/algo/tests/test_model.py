"""Property tests for ML Model module."""
import pytest
import pandas as pd
import numpy as np
from hypothesis import given, strategies as st, settings

import sys
sys.path.insert(0, '.')
from src.model import TrafficModel

# Feature: traffic-ml-analysis, Property 5: Data Split Ratio
# Validates: Requirements 6.1

@given(n_samples=st.integers(min_value=100, max_value=500))
@settings(max_examples=100, deadline=None)
def test_data_split_ratio(n_samples):
    """Property 5: Train set should be ~80% and test set ~20% (±2%)."""
    np.random.seed(42)
    
    # Generate random data
    X = pd.DataFrame({
        'feature1': np.random.randn(n_samples),
        'feature2': np.random.randn(n_samples),
        'feature3': np.random.randn(n_samples)
    })
    y = pd.Series(np.random.randn(n_samples))
    
    model = TrafficModel()
    model.train(X, y, test_size=0.2)
    
    total = model.train_size + model.test_size
    train_ratio = model.train_size / total
    test_ratio = model.test_size / total
    
    # Allow ±2% tolerance
    assert 0.78 <= train_ratio <= 0.82, f"Train ratio {train_ratio} not in [0.78, 0.82]"
    assert 0.18 <= test_ratio <= 0.22, f"Test ratio {test_ratio} not in [0.18, 0.22]"


def test_model_training_returns_metrics():
    """Test that training returns expected metrics."""
    np.random.seed(42)
    
    X = pd.DataFrame({
        'feature1': np.random.randn(100),
        'feature2': np.random.randn(100)
    })
    y = pd.Series(np.random.randn(100))
    
    model = TrafficModel()
    metrics = model.train(X, y)
    
    assert 'r2_score' in metrics
    assert 'mae' in metrics
    assert 'rmse' in metrics
    assert 'train_size' in metrics
    assert 'test_size' in metrics


def test_feature_importance_after_training():
    """Test feature importance is available after training."""
    np.random.seed(42)
    
    X = pd.DataFrame({
        'feature1': np.random.randn(100),
        'feature2': np.random.randn(100)
    })
    y = pd.Series(np.random.randn(100))
    
    model = TrafficModel()
    model.train(X, y)
    
    importance = model.get_feature_importance()
    assert 'feature1' in importance
    assert 'feature2' in importance
    assert sum(importance.values()) > 0
