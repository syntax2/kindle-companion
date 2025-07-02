Kindle Companion
Kindle Companion is an AI-powered agent designed to help you rebuild and maintain your reading habit through intelligent, proactive encouragement.

Tech Stack
Monorepo: pnpm workspaces for frontend

Frontend: Next.js (React) & Tailwind CSS

Backend: Python & FastAPI

Database: PostgreSQL (via Docker)

Python Environment: Poetry

Local Development Setup
Follow these steps to get the full application stack running on your local machine.

Prerequisites
Python (v3.9+) & Poetry

Node.js (v18+) & pnpm

Git

Docker Desktop (must be running)

1. Clone & Install Dependencies
First, clone the repository and install the frontend dependencies.

git clone <your-repo-url>
cd kindle-companion
pnpm install

2. Install Python Dependencies
Navigate into the API service directory and install its dependencies using Poetry.

cd packages/api-service
poetry install
cd ../..

3. Start the Database & Create Tables
You need to start the database container and then manually create the necessary tables for our application.

a. Start the Database:
From the root directory, run:

docker-compose up -d

This will start a PostgreSQL server on localhost:5432.

b. Create Database Tables:
Connect to the database using a client of your choice (like DBeaver, TablePlus, or the psql command-line tool) with the following credentials:

Host: localhost

Port: 5432

Database: kindle_companion

User: user

Password: password

Once connected, run the following SQL script to create the required tables:

-- Create a UUID generation function for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table to store user information
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_identifier TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table to store user reading goals
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reading_minutes_per_day INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Table to store the books a user is reading
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

4. Run the Application
You will need two separate terminals running from the root kindle-companion directory.

Terminal 1: Start the Backend API

cd packages/api-service
poetry run uvicorn src.main:app --reload --port 8080

Terminal 2: Start the Frontend App

cd packages/web-app
pnpm dev

You can now access the web application at http://localhost:3000.