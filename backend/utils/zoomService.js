const axios = require('axios');

class ZoomService {
  constructor() {
    this.clientId = process.env.ZOOM_CLIENT_ID;
    this.clientSecret = process.env.ZOOM_CLIENT_SECRET;
    this.redirectUri = process.env.ZOOM_REDIRECT_URI;
    this.accountId = process.env.ZOOM_ACCOUNT_ID;
  }

  // Get OAuth token
  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(
        `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${this.accountId}`,
        {},
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Zoom token error:', error.response?.data || error.message);
      throw new Error('Failed to get Zoom access token');
    }
  }

  // Create Zoom meeting
  async createMeeting(appointmentData) {
    try {
      const accessToken = await this.getAccessToken();
      
      const meetingConfig = {
        topic: `Appointment: ${appointmentData.serviceName}`,
        type: 2, // Scheduled meeting
        start_time: appointmentData.startTime,
        duration: appointmentData.duration, // in minutes
        timezone: appointmentData.timezone || 'UTC',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          waiting_room: true,
          audio: 'both',
          auto_recording: 'none'
        }
      };

      const response = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        meetingConfig,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        id: response.data.id,
        join_url: response.data.join_url,
        start_url: response.data.start_url,
        password: response.data.password,
        meeting_id: response.data.id
      };
    } catch (error) {
      console.error('Zoom meeting creation error:', error.response?.data || error.message);
      throw new Error('Failed to create Zoom meeting');
    }
  }

  // Get meeting details
  async getMeeting(meetingId) {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await axios.get(
        `https://api.zoom.us/v2/meetings/${meetingId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Zoom get meeting error:', error.response?.data || error.message);
      throw new Error('Failed to get Zoom meeting');
    }
  }

  // Update Zoom meeting
  async updateMeeting(meetingId, updates) {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await axios.patch(
        `https://api.zoom.us/v2/meetings/${meetingId}`,
        updates,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Zoom update meeting error:', error.response?.data || error.message);
      throw new Error('Failed to update Zoom meeting');
    }
  }

  // Delete Zoom meeting
  async deleteMeeting(meetingId) {
    try {
      const accessToken = await this.getAccessToken();
      
      await axios.delete(
        `https://api.zoom.us/v2/meetings/${meetingId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return { success: true };
    } catch (error) {
      console.error('Zoom delete meeting error:', error.response?.data || error.message);
      throw new Error('Failed to delete Zoom meeting');
    }
  }
}

module.exports = new ZoomService();
