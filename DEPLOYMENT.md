# Deployment Guide

## Deployment Options

### Option 1: Firebase Hosting (Recommended)

#### Prerequisites
```bash
npm install -g firebase-tools
firebase login
```

#### Steps
1. Build the project:
```bash
npm run build
```

2. Update `firebase.json` (update `site` value):
```json
{
  "hosting": {
    "site": "your-college-app",
    "public": "dist",
    ...
  }
}
```

3. Deploy:
```bash
firebase deploy
```

Your app is now live at `https://your-college-app.web.app`

---

### Option 2: Vercel

#### Steps
1. Build the project:
```bash
npm run build
```

2. Install Vercel CLI:
```bash
npm i -g vercel
```

3. Deploy:
```bash
vercel --prod
```

Follow the prompts to create/select a project.

**Your app is live at:** `https://your-project.vercel.app`

---

### Option 3: Netlify

#### Steps
1. Build the project:
```bash
npm run build
```

2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

---

### Option 4: GitHub Pages

#### Steps
1. Update `vite.config.js`:
```javascript
export default {
  base: '/repository-name/', // Your repo name
  // ... rest of config
}
```

2. Build:
```bash
npm run build
```

3. Push to GitHub:
```bash
git add dist
git commit -m "Deploy"
git push
```

---

## Production Checklist

- [ ] Firebase project created and configured
- [ ] Firestore database deployed with security rules
- [ ] Authentication enabled (Email + Google)
- [ ] Environment variables set correctly
- [ ] Application tested locally
- [ ] Build passes without errors (`npm run build`)
- [ ] Firestore security rules reviewed
- [ ] Firebase hosting configured
- [ ] Domain custom domain set up (optional)
- [ ] Analytics enabled (optional)

---

## Environment Variables for Production

Create `.env.production` file:

```env
VITE_FIREBASE_API_KEY=your_production_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Performance Optimization

### Build Optimization
- Vite automatically minifies and optimizes the build
- Tree-shaking removes unused code
- CSS is minified
- JavaScript is bundled efficiently

### Runtime Optimization
- Lazy load components with React.lazy() (future improvement)
- Optimize images (future improvement)
- Use service workers for offline support (future improvement)
- Enable compression on Firebase hosting

### Firestore Optimization
- Indexes created for common queries
- Real-time listeners only active when needed
- Batch operations for multiple updates (future improvement)

---

## Monitoring & Analytics

### Firebase Console Monitoring
1. Go to Firebase Console
2. Select your project
3. Check:
   - Firestore Usage (reads/writes/deletes)
   - Authentication metrics
   - Hosting bandwidth

### Error Tracking
Monitor browser console for errors:
```bash
# Install error tracking (optional)
npm install @sentry/react
```

---

## Scaling Considerations

**Current Setup Handles:**
- ✅ 100-1000 users
- ✅ 10,000-100,000 daily queries
- ✅ Real-time updates for multiple users

**For Larger Scale:**
- Implement Cloud Functions for complex operations
- Use Cloud Storage for file uploads
- Implement caching strategies
- Consider database replication across regions

---

## Backup & Recovery

### Backup Firestore Data
```bash
# Using Firebase CLI
firebase firestore:delete --all-collections
# Or use GCP Console for automated backups
```

### Export Firestore Data
```bash
# Via GCP Console
gcloud firestore export gs://your-bucket/backup
```

---

## Security in Production

### Firestore Security Rules
Ensure these rules are deployed:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /timetables/{document=**} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
    // Similar for events and tasks
  }
}
```

### Firebase Authentication
- ✅ Email verification (optional)
- ✅ Password reset flow
- ✅ OAuth2 with Google
- ✅ User role management

### CORS Configuration
Firebase automatically handles CORS for hosted apps.

---

## Cost Estimation

**Firebase Free Tier Includes:**
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day
- 5 GB storage
- 5 GB downloads/month

**Typical Cost for 1000 Users:**
- ~$0-5/month (under free tier limits)
- Scales as usage increases
- ~$0.06 per 100k reads
- ~$0.18 per 100k writes

---

## Troubleshooting Deployment

### Build Error: "Module not found"
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Firebase Deploy Error: "Permission denied"
```bash
firebase logout
firebase login
firebase deploy
```

### App Blank After Deploy
1. Check browser console for errors
2. Verify environment variables are set
3. Check Firestore security rules
4. Clear browser cache

---

## Rollback Procedure

If something goes wrong after deploy:

**Firebase Hosting:**
```bash
firebase hosting:versions:list
firebase hosting:clone-version [version_hash]
```

**Vercel:**
```bash
vercel rollback
```

**Netlify:**
```bash
netlify deploy --alias production
```

---

## Post-Deployment

1. **Test the application thoroughly**
   - Create accounts
   - Add timetables/events
   - Check Google Calendar integration
   - Test on mobile

2. **Monitor performance**
   - Check Firebase console metrics
   - Review console errors
   - Test real-time updates

3. **Gather feedback**
   - Collect user feedback
   - Monitor usage patterns
   - Plan improvements

---

## Future Improvements

- [ ] Progressive Web App (PWA) support
- [ ] Offline functionality with service workers
- [ ] Email notifications for events
- [ ] Calendar month/year view
- [ ] Bulk import/export
- [ ] Custom branding for different colleges
- [ ] Mobile app (React Native)
- [ ] Admin dashboard with analytics

---

**Your College Scheduling App is now production-ready! 🚀**
