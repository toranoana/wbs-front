# wbs

wbs tool front app repository

## require

- development
  - docker
- production or staging
  - node v12

## Project setup

### development

```
docker-compose up -d
bin/docker_shell.sh
npm install
```

if you change graphql schema(preparing)

```
npm install -g apollo
cd ~/desktop # or project outside directory
apollo client:download-schema --endpoint=http://localhost:3000/graphql schema.graphql
apollo client:download-schema --endpoint=http://localhost:3000/graphql schema.json
```

### production

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your unit tests

```
npm run test:unit
```

### Run your end-to-end tests

```
npm run test:e2e
```

### Lints and fixes files

```
npm run lint
```
