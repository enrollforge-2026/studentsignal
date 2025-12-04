# Content Management System (CMS) - User Guide

## 📝 Overview

StudentSignal now has a centralized content management file that allows you to edit text across the site **without touching any React component code**.

---

## 📁 Location

**File:** `/app/frontend/src/config/siteContent.js`

This single file controls all editable text content for the entire StudentSignal platform.

---

## 🎯 How to Edit Content

### Step 1: Open the Content File
Navigate to: `/app/frontend/src/config/siteContent.js`

### Step 2: Find the Section You Want to Edit
The file is organized by page and section. For example:

```javascript
collegeSearch: {
  hero: {
    title: "College Search",
    subtitle: "Your subtitle text here...",
    searchPlaceholder: "Search Colleges"
  }
}
```

### Step 3: Edit the Text
Simply change the text inside the quotes:

```javascript
// Before:
subtitle: "Old text here"

// After:
subtitle: "New text here"
```

### Step 4: Save the File
The frontend will automatically reload with your changes (hot reload is enabled).

---

## 📋 Available Content Sections

### 1. **College Search Page**

#### Hero Section
```javascript
collegeSearch: {
  hero: {
    title: "College Search",
    subtitle: "Student Signal simplifies the process of...",
    searchPlaceholder: "Search Colleges"
  }
}
```

**What you can edit:**
- Hero title
- Hero subtitle (the paragraph below the title)
- Search bar placeholder text

**Current subtitle:**
> "Student Signal simplifies the process of discovering and connecting with top Colleges and Universities. Explore colleges for free, check admission rates, and access other valuable information to help you create your perfect college list."

#### Filter Labels
```javascript
filters: {
  title: "Filters",
  clearAll: "Clear all",
  labels: {
    location: "Location",
    levelOfInstitution: "Level of Institution",
    institutionType: "Institution Type",
    cost: "Cost (Avg Net Price)",
    selectivity: "Selectivity (Acceptance Rate)",
    satScoreRange: "SAT Score Range",
    actScoreRange: "ACT Score Range"
  },
  placeholders: {
    location: "City or State",
    minCost: "Min $",
    maxCost: "Max $"
  }
}
```

**What you can edit:**
- Filter section title
- "Clear all" button text
- All filter label names
- Input placeholder text

#### Results Section
```javascript
results: {
  browsingText: "Browsing {count} Colleges",
  sortByLabel: "Sort by:",
  noResultsTitle: "No colleges found matching your criteria",
  noResultsButton: "Clear All Filters"
}
```

**What you can edit:**
- Results count text (use `{count}` as placeholder for number)
- Sort dropdown label
- No results message
- Clear filters button text

#### Card Content
```javascript
card: {
  ctaButton: "Will you get accepted?"
}
```

**What you can edit:**
- Call-to-action button text on college cards

---

### 2. **Scholarship Search Page**

```javascript
scholarshipSearch: {
  hero: {
    title: "Scholarship Search",
    subtitle: "Find and apply to scholarships...",
    searchPlaceholder: "Search Scholarships"
  }
}
```

**Note:** This section is prepared for future updates when we apply the CMS to the Scholarship page.

---

### 3. **Home Page**

```javascript
homePage: {
  hero: {
    title: "Your Path to College Success Starts Here",
    subtitle: "Discover colleges, find scholarships..."
  }
}
```

**Note:** Ready for when the home page is updated to use the CMS.

---

### 4. **Common Text**

```javascript
common: {
  buttons: {
    learnMore: "Learn More",
    getStarted: "Get Started",
    apply: "Apply Now",
    save: "Save",
    cancel: "Cancel"
  },
  labels: {
    loading: "Loading...",
    error: "Something went wrong",
    success: "Success!"
  }
}
```

**What you can edit:**
- Common button labels used across the site
- Common status messages

---

## ⚠️ Important Rules

### ✅ DO:
- Edit text inside the quotes
- Keep placeholders like `{count}` intact
- Save the file after editing
- Test the page to verify changes

### ❌ DON'T:
- Change property names (e.g., don't rename `subtitle` to `subTitle`)
- Remove quotes around text
- Delete commas between properties
- Add or remove curly braces `{}`
- Change the file structure

---

## 📝 Example: Changing the College Search Subtitle

### Current Text:
```javascript
subtitle: "Student Signal simplifies the process of discovering and connecting with top Colleges and Universities. Explore colleges for free, check admission rates, and access other valuable information to help you create your perfect college list."
```

### How to Change It:

1. Open `/app/frontend/src/config/siteContent.js`
2. Find `collegeSearch.hero.subtitle`
3. Replace the text inside the quotes:

```javascript
subtitle: "Your new subtitle text goes here. Make it engaging and informative!"
```

4. Save the file
5. The page will automatically reload with your new text

---

## 🎨 Best Practices

### Writing Effective Content

1. **Be Clear and Concise**
   - Keep subtitles under 200 characters
   - Use simple, direct language

2. **Maintain Consistency**
   - Use the same tone across all pages
   - Keep button labels consistent (e.g., all "Learn More" or all "Learn more")

3. **Consider Mobile Users**
   - Shorter text works better on small screens
   - Test on mobile after making changes

4. **Use Action Words**
   - Buttons: "Explore", "Discover", "Find", "Apply"
   - Avoid: "Click here", "Submit"

---

## 🐛 Troubleshooting

### Problem: Page Shows Error After Editing

**Cause:** Likely a syntax error (missing quote, comma, or bracket)

**Solution:**
1. Check for missing quotes around text
2. Ensure all properties have commas between them (except the last one)
3. Verify all brackets `{}` are properly closed

**Example of Common Errors:**

❌ **Wrong:**
```javascript
subtitle: Student Signal simplifies...  // Missing quotes
```

✅ **Correct:**
```javascript
subtitle: "Student Signal simplifies..."
```

---

❌ **Wrong:**
```javascript
title: "College Search"  // Missing comma
subtitle: "Student Signal..."
```

✅ **Correct:**
```javascript
title: "College Search",
subtitle: "Student Signal..."
```

---

### Problem: Changes Not Showing

**Solution:**
1. Save the file (Ctrl+S / Cmd+S)
2. Hard refresh the browser (Ctrl+Shift+R / Cmd+Shift+R)
3. Clear browser cache if needed

---

## 📊 Current Content Implementation

### Pages Using CMS:
- ✅ College Search Page (fully implemented)

### Pages Ready for CMS (not yet connected):
- Scholarship Search Page
- Home Page
- Other pages (to be added)

---

## 🚀 Future Enhancements

The CMS file can be expanded to include:
- Button colors and styles
- Image URLs
- External links
- Social media links
- Contact information
- Terms of service text
- Privacy policy text

---

## 📞 Need Help?

If you encounter issues editing the content file:
1. Check this guide for troubleshooting tips
2. Verify the file syntax is correct
3. Test on a local environment first before production

---

## ✅ Quick Reference Card

| Content Type | Location | Example |
|--------------|----------|---------|
| Page Titles | `[page].hero.title` | "College Search" |
| Subtitles | `[page].hero.subtitle` | "Student Signal simplifies..." |
| Search Bar | `[page].hero.searchPlaceholder` | "Search Colleges" |
| Filter Labels | `[page].filters.labels.[name]` | "Location" |
| Button Text | `[page].card.ctaButton` | "Will you get accepted?" |
| Common Buttons | `common.buttons.[name]` | "Learn More" |

---

**File Location:** `/app/frontend/src/config/siteContent.js`

**Last Updated:** December 2024

**Status:** ✅ Active and working on College Search page
