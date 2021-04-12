# Unkle backend test

This is an API written in Nodejs (ExpressJS) and uses MONGODB as its database. In the following, we explain how to use
`curl` to send HTTP request to the API. You might also use [Postman](https://www.postman.com/) and
set the commands accordingly.

## Getting started

To start the server we need to follow these steps:

1. install dependencies with `npm install`,
1. add the first admin with

```bash
ADMIN_EMAIL="<FIRST_ADMIN_EMAIL>" \
ADMIN_PASSWORD="<FIRST_ADMIN_PASSWORD>" \
MONGODB_URI="<MONGODB_URI>" \
npm run create-first-admin
```

1. feed contract options with

```bash
MONGODB_URI="<MONGODB_URI>" npm run feed-options
```

This will feed the database with all options exported in `const/options.js`.

1. run `dev` server using the database URI `<MONGODB_URI>`, with

```bash
MONGODB_URI="<MONGODB_URI>" npm run dev
```

This command will run concurrently

- the ExpressJS server,
- the script `scripts/updateContractsStatus.js` that updates the contracts status on regular basis (currently every 1 min).

**Note:** Make sure to put `<MONGODB_URI>` within the quotes.

## Model

### User

```js
{
  "email": {
    "type": String,
    "required": true
  },
  "password": {
    "type": String,
    "required": true
  },
  "isAdmin": {
    "type": Boolean,
    "default": false
  },
  "createdAt": {
    "type": Date,
    "default": Date.now
  }
}
```

### Option

```js
{
  "title": {
    "type": String,
    "required": true
  },
  "description": {
    "type": String,
    "required": true
  }
}
```

### Contract

```js
{
  "startAt": {
    "type": Date,
    "require": true
  },
  "options": {
    "type": [{ "type": mongoose.Schema.Types.ObjectId, "ref": "Option" }],
    "required": true
  },
  "clients": {
    "type": [{ "type": mongoose.Schema.Types.ObjectId, "ref": "User" }],
    "required": true
  },
  "status": {
    "type": String,
    "default": PENDING,
    "enum": [PENDING, ACTIVE, FINISHED]
  },
  "finishAt": {
    "type": Date
  },
  "createdAt": {
    "type": Date,
    "default": Date.now
  }
}
```

## API

### User management

##### `POST /api/user/signup`

##### Desc: register non-admin users

```bash
curl -X POST \
     --header "Content-Type:application/json" \
     -d '{"email": "<EMAIL>", "password": "<PASSWORD>"}' \
     localhost:3000/api/user/signup
```

##### `GET /api/user/gentoken?email=<EMAIL>&password=<PASSWORD>`

##### Desc: get valid token (valid for 1h)

```bash
curl -X GET localhost:3000/api/user/gentoken?email=<EMAIL>&password=<PASSWORD>
```

It returns a JSON response containing the token:

```
{token: ....}
```

**Note:** You might need to use these tokens in protected endpoints (should be used as `<TOKEN>` or `<ADMIN_TOKEN>` in the following)

##### `POST /api/user/addadmin`

##### Desc: add new admins by older admins (by providing a valid admin token)

```bash
curl -X POST \
     -H "Content-Type:application/json" \
     -H "Authorization: Bearer <ADMIN_TOKEN>" \
     -d '{"email": "<EMAIL>", "password": "<PASSWORD>"}' \
     localhost:3000/api/user/addadmin
```

##### `GET /api/user`

##### Desc: get list of all users (only allowed to admin)

```bash
curl -X GET \
     -H "Content-Type:application/json" \
     -H "Authorization: Bearer <ADMIN_TOKEN>" \
     localhost:3000/api/user
```

## Options management

##### `GET /api/option`

##### Desc: get all options

```bash
curl -X GET \
     -H "Content-Type:application/json" \
     -H "Authorization: Bearer <TOKEN>" \
     localhost:3000/api/option
```

##### `GET /api/option?optionId=<OPTION_ID>`

##### Desc: get option by id

```bash
curl -X GET \
     -H "Content-Type:application/json" \
     -H "Authorization: Bearer <TOKEN>" \
     localhost:3000/api/option?optionId=<OPTION_ID>
```

##### `POST /api/option/`

##### Desc: create an option (only admins are allowed)

```bash
curl -X POST \
     -H "Content-Type:application/json" \
     -H "Authorization: Bearer <ADMIN_TOKEN>" \
     -d '{"title": "<OPTION_TITLE>", "description": "<OPTION_DESC>"}' \
     localhost:3000/api/option
```

## Contract management

**Note:** All dates should be in format 'dd/mm/yyyy' (e.g.'01/01/2021')

##### `GET /api/contract`

##### Desc: get all contracts (admins access all contracts and clients access only their own)

```bash
curl -X GET \
     -H "Content-Type:application/json" \
     -H "Authorization: Bearer <TOKEN>" \
     localhost:3000/api/contract
```

##### `GET /api/contract?contractId=<CONTRACT_ID>`

##### Desc: get contract by id (admins access all contracts and clients access only their own)

```bash
curl -X GET \
     -H "Content-Type:application/json" \
     -H "Authorization: Bearer <TOKEN>" \
     localhost:3000/api/contract?contractId=<CONTRACT_ID>
```

##### `POST /api/contract`

##### Desc: create contract (only admins can do it)

```bash
curl -X POST \
     -H "Content-Type:application/json" \
     -H "Authorization: Bearer <ADMIN_TOKEN>" \
     -d '{"startAt": "<START_AT>", "options": <LIST_OF_OPTIONS_IDS>, "clients": <LIST_OF_CLIENTS_IDS>}' \
     localhost:3000/api/contract
```

##### `PUT /api/contract/finish`

##### Desc: finish contract (only admins and contract clients can do it)

```bash
curl -X POST \
     -H "Content-Type:application/json" \
     -H "Authorization: Bearer <TOKEN>" \
     -d '{"finishAt": "<FINISH_AT>", "contractId": "<CONTRACT_ID>"}' \
     localhost:3000/api/contract/finish
```

## Features

- All passwords are encrypted, using `bcryptjs`, then registered in database.
