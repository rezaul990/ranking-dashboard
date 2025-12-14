# Walton Plaza - Branch Performance Dashboard

A modern, real-time dashboard for tracking branch performance metrics across all Walton Plaza locations.

## Features

- 📊 **All Branches View** - Comprehensive table with all branch metrics
- 🏢 **Branch View** - Detailed individual branch analysis
- 📈 **Real-time Data** - Fetches live data from Google Sheets
- 📸 **Screenshot Capability** - Easy sharing for WhatsApp/reports
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 📱 **Responsive** - Works on all devices

## Tech Stack

- React 18
- Vite
- CSS3 with Gradients & Animations
- Google Sheets API (CSV export)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Vercel will auto-detect Vite and deploy
4. Done! Your dashboard is live

Or use Vercel CLI:

```bash
npm install -g vercel
vercel
```

## Data Source

The dashboard fetches data from a published Google Sheets CSV. To update the data source:

1. Edit `src/pages/Dashboard.jsx` and `src/pages/BranchView.jsx`
2. Update the `CSV_URL` constant with your Google Sheets publish URL

## Project Structure

```
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── public/             # Static assets
└── index.html          # HTML template
```

## License

Private - Walton Plaza Internal Use

## Support

For issues or questions, contact your development team.
