# Food Ordering Website with Geo-indexing and P2P

A modern food ordering website that uses geospatial indexing to find nearby restaurants and implements peer-to-peer data sharing for real-time updates.

## Features

- Geolocation-based restaurant search
- Real-time P2P data sharing between users
- Modern Material-UI interface
- Responsive design
- MongoDB geospatial indexing
- WebRTC peer connections

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd food-ordering-p2p
```

2. Install dependencies:
```bash
npm run install-all
```

3. Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/food-ordering
PORT=5000
CLIENT_URL=http://localhost:3000
```

4. Create a `.env` file in the client directory:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SERVER_URL=http://localhost:5000
```

## Running the Application

1. Start the development servers:
```bash
npm start
```

This will start both the backend server (port 5000) and the frontend development server (port 3000).

## Project Structure

```
food-ordering-p2p/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main App component
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── p2p/           # P2P connection handling
│   │   └── index.ts       # Server entry point
│   └── package.json
└── package.json
```

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Material-UI
  - Socket.IO Client
  - Simple-Peer (WebRTC)

- Backend:
  - Node.js
  - Express
  - TypeScript
  - MongoDB
  - Socket.IO
  - Simple-Peer

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 