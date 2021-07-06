FROM node:12-alpine AS base

ARG WORKDIR=/usr/src/app

ENV LANG=C.UTF-8 TZ=Asia/Tokyo

RUN apk add --no-cache \
    tini \
    tzdata

RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR

EXPOSE 8080

ENV NODE_ENV="development"

