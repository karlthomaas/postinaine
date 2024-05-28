
# Postinaine

This project is a full-stack application with React.js and Typescript frontend and a Python FastAPI backend.

## Frontend
In addition to React.js, this project is equipped with several modern libraries to facilitate efficient and effective development:

* **RTK (Redux Toolkit)** — Official, opinionated, batteries-included tool set for efficient  Redux development

* **RTK Query** — Powerful data fetching and caching tool. It is part of Redux toolkit that provides developers with a set of tools to define APIs, fetch data from them, cache the results, and automatically update the cache as needed.

* **React Hook Form** — Lightweight and efficient library for managing form states in React.

* **Tailwind CSS** — Provides low-level utility classes that allow developers to build completely custom designs without ever leaving their HTML

* **Vitest** —  Vitest is a unit testing framework designed specifically for Vite. It provides a fast and efficient testing environment with out-of-the-box support for ES modules and Vite-specific features.

* **React Testing Library**—This project uses React Testing Library for testing React components. It provides light-weight solutions for testing React components without relying on their implementation details, encouraging better testing practices.


## Backend
The backend is a Python application built with FastAPI. It includes  API endpoints and database interactions.  It's equipped with:
 

* **JWT (JSON web token)** — used for securely transmitting information between the client and the server.

* **Refresh Tokens** — Used to obtain new JWT when the current token gets invalid. This allows the user to stay authenticated without needing to manually re-enter credentials.

* **SQLite DB** —  Used for storing user sessions and newsapi tokens.

## TODO

- [ ]  Add middleware to backend (for JWT check)
## Run Locally

Clone the project

```bash
git clone https://github.com/karlthomaas/postinaine.git
```

Go to the project directory

```bash
cd postinaine
```

Build docker container

```bash
docker-compose build
```

Run docker container

```bash
docker-compose up
```


## Running Tests

To run tests, run the following command

```bash
npm run test
```

To view the coverage, run the following command
```bash
npm run coverage
```

## Screenshots

#### News page
![App Screenshot](https://i.postimg.cc/266Hbdpk/Screenshot-2024-05-28-at-18-09-21-Vite-React-TS.png)

#### Login Panel
![App Screenshot](https://i.postimg.cc/bJN50cnj/Screenshot-2024-05-28-at-18-08-18-Vite-React-TS.png)

## Estimation
* Frontend - 12 hours
* Backend - 3 hours
* Total - 15 hours

## Authors
- [@karlthomaas](https://www.github.com/karlthomaas)
