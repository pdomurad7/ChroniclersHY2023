FROM python:3

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

COPY app .