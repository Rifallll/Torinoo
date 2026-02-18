"""Feature Engineering module for Traffic ML Analysis."""
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Tuple

class FeatureEngineer:
    """Handles feature extraction and engineering for traffic data."""
    
    # Time feature extraction
    @staticmethod
    def extract_hour(interval: int) -> int:
        """Extract hour of day (0-23) from interval seconds."""
        return interval // 3600
    
    @staticmethod
    def extract_weekday(date_str: str) -> int:
        """Extract day of week (0-6, Monday=0) from date string."""
        date = datetime.strptime(date_str, '%Y-%m-%d')
        return date.weekday()
    
    @staticmethod
    def extract_month(date_str: str) -> int:
        """Extract month (1-12) from date string."""
        date = datetime.strptime(date_str, '%Y-%m-%d')
        return date.month
    
    @staticmethod
    def interval_to_time(interval: int) -> str:
        """Convert interval seconds to time string HH:MM:SS."""
        hours = interval // 3600
        minutes = (interval % 3600) // 60
        seconds = interval % 60
        return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
    
    @staticmethod
    def time_to_interval(time_str: str) -> int:
        """Convert time string HH:MM:SS to interval seconds."""
        parts = time_str.split(':')
        hours = int(parts[0])
        minutes = int(parts[1])
        seconds = int(parts[2])
        return hours * 3600 + minutes * 60 + seconds

    # Binary feature functions
    @staticmethod
    def is_rush_hour(hour: int) -> int:
        """Return 1 if hour is rush hour (7-9 or 17-19), else 0."""
        return 1 if hour in [7, 8, 9, 17, 18, 19] else 0
    
    @staticmethod
    def is_weekday(weekday: int) -> int:
        """Return 1 if weekday is Monday-Friday (0-4), else 0."""
        return 1 if weekday in [0, 1, 2, 3, 4] else 0
    
    @staticmethod
    def is_peak_traffic(is_rush: int, is_wkday: int) -> int:
        """Return 1 if both rush hour and weekday, else 0."""
        return 1 if is_rush == 1 and is_wkday == 1 else 0
    
    # Aggregate feature functions
    @staticmethod
    def calculate_detector_aggregates(df: pd.DataFrame) -> pd.DataFrame:
        """Calculate mean flow, speed, occupancy per detector."""
        agg = df.groupby('detid').agg({
            'flow': 'mean',
            'speed': 'mean',
            'occ': 'mean'
        }).reset_index()
        agg.columns = ['detid', 'detector_mean_flow', 'detector_mean_speed', 'detector_mean_occ']
        return df.merge(agg, on='detid', how='left')
    
    @staticmethod
    def calculate_hourly_aggregates(df: pd.DataFrame) -> pd.DataFrame:
        """Calculate hourly average flow."""
        agg = df.groupby('hour').agg({'flow': 'mean'}).reset_index()
        agg.columns = ['hour', 'hourly_mean_flow']
        return df.merge(agg, on='hour', how='left')
    
    # Traffic index functions
    @staticmethod
    def calculate_traffic_index(flow: float, occ: float, speed: float) -> float:
        """Calculate traffic index combining flow, occupancy, and speed."""
        # Handle NaN/Infinity values
        if pd.isna(flow) or np.isinf(flow):
            flow = 0
        if pd.isna(occ) or np.isinf(occ):
            occ = 0
        if pd.isna(speed) or np.isinf(speed):
            speed = 60  # Default speed
        
        # Higher flow and occupancy = more congestion
        # Lower speed = more congestion
        # Normalize each component and combine
        flow_norm = min(flow / 500, 1.0)  # Assume max flow ~500
        occ_norm = min(occ / 100, 1.0)    # Occupancy is already 0-100
        speed_factor = max(1 - (speed / 120), 0)  # Inverse of speed, max ~120
        
        return (flow_norm * 0.4 + occ_norm * 0.3 + speed_factor * 0.3) * 100
    
    @staticmethod
    def normalize_index(index: float) -> float:
        """Normalize traffic index to 0-100 scale."""
        return max(0, min(100, index))
    
    @staticmethod
    def categorize_traffic(index: float) -> str:
        """Categorize traffic as Low, Medium, or High."""
        if index <= 33:
            return "Low"
        elif index <= 66:
            return "Medium"
        else:
            return "High"

    # Main pipeline
    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Apply all feature engineering to DataFrame."""
        df = df.copy()
        
        # Time features
        df['hour'] = df['interval'].apply(self.extract_hour)
        df['weekday'] = df['day'].apply(self.extract_weekday)
        df['month'] = df['day'].apply(self.extract_month)
        
        # Binary features
        df['is_rush_hour'] = df['hour'].apply(self.is_rush_hour)
        df['is_weekday'] = df['weekday'].apply(self.is_weekday)
        df['is_peak_traffic'] = df.apply(
            lambda x: self.is_peak_traffic(x['is_rush_hour'], x['is_weekday']), axis=1
        )
        
        # Aggregate features
        df = self.calculate_detector_aggregates(df)
        df = self.calculate_hourly_aggregates(df)
        
        # Traffic index
        df['traffic_index'] = df.apply(
            lambda x: self.calculate_traffic_index(x['flow'], x['occ'], x['speed']), axis=1
        )
        df['traffic_index'] = df['traffic_index'].apply(self.normalize_index)
        df['traffic_category'] = df['traffic_index'].apply(self.categorize_traffic)
        
        return df
