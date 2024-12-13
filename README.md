# Social Media Backend

A social media project with expressJs framework and mongoDB database and ejs template engine.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing
purposes.

### Prerequisites

You need to have the following software installed on your system:

- Node.js
- MongoDB

### Installing

1. Clone the repository to your local machine:

```
git clone https://github.com/Bahinkor/social-media.git
```

2. Navigate to the project directory:

```
cd social-media
```

3. Install dependencies:

```
npm install
```

### Setting Up MongoDB

1. Make sure MongoDB is installed and running on your system.

2. Create a new database named `social-media`.

### Configuration

1. Create a `.env` file in the root directory of the project.

2. Add the following environment variables to the `.env` file:

```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/social-media
REFRESH_TOKEN_EXPIRE=60
ACCESS_TOKEN_SECRET=RANDOM KEY
NODE_ENV=development
EMAIL=YOUR EMAIL
EMAIL_PASS=YOUR EMAIL APP PASSWORD
HOST=http://localhost:8000
SESSION_SECRET=RANDOM KEY
FRONT_URL=CLIENT HOST URL
```

### Running the Server

Start the server by running the following command:

```
npm start
```

The server will be running on port 8000 by default.

## Usage

Once the server is running, you can access the application by navigating to `http://localhost:8000` in your web browser.