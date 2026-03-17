#!/usr/bin/env python3
import json, os, sqlite3, sys
from datetime import datetime

DB_PATH = "quotes.db"

def get_db():
    db = sqlite3.connect(DB_PATH)
    db.execute("""CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        facility_name TEXT,
        facility_type TEXT,
        beds INTEGER,
        platform TEXT,
        total_price REAL,
        equipment_total REAL,
        installation_total REAL,
        margin_total REAL,
        components TEXT,
        answers TEXT,
        lead_name TEXT DEFAULT '',
        lead_email TEXT DEFAULT '',
        lead_phone TEXT DEFAULT '',
        lead_facility TEXT DEFAULT '',
        lead_notes TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""")
    # Migrate existing tables — add lead columns if missing
    try:
        db.execute("ALTER TABLE quotes ADD COLUMN lead_name TEXT DEFAULT ''")
    except:
        pass
    try:
        db.execute("ALTER TABLE quotes ADD COLUMN lead_email TEXT DEFAULT ''")
    except:
        pass
    try:
        db.execute("ALTER TABLE quotes ADD COLUMN lead_phone TEXT DEFAULT ''")
    except:
        pass
    try:
        db.execute("ALTER TABLE quotes ADD COLUMN lead_facility TEXT DEFAULT ''")
    except:
        pass
    try:
        db.execute("ALTER TABLE quotes ADD COLUMN lead_notes TEXT DEFAULT ''")
    except:
        pass
    db.commit()
    return db

def respond(status, body):
    print(f"Status: {status}")
    print("Content-Type: application/json")
    print()
    print(json.dumps(body))

method = os.environ.get("REQUEST_METHOD", "GET")
path_info = os.environ.get("PATH_INFO", "")
query = os.environ.get("QUERY_STRING", "")

try:
    db = get_db()

    if method == "POST" and path_info in ("", "/", "/quotes"):
        content_length = int(os.environ.get("CONTENT_LENGTH", 0))
        body = json.loads(sys.stdin.read(content_length)) if content_length > 0 else {}

        facility_name = body.get("facility_name", "Unknown Facility")
        facility_type = body.get("facility_type", "")
        beds = body.get("beds", 0)
        platform = body.get("platform", "")
        total_price = body.get("total_price", 0)
        equipment_total = body.get("equipment_total", 0)
        installation_total = body.get("installation_total", 0)
        margin_total = body.get("margin_total", 0)
        components = json.dumps(body.get("components", []))
        answers = json.dumps(body.get("answers", {}))
        lead_name = body.get("lead_name", "")
        lead_email = body.get("lead_email", "")
        lead_phone = body.get("lead_phone", "")
        lead_facility = body.get("lead_facility", "")
        lead_notes = body.get("lead_notes", "")

        cursor = db.execute(
            """INSERT INTO quotes (facility_name, facility_type, beds, platform,
               total_price, equipment_total, installation_total, margin_total,
               components, answers, lead_name, lead_email, lead_phone, lead_facility, lead_notes)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            [facility_name, facility_type, beds, platform,
             total_price, equipment_total, installation_total, margin_total,
             components, answers, lead_name, lead_email, lead_phone, lead_facility, lead_notes]
        )
        db.commit()
        quote_id = cursor.lastrowid

        respond(201, {
            "id": quote_id,
            "facility_name": facility_name,
            "total_price": total_price,
            "created_at": datetime.now().isoformat()
        })

    elif method == "GET" and path_info in ("/admin", "/quotes"):
        # Check password for admin
        password = ""
        if query:
            for param in query.split("&"):
                if param.startswith("password="):
                    password = param.split("=", 1)[1]

        if password != "nexus2026":
            respond(401, {"error": "Unauthorized"})
        else:
            rows = db.execute(
                """SELECT id, facility_name, facility_type, beds, platform,
                   total_price, equipment_total, installation_total, margin_total,
                   components, answers, created_at,
                   lead_name, lead_email, lead_phone, lead_facility, lead_notes
                   FROM quotes ORDER BY id DESC"""
            ).fetchall()

            results = []
            for row in rows:
                results.append({
                    "id": row[0],
                    "facility_name": row[1],
                    "facility_type": row[2],
                    "beds": row[3],
                    "platform": row[4],
                    "total_price": row[5],
                    "equipment_total": row[6],
                    "installation_total": row[7],
                    "margin_total": row[8],
                    "components": json.loads(row[9]) if row[9] else [],
                    "answers": json.loads(row[10]) if row[10] else {},
                    "created_at": row[11],
                    "lead_name": row[12] or "",
                    "lead_email": row[13] or "",
                    "lead_phone": row[14] or "",
                    "lead_facility": row[15] or "",
                    "lead_notes": row[16] or "",
                })

            respond(200, results)

    elif method == "GET":
        respond(200, {"status": "ok", "service": "NexusCT Nurse Call Quoting API"})

    else:
        respond(404, {"error": "Not found"})

except Exception as e:
    respond(400, {"error": str(e)})
