# HR Event Toolkit Pro

協助 HR 生產力工具專案。

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Deployment

This project is configured to deploy automatically to **GitHub Pages** using GitHub Actions.

### Setup

1. Go to your repository **Settings**.
2. Navigate to **Pages** (under the "Code and automation" section).
3. Under **Build and deployment**, select **GitHub Actions** as the Source.
4. The workflow defined in `.github/workflows/deploy.yml` will automatically build and deploy your site on every push to the `main` branch.

### Manual Deployment (Optional)

You can also build the project locally and deploy the `dist` folder manually if needed.
