# AI Sales Coach - Retell Frontend

This project is a React-based frontend for interacting with a Retell AI voice agent. It uses the latest `retell-client-js-sdk` to handle calls. It features a clickable agent portrait that initiates and ends calls, with a dynamic "breathing" halo effect that indicates when the agent is speaking.

This guide provides a Standard Operating Procedure (SOP) for setting up, customizing, and running this project on a new machine.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (which includes npm)

---

## Step 1: Get the Project Files

Clone this repository or download the source code to your local machine.
repository link: https://github.com/retell-ai/retell-frontend-reactjs

---

## Step 2: Install Dependencies

Navigate to the project's root directory in your terminal and run the following command to install all the necessary packages:

```bash
npm install
```

This will download all dependencies listed in the `package.json` file, such as React, Express, and the Retell SDK.

---

## Step 3: Configure Environment Variables

The project uses a `.env` file to manage API keys and agent IDs securely.

1.  **Create the file:** In the root of the project, create a new file named `.env`.

2.  **Add the variables:** Open the `.env` file and add the following lines:

    ```
    RETELL_API=your_retell_api_key
    REACT_APP_RETELL_AGENTID=your_agent_id
    RETELL_SAMPLE_RATE=48000
    ```

3.  **Get your credentials:**
    *   `your_retell_api_key`: Log in to your [Retell AI Dashboard](https://retellai.com/dashboard), go to the API Keys section, and copy your API key.
    *   `your_agent_id`: In the Retell AI Dashboard, select the agent you want to use and copy its Agent ID.

---

## Step 4: Customize the Agent's Appearance

1.  **Change the Agent Image:**
    *   Navigate to the `public` folder.
    *   Replace the existing `agent-portrait.png` file with your desired image.
    *   **Important:** Your new image file **must be named `agent-portrait.png`** for the application to load it correctly.

2.  **(Optional) Change the Halo Color:**
    *   Open the `src/App.css` file.
    *   Find the `:root` section at the top.
    *   Modify the `--halo-color` variable to your desired color (e.g., `--halo-color: #FF00FF;` for pink).

---

## Step 5: Run the Application

Once everything is configured, you can start the application. Run the following command from the project's root directory:

```bash
npm run dev
```

This command starts both the backend server (on port 8080) and the frontend React development server (on port 3000) concurrently.

Your default web browser should automatically open to `http://localhost:3000`, where you will see your AI Sales Coach, ready for a call.

---

## Project Structure Overview

-   `server.js`: A simple Express server that handles API requests to Retell, keeping your API key secure.
-   `src/App.tsx`: The main React component that manages the application's state, handles user interactions, and communicates with the Retell SDK.
-   `src/App.css`: The stylesheet for the application. All visual customizations, like colors and animations, are handled here.
-   `public/agent-portrait.png`: The image file for the agent.
-   `.env`: The file where you store your secret keys and configuration variables. It is ignored by version control for security.

---

## Troubleshooting

If you encounter issues, check these common problems and solutions:

1.  **Problem: The Agent connects but is silent (doesn't speak).**

    *   **Solution:** This is almost always an issue with the Language Model (LLM) configuration on the Retell AI dashboard. Log in to your [Retell AI Dashboard](https://retellai.com/dashboard), select your agent, and ensure the API key for your chosen LLM (e.g., OpenAI) is correct, active, and has available funds/credits. An invalid or unfunded LLM key is the most common cause of a silent agent.

2.  **Problem: The call starts, but you hear no audio at all.**

    *   **Solution:** Modern browsers have strict autoplay policies that can block audio. This project solves this by explicitly starting audio playback when the `call_ready` event is fired by the SDK. If you modify the code, ensure the `webClient.startAudioPlayback()` call remains within the `webClient.on("call_ready", ...)` event listener in `src/App.tsx`.

3.  **Problem: The application shows an error or fails to connect to the backend.**

    *   **Solution:** Ensure the backend server is running correctly. The `npm run dev` command should start both the frontend and backend. Check your terminal for any error messages from the server, which runs on `http://localhost:8080`. Also, confirm your `.env` file is correctly named and configured with the right API key and agent ID.

---

## Embedding the Agent in a Website

To use this agent on a live website, you must first deploy it to a public hosting service. Once deployed, you can embed it using an `<iframe>`.

### Step 1: Deploy the Application

1.  **Choose a Hosting Provider:** Services like [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/) are highly recommended for React applications.
2.  **Deploy Your Project:** Follow the provider's instructions to link your GitHub repository and deploy the project.
3.  **Configure Environment Variables:** During the deployment setup, the provider will ask for your environment variables. Copy the contents of your local `.env` file into the provider's dashboard.
4.  **Get Your Public URL:** After a successful deployment, you will receive a public URL (e.g., `https://your-agent.vercel.app`).

### Step 2: Embed the Iframe

Once you have your public URL, you can embed the agent on any other website by adding the following HTML code. Replace `YOUR_DEPLOYED_APP_URL` with the URL you received in the previous step.

```html
<div id="Agent Name"></div>
<style>
  iframe {
    border: none;
    width: 100%;
    height: 400px; /* Adjust height as needed */
    border-radius: 100px; /* Creates the rounded corners */
  }
</style>
<iframe src="YOUR_DEPLOYED_APP_URL" allow="microphone" title="AI Sales Coach"></iframe>
```
