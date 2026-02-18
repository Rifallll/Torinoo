"""Property tests for Feature Engineering module."""
import pytest
import pandas as pd
import numpy as np
from hypothesis import given, strategies as st, settings, assume
from datetime import datetime, timedelta

import sys
sys.path.insert(0, '.')
from src.feature_engineering import FeatureEngineer

fe = FeatureEngineer()

# Feature: traffic-ml-analysis, Property 1: Time Feature Extraction Correctness
# Validates: Requirements 2.1, 2.2, 2.3

@given(interval=st.integers(min_value=0, max_value=86399))
@settings(max_examples=100)
def test_extract_hour_correctness(interval):
    """Property 1: For any valid interval (0-86400), extracted hour should be interval // 3600 and in [0, 23]."""
    hour = fe.extract_hour(interval)
    expected = interval // 3600
    assert hour == expected
    assert 0 <= hour <= 23


@given(days_offset=st.integers(min_value=0, max_value=365))
@settings(max_examples=100)
def test_extract_weekday_correctness(days_offset):
    """Property 1: For any valid date, extracted weekday should be in [0, 6]."""
    base_date = datetime(2016, 1, 1)
    date = base_date + timedelta(days=days_offset)
    date_str = date.strftime('%Y-%m-%d')
    
    weekday = fe.extract_weekday(date_str)
    assert weekday == date.weekday()
    assert 0 <= weekday <= 6


@given(days_offset=st.integers(min_value=0, max_value=365))
@settings(max_examples=100)
def test_extract_month_correctness(days_offset):
    """Property 1: For any valid date, extracted month should be in [1, 12]."""
    base_date = datetime(2016, 1, 1)
    date = base_date + timedelta(days=days_offset)
    date_str = date.strftime('%Y-%m-%d')
    
    month = fe.extract_month(date_str)
    assert month == date.month
    assert 1 <= month <= 12


# Feature: traffic-ml-analysis, Property 6: Interval Round-Trip
# Validates: Requirements 2.4

@given(interval=st.integers(min_value=0, max_value=86399))
@settings(max_examples=100)
def test_interval_round_trip(interval):
    """Property 6: For any interval, converting to time and back should produce original value."""
    time_str = fe.interval_to_time(interval)
    result = fe.time_to_interval(time_str)
    assert result == interval


# Feature: traffic-ml-analysis, Property 2: Binary Feature Correctness
# Validates: Requirements 3.1, 3.2, 3.3

@given(hour=st.integers(min_value=0, max_value=23))
@settings(max_examples=100)
def test_is_rush_hour_correctness(hour):
    """Property 2: is_rush_hour should be 1 iff hour in {7, 8, 9, 17, 18, 19}."""
    result = fe.is_rush_hour(hour)
    expected = 1 if hour in [7, 8, 9, 17, 18, 19] else 0
    assert result == expected
    assert result in [0, 1]


@given(weekday=st.integers(min_value=0, max_value=6))
@settings(max_examples=100)
def test_is_weekday_correctness(weekday):
    """Property 2: is_weekday should be 1 iff weekday in {0, 1, 2, 3, 4}."""
    result = fe.is_weekday(weekday)
    expected = 1 if weekday in [0, 1, 2, 3, 4] else 0
    assert result == expected
    assert result in [0, 1]


@given(
    is_rush=st.integers(min_value=0, max_value=1),
    is_wkday=st.integers(min_value=0, max_value=1)
)
@settings(max_examples=100)
def test_is_peak_traffic_correctness(is_rush, is_wkday):
    """Property 2: is_peak_traffic should equal is_rush_hour AND is_weekday."""
    result = fe.is_peak_traffic(is_rush, is_wkday)
    expected = 1 if is_rush == 1 and is_wkday == 1 else 0
    assert result == expected


# Feature: traffic-ml-analysis, Property 3: Aggregate Calculation Correctness
# Validates: Requirements 4.1, 4.2, 4.3, 4.4

@given(
    n_detectors=st.integers(min_value=2, max_value=5),
    n_rows_per_detector=st.integers(min_value=3, max_value=10)
)
@settings(max_examples=100)
def test_detector_aggregates_correctness(n_detectors, n_rows_per_detector):
    """Property 3: Mean flow/speed/occ per detector should equal sum/count."""
    np.random.seed(42)
    
    data = []
    for det_id in range(1, n_detectors + 1):
        for _ in range(n_rows_per_detector):
            data.append({
                'detid': det_id,
                'flow': np.random.uniform(0, 500),
                'speed': np.random.uniform(0, 120),
                'occ': np.random.uniform(0, 100),
                'hour': np.random.randint(0, 24)
            })
    
    df = pd.DataFrame(data)
    result = fe.calculate_detector_aggregates(df)
    
    # Verify for each detector
    for det_id in range(1, n_detectors + 1):
        det_data = df[df['detid'] == det_id]
        expected_mean_flow = det_data['flow'].mean()
        expected_mean_speed = det_data['speed'].mean()
        expected_mean_occ = det_data['occ'].mean()
        
        result_row = result[result['detid'] == det_id].iloc[0]
        assert abs(result_row['detector_mean_flow'] - expected_mean_flow) < 1e-10
        assert abs(result_row['detector_mean_speed'] - expected_mean_speed) < 1e-10
        assert abs(result_row['detector_mean_occ'] - expected_mean_occ) < 1e-10


@given(
    n_hours=st.integers(min_value=2, max_value=10),
    n_rows_per_hour=st.integers(min_value=2, max_value=5)
)
@settings(max_examples=100)
def test_hourly_aggregates_correctness(n_hours, n_rows_per_hour):
    """Property 3: Hourly average flow should equal sum/count for that hour."""
    np.random.seed(42)
    
    data = []
    for hour in range(n_hours):
        for _ in range(n_rows_per_hour):
            data.append({
                'hour': hour,
                'flow': np.random.uniform(0, 500)
            })
    
    df = pd.DataFrame(data)
    result = fe.calculate_hourly_aggregates(df)
    
    # Verify for each hour
    for hour in range(n_hours):
        hour_data = df[df['hour'] == hour]
        expected_mean = hour_data['flow'].mean()
        
        result_row = result[result['hour'] == hour].iloc[0]
        assert abs(result_row['hourly_mean_flow'] - expected_mean) < 1e-10


# Feature: traffic-ml-analysis, Property 4: Traffic Index Normalization
# Validates: Requirements 5.2, 5.3

@given(
    flow=st.floats(min_value=0, max_value=1000),
    occ=st.floats(min_value=0, max_value=100),
    speed=st.floats(min_value=0, max_value=200)
)
@settings(max_examples=100)
def test_traffic_index_normalization(flow, occ, speed):
    """Property 4: Normalized traffic index should be in [0, 100]."""
    assume(not (np.isnan(flow) or np.isnan(occ) or np.isnan(speed)))
    
    index = fe.calculate_traffic_index(flow, occ, speed)
    normalized = fe.normalize_index(index)
    
    assert 0 <= normalized <= 100


@given(index=st.floats(min_value=-50, max_value=150))
@settings(max_examples=100)
def test_traffic_categorization(index):
    """Property 4: Category should match defined ranges."""
    assume(not np.isnan(index))
    
    normalized = fe.normalize_index(index)
    category = fe.categorize_traffic(normalized)
    
    if normalized <= 33:
        assert category == "Low"
    elif normalized <= 66:
        assert category == "Medium"
    else:
        assert category == "High"
