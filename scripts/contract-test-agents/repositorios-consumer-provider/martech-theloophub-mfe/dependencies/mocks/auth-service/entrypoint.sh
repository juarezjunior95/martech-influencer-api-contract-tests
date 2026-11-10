#!/bin/sh

token=`cat ../../.env | grep JWT | tr -d 'JWT='`

sed -i 's/<TOKEN>/$token/g' responses/response-login-sucessful.json

stubby -d auth-endpoints.yaml -s 80 -a 8906 -t 7449 -w