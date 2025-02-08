# Next.js AI Chatbot

## Overview

This project is an open-source AI chatbot template built with Next.js and the AI SDK by Vercel. It is designed to be a starting point for building AI-powered applications, offering a customizable and extendable framework. The chatbot leverages advanced AI models to provide intelligent responses and can be deployed easily on Vercel.

## Features

- **Next.js App Router**: Advanced routing for seamless navigation and performance, including React Server Components (RSCs) and Server Actions for server-side rendering.
- **AI SDK Integration**: Unified API for generating text, structured objects, and tool calls with LLMs. Supports multiple model providers like OpenAI, Anthropic, and Cohere.
- **UI Components**: Styled with Tailwind CSS and component primitives from Radix UI for accessibility and flexibility.
- **Data Persistence**: Utilizes Vercel Postgres for saving chat history and user data, and Vercel Blob for efficient file storage.
- **Authentication**: Simple and secure authentication using NextAuth.js.
- **Customizable Blocks**: Includes text, code, image, and sheet blocks for diverse content interaction.
- **Weather and File Upload Tools**: Integrated tools for fetching weather data and uploading files.

## Installation

To set up the project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<username>/<repository>
   cd <repository>
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Set Up Environment Variables**:
   - Copy the `.env.example` file to `.env` and fill in the necessary environment variables.
   - Alternatively, use Vercel Environment Variables for better security.

4. **Link with Vercel**:
   ```bash
   vercel link
   vercel env pull
   ```

5. **Run the Development Server**:
   ```bash
   pnpm dev
   ```

   Your app should now be running on [localhost:3000](http://localhost:3000).