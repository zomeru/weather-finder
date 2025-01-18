## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
  - [On a Simulator](#on-a-simulator)
  - [On a Physical Device](#on-a-physical-device)
- [Setting Up Your Environment](#setting-up-your-environment)
-

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **Expo CLI**: Install Expo CLI globally by running:

  ```
  npm install -g expo-cli
  ```

- **Git**: Ensure you have Git installed to clone the repository.

## Installation

1. **Clone the Repository**:
   ```
   git clone https://github.com/zomeru/weather-finder.git
   cd weather-finder
   ```
2. **Install Dependencies**:
   Run the following command to install all necessary dependencies:
   ```
   npm install
   ```

## Running the App

### On a Simulator

1. **Start the Expo Development Server**:
   In your project directory, run:

   ```
   npm run start
   ```

   This will display a terminal UI with options for running your app.

2. **Open in Simulator**:
   Use the following keyboard shortcuts to select your platform:
   - Press **I** to open the project in an iOS Simulator (requires macOS).
   - Press **Shift + I** to select an iOS Simulator (requires macOS)
   - Press **A** to open the project on a connected Android device.
   - Press **Shift + A** to select an Android device or emulator to open.
   - Press **W** to open the project in a web browser (if configured).

### On a Physical Device

1. **Install the Expo Go App**:
   Download and install the Expo Go app from the App Store (iOS) or Google Play Store (Android).

2. **Start the Expo Development Server**:
   In your project directory, run:
   `   npm run start`
3. **Scan the QR Code**:
   Open the Expo Go app on your device and scan the QR code displayed in your terminal.

## Setting Up Your Environment

For detailed instructions on setting up your development environment for running your project on Android and iOS, please refer to the official Expo documentation: [Set Up Your Environment](https://docs.expo.dev/get-started/set-up-your-environment/).
