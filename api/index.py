import os
import sys

# Add the source directory to the system path
# The path is relative to this file (api/index.py) -> ../algo 2/algo/src
current_dir = os.path.dirname(os.path.abspath(__file__))
src_path = os.path.join(current_dir, '..', 'algo 2', 'algo', 'src')
sys.path.append(src_path)

# Import the Flask app
from app import app

# Vercel expects the app to be named 'app'
# This file exposes the 'app' variable which Vercel will use as the entry point
