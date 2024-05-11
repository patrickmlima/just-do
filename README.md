# Just DO

Simple ToDo application

### Dependencies

- Docker CE (>= v26)
- NodeJS (>= 20.10)
- NPM (>= 10.6)

### How to run this project

Firstly you need to setup your environment variables.

Inside `just-do-backend/environments` is the folder where you will paste `.env` files for each of your environments. The name standard is set as `.env.<ENVIRONMENT_NAME>`

In folder `just-do-frontend/src/environments` is where you will set your variables for each environment on frontend application. The name standard follows the same logic mentioned before.

If you want to run it for development purposes you can run a docker compose stack for backend:

```bash
cd just-do-frontend
npm i
npm run start
```

And from another terminal run frontend locally:

```bash
cd just-do-backend
npm i
docker compose -f ./docker-compose.dev.yaml up --build
```

If you want to deploy it in a more production-ready way you can run the complete Docker compose stack for this project using
`docker compose -f ./docker-compose_production.yaml up --build` from the root folder of this project.
