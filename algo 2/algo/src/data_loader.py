"""Data Loader module for Traffic ML Analysis."""
import pandas as pd
import numpy as np
from typing import Dict, Any, Optional

class DataLoader:
    """Handles loading, validation, and preprocessing of traffic data."""
    
    REQUIRED_COLUMNS = ['day', 'interval', 'detid', 'flow', 'occ', 'speed']
    
    def __init__(self):
        self.data: Optional[pd.DataFrame] = None
    
    def load_csv(self, file_path: str) -> pd.DataFrame:
        """Load CSV file and return DataFrame."""
        df = pd.read_csv(file_path)
        if not self.validate_data(df):
            raise ValueError("Invalid data structure: missing required columns")
        self.data = df
        return df
    
    def validate_data(self, df: pd.DataFrame) -> bool:
        """Validate that DataFrame has required columns."""
        return all(col in df.columns for col in self.REQUIRED_COLUMNS)
    
    def handle_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        """Handle missing values using forward fill and mean imputation."""
        df = df.copy()
        
        # For numeric columns, replace inf with nan first, then fill with mean
        numeric_cols = ['flow', 'occ', 'speed']
        for col in numeric_cols:
            if col in df.columns:
                # Replace infinity values with NaN
                df[col] = df[col].replace([np.inf, -np.inf], np.nan)
                # Calculate mean excluding NaN
                col_mean = df[col].mean()
                # If mean is still NaN or inf, use 0
                if pd.isna(col_mean) or np.isinf(col_mean):
                    col_mean = 0
                df[col] = df[col].fillna(col_mean)
        
        # For categorical/id columns, forward fill then backward fill
        other_cols = ['day', 'interval', 'detid']
        for col in other_cols:
            if col in df.columns:
                df[col] = df[col].ffill().bfill()
        
        return df
    
    def get_statistics(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Get basic statistics from the data."""
        return {
            'row_count': len(df),
            'date_range': {
                'start': df['day'].min() if 'day' in df.columns else None,
                'end': df['day'].max() if 'day' in df.columns else None
            },
            'detector_count': df['detid'].nunique() if 'detid' in df.columns else 0,
            'flow_stats': {
                'mean': float(df['flow'].mean()) if 'flow' in df.columns else 0,
                'min': float(df['flow'].min()) if 'flow' in df.columns else 0,
                'max': float(df['flow'].max()) if 'flow' in df.columns else 0
            },
            'speed_stats': {
                'mean': float(df['speed'].mean()) if 'speed' in df.columns else 0,
                'min': float(df['speed'].min()) if 'speed' in df.columns else 0,
                'max': float(df['speed'].max()) if 'speed' in df.columns else 0
            }
        }
