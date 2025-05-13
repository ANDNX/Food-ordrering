import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Paper,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useP2P } from '../context/P2PContext';

const P2PConnectionManager: React.FC = () => {
  const { connectedPeers, connectToPeer, p2pService } = useP2P();
  const [newPeerId, setNewPeerId] = useState('');

  const handleConnect = async () => {
    if (newPeerId.trim()) {
      try {
        await connectToPeer(newPeerId.trim());
        setNewPeerId('');
      } catch (error) {
        console.error('Failed to connect to peer:', error);
      }
    }
  };

  const handleDisconnect = (peerId: string) => {
    p2pService.disconnectPeer(peerId);
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        P2P Connections
      </Typography>
      
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          size="small"
          label="Peer ID"
          value={newPeerId}
          onChange={(e) => setNewPeerId(e.target.value)}
          sx={{ mr: 1, flexGrow: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleConnect}
          disabled={!newPeerId.trim()}
        >
          Connect
        </Button>
      </Box>

      <List>
        {connectedPeers.map((peerId) => (
          <ListItem key={peerId}>
            <ListItemText
              primary={peerId}
              secondary={`Status: ${p2pService.isConnected(peerId) ? 'Connected' : 'Disconnected'}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="disconnect"
                onClick={() => handleDisconnect(peerId)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        {connectedPeers.length === 0 && (
          <ListItem>
            <ListItemText primary="No connected peers" />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

export default P2PConnectionManager; 