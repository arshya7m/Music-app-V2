# Music-app-v2
# Music Streaming App v2
-made by
arshya moonat(21f1004769)

## Getting Started

To set up and run the application locally, follow these steps:

### Prerequisites

- Python 3.7 or higher installed
- Redis server installed and running
- Go binary installed (for MailHog)

### Setup
 Navigate to the project directory in the terminal using cd

### Environment Setup

Create a virtual environment and activate it:

python -m venv env2
source env2/bin/activate

pip install -r requirements.txt

### Running the Application
    Start the Redis server:

    sudo service redis-server start
    redis-server
    redis-cli

### Run the Flask app:

    python main.py

### Start Celery for background task processing:

    celery -A main:celery_app worker --loglevel INFO
    celery -A main:celery_app beat --loglevel INFO

### For email testing, use MailHog:

    ~/go/bin/MailHog

### Usage
Once the application is running locally, access it through a web browser at http://localhost:5000.
