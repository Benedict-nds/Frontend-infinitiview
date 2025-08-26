# InfinitiView AI Real Estate Chat Frontend

A modern, responsive React frontend for an AI-powered real estate agent that helps users search properties, get virtual tours, and answer questions about real estate listings.

## ✨ Features

- **AI-Powered Chat Interface** - Intelligent property search and Q&A
- **Real-Time Property Data** - Live integration with Google Sheets database
- **Virtual Tour Integration** - Direct links to property virtual tours
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern UI/UX** - Clean, professional interface with Tailwind CSS
- **Real-Time Updates** - Hot module replacement for development

## 🚀 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API Integration**: Fetch API with Lambda backend

## 📁 Project Structure

```
infinitiview-frontend/
├── public/                 # Static files
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── api/               # API service functions
│   │   └── realEstateApi.js
│   ├── components/        # React components
│   │   ├── RealEstateChat.jsx
│   │   ├── ChatMessage.jsx
│   │   └── PropertyCard.jsx
│   ├── hooks/            # Custom React hooks
│   │   └── useChat.js
│   ├── utils/            # Utility functions
│   │   └── formatters.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/infinitiview-frontend.git
   cd infinitiview-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### API Endpoint
Update the API base URL in `src/api/realEstateApi.js`:
```javascript
const API_BASE_URL = 'https://your-lambda-api-gateway-url.amazonaws.com/prod';
```

### Environment Variables
Create a `.env` file for any environment-specific configuration:
```env
VITE_API_BASE_URL=https://your-api-url.com
```

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect React + Vite configuration
3. Deploy automatically on every push

### Other Platforms
- **Netlify**: Drag & drop the `dist` folder
- **AWS S3 + CloudFront**: Upload built files
- **GitHub Pages**: Use GitHub Actions for deployment

## 🔗 Backend Integration

This frontend connects to:
- **AWS Lambda** - AI processing and business logic
- **Google Sheets** - Live property database
- **OpenAI API** - Intelligent responses (when available)
- **Fallback System** - Reliable responses when AI is unavailable

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme changes
- Update `src/index.css` for global styles
- Component-specific styles in individual component files

### Components
- Add new components in `src/components/`
- Extend API functions in `src/api/`
- Create custom hooks in `src/hooks/`

## 📊 Performance

- **Lazy Loading** - Components load on demand
- **Code Splitting** - Automatic bundle optimization
- **Image Optimization** - Responsive image handling
- **Caching** - Efficient API response caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Create an issue in this repository
- Contact the development team
- Check the backend integration status

---

Built with ❤️ for the real estate industry
