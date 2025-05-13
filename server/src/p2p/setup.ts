import { Server } from 'socket.io';
import SimplePeer from 'simple-peer';

interface PeerConnection {
  peer: SimplePeer.Instance;
  socketId: string;
}

const peers: Map<string, PeerConnection> = new Map();

export const setupP2P = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('New peer connected:', socket.id);

    // Handle peer connection requests
    socket.on('join-p2p', (targetId: string) => {
      const peer = new SimplePeer({
        initiator: true,
        trickle: false
      });

      peers.set(socket.id, { peer, socketId: targetId });

      peer.on('signal', (data) => {
        socket.emit('peer-signal', { signal: data, targetId });
      });

      peer.on('data', (data) => {
        // Handle incoming P2P data
        try {
          const message = JSON.parse(data.toString());
          console.log('Received P2P data:', message);
          // Broadcast to other peers if needed
          socket.broadcast.emit('p2p-data', message);
        } catch (error) {
          console.error('Error processing P2P data:', error);
        }
      });
    });

    // Handle peer signals
    socket.on('peer-signal', ({ signal, targetId }) => {
      const peerConnection = peers.get(targetId);
      if (peerConnection) {
        peerConnection.peer.signal(signal);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const peerConnection = peers.get(socket.id);
      if (peerConnection) {
        peerConnection.peer.destroy();
        peers.delete(socket.id);
      }
    });
  });
}; 