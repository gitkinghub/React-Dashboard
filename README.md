# Responsive Dashboard Project

This project is a responsive dashboard built with React for the frontend and JSON Server for creating fake users and products data.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (version 14.0 or later)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:
 -git clone https://github.com/gitkinghub/React-Dashboard.git
cd responsive-dashboard

2. Install the project dependencies:
-npm install

3. Install JSON Server globally:
 -npm install -g json-server

## Running the Project

1. Start the JSON Server:
 -json-server --watch db.json --port 5000
 -This will start the server on `http://localhost:5000`

2. In a new terminal window, start the React development server:
 -npm start

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in development mode
- `npm run build`: Builds the app for production

## Features

- Responsive dashboard layout
- Fetches and displays user data from JSON Server
- Table with sorting and filtering capabilities
- Search functionality for users
- Responsive design for various screen sizes

## Technologies Used

- React
- JSON Server
- HTML5
- CSS3
- JavaScript (ES6+)

## Troubleshooting

If you encounter any issues:

1. Ensure all dependencies are installed correctly
2. Check that JSON Server is running on port 5000
3. Verify that the React app is running on port 3000
4. Clear your browser cache and restart the development server

## Contributing

Feel free to submit pull requests or open issues to improve the project.

## License

This project is open source and available under the [MIT License](LICENSE).