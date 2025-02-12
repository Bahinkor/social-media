# Social Media Backend

A social media project built using the Express.js framework and MongoDB database, designed to function similarly to Instagram, allowing users to share posts, interact with others, and engage with various social features.

- Authentication & Authorization: Secure user authentication using JWT (JSON Web Token).
- Database Management: MongoDB with Mongoose for efficient data modeling.
- File Uploads: Support for image and video uploads, likely using Multer or Cloud Storage.
- API Security: Input validation using Joi, and rate limiting to prevent abuse.
- RESTful API: Well-structured RESTful APIs for frontend integration.
- API Documentation: API documentation using Swagger (Swagger UI & OpenAPI) for clear and interactive API reference.


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

## Client repo:
[Social Media Project Client Repo](https://github.com/Bahinkor/social-media-client)
