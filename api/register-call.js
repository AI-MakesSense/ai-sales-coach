const { Retell } = require('retell-sdk');

// This function is the serverless function handler for Vercel.
module.exports = async (req, res) => {
  // Ensure this is a POST request.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Initialize Retell client with the API key from environment variables.
    const retellClient = new Retell({
      apiKey: process.env.RETELL_API,
    });

    // Register a new call. The agent ID is also from environment variables.
    const registerCallResponse = await retellClient.call.createWebCall({
      agent_id: process.env.REACT_APP_RETELL_AGENTID,
      audio_encoding: 's16le',
      audio_websocket_protocol: 'web',
      sample_rate: parseInt(process.env.RETELL_SAMPLE_RATE || '48000'),
    });

    // Send the successful response back to the frontend.
    res.status(200).json(registerCallResponse);

  } catch (error) {
    console.error('Error registering call:', error);
    res.status(500).json({ error: 'Failed to register call.' });
  }
};
