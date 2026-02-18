from backend.algo.src.app import app

# Vercel needs the variable 'app' to be the Flask instance
if __name__ == '__main__':
    app.run()
