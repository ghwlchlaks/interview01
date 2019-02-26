#!/bin/sh

mongod &

service redis-server stop
service redis-server start
redis-server &