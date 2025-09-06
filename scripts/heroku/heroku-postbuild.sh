#!/usr/bin/env bash

if [ "$APP" == "web" ]; then
    pnpm build:web
elif [ "$APP" == "strapi" ]; then
    pnpm build:strapi
else
    echo "Invalid APP env value. Please set APP to one of: web, strapi"
fi
