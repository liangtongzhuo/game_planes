#!/bin/bash

# add the below line to crontab
# */1 * * * * cd /home/ubuntu/node-live-api/current && ./update.sh > /dev/null

git remote update

LOCAL=$(git rev-parse @)

REMOTE=$(git rev-parse "origin/master")

if [ $LOCAL = $REMOTE ];then
 echo "up-to-date" > /dev/null
else
 git checkout master
 git pull && npm install && sudo pm2 reload game_planes
fi
