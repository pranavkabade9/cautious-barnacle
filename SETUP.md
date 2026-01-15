# College Scheduling App - Setup Guide

## Step-by-Step Setup Instructions

### Phase 1: Project Setup

#### Step 1.1: Clone/Download the Project
```bash
cd /workspaces/cautious-barnacle
```

#### Step 1.2: Install Dependencies
```bash
npm install
```

This will install:
- React 18.2
- Firebase 10.7
- Tailwind CSS 3.4
- Vite 5.0
- Lucide React icons

---

### Phase 2: Firebase Configuration

#### Step 2.1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Enter project name: `college-scheduling` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create Project" and wait for completion

#### Step 2.2: Enable Firebase Services

**Enable Firestore Database:**
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select region: `us-central1` (or closest to you)
5. Click "Enable"

**Enable Authentication:**
1. Go to "Authentication" → "Sign-in method"
2. Enable "Email/Password"
3. Enable "Google" (click "Configure" if needed)
4. Click "Save"

#### Step 2.3: Get Firebase Credentials
1. Go to "Project Settings" (gear icon)
2. Select "Your apps" section
3. Click on your web app (or create one if not present)
4. Copy the Firebase config object

#### Step 2.4: Configure Environment Variables
1. Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```

2. Open `.env.local` and fill in your Firebase credentials:
```env
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=college-scheduling.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=college-scheduling-xxxxx
REACT_APP_FIREBASE_STORAGE_BUCKET=college-scheduling.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1234567890
REACT_APP_FIREBASE_APP_ID=1:1234567890:web:abc123...
```

3. Save the file

#### Step 2.5: Deploy Firestore Security Rules
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

Or manually set Firestore rules:
1. In Firebase Console → Firestore → Rules
2. Replace with rules from `firestore.rules` file
3. Click "Publish"

---

### Phase 3: Create Firestore Collections

Go to Firestore Console and create these **empty collections** (data will be added by the app):

1. **users** - Stores user profiles and roles
2. **timetables** - Stores class schedules
3. **events** - Stores college events
4. **tasks** - Stores custom tasks

---

### Phase 4: Run the Application

#### Step 4.1: Start Development Server
```bash
npm run dev
```

The app will automatically open at `http://localhost:3000`

#### Step 4.2: Test Login
Create test accounts:
1. Click "Register"
2. Enter email: `test@example.com`
3. Enter password: `Test123456`
4. Select role: "Admin"
5. Click "Register"

Repeat for Student account (select "Student" role)

---

### Phase 5: Deploy (Optional)

#### Deploy to Firebase Hosting:
```bash
npm run build
firebase deploy
```

#### Deploy to Vercel:
```bash
npm run build
# Then use Vercel CLI or connect GitHub repo
vercel
```

---

## Troubleshooting

### Issue: "Firebase Config is Invalid"
**Solution:** Ensure `.env.local` is in the project root (same level as `package.json`)

### Issue: "Firestore Permission Denied"
**Solution:**
1. Check Firestore rules are deployed
2. Ensure you're logged in
3. Clear browser cache and try again

### Issue: "Google Sign-In Not Working"
**Solution:**
1. Go to Firebase → Authentication → Sign-in methods
2. Verify Google provider is enabled
3. Check callback URL matches your domain

### Issue: "Build Fails with Module Not Found"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## Project Structure Explanation

```
src/
├── components/           → Reusable UI components
├── pages/               → Full page views (Login, Dashboard)
├── firebase/            → Firebase setup and operations
├── hooks/               → Custom React hooks for data
├── utils/               → Helper functions
└── index.css            → Global styles with Tailwind
```

### Key Components

**FloatingMenu.jsx** - The "+" button at top-left with 3 options
- Positioned fixed at top-left
- Opens dropdown menu
- Triggers modal forms

**TimetableForm** - Form to add class schedules
- Validates dates/times
- Checks room conflicts
- Saves to Firestore

**EventForm** - Form to add events
- Creates events
- Integrates with Google Calendar

**CustomTaskForm** - Extensible task management
- Can be customized for future features
- Stores in tasks collection

**TimetableGrid** - Weekly schedule display
- Shows classes by day
- Color-coded
- Admin can edit/delete

**EventsList** - Event display with Google Calendar buttons
- Shows all events
- Click to open in Google Calendar
- Admin can edit/delete

---

## Key Features to Note

### 1. Floating Menu (Top-Left)
- Fixed position
- Always visible
- Three quick-add options
- Opens modals for forms

### 2. Google Calendar Integration
- Click calendar icon on any event
- Opens Google Calendar in new tab
- Pre-fills: title, date, time, description
- No API key required (uses URL-based integration)

### 3. Conflict Detection
- When adding timetable entry
- Checks same room + same faculty + overlapping time
- Shows warning, allows override

### 4. Role-Based Access
- **Admin**: Full access, can create/edit/delete, sees floating menu
- **Student**: Read-only, can only view, no floating menu

### 5. Time Conflict Checking
```javascript
// Checks for conflicts automatically
await checkTimeConflict(userId, day, startTime, endTime, room)
```

---

## Firebase Firestore Schema

### users Collection
```javascript
{
  uid: "user_id",
  email: "user@college.com",
  displayName: "John Doe", // optional
  role: "admin" | "student",
  createdAt: "2024-01-15T10:00:00Z"
}
```

### timetables Collection
```javascript
{
  userId: "user_id",
  subject: "Thermodynamics",
  faculty: "Prof. Sharma",
  day: "Monday",
  startTime: "10:00",
  endTime: "11:00",
  room: "Room 203",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
}
```

### events Collection
```javascript
{
  userId: "user_id",
  title: "Annual Fest",
  date: "2024-01-20",
  time: "10:00",
  description: "Annual college festival and celebration",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
}
```

### tasks Collection
```javascript
{
  userId: "user_id",
  title: "Complete assignment",
  notes: "Math chapter 5, due Friday",
  dueDate: "2024-01-20",
  priority: "high" | "medium" | "low",
  completed: false,
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
}
```

---

## Development Tips

### Add New Features
1. Create component in `src/components/`
2. Add utility functions in `src/utils/`
3. Use custom hooks from `src/hooks/`
4. Connect to Firestore via `src/firebase/firestore.js`

### Styling
- Uses Tailwind CSS
- Global styles in `src/index.css`
- Custom classes defined in `@layer components`
- Color scheme: Blue (#2563eb), Gray (#64748b)

### State Management
- React hooks (useState, useEffect)
- Custom hooks: `useAuth`, `useFirestore`
- No Redux (kept simple)

### Validation
- All forms validated before submit
- Check `src/utils/validation.js` for rules
- Real-time error display

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up Firebase
3. ✅ Configure environment variables
4. ✅ Deploy Firestore rules
5. ✅ Run development server
6. ✅ Create test accounts
7. ✅ Test all features
8. ✅ Deploy to production

---

## Support

- Check [Firebase Documentation](https://firebase.google.com/docs)
- Review React hooks guide: [React.dev](https://react.dev)
- Tailwind CSS: [tailwindcss.com](https://tailwindcss.com)

**Your College Scheduling App is ready! 🎉**
