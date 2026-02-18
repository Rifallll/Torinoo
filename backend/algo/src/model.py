"""ML Model module for Traffic ML Analysis."""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
from typing import Dict, Any, Optional, Tuple

class TrafficModel:
    """Random Forest model for traffic prediction."""
    
    FEATURE_COLUMNS = [
        'hour', 'weekday', 'month', 'is_rush_hour', 'is_weekday', 
        'is_peak_traffic', 'detector_mean_flow', 'detector_mean_speed',
        'detector_mean_occ', 'hourly_mean_flow', 'occ', 'speed', 'detid'
    ]
    
    def __init__(self, n_estimators: int = 50, random_state: int = 42):
        self.model = RandomForestRegressor(
            n_estimators=n_estimators,
            random_state=random_state,
            n_jobs=-1,
            max_depth=15,  # Limit depth for speed
            min_samples_split=10
        )
        self.is_trained = False
        self.feature_names = []
        self.train_size = 0
        self.test_size = 0
    
    def train(self, X: pd.DataFrame, y: pd.Series, test_size: float = 0.2, max_samples: int = 100000) -> Dict[str, Any]:
        """Train the model and return metrics."""
        # Sample data if too large (for faster training)
        total_size = len(X)
        if len(X) > max_samples:
            sample_idx = np.random.choice(len(X), max_samples, replace=False)
            X = X.iloc[sample_idx]
            y = y.iloc[sample_idx]
        
        # Convert to numpy arrays to avoid sklearn warnings
        X_array = X.values
        feature_names = list(X.columns)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_array, y, test_size=test_size, random_state=42
        )
        
        self.train_size = len(X_train)
        self.test_size = len(X_test)
        self.feature_names = feature_names
        
        # Train model
        self.model.fit(X_train, y_train)
        self.is_trained = True
        
        # Calculate metrics
        y_pred = self.model.predict(X_test)
        
        metrics = {
            'r2_score': float(r2_score(y_test, y_pred)),
            'mae': float(mean_absolute_error(y_test, y_pred)),
            'rmse': float(np.sqrt(mean_squared_error(y_test, y_pred))),
            'train_size': self.train_size,
            'test_size': self.test_size,
            'total_size': total_size,
            'sampled_size': len(X)
        }
        
        return metrics

    def predict(self, X: pd.DataFrame) -> Dict[str, Any]:
        """Make prediction with confidence interval."""
        if not self.is_trained:
            raise ValueError("Model not trained yet")
        
        # Convert to numpy array
        X_array = X.values
        
        # Get predictions from all trees for confidence interval
        predictions = np.array([tree.predict(X_array) for tree in self.model.estimators_])
        
        mean_pred = predictions.mean(axis=0)
        std_pred = predictions.std(axis=0)
        
        # 95% confidence interval
        confidence_low = mean_pred - 1.96 * std_pred
        confidence_high = mean_pred + 1.96 * std_pred
        
        return {
            'prediction': mean_pred.tolist(),
            'confidence_low': confidence_low.tolist(),
            'confidence_high': confidence_high.tolist()
        }
    
    def get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance ranking."""
        if not self.is_trained:
            raise ValueError("Model not trained yet")
        
        importance = dict(zip(self.feature_names, self.model.feature_importances_))
        return dict(sorted(importance.items(), key=lambda x: x[1], reverse=True))
    
    def calculate_correlation(self, df: pd.DataFrame, target: str) -> Dict[str, float]:
        """Calculate correlation between features and target."""
        import warnings
        correlations = {}
        for col in df.columns:
            if col != target and df[col].dtype in ['int64', 'float64']:
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore")
                    corr = df[col].corr(df[target])
                    if not np.isnan(corr):
                        correlations[col] = float(corr)
        return dict(sorted(correlations.items(), key=lambda x: abs(x[1]), reverse=True))
    
    def save_model(self, path: str):
        """Save model to file."""
        joblib.dump({
            'model': self.model,
            'feature_names': self.feature_names,
            'is_trained': self.is_trained
        }, path)
    
    def load_model(self, path: str):
        """Load model from file."""
        data = joblib.load(path)
        self.model = data['model']
        self.feature_names = data['feature_names']
        self.is_trained = data['is_trained']
