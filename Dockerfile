FROM node as npmbuild
ADD . /build
WORKDIR /build
RUN npm i --save-dev
RUN npm run build -- -o dist/main.js

# base defines entrypoint as /entrypoint.sh
FROM tiangolo/uwsgi-nginx-flask:python3.6-alpine3.7

ENV DB_REL_PATH=app.db

COPY . /app
COPY --from=npmbuild /build/dist /react
# base sets the FLASK_APP to /app/main.py
RUN echo "from fapp.routes import app" > /app/main.py
ADD nginx.conf /etc/nginx/conf.d/nginx.conf

RUN apk add --no-cache --virtual .build-deps gcc musl-dev libffi-dev && \
	pip install -r requirements.txt && \
	apk del .build-deps
