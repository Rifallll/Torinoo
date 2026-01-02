"""Property tests for Data Loader module."""
import pytest
import pandas as pd
import numpy as np
from hypothesis import given, strategies as st, settings

import sys
sys.path.insert(0, '.')
from src.data_loader import DataLoader

# Feature: traffic-ml-analysis, Property 7: Missing Value Handling
# Validates: Requirements 1.2

@given(
    n_rows=st.integers(min_value=5, max_value=50),
    missing_ratio=st.floats(min_value=0.1, max_value=0.5)
)
@settings(max_examples=100)
def test_missing_value_handling_no_nulls_remain(n_rows, missing_ratio):
    """Property 7: For any dataset with missing values, after processing,
    the output should contain no missing values in required columns."""
    loader = DataLoader()
    
    # Generate random data with some missing values
    np.random.seed(42)
    df = pd.DataFrame({
        'day': ['2016-09-26'] * n_rows,
        'interval': np.random.randint(0, 86400, n_rows),
        'detid': np.random.randint(1, 10, n_rows),
        'flow': np.random.uniform(0, 500, n_rows),
        'occ': np.random.uniform(0, 100, n_rows),
        'speed': np.random.uniform(0, 120, n_rows),
        'city': ['torino'] * n_rows
    })
    
    # Introduce missing values
    n_missing = int(n_rows * missing_ratio)
    for col in ['flow', 'occ', 'speed']:
        missing_idx = np.random.choice(n_rows, n_missing, replace=False)
        df.loc[missing_idx, col] = np.nan
    
    # Process missing values
    result = loader.handle_missing_values(df)
    
    # Assert no missing values in numeric columns
    assert result['flow'].isna().sum() == 0
    assert result['occ'].isna().sum() == 0
    assert result['speed'].isna().sum() == 0


def test_validate_data_with_required_columns():
    """Test validation passes with all required columns."""
    loader = DataLoader()
    df = pd.DataFrame({
        'day': ['2016-09-26'],
        'interval': [0],
        'detid': [1],
        'flow': [100.0],
        'occ': [5.0],
        'speed': [50.0]
    })
    assert loader.validate_data(df) == True


def test_validate_data_missing_columns():
    """Test validation fails with missing columns."""
    loader = DataLoader()
    df = pd.DataFrame({
        'day': ['2016-09-26'],
        'interval': [0]
    })
    assert loader.validate_data(df) == False
