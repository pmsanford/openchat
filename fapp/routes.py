import json
import os
from flask import Flask, render_template, request, Response, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///msg.db'
db = SQLAlchemy(app)


class Message(db.Model):
    msg_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    payload = db.Column(db.String(2000), nullable=False)

    def to_dict(self):
        return {'msg_id': self.msg_id, 'username': self.username, 'payload': self.payload}


@app.route('/')
def index():
    index_path = os.path.join(app.static_folder, 'index.html')
    return send_file(index_path)

@app.route('/main.js')
def mainjs():
    mainjs_path = os.path.join(app.static_folder, 'main.js')
    return send_file(mainjs_path)

@app.route('/main.js.map')
def mainjsmap():
    mainjsmap_path = os.path.join(app.static_folder, 'main.js.map')
    return send_file(mainjsmap_path)

@app.route('/r/stream')
def stream():
    after = request.args.get('start_after', default=0)

    def gen(after):
        while True:
            new_messages = Message.query.filter(Message.msg_id > after).all()
            if len(new_messages) > 0:
                after = new_messages[-1].msg_id
                formatted = [msg.to_dict() for msg in new_messages]
                data = "data: {}\n\n".format(json.dumps(formatted))
                yield data
    return Response(gen(after), 200, {'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no'})


@app.route('/r/messages', methods=['GET', 'PUT'])
def messages():
    if request.method == 'GET':
        messages_list = Message.query.all()
        messages = [msg.to_dict() for msg in messages_list]
        return json.dumps(messages), 200, {'Content-Type': 'application/json'}
    else:
        nm = request.get_json()
        msg = Message()
        msg.username = nm['username']
        msg.payload = json.dumps(nm['payload'])
        db.session.add(msg)
        db.session.commit()
        return json.dumps({'msg_id': msg.msg_id}), 200, {'Content-Type': 'application/json'}


@app.route('/r/test')
def test():
    return render_template('esource.html')
