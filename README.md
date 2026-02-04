# Virtual Film Office - Admin Portal

A modern, production-ready admin portal for a Coursera-style learning platform built with Next.js, TypeScript, and Tailwind CSS.

## 🎨 Features

### Admin Login Page (`/admin/login`)
- Email and password validation
- Show/hide password toggle
- "Remember me" checkbox
- Mock authentication with redirect to course builder
- Responsive design with brand colors

### Course Create Page (`/admin/courses/create`)
- **Week-based Course Builder**
  - Default 4 weeks (expandable)
  - Add/remove weeks with title and description
  - Collapsible accordion view
  
- **Lesson Management**
  - Add lessons to any week
  - Choose lesson type (Video or PDF)
  - Upload content with progress simulation
  - Drag handle UI for reordering (visual only)
  - Delete lessons
  
- **Properties Panel**
  - Edit week details (title, description)
  - Edit lesson details (title, view attachments)
  - Shows lesson count and content status
  
- **Validation & Publishing**
  - Publish button enabled only when:
    - Course title exists
    - At least 1 lesson exists
    - At least 1 content file attached
  - Draft auto-save to localStorage
  - Status badge (Draft/Published)

## 🚀 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Hooks + localStorage
- **No Backend**: All data is mock/local

## 📁 Project Structure

```
admin-portal/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── courses/
│   │       └── create/
│   │           └── page.tsx      # Course builder page
│   ├── globals.css               # Global styles with brand colors
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   └── Accordion.tsx
│   └── admin/                    # Admin-specific components
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       ├── AdminLayout.tsx
│       ├── WeekAccordion.tsx
│       ├── LessonRow.tsx
│       ├── PropertiesPanel.tsx
│       ├── AddWeekModal.tsx
│       ├── AddLessonModal.tsx
│       └── UploadModal.tsx
├── types/
│   └── course.ts                 # TypeScript interfaces
├── lib/
│   ├── validation.ts             # Validation utilities
│   └── storage.ts                # localStorage utilities
└── README.md
```

## 🎨 Brand Colors

The application uses the Virtual Film Office brand colors:

- **Primary Navy**: `#0F3B5F` - Main brand color
- **Gold Accent**: `#D4AF37` - Highlights and badges
- **Light Background**: `#F8F9FA` - Page background
- **Dark Text**: `#1A2332` - Headings and primary text

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd admin-portal
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000/admin/login
```

### Build for Production

```bash
npm run build
npm start
```

## 📝 Usage Guide

### Login
1. Go to `/admin/login`
2. Enter any valid email format (e.g., `admin@vfo.com`)
3. Enter any password
4. Click "Sign In"
5. You'll be redirected to the course builder

### Creating a Course

1. **Add Course Title**: Click on the title field and enter your course name
2. **Add Description** (optional): Enter a brief description
3. **Manage Weeks**:
   - Default 4 weeks are provided
   - Click "Add Week" to create more
   - Click on week title to expand/collapse
   - Edit week details in the properties panel
4. **Add Lessons**:
   - Click "Add Lesson" within any week
   - Enter lesson title and select type (Video/PDF)
   - Click "Add Lesson"
5. **Upload Content**:
   - Click "Upload" on any lesson
   - Select or drag & drop a file
   - Watch the progress bar (simulated)
6. **Save & Publish**:
   - Click "Save Draft" to save to localStorage
   - "Publish Course" button enables when all requirements are met
   - Requirements: course title + 1 lesson + 1 content file

## 🎯 Key Features

### Responsive Design
- Desktop-first approach
- Sidebar navigation
- Collapsible properties panel
- Mobile-friendly (doesn't break on smaller screens)

### Data Persistence
- Auto-saves to localStorage every second
- Manual "Save Draft" button
- Persists across page refreshes

### Validation
- Email format validation on login
- Required field validation
- Publish button disabled until minimum requirements met
- Visual feedback for errors

### UI/UX
- Smooth animations and transitions
- Hover effects on interactive elements
- Loading states on buttons
- Modal dialogs with backdrop
- Drag handle icons (visual only)
- Status badges
- Icon-based navigation

## 🔧 Customization

### Adding New Pages
Create new pages in the `app/admin/` directory following Next.js App Router conventions.

### Modifying Brand Colors
Edit the CSS variables in `app/globals.css`:
```css
:root {
  --primary-navy: #0F3B5F;
  --gold-accent: #D4AF37;
  /* ... */
}
```

### Adding New Components
Place reusable components in `components/ui/` and admin-specific components in `components/admin/`.

## 📄 License

© 2026 Virtual Film Office. All rights reserved.

## 🤝 Support

For questions or support, contact: support@vfo.com
