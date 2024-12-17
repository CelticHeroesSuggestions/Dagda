import os
import sys
from urllib.parse import urlparse
from http.server import SimpleHTTPRequestHandler
from http.server import HTTPServer
import json

# import the two connectors
try:
    import mariadb
    using_maria = True
except:
    using_maria = False
try:
    import mysql.connector
    using_mysql = True
except:
    using_mysql = False

class Handler(SimpleHTTPRequestHandler):
    # get requests
    def do_GET(self):
        url = urlparse(self.path)
        request_file_path = url.path.strip('/')

        # index route
        if request_file_path == "":
            self.path = "index.html"

        # by default this will get the file relative to this root (CSS, JS)

        # print if the requested file does not exist
        if not os.path.exists(request_file_path):
            print(f'Not found: {request_file_path}')

        return SimpleHTTPRequestHandler.do_GET(self)
    
    # post requests
    def do_POST(self):
        if self.path == "/data":
            # Read the content length from the headers
            content_length = int(self.headers['Content-Length'])
            
            # Read and decode the body of the POST request
            post_data = self.rfile.read(content_length).decode('utf-8')
            
            # Parse the JSON data from the body
            try:
                data = json.loads(post_data)
                response_message = f"Received data: {data['action']}, {data['target']}"
                print(response_message)

                # "get" will pull a "target" table from the database
                if data["action"] == "get":
                    response_message = db.get_table(data["target"], fields=data["fields"] if "fields" in data else [])
                    for row in range(len(response_message)):
                        for col in range(len(response_message[row])):
                            if type(response_message[row][col]) == bytes:
                                response_message[row] = list(response_message[row])
                                response_message[row][col] = int.from_bytes(response_message[row][col])
                # "set" will update a "target" table in the database with a "value" row
                elif data["action"] == "set":
                    # update a quest's stage template and stages individually
                    if data["target"] == "quest":
                        # replace the stages
                        queries = []
                        queries.append(f"DELETE FROM ch_unitydatadb.quest_stage_templates WHERE quest_id = {data["data"]["quest_id"]};")
                        for stage in data["data"]["stages"]:
                            queries.append(["INSERT INTO ch_unitydatadb.quest_stage_templates (quest_id, stage_id, completion_type, completion_details, next_stage, stage_open_sum, description) VALUES (%s, %s, %s, %s, %s, %s, %s)", (stage["quest_id"], stage["stage_id"], stage["completion_type"], stage["completion_details"], stage["next_stage"], stage["stage_open_sum"], stage["description"])])
                        # replace the quest
                        queries.append(f"DELETE FROM ch_unitydatadb.quest_templates WHERE quest_id = {data["data"]["quest_id"]};")
                        queries.append(["INSERT INTO ch_unitydatadb.quest_templates (quest_id, level_required, xp_reward, coins_reward, item_reward, item_count, prerequesit, zone, quest_level, repeatable, requires_class, has_ability, lacks_ability, uses_loot_table, blocked_by, quest_name, bounty_weight, quest_type, faction_id, faction_level, faction_id_reward, faction_point_reward, description) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (data["data"]["quest_id"], data["data"]["level_required"], data["data"]["xp_reward"], data["data"]["coins_reward"], data["data"]["item_reward"], data["data"]["item_count"], data["data"]["prerequesit"], data["data"]["zone"], data["data"]["quest_level"], data["data"]["repeatable"], data["data"]["requires class"], data["data"]["has_ability"], data["data"]["lacks_ability"], data["data"]["uses_loot_table"], data["data"]["blocked_by"], data["data"]["quest_name"], data["data"]["bounty_weight"], data["data"]["quest_type"], data["data"]["faction_id"], data["data"]["faction_level"], data["data"]["faction_id_reward"], data["data"]["faction_point_reward"], data["data"]["description"])])
                        db.execute(queries)
                # Send a success response
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                response = {"status": "success", "message": response_message}
                self.wfile.write(json.dumps(response).encode('utf-8'))
            except json.JSONDecodeError:
                # Send a bad request response if JSON is invalid
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                response = {"status": "error", "message": "Invalid JSON"}
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            # Handle unsupported paths
            self.send_response(404)
            self.end_headers()


class Database():
    def __init__(self):
        self.db = None
        self.init_db()

    # connect to the database
    def init_db(self):
        mydb = None
        self.db_type = None
        print("Connecting to DB at URL", os.getenv("CH_DB_URL"), "with user", os.getenv("CH_DB_USER"), "and pass", os.getenv("CH_DB_PASS"))
        if using_maria:
            try:
                mydb = mariadb.connect(
                    host = os.getenv("CH_DB_URL"),
                    user = os.getenv("CH_DB_USER"),
                    password = os.getenv("CH_DB_PASS")
                )
                self.db_type = "mariadb"
            except Exception as e:
                print("MariaDB connector is installed, but unable to connect:", e)
        if mydb is None:
            try:
                mydb = mysql.connector.connect(
                    host = os.getenv("CH_DB_URL"),
                    user = os.getenv("CH_DB_USER"),
                    password = os.getenv("CH_DB_PASS")
                )
                self.db_type = "mysql"
            except Exception as e:
                print("MySQL connector is installed, but unable to connect:", e)
        if mydb is None:
            print("Neither connection was able to connect to the database! Check that you have installed a connector that matches the target database, and that your environment variables are set.")
            sys.exit(1)
        self.db = mydb
        return

    # get all table contents from the database
    def get_table(self, table, fields=[]):
        cursor = self.db.cursor()
        if "." not in table:
            table = "ch_unitydatadb." + table
        if self.db_type == "mariadb":
            try:
                cursor.execute(f"SELECT {("*" if fields == [] else ", ".join(fields))} FROM {table}")
                res = cursor.fetchall()
                cursor.close()
                return res
            except mariadb.OperationalError:
                print("Database table", table, "does not exist!!")
        elif self.db_type == "mysql":
            try:
                cursor.execute(f"SELECT * FROM {table}")
                res = cursor.fetchall()
                cursor.close()
                return res
            except mysql.connector.errors.ProgrammingError:
                print("Database table", table, "does not exist!!")
        return []
    
    # sanitize inputs
    def sanitize(self, inputs):
        if isinstance(inputs, str):
            inputs.replace(", ,", ", NULL,").replace(", None,", ", NULL,")
        elif isinstance(inputs, list):
            for i in range(len(inputs)):
                if inputs[i] is None or inputs[i] == "" or inputs[i] == "None":
                    inputs[i] = "NULL"
        return inputs
    
    # print a query that has values
    def print_query_with_values(self, query):
        print(query[0][:query[0].find("(%s")] + str(query[1]))

    # execute a query on the database
    def execute(self, queries):
        # force queries to be a list
        if isinstance(queries, str):
            queries = [queries]
        cursor = self.db.cursor()
        print("* Query *")
        if self.db_type == "mariadb":
            try:
                for query in queries:
                    # if a list, execute with parameters
                    if isinstance(query, list):
                        self.print_query_with_values(query)
                        cursor.execute(self.sanitize(query[0]), self.sanitize(query[1]))
                    else:
                        print(query)
                        cursor.execute(self.sanitize(query))
                self.db.commit()
                cursor.close()
                print("* Success *")
            except mariadb.OperationalError:
                cursor.close()
                print("*Invalid query*", query)
        elif self.db_type == "mysql":
            try:
                for query in queries:
                    # if a list, execute with parameters
                    if isinstance(query, list):
                        self.print_query_with_values(query[0])
                        cursor.execute(self.sanitize(query[0]), self.sanitize(query[1]))
                    else:
                        print(query)
                        cursor.execute(self.sanitize(query))
                self.db.commit()
                cursor.close()
                print("* Success *")
            except mysql.connector.errors.ProgrammingError:
                cursor.close()
                print("*Invalid query*", query)
        return
    

try:
    param = sys.argv[1]
except IndexError:
    param = None

host = '0.0.0.0'
if param is None:
    port = 8000
else:
    if ':' in param:
        host = param.split(':')[0]
        port = int(param.split(':')[1])
    else:
        port = int(param)

db = Database()
print("Connected to database!")
httpd = HTTPServer((host, port), Handler)
print(f'Serving HTTP on {host}:{port}')
print(f'Looking for static assets in {os.getcwd()}')

# query1 = "DELETE FROM ch_unitydatadb.quest_templates WHERE quest_id = 1;"
# query2 = "INSERT INTO ch_unitydatadb.quest_templates (quest_id, level_required, xp_reward, coins_reward, item_reward, item_count, prerequesit, zone, quest_level, repeatable, requires_class, has_ability, lacks_ability, uses_loot_table, blocked_by, quest_name, bounty_weight, quest_type, faction_id, faction_level, faction_id_reward, faction_point_reward, description) VALUES (1, 1, 150, 5, NULL, 0, NULL, 2, 1, 0, 0, -1, -1, 0, NULL, 'Starting Out', 0, 0, 0, 0, 0, 0, 'You have arrived in Lirs Reach to find it under attack from Direhounds - it looks like your chance for adventure will come sooner than you thought!');"

# cursor = db.db.cursor()
# cursor.execute(query1)
# cursor.execute(query2)
# db.db.commit()
# cursor.close()
# print("EXECUTED QUERY")

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print('Bye bye')
    sys.exit(0)