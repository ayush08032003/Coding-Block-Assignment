

# Multi-Service Blog Platform with JWT Authentication, Docker, and AWS Deployment

## Overview

This project is a **multi-service application** that allows users to interact with blog posts through an authentication mechanism using **JWT (JSON Web Tokens)**. It uses the following core technologies:

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcrypt for hashing passwords
- **Containerization:** Docker for containerization and Docker Compose for orchestration
- **Cloud Deployment:** AWS EC2 for deployment

It provides functionality for users to register, log in, create blogs, edit blogs, delete blogs, and add comments. The services are Dockerized, and the platform is deployed on AWS EC2 instances for easy scalability.

---

## Table of Contents

1. [Installation](#installation)
2. [Environment Variables](#environment-variables)
3. [Architecture](#architecture)
4. [API Endpoints](#api-endpoints)
5. [Docker Setup](#docker-setup)
6. [Deployment to AWS](#deployment-to-aws)
7. [Error Handling](#error-handling)
8. [Contributing](#contributing)
---
Thank you for providing the GitHub link. You can update the **Installation** and **Docker Setup** sections of your `README.md` with the actual GitHub repository link as follows:

---

## Installation

To get started, clone this repository and install the required dependencies:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ayush08032003/Coding-Block-Assignment.git
   cd Coding-Block-Assignment
   ```

2. **Install dependencies:**

   Install Node.js dependencies:

   ```bash
   npm install
   ```

3. **Install Docker (if not installed already):**

   [Docker Installation Guide](https://docs.docker.com/get-docker/)

---

## Environment Variables

Create a `.env` file at the root of the project and define the following environment variables:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_PORT=5432
```

---

## Architecture

The application is designed with the following services:

### **User Service:**

- Allows users to register and log in.
- The password is hashed using `bcrypt`.
- JWT tokens are generated upon successful login for further authentication.

### **Blog Service:**

- Registered users can create blog posts with descriptions.
- Users can update or delete their own blog posts.
- Each blog belongs to a user (foreign key reference).

### **Comment Service:**

- Users can add comments to blogs.
- Comment replies are supported (by adding a parent comment relationship).

---

## API Endpoints

Here is a list of the primary API endpoints provided by the platform.

### **1. User Authentication:**

- `POST /register` - Register a new user
  - **Request Body:** `{ "name": "<username>", "email": "<email>", "password": "<password>" }`
- `POST /login` - Login an existing user and get a JWT token
  - **Request Body:** `{ "email": "<email>", "password": "<password>" }`

### **2. User Profile:**

- `GET /users/:userId` - Get user details by ID
  - **Params:** `userId`
  
### **3. Blog Management:**

- `POST /blogs` - Create a new blog post (requires JWT)
  - **Request Body:** `{ "description": "<blog_description>" }`
- `PUT /blogs/:blogId` - Edit an existing blog (requires JWT)
  - **Params:** `blogId`
  - **Request Body:** `{ "description": "<updated_description>" }`
- `DELETE /blogs/:blogId` - Delete a blog (requires JWT)
  - **Params:** `blogId`

### **4. Comment Management:**

- `POST /comments` - Add a comment to a blog post (requires JWT)
  - **Request Body:** `{ "blogId": "<blog_id>", "description": "<comment_description>" }`
- `PUT /comments/:commentId` - Edit an existing comment (requires JWT)
  - **Params:** `commentId`
  - **Request Body:** `{ "description": "<updated_description>" }`
- `DELETE /comments/:commentId` - Delete a comment (requires JWT)
  - **Params:** `commentId`

---

## Docker Setup

The project can be containerized using Docker. To set up the application with Docker and Docker Compose:

1. **Build Docker Images:**

   From the root directory of the project, run the following command:

   ```bash
   docker-compose build
   ```

2. **Start the Containers:**

   Start the project and PostgreSQL database container:

   ```bash
   docker-compose up
   ```

3. **Stop the Containers:**

   To stop the containers, use:

   ```bash
   docker-compose down
   ```

This will start the API, connect to the PostgreSQL database, and make it accessible for local development.

---

## Deployment to AWS

Follow these steps to deploy your application to AWS EC2 using Docker:

1. **Prepare Your AWS Account:**
   - Create or log in to your AWS account at [AWS Console](https://aws.amazon.com/console/).
   - Create an EC2 instance (we recommend a t2.micro instance for testing).
   - Ensure that your instance has a security group allowing:
     - SSH access on port `22` for connecting to the instance.
     - HTTP access on port `80` to serve the app.

2. **Connect to Your EC2 Instance:**
   Once your EC2 instance is up and running, connect to it using SSH:

   ```bash
   ssh -i "your-key.pem" ec2-user@<Your-EC2-Public-IP>
   ```

   Make sure to replace `your-key.pem` with your key file and `<Your-EC2-Public-IP>` with the public IP address of your EC2 instance.

3. **Install Docker and Docker Compose:**

   On your EC2 instance, install Docker:

   ```bash
   sudo yum update -y
   sudo yum install -y docker
   sudo service docker start
   sudo usermod -a -G docker ec2-user
   ```

   Install Docker Compose:

   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. **Clone Your GitHub Repository:**

   Clone your repository on the EC2 instance:

   ```bash
   git clone https://github.com/ayush08032003/Coding-Block-Assignment.git
   cd Coding-Block-Assignment
   ```

5. **Build and Run the Docker Containers:**

   Inside your project directory, build and start your containers with Docker Compose:

   ```bash
   sudo docker-compose up --build -d
   ```

   This will:
   - Build the Docker images defined in your `Dockerfile`.
   - Start your services (blog, user, comment) in the background.

6. **Verify the Application is Running:**

   Once the containers are running, open a browser and visit your EC2 instance's public IP to see if the application is deployed and working.

   You can access it via:

   ```
   http://<Your-EC2-Public-IP>:3000
   ```

7. **Access Logs for Troubleshooting:**

   If you face any issues, check the Docker container logs to troubleshoot:

   ```bash
   sudo docker logs <container_id>
   ```

8. **Enable Persistence:**

   Ensure that the PostgreSQL database persists your data even after stopping/restarting the containers by using AWS EBS volumes or RDS instead of a containerized PostgreSQL.

---

Feel free to make any further adjustments. This section now outlines the process of getting your application up and running on AWS EC2.

## Error Handling

The application has comprehensive error handling through the `createHttpError` package, providing detailed error messages for common failure scenarios:

- Missing fields in requests (`400 Bad Request`)
- Invalid authentication (`401 Unauthorized`)
- Forbidden actions, such as unauthorized blog updates (`403 Forbidden`)
- Resource not found (`404 Not Found`)
- Internal server errors (`500 Internal Server Error`)

---

## Contributing

Contributions are welcome! If you have ideas or improvements for the project, feel free to submit issues or open a pull request.

### To contribute:

1. Fork the repository.
2. Clone your fork and create a new branch.
3. Implement your changes.
4. Open a pull request to the main repository.

--- 

## Conclusion

This project is a simple yet powerful multi-service blog platform that demonstrates the integration of JWT authentication, user management, and CRUD operations for blog posts. It's designed to be extensible and deployable on the cloud via Docker and AWS.

Feel free to expand upon the project, add new features, or modify it according to your needs.

