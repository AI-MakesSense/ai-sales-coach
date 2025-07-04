# Vercel Deployment & Troubleshooting Guide

This document provides a step-by-step guide for deploying the AI Sales Coach to Vercel and a log of production issues encountered and their resolutions. This serves as a reference for future debugging and deployment efforts.

---

## Part 1: Initial GitHub Setup

Before deploying to Vercel, the project must be correctly set up in a GitHub repository.

1.  **Create a New GitHub Repository**: Create a new, empty, public repository on GitHub. Do not initialize it with a README or .gitignore file.

2.  **Connect Local Project to GitHub**: Use the following commands to link your local project folder to the new GitHub repository and perform the initial push.

    ```bash
    # Replace the URL with your repository's URL
    git remote set-url origin https://github.com/your-username/your-repo-name.git

    # Push the code to the 'main' branch
    git push -u origin main
    ```

3.  **Troubleshooting `node_modules` Upload Issues**:
    *   **Symptom**: `git push` fails with an error about too many files.
    *   **Cause**: The local Git repository was initialized before the `.gitignore` file was configured to ignore `node_modules`. Git is still tracking thousands of files from that folder.
    *   **Resolution**: Clear the Git cache and re-add the files, forcing Git to respect the `.gitignore` file.
        ```bash
        # Un-track all files (without deleting them)
        git rm -r --cached .

        # Re-track all files (respecting .gitignore)
        git add .

        # Commit the fix
        git commit -m "Fix: Stop tracking node_modules"
        ```

---

## Part 2: Vercel Deployment & Production Fixes

This section details the process of deploying to Vercel and the specific errors that were resolved.

### Initial Deployment Steps

1.  **Sign up** for Vercel using your GitHub account.
2.  **Import** the project from your GitHub repository.
3.  **Configure Environment Variables**: In the Vercel project settings, add the following variables:
    *   `RETELL_API`: Your Retell API Key.
    *   `REACT_APP_RETELL_AGENTID`: Your Retell Agent ID.
    *   `RETELL_SAMPLE_RATE`: `48000`
4.  **Deploy** the project.

### Production Issue Log

#### Issue 1: `FUNCTION_INVOCATION_FAILED` (500 Error)
*   **Vercel Log**: `Cannot find module 'retell-sdk'`
*   **Cause**: The backend serverless function (`api/register-call.js`) required the `retell-sdk` package, but it was not listed as a dependency in `package.json`.
*   **Resolution**: Added `"retell-sdk": "^3.3.1"` to the `dependencies` section of `package.json` and redeployed.

#### Issue 2: `TypeError: retellClient.call.register is not a function`
*   **Vercel Log**: Showed the TypeError pointing to a line in `api/register-call.js`.
*   **Cause**: The backend code was using an incorrect method name (`.register()`). The Retell SDK uses `.createWebCall()` for this purpose.
*   **Resolution**: Changed `retellClient.call.register` to `retellClient.call.createWebCall` in `api/register-call.js`.

#### Issue 3: `401 Unauthorized` Error
*   **Browser Console**: All network requests, including for static files like `manifest.json`, failed with a 401 error.
*   **Cause**: Vercel's **Deployment Protection** feature was enabled by default, password-protecting the entire deployment.
*   **Resolution**: Disabled Deployment Protection in the Vercel project's **Settings > Security** tab and redeployed.

#### Issue 4: `Failed to get access token`
*   **Browser Console**: Showed the `Failed to get access token` error.
*   **Vercel Log**: A debug `console.log` revealed the backend was successfully receiving a response from Retell containing `"access_token": "..."`.
*   **Cause**: A mismatch between the backend response and frontend expectation. The backend sent the token as `access_token` (snake_case), but the frontend `retell-client-js-sdk` expected it as `accessToken` (camelCase).
*   **Resolution**: Modified the frontend code in `src/App.tsx` to explicitly map the received `data.access_token` to the `accessToken` property required by the `webClient.startCall()` function.

This systematic approach of checking browser and function logs allowed us to pinpoint and resolve each issue sequentially, leading to a successful deployment.
