import os
import urllib.parse

from flask import Flask, request
import requests

app = Flask(__name__)

DISCORD_WEBHOOK_URL = os.environ["DISCORD_WEBHOOK_URL"]
FREE_USER = os.environ.get("FREE_USER")
FREE_PASS = os.environ.get("FREE_PASS")


@app.post("/discord")
def discord_webhook():
    data = request.json or {}
    alerts = data.get("alerts", [])

    lines = []
    for a in alerts:
        labels = a.get("labels", {})
        ann = a.get("annotations", {})
        status = a.get("status", "?")
        name = labels.get("alertname", "unknown")
        severity = labels.get("severity", "unknown")
        desc = ann.get("description", "")

        lines.append(f"[{status.upper()}] {name} (sev={severity}) - {desc}")

    if not lines:
        return "", 200

    payload = {"content": "\n".join(lines)[:1800]}

    r = requests.post(DISCORD_WEBHOOK_URL, json=payload, timeout=5)
    r.raise_for_status()
    return "", 200


@app.post("/free")
def free_sms():
    if not FREE_USER or not FREE_PASS:
        return "", 200

    data = request.json or {}
    alerts = data.get("alerts", [])
    if not alerts:
        return "", 200

    a = alerts[0]
    labels = a.get("labels", {})
    ann = a.get("annotations", {})

    name = labels.get("alertname", "unknown")
    severity = labels.get("severity", "unknown")
    desc = ann.get("description", "")

    msg = f"{severity.upper()} - {name}: {desc}"
    msg_enc = urllib.parse.quote_plus(msg[:150])

    url = (
        f"https://smsapi.free-mobile.fr/sendmsg"
        f"?user={FREE_USER}&pass={FREE_PASS}&msg={msg_enc}"
    )

    r = requests.get(url, timeout=5)
    try:
        r.raise_for_status()
    except Exception as e:
        print("Erreur SMS Free:", e)

    return "", 200
