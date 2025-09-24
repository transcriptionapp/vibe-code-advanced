# 🚴‍♀️ Bike Gear Website

A beautiful, responsive website showcasing premium bike helmets and cycling glasses with advanced analytics tracking and comprehensive testing.

## 🌟 Features

- **Responsive Design** - Mobile-first approach with seamless desktop experience
- **Dual Product Pages** - Dedicated sections for bike helmets and cycling glasses
- **Analytics Tracking** - Real-time user interaction monitoring with localStorage persistence
- **Cross-Browser Compatible** - Tested on Chrome, Firefox, Safari, and mobile browsers
- **SEO Optimized** - Meta tags, Open Graph, structured data, and semantic HTML
- **Accessibility Compliant** - ARIA labels, keyboard navigation, screen reader support

## 🎭 Technologies

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Testing**: Playwright for end-to-end testing
- **Analytics**: Custom JavaScript analytics system
- **Database**: Supabase (PostgreSQL) for server-side analytics
- **Deployment**: Static hosting ready

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/transcriptionapp/vibe-code-advanced.git
   cd vibe-code-advanced
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start local development server**
   ```bash
   python3 -m http.server 8000
   # or
   npx serve .
   ```

4. **View the website**
   - Homepage: http://localhost:8000
   - Glasses page: http://localhost:8000/glasses.html

## 🧪 Testing

### Run All Tests
```bash
npm test                # Run all Playwright tests
npm run test:headed     # Run with browser visible
npm run test:ui         # Interactive test runner
npm run test:debug      # Debug mode with breakpoints
```

### Test Suites
- **Homepage Tests** - Page structure, navigation, SEO
- **Glasses Page Tests** - Product display, navigation, responsive design
- **User Journey Tests** - End-to-end user flows
- **Analytics Tests** - Click tracking and data persistence
- **Accessibility Tests** - ARIA compliance and keyboard navigation
- **Performance Tests** - Load times and responsiveness

## 📊 Analytics System

The website includes a comprehensive analytics system that tracks:

- **Button Clicks** - All interactive elements with detailed metadata
- **Page Views** - Visit duration and navigation patterns
- **User Sessions** - Cross-page tracking with persistence
- **Real-time Display** - Visual feedback for tracked interactions

### Analytics Database Schema

```sql
-- User sessions tracking
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY,
    session_id TEXT UNIQUE,
    user_agent TEXT,
    created_at TIMESTAMP
);

-- Button click tracking
CREATE TABLE button_clicks (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES user_sessions(id),
    button_id TEXT,
    page_url TEXT,
    created_at TIMESTAMP
);
```

## 🎨 Design Features

### Bike Helmets Page
- **Purple gradient background** with modern card design
- **6 helmet categories** including racing, urban, mountain, and youth options
- **Feature lists** highlighting safety technologies like MIPS and LED lighting

### Bike Glasses Page
- **Pink/coral gradient theme** for visual distinction
- **Protection benefits section** highlighting UV, wind, and impact resistance
- **Detailed product specs** including VLT ratings and lens technologies
- **Price display** with clear value propositions

## 🔧 Development

### Project Structure
```
├── index.html          # Bike helmets homepage
├── glasses.html        # Cycling glasses page
├── tests/              # Playwright test suites
├── playwright.config.ts # Test configuration
└── package.json        # Dependencies and scripts
```

### Key Components
- **BikeGearAnalytics class** - Handles all user interaction tracking
- **Responsive CSS Grid** - Mobile-first responsive layouts
- **Progressive Enhancement** - Works without JavaScript
- **SEO Meta Tags** - Complete social media and search optimization

## 🚀 Deployment

### Static Hosting (Recommended)
- **GitHub Pages** - Automatic deployment from main branch
- **Netlify** - Drag and drop deployment
- **Vercel** - Connect GitHub repository for auto-deploy

### Environment Setup
1. Set up Supabase project for analytics database
2. Configure environment variables (keep .mcp.json out of version control)
3. Enable GitHub Pages in repository settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Testing Best Practices

- **Run tests before commits** - Ensure all functionality works
- **Test across browsers** - Use Playwright's multi-browser support
- **Validate accessibility** - Keyboard navigation and screen readers
- **Check mobile experience** - Touch interactions and responsive design
- **Monitor performance** - Load times and user experience metrics

## 🔒 Security

- **No hardcoded secrets** - All sensitive data in environment variables
- **XSS protection** - Proper data sanitization
- **HTTPS ready** - Secure connection configuration
- **Privacy compliant** - Analytics data handled responsibly

## 📈 Performance

- **Optimized images** - CSS-based graphics for fast loading
- **Minimal dependencies** - Vanilla JavaScript for performance
- **Efficient animations** - CSS transforms with GPU acceleration
- **Responsive loading** - Progressive enhancement approach

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Playwright** - Excellent testing framework
- **Supabase** - Powerful backend-as-a-service
- **Modern CSS** - Flexbox and Grid layout systems

---

**Built with ❤️ for the cycling community** 🚴‍♀️🚴‍♂️