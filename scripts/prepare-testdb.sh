#!/bin/bash

docker rm -f testdb
docker run --name mysqlraw -e MYSQL_ROOT_PASSWORD=1234 -d mysql/mysql-server:5.6
sleep 10
mv migrations/.migrate migrations/.bkp_migrate
node_modules/migrate/bin/migrate up
IP=$(dips | grep mysqlraw | sed "s#/mysqlraw - ##")
docker exec mysqlraw mysqldump -u root -p1234 test > test.sql
chmod 0777 test.sql
docker rm -f mysqlraw
rm migrations/.migrate
mv migrations/.bkp_migrate migrations/.migrate
docker run --name testdb -e MYSQL_ROOT_PASSWORD=1234 -d -v $(pwd)/test.sql:/docker-entrypoint-initdb.d/test.sql mysql/mysql-server:5.6
