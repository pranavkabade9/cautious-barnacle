# College Scheduling Web Application

A production-ready college scheduling application built with **React**, **Firebase**, and **Tailwind CSS**. Features admin panel for managing timetables, events, and custom tasks with Google Calendar integration.

## 🎯 Features

### Core Features
- **Admin Dashboard**: Create and manage timetables, events, and custom tasks
- **Student View**: Read-only access to schedules and events
- **Floating Action Menu**: Quick access to add timetable, events, or tasks (top-left corner)
- **Weekly Timetable Grid**: Visual representation of class schedule
- **Event Management**: Create events with Google Calendar integration
- **Custom Tasks**: Extensible task management system for college-related work
- **Google Calendar Integration**: One-click calendar export for all events

### Security & Auth
- Firebase Authentication (Email/Password + Google OAuth)
- Role-based access control (Admin/Student)
- Protected routes and secure data access

### Validation
- Real-time form validation
- Time conflict detection for classes
- Date and time format validation

## 📋 Project Structure

```
src/
├── components/           # Reusable React components
│   ├── FloatingMenu.jsx
│   ├── Modal.jsx
│   ├── TimetableForm.jsx
│   ├── EventForm.jsx
│   ├── CustomTaskForm.jsx
│   ├── TimetableGrid.jsx
│   ├── EventsList.jsx
│   ├── TasksList.jsx
│   └── ProtectedRoute.jsx
├── pages/               # Page components
│   ├── LoginPage.jsx
│   └── Dashboard.jsx
├── firebase/            # Firebase configuration and operations
│   ├── config.js
│   ├── auth.js
│   └── firestore.js
├── hooks/               # Custom React hooks
│   ├── useAuth.js
│   └── useFirestore.js
├── utils/               # Utility functions
│   ├── googleCalendar.js
│   ├── validation.js
│   └── formatters.js
├── App.jsx
├── index.jsx
└── index.css
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Firebase account
- Git

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable:
   - Firestore Database (start in production mode)
   - Firebase Authentication (Email/Password + Google Sign-In)

3. Get your Firebase config:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key" or view Web API key

4. Create `.env` file in root directory:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. Update `src/firebase/config.js` with your values if not using .env

### 3. Firestore Database Schema

Create the following collections in Firestore:

**users** collection:
```json
{
  "uid": "user_id",
  "email": "user@example.com",
  "displayName": "John Doe",
  "role": "admin" | "student",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

**timetables** collection:
```json
{
  "userId": "user_id",
  "subject": "Thermodynamics",
  "faculty": "Prof. Sharma",
  "day": "Monday",
  "startTime": "10:00",
  "endTime": "11:00",
  "room": "Room 203",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**events** collection:
```json
{
  "userId": "user_id",
  "title": "Annual Fest",
  "date": "2024-01-20",
  "time": "10:00",
  "description": "Annual college festival",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**tasks** collection:
```json
{
  "userId": "user_id",
  "title": "Complete assignment",
  "notes": "Math assignment chapter 5",
  "dueDate": "2024-01-20",
  "priority": "high" | "medium" | "low",
  "completed": false,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### 4. Run Development Server
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### 5. Build for Production
```bash
npm run build
```

## 🔐 Authentication Roles

### Admin Account
- Full access to all features
- Can create, edit, delete timetables, events, and tasks
- Access to floating "+" menu

### Student Account
- Read-only access
- Can view timetables, events, and tasks
- Can add events to Google Calendar

## 📱 Features in Detail

### Add Timetable
- Subject name, faculty, day, time, room
- Automatic conflict detection (same room/faculty at same time)
- Weekly grid visualization

### Add Event
- Event title, date, time, description
- **Google Calendar Integration**: Click calendar icon to add to Google Calendar
- Pre-fills event details in Google Calendar

### Custom Task
- Task title, notes, due date, priority
- Mark as complete/incomplete
- Extensible for future customization

## 🎨 UI/UX Features

- **Minimal Design**: 2-3 color palette (Blue primary)
- **Responsive**: Mobile-first design
- **Accessible**: Proper labels and ARIA attributes
- **Clean Typography**: System font stack
- **No Overengineering**: Smooth transitions only where needed

## 🔗 Google Calendar Integration

Events automatically generate a Google Calendar link:
```javascript
generateGoogleCalendarURL({
  title: 'Annual Fest',
  date: '2024-01-20',
  startTime: '10:00',
  endTime: '11:00',
  description: 'Annual college festival'
})
```

When user clicks "Google Calendar" button, it opens Google Calendar with pre-filled event details.

## 🧪 Testing

### Test Admin Account
```
Email: admin@college.com
Password: AdminTest123
Role: admin
```

### Test Student Account
```
Email: student@college.com
Password: StudentTest123
Role: student
```

## 📦 Dependencies

- **react** (18.2.0): UI framework
- **firebase** (10.7.0): Backend & Auth
- **tailwindcss** (3.4.0): Styling
- **lucide-react** (0.338.0): Icons
- **vite** (5.0.0): Build tool

## 🛠️ Development

### Project Structure Rationale

1. **Components**: Reusable UI building blocks
2. **Pages**: Full-page components (LoginPage, Dashboard)
3. **Firebase**: Centralized auth and database operations
4. **Hooks**: Custom React hooks for data fetching
5. **Utils**: Pure utility functions (validation, formatting)

### Code Style

- Functional components only
- React Hooks for state management
- Destructuring for imports
- Clear naming conventions
- Comments for complex logic

## 🚨 Error Handling

- Form validation with detailed error messages
- Firebase error catching and user-friendly messages
- Time conflict warnings with confirmation dialog
- Network error handling

## 📄 License

MIT - Feel free to use this for your college

## 🤝 Contributing

Contributions welcome! Areas for enhancement:
- Edit functionality for entries
- Batch import from CSV
- Calendar month view
- Email notifications
- Dark mode

## 📞 Support

For issues or questions:
1. Check Firebase console for connectivity
2. Verify all env variables are set correctly
3. Check browser console for error messages
4. Ensure Firestore rules allow read/write for authenticated users

---

**Built with ❤️ for colleges**
