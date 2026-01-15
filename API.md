# API Documentation

## Firebase Functions

### Authentication (`src/firebase/auth.js`)

#### `registerUser(email, password, role = 'student')`
Creates a new user account and stores role in Firestore.

```javascript
import { registerUser } from './firebase/auth';

await registerUser('user@example.com', 'password123', 'student');
```

**Returns:** Firebase User object

---

#### `loginUser(email, password)`
Sign in with email and password.

```javascript
await loginUser('user@example.com', 'password123');
```

**Returns:** Firebase User object

---

#### `loginWithGoogle()`
Sign in using Google OAuth.

```javascript
await loginWithGoogle();
```

**Returns:** Firebase User object

---

#### `logoutUser()`
Sign out current user.

```javascript
await logoutUser();
```

---

#### `getUserRole(uid)`
Fetch user's role from Firestore.

```javascript
const role = await getUserRole(userId); // Returns: 'admin' | 'student'
```

---

#### `watchAuthState(callback)`
Real-time listener for authentication changes.

```javascript
const unsubscribe = watchAuthState((user) => {
  if (user) console.log('User logged in:', user.email);
  else console.log('User logged out');
});

// Cleanup
return () => unsubscribe();
```

---

### Firestore Operations (`src/firebase/firestore.js`)

#### Timetable Functions

##### `addTimetableEntry(userId, data)`
Add a new class schedule.

```javascript
const id = await addTimetableEntry(user.uid, {
  subject: 'Thermodynamics',
  faculty: 'Prof. Sharma',
  day: 'Monday',
  startTime: '10:00',
  endTime: '11:00',
  room: 'Room 203'
});
```

**Returns:** Document ID

---

##### `fetchTimetables(userId)`
Get all timetable entries for a user.

```javascript
const timetables = await fetchTimetables(user.uid);
// Returns: [{id, subject, faculty, day, startTime, endTime, room, ...}, ...]
```

---

##### `subscribeToTimetables(userId, callback)`
Real-time updates for timetables.

```javascript
const unsubscribe = subscribeToTimetables(user.uid, (timetables) => {
  console.log('Updated timetables:', timetables);
});
```

---

##### `updateTimetableEntry(docId, data)`
Update an existing timetable entry.

```javascript
await updateTimetableEntry(docId, {
  startTime: '10:30',
  endTime: '11:30'
});
```

---

##### `deleteTimetableEntry(docId)`
Delete a timetable entry.

```javascript
await deleteTimetableEntry(docId);
```

---

#### Event Functions

##### `addEvent(userId, data)`
Create a new event.

```javascript
const id = await addEvent(user.uid, {
  title: 'Annual Fest',
  date: '2024-01-20',
  time: '10:00',
  description: 'Annual college festival'
});
```

**Returns:** Document ID

---

##### `fetchEvents(userId)`
Get all events for a user.

```javascript
const events = await fetchEvents(user.uid);
```

---

##### `subscribeToEvents(userId, callback)`
Real-time updates for events.

```javascript
const unsubscribe = subscribeToEvents(user.uid, (events) => {
  console.log('Events updated:', events);
});
```

---

##### `updateEvent(docId, data)`
Update an event.

```javascript
await updateEvent(docId, {
  title: 'Updated Event Title',
  time: '14:00'
});
```

---

##### `deleteEvent(docId)`
Delete an event.

```javascript
await deleteEvent(docId);
```

---

#### Task Functions

##### `addCustomTask(userId, data)`
Create a new task.

```javascript
const id = await addCustomTask(user.uid, {
  title: 'Complete assignment',
  notes: 'Math chapter 5',
  dueDate: '2024-01-20',
  priority: 'high'
});
```

**Returns:** Document ID

---

##### `fetchTasks(userId)`
Get all tasks for a user.

```javascript
const tasks = await fetchTasks(user.uid);
```

---

##### `subscribeToTasks(userId, callback)`
Real-time updates for tasks.

```javascript
const unsubscribe = subscribeToTasks(user.uid, (tasks) => {
  console.log('Tasks updated:', tasks);
});
```

---

##### `updateTask(docId, data)`
Update a task.

```javascript
await updateTask(docId, {
  completed: true,
  priority: 'low'
});
```

---

##### `deleteTask(docId)`
Delete a task.

```javascript
await deleteTask(docId);
```

---

#### Validation Functions

##### `checkTimeConflict(userId, day, startTime, endTime, room, excludeId = null)`
Check for time conflicts in timetable.

```javascript
const conflicts = await checkTimeConflict(
  user.uid,
  'Monday',
  '10:00',
  '11:00',
  'Room 203'
);
// Returns: [{id, subject, faculty, ...}, ...]
```

Returns array of conflicting entries. Empty array = no conflicts.

---

## Utility Functions

### Google Calendar (`src/utils/googleCalendar.js`)

#### `generateGoogleCalendarURL(event)`
Generate Google Calendar event link.

```javascript
const url = generateGoogleCalendarURL({
  title: 'Annual Fest',
  date: '2024-01-20',
  startTime: '10:00',
  endTime: '11:00',
  description: 'College festival'
});
// Returns: https://calendar.google.com/calendar/u/0/r/eventedit?...
```

