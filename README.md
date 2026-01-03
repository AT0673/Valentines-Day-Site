# Valentine's Day Website for Judy Jiao 💕

A beautiful, interactive Valentine's Day website built with React, TypeScript, and Framer Motion. Features romantic animations, a love counter, photo gallery, timeline, interactive quiz, and more.

## ✨ Features

### Main Pages
- **Landing Page** - Animated heart bloom entrance with auto-advance
- **Home** - 3D rotating heart, live relationship counter, photo gallery, reasons grid
- **Countdown** - Live countdown to one-year anniversary (Dec 4, 2026)
- **Timeline** - Vertical timeline of relationship milestones with lily decorations
- **Letter** - Romantic love letter on vintage paper aesthetic
- **Dreams** - Interactive bubble cards showcasing shared future dreams
- **Quiz** - Fun relationship quiz with animated transitions
- **Wishes** - Cosmic wishes page with interactive shooting stars
- **Admin Panel** - Protected admin area with Firebase authentication

### Interactive Effects
- **Custom Cursor** (Desktop) - Heart trails and animated cursor ring
- **Touch Effects** (Mobile) - Ripple effects on tap, particle trails on swipe
- **Page Transitions** - Smooth transitions with heart and particle animations
- **Glass Morphism** - Throughout the UI for a modern, dreamy aesthetic
- **Responsive Design** - Optimized for both desktop and mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase account (for authentication and storage)

### Installation

1. **Navigate to the app directory**
   ```bash
   cd valentines-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**

   a. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

   b. Enable Authentication (Email/Password provider)

   c. Create a Firestore Database

   d. Create a Storage bucket

   e. Copy `.env.example` to `.env` and fill in your Firebase credentials:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Firebase config values:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_ADMIN_EMAIL=your_admin_email@example.com
   ```

4. **Set up Firebase Authentication**

   In the Firebase Console, go to Authentication > Users > Add User and create an admin account with the email you specified in `VITE_ADMIN_EMAIL`.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
valentines-app/
├── src/
│   ├── components/
│   │   ├── Effects/
│   │   │   ├── CustomCursor.tsx       # Desktop cursor with heart trails
│   │   │   └── MobileTouchEffects.tsx # Mobile touch ripples
│   │   ├── Gallery/
│   │   │   └── PhotoGallery.tsx       # Organic masonry photo gallery
│   │   ├── Hearts/
│   │   │   └── RotatingHeart.tsx      # 3D rotating heart component
│   │   ├── Navigation/
│   │   │   └── BottomNav.tsx          # Glass morphism floating nav
│   │   ├── shared/
│   │   │   ├── LoveCounter.tsx        # Real-time relationship counter
│   │   │   └── ReasonsGrid.tsx        # Grid of love reasons
│   │   └── Transitions/
│   │       └── PageTransition.tsx     # Page transition with particles
│   ├── config/
│   │   └── firebase.ts                # Firebase configuration
│   ├── hooks/
│   │   ├── useCountdown.ts            # Countdown hook
│   │   └── useLoveCounter.ts          # Love counter hook
│   ├── pages/
│   │   ├── Admin.tsx                  # Admin panel
│   │   ├── Countdown.tsx              # Anniversary countdown
│   │   ├── Dreams.tsx                 # Dreams page
│   │   ├── Home.tsx                   # Home page
│   │   ├── Landing.tsx                # Landing page
│   │   ├── Letter.tsx                 # Love letter
│   │   ├── Quiz.tsx                   # Relationship quiz
│   │   ├── Timeline.tsx               # Relationship timeline
│   │   └── Wishes.tsx                 # Wishes page
│   ├── styles/
│   │   ├── global.css                 # Global styles
│   │   └── theme.ts                   # Theme configuration
│   ├── types/
│   │   └── firestore.ts               # TypeScript types
│   ├── App.tsx                        # Main app component
│   └── main.tsx                       # App entry point
├── .env.example                       # Environment variables template
└── package.json
```

## 🎨 Customization

### Changing Dates
- **Relationship Start Date**: Edit `RELATIONSHIP_START_DATE` in `src/pages/Home.tsx`
- **Anniversary Date**: Edit `DEFAULT_TARGET_DATE` in `src/pages/Countdown.tsx`

### Updating Content
- **Love Letter**: Edit the paragraphs in `src/pages/Letter.tsx`
- **Timeline Events**: Modify the `timelineEvents` array in `src/pages/Timeline.tsx`
- **Dreams**: Update the `dreams` array in `src/pages/Dreams.tsx`
- **Quiz Questions**: Edit the `quizQuestions` array in `src/pages/Quiz.tsx`
- **Wishes**: Customize the `wishes` array in `src/pages/Wishes.tsx`

### Changing Colors
Edit the theme in `src/styles/theme.ts`:
- `colors.primary` - Main pink color (#FF6B9D)
- `colors.secondary` - Lavender accent (#C8B6E2)
- `colors.gradients` - Background gradients

### Adding Photos
Update the `photos` array in `src/components/Gallery/PhotoGallery.tsx` with your own photo URLs.

## 🔐 Admin Panel

Access the admin panel at `/admin` route.

**Features:**
- Firebase authentication
- Setup guide
- Quick links to customize content
- Can be extended with photo upload, content editors, etc.

## 📱 Mobile Optimization

The website is fully responsive with special mobile features:
- Touch ripple effects
- Swipe particle trails
- Optimized layouts for mobile screens
- Auto-hiding navigation

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Emotion** - Styled components
- **React Router** - Navigation
- **Firebase** - Authentication, Database, Storage

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the Vite configuration

3. **Configure Environment Variables**
   - In Vercel Dashboard, go to: Project Settings > Environment Variables
   - Add each Firebase environment variable:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
   - Make sure to check "Production", "Preview", and "Development" for each variable

4. **Deploy**
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`

**Note**: The `vercel.json` file is already configured for proper SPA routing.

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 💡 Future Enhancements

Potential features to add:
- Photo upload interface in admin panel
- Rich text editor for love letter
- Timeline event manager (CRUD operations)
- Quiz question editor
- Analytics dashboard
- Music player integration
- More Easter eggs and animations
- Multi-language support

## ❤️ Credits

Created with love for Judy Jiao.

Design Aesthetic: Soft romantic dreamscape with blush gradients, elegant typography, and glass morphism.

Fonts:
- Display: Playfair Display
- Body: Raleway
- Script: Dancing Script

## 📄 License

This is a personal project created for Valentine's Day. Feel free to use it as inspiration for your own romantic website!

---

Made with 💕 by Claude Code
