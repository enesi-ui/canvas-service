## Canvas Service

This is a service that provides websocket and REST API for managing shapes and components.

### Envs

create a `.env` file in the root directory with the following content:

```bash
DATABASE_URL=mongodb://localhost:27017/enesi
```

### Run

initialize the database with the following command:
this starts the mongodb on docker
you can also use the https://github.com/enesi-ui/orchestration repository to start the complete stack

```bash
npm run start:env
```

```bash
npm install
npm run dev
```


