# wom-comps

This project automates the creation of WOM competitions for a group.

Competition configs live in `/src/create_comps/comps_config.ts`.

Runtime config lives in `.env`, see `.env.sample` for an example.

## Running this project

Requires `docker-compose`.

Run `sudo docker compose up --build` to run the container.

The result of this code depends on the exact implementation of some standard functions, so running in different versions of node may produce undesired effects. Please use the version specified in the dockerfile.