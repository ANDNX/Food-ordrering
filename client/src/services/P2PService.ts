import SimplePeer from 'simple-peer';
import { Socket } from 'socket.io-client';

export interface PeerData {
  type: 'restaurant-update' | 'order-update' | 'user-location';
  data: any;
  timestamp: number;
}

export class P2PService {
  private peers: Map<string, SimplePeer.Instance> = new Map();
  private socket: Socket;
  private onDataCallback: ((data: PeerData) => void) | null = null;

  constructor(socket: Socket) {
    this.socket = socket;
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('peer-signal', ({ signal, targetId }) => {
      const peer = this.peers.get(targetId);
      if (peer) {
        peer.signal(signal);
      }
    });

    this.socket.on('peer-disconnected', (peerId: string) => {
      this.disconnectPeer(peerId);
    });
  }

  public connectToPeer(targetId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const peer = new SimplePeer({
          initiator: true,
          trickle: false,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });

        peer.on('signal', (data) => {
          this.socket.emit('peer-signal', { signal: data, targetId });
        });

        peer.on('connect', () => {
          console.log(`Connected to peer: ${targetId}`);
          this.peers.set(targetId, peer);
          resolve();
        });

        peer.on('data', (data) => {
          try {
            const message = JSON.parse(data.toString()) as PeerData;
            if (this.onDataCallback) {
              this.onDataCallback(message);
            }
          } catch (error) {
            console.error('Error processing P2P data:', error);
          }
        });

        peer.on('error', (err) => {
          console.error('Peer connection error:', err);
          this.disconnectPeer(targetId);
          reject(err);
        });

        this.socket.emit('join-p2p', targetId);
      } catch (error) {
        reject(error);
      }
    });
  }

  public disconnectPeer(peerId: string) {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.destroy();
      this.peers.delete(peerId);
      console.log(`Disconnected from peer: ${peerId}`);
    }
  }

  public sendData(data: Omit<PeerData, 'timestamp'>) {
    const message: PeerData = {
      ...data,
      timestamp: Date.now()
    };

    this.peers.forEach((peer) => {
      if (peer.connected) {
        peer.send(JSON.stringify(message));
      }
    });
  }

  public setOnDataCallback(callback: (data: PeerData) => void) {
    this.onDataCallback = callback;
  }

  public getConnectedPeers(): string[] {
    return Array.from(this.peers.keys());
  }

  public isConnected(peerId: string): boolean {
    const peer = this.peers.get(peerId);
    return peer?.connected || false;
  }
} 