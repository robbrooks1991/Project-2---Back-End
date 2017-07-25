from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME2 = 'goalscoredPremLeague'
COLLECTION_NAME2 = 'goals'


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/team_stats')
def team_stats():
    return render_template('team_stats.html')


@app.route('/player_stats')
def player_stats():
    return render_template('player_stats.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route("/goal_stats")
def goal_stats():

    # This creates a flask view of the data gathered from Mongo DB in a JSON format

    fields = {
        '_id': False, 'goalid': True, 'team': True, 'against': True, 'date': True, 'time_of_goal': True, 'location': True,
        'home_away': True, 'scorer': True, 'Penalty (Y/N)': True, 'price_of_scorer': True, 'assist': True,
        'price_of_assister': True
    }

    with MongoClient(MONGODB_HOST, MONGODB_PORT) as conn:

        collection = conn[DBS_NAME2][COLLECTION_NAME2]
        goals = collection.find(projection=fields, limit=1000)
        return json.dumps(list(goals))

if __name__ == '__main__':
    app.run(debug=True)