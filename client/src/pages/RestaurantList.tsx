import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useP2P } from '../context/P2PContext';
import axios from 'axios';
import P2PConnectionManager from '../components/P2PConnectionManager';

interface Restaurant {
  _id: string;
  name: string;
  cuisine: string;
  address: string;
  rating: number;
  isOpen: boolean;
}

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { sendData } = useP2P();

  useEffect(() => {
    const fetchNearbyRestaurants = async () => {
      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/restaurants/nearby`,
                {
                  params: {
                    latitude,
                    longitude,
                    maxDistance: 5000, // 5km radius
                  },
                }
              );
              setRestaurants(response.data);
              setLoading(false);

              // Share restaurant data with peers
              sendData({
                type: 'restaurant-update',
                data: {
                  restaurants: response.data,
                  location: { latitude, longitude },
                },
              });
            },
            (error) => {
              setError('Error getting location: ' + error.message);
              setLoading(false);
            }
          );
        } else {
          setError('Geolocation is not supported by your browser');
          setLoading(false);
        }
      } catch (error) {
        setError('Error fetching restaurants');
        setLoading(false);
      }
    };

    fetchNearbyRestaurants();
  }, [sendData]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Nearby Restaurants
        </Typography>
        <P2PConnectionManager />
      </Box>

      <Grid container spacing={3}>
        {restaurants.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{restaurant.name}</Typography>
                <Typography color="textSecondary">{restaurant.cuisine}</Typography>
                <Typography variant="body2">{restaurant.address}</Typography>
                <Typography variant="body2">
                  Rating: {restaurant.rating.toFixed(1)}/5
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                  sx={{ mt: 2 }}
                >
                  View Menu
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RestaurantList; 