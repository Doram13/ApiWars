from flask import Flask, render_template, redirect, request, url_for, session
import requests


app = Flask(__name__)


#response = requests.get('http://swapi.co/api/planets/').json()

#name = response['name']


@app.route('/')
def hello_world():
    return render_template('firstpage.html')


if __name__ == '__main__':
    app.run()

