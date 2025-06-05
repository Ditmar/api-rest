print("Start ########################");
db = db.getSiblingDB("db-open-science");
db.createUser({
  user: "admin",
  pwd: "admin",
  roles: [{ role: "readWrite", db: "db-open-science" }],
});
db.createCollection("users");

print("END ##########################");