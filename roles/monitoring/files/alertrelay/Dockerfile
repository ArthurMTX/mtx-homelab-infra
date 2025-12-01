FROM python:3.12-slim

WORKDIR /app
RUN pip install flask requests

COPY app.py .

ENV FLASK_APP=app.py

CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]