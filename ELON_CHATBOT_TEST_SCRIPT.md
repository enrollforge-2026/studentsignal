# Elon AI Chatbot - User Test Script

## Quick Test (5 minutes)

### Test 1: Guest Chat on Homepage

1. **Navigate to Homepage**
   - URL: `https://studentui-stable.preview.emergentagent.com/`
   - Look for purple gradient chat button in bottom-right corner

2. **Open Chat**
   - Click the chat button with message icon
   - **Expected:** Chat window opens with greeting: "Hi there! 👋 I'm Elon. I can help answer questions about Student Signal. For personalized help, please sign up!"

3. **Send a Test Message**
   - Type: "What is Student Signal?"
   - Click send button (or press Enter)
   - **Expected:** AI response within 5-10 seconds explaining the platform
   - **Expected:** Response is friendly, brief (3-4 sentences), and encourages sign-up

4. **Test Follow-up Conversation**
   - Type: "What can I find here?"
   - **Expected:** AI provides info about colleges and scholarships

5. **Verify Guest Limitations**
   - Look for sign-up prompt at bottom of chat input
   - **Expected:** "💡 Sign up for personalized assistance!" with link to signup

---

### Test 2: Authenticated Chat on Signal Hub

1. **Login**
   - Navigate to: `https://studentui-stable.preview.emergentagent.com/login`
   - Use test credentials:
     - Email: `elon_test@example.com`
     - Password: `test123`
   - **Expected:** Redirect to Signal Hub dashboard

2. **Verify Personalization**
   - Check dashboard header
   - **Expected:** "Welcome back, Alex 🎓"

3. **Open Chat**
   - Click purple chat button in bottom-right
   - **Expected:** Personalized greeting: "Hi Alex! 👋 I'm Elon, your Student Signal assistant. How can I help you today?"

4. **Send Personalized Message**
   - Type: "Can you help me find scholarships?"
   - **Expected:** Response addresses you by name ("Hey Alex..." or "Hi Alex...")
   - **Expected:** Provides specific navigation help for scholarships page

5. **Test Conversation Flow**
   - Type: "What's in my Signal Hub?"
   - **Expected:** AI explains dashboard features (saved colleges, scholarships, application tracking)

6. **Close and Reopen Chat**
   - Click X to close chat
   - Click chat button again
   - **Expected:** Greeting shows again (session starts fresh)

---

## What to Look For

### ✅ Success Criteria

**Functionality:**
- Chat button always visible (even when scrolling)
- Chat opens and closes smoothly
- Messages send successfully
- AI responses arrive within 10 seconds
- Conversation feels natural and helpful

**Personalization:**
- Guest users see generic greeting + sign-up prompt
- Logged-in users greeted by first name
- Responses reference user's name when appropriate

**UI/UX Quality:**
- Professional appearance (matches Student Signal design)
- Smooth animations
- No visual glitches
- Mobile-friendly (if testing on phone)
- Readable text with good contrast

**Error Handling:**
- If AI fails, friendly error message appears
- No raw error messages or blank states
- Chat remains usable after errors

### 🚨 Issues to Report

- Chat button not visible or clickable
- Messages not sending
- AI not responding or errors showing
- Personalization not working (no name in greeting)
- Visual bugs (overlapping text, broken layout)
- Slow response times (>15 seconds)

---

## Test Account Details

**Pre-created Test User:**
- Email: `elon_test@example.com`
- Password: `test123`
- First Name: Alex
- Last Name: Testing

**Or create your own:**
- Go to `/signup`
- Use any email/password
- Complete the onboarding flow
- Then test chat on Signal Hub

---

## Known Limitations (Expected Behavior)

1. **Response Speed:** 5-10 seconds is normal (free-tier AI)
2. **Context:** Chat doesn't remember previous sessions (only current conversation)
3. **Capabilities:** Basic Q&A and navigation help (no advanced features)
4. **Text-Only:** No voice/audio support

---

## Quick Checklist

- [ ] Chat button visible on homepage
- [ ] Guest chat opens and works
- [ ] Can send and receive messages as guest
- [ ] Login successful with test account
- [ ] Chat button visible on Signal Hub
- [ ] Personalized greeting shows user's name
- [ ] Can send and receive messages as authenticated user
- [ ] Responses include user's name
- [ ] No errors or visual glitches
- [ ] UI looks professional and polished

---

## Questions to Consider

1. Does the chatbot feel helpful and friendly?
2. Are responses relevant to your questions?
3. Would you use this feature as a student?
4. Is the UI intuitive and easy to use?
5. Any features or improvements you'd suggest?

---

**Test completed successfully?** Let me know if you approve to proceed to the next task! 🚀
