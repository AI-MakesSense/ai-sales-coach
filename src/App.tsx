import React, { useEffect, useState, useRef } from "react";
import "./App.css";
// RetellWebClient is the main class to interact with Retell's web client.
import { RetellWebClient } from "retell-client-js-sdk";

// Retrieve agentId from environment variables.
const agentId = process.env.REACT_APP_RETELL_AGENTID;

// Define the expected response structure from our backend's /register-call endpoint.
// It should contain the access token required by the RetellWebClient to start a call.
interface RegisterCallResponse {
  accessToken?: string;
  sampleRate: number;
}

// Instantiate the RetellWebClient.
const webClient = new RetellWebClient();

// Refresh trigger
const App = () => {
  // State to manage the call status.
  const [callStatus, setCallStatus] = useState<'not-started' | 'active' | 'inactive'>('not-started');
  // State to track if the agent is currently speaking.
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Setup event listeners for the RetellWebClient.
  useEffect(() => {
    // When a call is successfully started.
    webClient.on("call_started", () => {
      console.log("Call started");
      setCallStatus('active');
    });

    // When the agent's audio track is ready for playback.
    webClient.on("call_ready", async () => {
      console.log("Call is ready, attempting to start audio playback.");
      try {
        await webClient.startAudioPlayback();
        console.log("Audio playback started successfully.");
      } catch (err) {
        console.error("Error starting audio playback:", err);
      }
    });

    // When a call ends, for any reason.
    webClient.on("call_ended", () => {
      console.log("Call ended");
      setCallStatus('inactive');
      setIsAgentSpeaking(false);
    });

    // When an error occurs.
    webClient.on("error", (error) => {
      console.error("An error occurred:", error);
      setCallStatus('inactive');
      setIsAgentSpeaking(false);
    });

    // When the agent starts speaking.
    webClient.on("agent_start_talking", () => {
      console.log("Agent started talking");
      setIsAgentSpeaking(true);
    });
    
    // When the agent stops speaking.
    webClient.on("agent_stop_talking", () => {
      console.log("Agent stopped talking");
      setIsAgentSpeaking(false);
    });

  }, []);

  // Function to toggle the call on/off.
  const toggleConversation = async () => {
    // Ensure agentId is available before proceeding.
    if (!agentId) {
      alert("Agent ID is not set. Please check your .env file.");
      return;
    }

    if (callStatus === 'active') {
      // If a call is active, stop it.
      webClient.stopCall();
    } else {
      try {
        // Register the call with our backend to get an access token.
        const registerCallResponse = await registerCall(agentId);
        if (registerCallResponse.accessToken) {
          // Use the access token to start the call.
          await webClient.startCall({
            accessToken: registerCallResponse.accessToken,
            sampleRate: registerCallResponse.sampleRate,
          });
          console.log("Starting call...");
        } else {
          console.error("Failed to get access token.");
          setCallStatus('inactive');
        }
      } catch (err) {
        console.error("Error during call registration or start:", err);
        setCallStatus('inactive');
      }
    }
  };
  
  // Function to make a POST request to our backend's /register-call endpoint.
  async function registerCall(agentId: string): Promise<RegisterCallResponse> {
    try {
      const response = await fetch("/api/register-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agentId }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Error: ${response.status} ${errorBody}`);
      }

      const data: RegisterCallResponse = await response.json();
      return data;
    } catch (err) {
      console.error("Error registering call:", err);
      throw err;
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div 
          ref={containerRef} 
          className={`portrait-container 
            ${callStatus === 'active' ? 'active' : ''} 
            ${callStatus === 'inactive' ? 'inactive' : ''} 
            ${isAgentSpeaking ? 'agent-speaking' : ''}`}
          onClick={toggleConversation}
        >
          <img 
            src={`${process.env.PUBLIC_URL}/agent-portrait.png`}
            alt="Agent Portrait" 
            className="agent-portrait"
          />
        </div>
      </header>
    </div>
  );
};

export default App;
