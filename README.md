# Humanity Verse Aid Foundation

## Project Overview

This is the official website for the Humanity Verse Aid Foundation, a non-profit organization dedicated to helping communities in need. The website includes features for donations, contact forms, newsletter subscriptions, and more.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [External Service Setup](#external-service-setup)
  - [Firebase Setup](#firebase-setup)
  - [Flutterwave Setup](#flutterwave-setup)
  - [EmailJS Setup](#emailjs-setup)
  - [Mailchimp Setup](#mailchimp-setup)
  - [Google Analytics Setup](#google-analytics-setup)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/your-username/humanity-verse-aid-foundation.git
   ```

2. Navigate to the project directory
   ```sh
   cd humanity-verse-aid-foundation
   ```

3. Install dependencies
   ```sh
   npm install
   # or
   yarn install
   ```

### Environment Variables

Create a `.env` file in the root directory based on the `.env.example` file. The following environment variables are required:

```
# Firebase Configuration
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_CLIENT_EMAIL="your_client_email"
FIREBASE_PROJECT_ID="your_project_id"

# Firebase Web App Configuration
REACT_APP_FIREBASE_API_KEY="your_api_key"
REACT_APP_FIREBASE_AUTH_DOMAIN="your_auth_domain"
REACT_APP_FIREBASE_DATABASE_URL="your_database_url"
REACT_APP_FIREBASE_PROJECT_ID="your_project_id"
REACT_APP_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
REACT_APP_FIREBASE_APP_ID="your_app_id"
REACT_APP_FIREBASE_MEASUREMENT_ID="your_measurement_id"

# Flutterwave Configuration
VITE_FLW_PUBLIC_KEY=your_flutterwave_public_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key

# Site Configuration
REACT_APP_SITE_URL=your_site_url

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Google Analytics Configuration
VITE_GA_MEASUREMENT_ID=your_ga_measurement_id
VITE_ENABLE_ANALYTICS=true_or_false

# Mailchimp Configuration
VITE_MAILCHIMP_API_KEY=your_mailchimp_api_key
VITE_MAILCHIMP_LIST_ID=your_mailchimp_list_id
VITE_MAILCHIMP_SERVER_PREFIX=your_mailchimp_server_prefix
```

## External Service Setup

### Firebase Setup

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Google Analytics if desired

2. **Set up Firebase Authentication**:
   - In the Firebase Console, go to "Authentication" > "Sign-in method"
   - Enable the authentication methods you need (Email/Password, Google, etc.)

3. **Create a Firestore Database**:
   - Go to "Firestore Database" > "Create database"
   - Start in production mode or test mode as needed
   - Choose a location close to your users

4. **Generate Service Account Key**:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely
   - Extract the private key, client email, and project ID for your `.env` file

5. **Get Web App Configuration**:
   - Go to Project Settings > Your Apps
   - If no app exists, click "Add app" and select the web platform
   - Register the app with a nickname
   - Copy the Firebase configuration object for your `.env` file

### Flutterwave Setup

1. **Create a Flutterwave Account**:
   - Sign up at [Flutterwave](https://dashboard.flutterwave.com/signup)
   - Verify your account

2. **Get API Keys**:
   - Go to Settings > API
   - Copy your Public Key and Secret Key
   - Add them to your `.env` file

3. **Set up Payment Plans for Recurring Donations** (if using monthly donations):
   - Go to Payment Plans
   - Create plans for each donation amount and currency
   - Note the plan IDs and update them in `src/pages/Donate.tsx` in the `monthlyPlanIds` object

4. **Configure Webhooks** (for production):
   - Go to Settings > Webhooks
   - Add a webhook URL to receive payment notifications
   - Set the secret hash for verification

### EmailJS Setup

1. **Create an EmailJS Account**:
   - Sign up at [EmailJS](https://www.emailjs.com/)

2. **Add an Email Service**:
   - Go to "Email Services" > "Add New Service"
   - Connect your email provider (Gmail, Outlook, etc.)

3. **Create an Email Template**:
   - Go to "Email Templates" > "Create New Template"
   - Design your template with the following variables:
     - `{{name}}` - Sender's name
     - `{{email}}` - Sender's email
     - `{{phone}}` - Sender's phone
     - `{{subject}}` - Message subject
     - `{{organization}}` - Sender's organization
     - `{{lga}}` - Local Government Area
     - `{{state}}` - State
     - `{{country}}` - Country
     - `{{message}}` - Message content
   - **IMPORTANT**: Make sure your template uses the exact variable names listed above
   - **NOTE**: Sample EmailJS templates can be found in the `email js templates.txt` file in the project root directory

4. **Get API Keys**:
   - Go to "Integration" > "API Keys"
   - Copy your Public Key
   - Note your Service ID and Template ID
   - Add these to your `.env` file

### Mailchimp Setup

1. **Create a Mailchimp Account**:
   - Sign up at [Mailchimp](https://mailchimp.com/)

2. **Create an Audience**:
   - Go to "Audience" > "Audience dashboard"
   - Create a new audience or use an existing one

3. **Get API Keys and List ID**:
   - Go to "Account" > "Extras" > "API keys"
   - Create a new API key or use an existing one
   - Find your List ID by going to "Audience" > "Settings" > "Audience name and defaults"
   - Note the server prefix from your Mailchimp API URL (e.g., "us15")
   - Add these to your `.env` file

### Google Analytics Setup

1. **Create a Google Analytics Account**:
   - Go to [Google Analytics](https://analytics.google.com/)
   - Set up a new property

2. **Get Measurement ID**:
   - Go to "Admin" > "Data Streams" > "Web"
   - Create a new stream or select an existing one
   - Copy the Measurement ID (starts with "G-")
   - Add it to your `.env` file

## Running the Project

After setting up all the required environment variables and services, you can run the project locally:

```sh
# Development mode
npm run dev
# or
yarn dev

# Build for production
npm run build
# or
yarn build

# Preview production build
npm run preview
# or
yarn preview
```

## Deployment

This project can be deployed to various hosting platforms:

### Firebase Hosting

1. Install Firebase CLI:
   ```sh
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```sh
   firebase login
   ```

3. Initialize Firebase in your project:
   ```sh
   firebase init
   ```

4. Deploy to Firebase:
   ```sh
   npm run build
   firebase deploy
   ```

### Netlify

1. Install Netlify CLI:
   ```sh
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```sh
   netlify login
   ```

3. Deploy to Netlify:
   ```sh
   npm run build
   netlify deploy --prod
   ```

## Troubleshooting

### Contact Form Issues

If the contact form is not sending all fields to EmailJS:

1. Verify that your EmailJS template includes all the variable placeholders: `{{name}}`, `{{email}}`, `{{phone}}`, `{{subject}}`, `{{organization}}`, `{{lga}}`, `{{state}}`, `{{country}}`, and `{{message}}`

2. Check that all form fields have the correct `name` attribute matching the EmailJS template variables

3. For select elements (like the subject dropdown), ensure there's a hidden input with the correct name attribute:
   ```jsx
   <input type="hidden" name="subject" value={formData.subject} />
   ```

4. Check browser console for any errors during form submission

### Flutterwave Payment Issues

1. Ensure your Flutterwave API keys are correct and for the right environment (test/live)

2. Verify that the payment plans are correctly set up for recurring donations

3. Check that the currency configuration matches your Flutterwave account settings

### Firebase Issues

1. Verify that your Firebase configuration is correct

2. Ensure Firestore rules are properly set up to allow read/write operations

3. Check that authentication methods are enabled if you're using them
