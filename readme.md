# Spoti Stats API

The Spoti Stats API is a simple GraphQL API to track some Spotify play history and share them with other users. It allows users to authenticate using Spotify and have their play history be saved.

The tech stack used is the following:
- **GraphQL** - Query user data
- **Express** and **Node.js** - Server and authentication
- **MongoDB** - Data storage

## Installation

To install the project you first need to clone it. Open the project directory in a terminal and run `npm install` to install the dependencies needed.

Some aditional configuration steps are described below.

### Spotify settings

In order to run this project you need to create a Spotify app in the [developer dashboard](https://developer.spotify.com/dashboard). Then you can get the **Client ID** and **Client Secret** needed for the environment configuration.

You will aditionally need to setup the callback url. This will be the url of your client that will be redirected to after the user logins with spotify. This will need to be added to the environment variables and to the Spotify app settings under **Redirect URIs**.

### Environment variables

Make sure to configure the environment variables before running. For this you will need:

- The URI to your MongoDB instance as well as the login information.
- The Spotify app's **Client ID**, **Client Secret**, and **Redirect URI** mentioned in the section above.
- A string to be used as the secret in the JWT token generation.

There is a template for the expected environment variables in `src/config/.env.template`. The default configuration expects the file `src/config/.env.development` to exist, so duplicate the template and rename it.

**!!! Make sure to never commit a .env file as these will contain secret information !!!**

## Running the project

Before running the project make sure the MongoDB database you configured in the environment file is running.

### Running Locally

To run the API locally you can use `npm run start:dev`. 

This launches the API server on port 8888 and uses the file `src/config/.env.development` to set the environment. Either create one following the template or change the location in the `package.json`