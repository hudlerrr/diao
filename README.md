# DIAO

## Overview

DIAO (pronounced like “ciao”) is an AI-powered DAO assistant that enables intuitive interaction with your DAO while displaying data visually instead of just text.

## Features

1. ENS Domain Integration
- Lookup ENS domains and render them as visually appealing profile cards.

2. Subgraph Query Generation
- Automatically generate queries based on the subgraph schema (currently supports only Nouns DAO).

3. Proposal Listing
- Fetch and display a clickable list of DAO proposals for easy exploration.

4. Detailed Proposal View
- Retrieve a specific proposal by ID, displaying it as:
  - A card-style summary UI.
  - A full document-style detailed view.

Additionally, DIAO integrates general LLM capabilities, enabling conversational interaction and deeper discussions about the displayed DAO data.

## Installation

To set up the project locally, follow these steps:
1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Set Up Environment Variables**:
   - Copy the `.env.example` file to `.env` and fill in the necessary environment variables.
   - Alternatively, use Vercel Environment Variables for better security.

3. **Link with Vercel**:
   ```bash
   vercel link
   vercel env pull
   ```

4. **Run the Development Server**:
   ```bash
   pnpm dev
   ```

   Your app should now be running on [localhost:3000](http://localhost:3000).