---

#### `openGoogleCalendar(event)`
Open Google Calendar in new tab.

```javascript
openGoogleCalendar({
  title: 'Annual Fest',
  date: '2024-01-20',
  startTime: '10:00',
  endTime: '11:00',
  description: 'College festival'
});
```

---

### Validation (`src/utils/validation.js`)

#### `validateTimetableForm(data)`
Validate timetable form input.

```javascript
const result = validateTimetableForm({
  subject: 'Math',
  faculty: 'Prof. Smith',
  day: 'Monday',
  startTime: '09:00',
  endTime: '10:00',
  room: 'Room 101'
});

console.log(result.isValid); // true/false
console.log(result.errors); // {subject: '...', ...}
```

---

#### `validateEventForm(data)`
Validate event form input.

```javascript
const result = validateEventForm({
  title: 'Event',
  date: '2024-01-20',
  time: '10:00',
  description: 'Description'
});
```

---

#### `validateTaskForm(data)`
Validate task form input.

```javascript
const result = validateTaskForm({
  title: 'Task',
  notes: 'Notes',
  dueDate: '2024-01-20',
  priority: 'high'
});
```

---

### Formatters (`src/utils/formatters.js`)

#### `formatTimeRange(startTime, endTime)`
Format time range string.

```javascript
const range = formatTimeRange('10:00', '11:00');
// Returns: '10:00 – 11:00'
```

---

#### `formatDate(dateString)`
Format date to readable string.

```javascript
const formatted = formatDate('2024-01-20');
// Returns: 'Saturday, January 20, 2024'
```

---

#### `formatTime12Hour(time24)`
Convert 24-hour to 12-hour format.

```javascript
const time12 = formatTime12Hour('14:00');
// Returns: '2:00 PM'
```

---

#### `getDayName(dateString)`
Get day name from date.

```javascript
const day = getDayName('2024-01-20');
// Returns: 'Saturday'
```

---

## Custom Hooks

### `useAuth()` (`src/hooks/useAuth.js`)
Manage authentication state.

```javascript
import { useAuth } from './hooks/useAuth';

const { user, userRole, loading, error } = useAuth();

// user: Firebase User object or null
// userRole: 'admin' | 'student' | null
// loading: boolean
// error: string or null
```

---

### `useTimetables(userId)` (`src/hooks/useFirestore.js`)
Real-time timetable data.

```javascript
const { timetables, loading, error } = useTimetables(user.uid);
```

---

### `useEvents(userId)`
Real-time events data.

```javascript
const { events, loading, error } = useEvents(user.uid);
```

---

### `useTasks(userId)`
Real-time tasks data.

```javascript
const { tasks, loading, error } = useTasks(user.uid);
```

---

### `useCheckConflict(userId)`
Check for schedule conflicts.

```javascript
const { conflicts, loading, checkConflict } = useCheckConflict(user.uid);

// Check conflicts
await checkConflict('Monday', '10:00', '11:00', 'Room 203');
```

---

## Component Props

### FloatingMenu
```javascript
<FloatingMenu 
  onSelectOption={(option) => {
    // option: 'timetable' | 'event' | 'task'
  }} 
/>
```

---

### TimetableGrid
```javascript
<TimetableGrid 
  timetables={[]}
  onEdit={(entry) => {}}
  onDelete={(id) => {}}
  loading={false}
  isAdmin={true}
/>
```

---

### EventsList
```javascript
<EventsList 
  events={[]}
  onEdit={(event) => {}}
  onDelete={(id) => {}}
  loading={false}
  isAdmin={true}
/>
```

---

### Modal
```javascript
<Modal 
  isOpen={true}
  title="Modal Title"
  onClose={() => {}}
  size="md" // 'sm' | 'md' | 'lg' | 'xl'
>
  {children}
</Modal>
```

---

## Error Handling

All functions throw errors that should be caught:

```javascript
try {
  await addTimetableEntry(userId, data);
} catch (error) {
  console.error('Error:', error.message);
}
```

Common errors:
- "Permission denied" - Check Firebase rules
- "Invalid document reference" - Document doesn't exist
- "Failed to add timetable" - Data validation failed

---

## Rate Limits & Quotas

Firebase Firestore has these limits per project:
- **Read operations**: 50,000/day (free tier)
- **Write operations**: 20,000/day (free tier)
- **Document size**: 1 MB max
- **Realtime listeners**: 100 concurrent

---

## Best Practices

1. **Always cleanup subscriptions**
   ```javascript
   useEffect(() => {
     const unsubscribe = subscribeToTimetables(...);
     return () => unsubscribe();
   }, []);
   ```

2. **Check user role before operations**
   ```javascript
   if (userRole !== 'admin') return; // Read-only
   ```

3. **Validate data before sending**
   ```javascript
   const validation = validateTimetableForm(data);
   if (!validation.isValid) {
     setErrors(validation.errors);
     return;
   }
   ```

4. **Use real-time listeners for live updates**
   ```javascript
   const unsubscribe = subscribeToTimetables(userId, (data) => {
     // Automatically updates when data changes
   });
   ```

---

**Last Updated**: January 2024
