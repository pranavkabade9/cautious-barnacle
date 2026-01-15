# Quick Reference Guide

## 🚀 Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local file with Firebase credentials
cp .env.example .env.local
# Edit .env.local with your Firebase config

# 3. Run development server
npm run dev

# 4. Open http://localhost:3000
# 5. Register test account
# 6. Explore the app!
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app component |
| `src/firebase/config.js` | Firebase setup |
| `src/firebase/auth.js` | Authentication functions |
| `src/firebase/firestore.js` | Database operations |
| `src/components/FloatingMenu.jsx` | Top-left "+" menu |
| `src/pages/Dashboard.jsx` | Main page |
| `.env.local` | Environment variables |
| `README.md` | Full documentation |
| `SETUP.md` | Step-by-step setup |

---

## 🔑 Key Concepts

### Three Main Features
1. **Add Timetable** - Schedule classes, detect conflicts
2. **Add Event** - Create events, export to Google Calendar
3. **Custom Task** - Manage tasks, mark complete

### Two Roles
- **Admin** - Full access, can create/edit/delete
- **Student** - Read-only, view schedules

### Real-time Updates
- All changes sync instantly
- Multi-user support
- Live data subscriptions

---

## 📝 Common Tasks

### Add New Timetable Entry
1. Click "+" button (top-left)
2. Select "Add Timetable"
3. Fill form: Subject, Faculty, Day, Time, Room
4. System auto-checks conflicts
5. Click "Save Timetable"

### Create Event with Google Calendar
1. Click "+" button
2. Select "Add Event"
3. Fill form: Title, Date, Time, Description
4. Click "Save Event"
5. In Events tab, click "Google Calendar" to export

### Create Custom Task
1. Click "+" button
2. Select "Custom Task"
3. Enter: Title, Notes, Due Date (optional), Priority
4. Click "Save Task"
5. Check off when complete

---

## 🔧 Component Quick Reference

### FloatingMenu
Located at top-left. Fixed position. Three options:
- Add Timetable
- Add Event
- Custom Task

### Modal
Opens when selecting from FloatingMenu. Contains forms.

### TimetableGrid
Weekly view. Classes organized by day. Color-coded.

### EventsList
Displays all events. Has Google Calendar button for each.

### TasksList
Shows tasks with checkboxes. Color-coded priority.

---

## 🔐 Authentication

### Sign Up
1. Click "Register"
2. Enter email, password, select role
3. Click "Register"

### Sign In
1. Enter email and password
2. Click "Sign In"
3. Or use "Sign in with Google"

### Logout
1. Click "Logout" button (top-right)
2. Redirects to login page

---

## 📊 Data Structure Examples

### Timetable
```javascript
{
  subject: "Thermodynamics",
  faculty: "Prof. Sharma",
  day: "Monday",
  startTime: "10:00",
  endTime: "11:00",
  room: "Room 203"
}
```

### Event
```javascript
{
  title: "Annual Fest",
  date: "2024-01-20",
  time: "10:00",
  description: "College festival"
}
```

### Task
```javascript
{
  title: "Complete assignment",
  notes: "Math chapter 5",
  dueDate: "2024-01-20",
  priority: "high",
  completed: false
}
```

---

## 🎨 Styling Guide

### Colors
- **Primary Blue**: #2563eb
- **Secondary Gray**: #64748b
- **Success Green**: #16a34a
- **Warning Yellow**: #eab308
- **Error Red**: #dc2626

### Component Classes
```css
.input-field     /* Form inputs */
.btn-primary     /* Blue buttons */
.btn-secondary   /* Gray buttons */
.card            /* White card containers */
```

---

## ⚙️ Firebase Setup Checklist

- [ ] Create Firebase project
- [ ] Enable Firestore Database
- [ ] Enable Firebase Authentication (Email + Google)
- [ ] Create .env.local with credentials
- [ ] Create empty Firestore collections:
  - users
  - timetables
  - events
  - tasks
- [ ] Deploy Firestore security rules
- [ ] Test with sample data

---

## 🧪 Testing

### Test Admin Account
```
Email: admin@test.com
Password: Admin123456
Role: Admin
```

### Test Student Account
```
Email: student@test.com
Password: Student123456
Role: Student
```

### Sample Data
- Add timetable: Math, Prof. Khan, Monday 9-10 AM, Room 101
- Add event: Exam, 2024-02-10, 10:00 AM
- Add task: Study calculus, High priority, Due 2024-02-05

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Firebase Config Invalid" | Check .env.local exists in root directory |
| "Permission Denied" | Deploy Firestore rules, check authentication |
| "Google Sign-In Fails" | Enable Google provider in Firebase Auth |
| "Build Fails" | Run `npm install` again, clear node_modules |
| "Blank Page" | Check browser console for errors |

---

## 📱 Mobile Responsiveness

App is fully responsive:
- Desktop: Full width, multiple columns
- Tablet: Optimized for touch
- Mobile: Single column, touch-friendly buttons

Test with Chrome DevTools (F12 → Responsive Design Mode)

---

## 🚀 Deployment Quick Links

- **Firebase Hosting**: `firebase deploy`
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod --dir=dist`
- **Build**: `npm run build`
- **Preview**: `npm run preview`

---

## 📚 Documentation Files

| File | Content |
|------|---------|
| README.md | Project overview & features |
| SETUP.md | Step-by-step setup instructions |
| API.md | Complete API documentation |
| ARCHITECTURE.md | System design & data flow |
| DEPLOYMENT.md | Deployment & production guide |

---

## 💡 Tips & Tricks

### Make Admin Account
1. Register with email
2. In Firebase Console → Firestore:
   - Find user document
   - Edit `role` field
   - Change from "student" to "admin"
   - Save

### Check Conflicts
1. When adding timetable
2. System auto-detects same room + time overlap
3. Shows warning dialog
4. Click "OK" to override

### Export to Google Calendar
1. Create event
2. View in Events tab
3. Click "Google Calendar" button
4. Opens in new tab with pre-filled details
5. Save to your calendar

### Bulk Add Timetable
1. Create one entry (admin sees pattern)
2. For repetitive classes, manually add each day
3. Future: CSV import feature

---

## 🔄 Development Workflow

```bash
# Start development
npm run dev

# Edit components, see live changes
# Auto-reload in browser

# When ready to deploy
npm run build
firebase deploy

# Check production
firebase hosting:versions:list
```

---

## 📞 Getting Help

1. **Setup Issues**: Check SETUP.md
2. **API Questions**: Check API.md
3. **Architecture**: Read ARCHITECTURE.md
4. **Deployment**: See DEPLOYMENT.md
5. **Firebase Docs**: firebase.google.com/docs
6. **React Docs**: react.dev

---

## ✅ Pre-Launch Checklist

- [ ] Firebase project created
- [ ] Environment variables configured
- [ ] Firestore rules deployed
- [ ] Test accounts created
- [ ] All forms tested
- [ ] Google Calendar integration working
- [ ] Mobile responsiveness checked
- [ ] Real-time updates verified
- [ ] Error handling tested
- [ ] Build passes without errors

---

## 🎉 You're Ready!

Your production-ready college scheduling app is complete. Start with SETUP.md and follow the steps. You'll have a live app running in minutes!

**Questions?** Check the documentation files or review the code comments.

**Happy coding! 🚀**
