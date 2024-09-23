import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Switch, 
  FormControlLabel 
} from '@mui/material';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleNotificationChange = (event) => {
    setNotificationsEnabled(event.target.checked);
    // Here you would typically update the notification settings
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <FormControlLabel
        control={
          <Switch
            checked={notificationsEnabled}
            onChange={handleNotificationChange}
            color="primary"
          />
        }
        label="Enable Notifications"
      />
    </Container>
  );
};

export default Settings;