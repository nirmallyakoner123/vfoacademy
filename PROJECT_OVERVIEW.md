# Virtual Film Office Academy - Project Overview

> **Last Updated**: February 5, 2026  
> **Version**: 1.0  
> **Platform**: Learning Management System (LMS)

## 📋 Table of Contents

1. [Project Introduction](#project-introduction)
2. [System Architecture](#system-architecture)
3. [Admin Portal](#admin-portal)
4. [Learner Portal](#learner-portal)
5. [Data Models](#data-models)
6. [Assessment System](#assessment-system)
7. [Backend Integration Requirements](#backend-integration-requirements)
8. [Technology Stack](#technology-stack)

---

## 🎯 Project Introduction

Virtual Film Office Academy is a comprehensive Learning Management System (LMS) similar to Coursera, designed specifically for film and creative education. The platform consists of two main portals:

- **Admin Portal**: For instructors and administrators to create, manage, and publish courses
- **Learner Portal**: For students to browse, enroll, and complete courses

### Key Features

- Week-based course structure
- Multiple content types (Video, PDF, Assessments)
- Comprehensive assessment system with proctoring
- Progress tracking and certificates
- User management and reporting

---

## 🏗️ System Architecture

### Application Structure

```
Virtual Film Office Academy/
└── admin-portal/                    # Main Next.js application
    ├── app/                         # Next.js App Router pages
    │   ├── admin/                   # Admin portal routes
    │   │   ├── layout.tsx          # Admin layout wrapper
    │   │   └── (pages)/            # Admin pages
    │   ├── courses/                 # Learner course routes
    │   ├── dashboard/               # Learner dashboard
    │   ├── certificates/            # Certificate management
    │   ├── profile/                 # User profile
    │   ├── login/                   # Authentication
    │   ├── layout.tsx              # Root layout
    │   └── globals.css             # Global styles
    ├── components/
    │   ├── admin/                   # Admin-specific components
    │   ├── learner/                 # Learner-specific components
    │   └── ui/                      # Shared UI components
    ├── types/                       # TypeScript type definitions
    │   ├── course.ts               # Course-related types
    │   ├── assessment.ts           # Assessment types
    │   ├── learner.ts              # Learner types
    │   └── reports.ts              # Reporting types
    ├── lib/                         # Utility functions
    └── public/                      # Static assets
```

### Design Principles

- **Component-Based Architecture**: Reusable UI components
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Optimized for fast loading

---

## 👨‍💼 Admin Portal

### Overview

The Admin Portal is where instructors and administrators create and manage courses, assessments, and monitor learner progress.

### Core Features

#### 1. Course Management

**Location**: `/admin/courses`

##### Course Builder
- **Week-Based Structure**: Organize content into weeks
- **Flexible Weeks**: Add/remove weeks dynamically
- **Week Properties**:
  - Title and description
  - Unlock dates (sequential release)
  - Lock/unlock status

##### Lesson Management
- **Lesson Types**:
  - 📹 **Video**: Upload video content
  - 📄 **PDF**: Upload PDF documents
  - 📝 **Assessment**: Create tests/quizzes
  
- **Lesson Features**:
  - Drag-and-drop reordering
  - Multiple file attachments
  - Preview mode option
  - Duration estimation

##### Content Upload
- **Upload Modal**: Drag-and-drop or file browser
- **File Types Supported**:
  - Videos: MP4, WebM, MOV
  - Documents: PDF
- **Progress Tracking**: Real-time upload progress
- **Asset Management**: View and manage all uploaded files

#### 2. Assessment Creation (Updated Design)

> [!IMPORTANT]
> **Design Change**: We've simplified the assessment creation process to align with the week-based course structure, removing the complex external platform integration.

##### Week-Based Assessment Creation

**Workflow**:
1. Add "Assessment" lesson type to any week
2. Configure assessment settings
3. Create questions directly in the platform
4. Questions are tied to specific week assessments

##### Assessment Configuration

**Basic Settings**:
- Assessment title and description
- Assessment type: Quiz, Exam, or Practice Test
- Time limit (optional)
- Maximum attempts allowed
- Passing score percentage
- Evaluation duration for manual grading

**Display Settings**:
- Shuffle questions (randomize order)
- Shuffle answer options
- Show results timing:
  - Immediately after submission
  - After all submissions
  - After due date
  - Never (manual review only)
- Show correct answers toggle

**Security & Proctoring**:
- Copy/paste restrictions
- Right-click menu blocking
- Print blocking
- Developer tools blocking
- Tab switch limits
- Security level indicator (Flexible/Moderate/Strict)

##### Question Creation

**Question Properties**:
- Question title and description
- Question type: Multiple Choice, True/False, Short Answer, Essay
- Difficulty level: Easy, Medium, Hard
- Marks/points value
- Time allocation per question
- Category, topic, and subtopic classification

**Answer Options** (for multiple choice):
- Add/remove options dynamically
- Mark correct answer(s)
- Rich text support for options

**Question Management**:
- Questions are stored within the assessment
- No external question bank integration
- Simple, straightforward question creation
- Questions tied to specific week assessments

#### 3. Properties Panel

**Dynamic Context Panel**:
- Shows details of selected week or lesson
- Edit week/lesson properties
- View lesson statistics
- Quick actions (delete, duplicate)

#### 4. Validation & Publishing

**Validation Rules**:
```typescript
{
  hasCourseTitle: boolean;
  hasDescription: boolean;
  hasAtLeastOneWeek: boolean;
  hasAtLeastOneLesson: boolean;
  hasAtLeastOneContent: boolean;
  hasThumbnail: boolean;
  hasCategory: boolean;
}
```

**Publishing Workflow**:
1. Save as Draft (auto-save + manual)
2. Validate course completeness
3. Publish course (makes visible to learners)
4. Archive course (hide from catalog)

#### 5. User Management

**Features**:
- Add/remove instructors
- Manage learner enrollments
- Role-based permissions
- Bulk user operations

#### 6. Reports & Analytics

**Available Reports**:
- Course enrollment statistics
- Learner progress tracking
- Assessment performance
- Completion rates
- Certificate issuance

---

## 🎓 Learner Portal

### Overview

The Learner Portal is where students browse courses, watch content, take assessments, and track their progress.

### Core Features

#### 1. Course Catalog

**Location**: `/courses`

- Browse all published courses
- Filter by category, level, language
- Search functionality
- Course cards with:
  - Thumbnail image
  - Title and subtitle
  - Instructor information
  - Duration and level
  - Enrollment status

#### 2. Course Player

**Location**: `/courses/[courseId]`

##### Video Player
- Custom video player with controls
- Playback speed adjustment
- Quality selection
- Fullscreen mode
- Progress tracking
- Resume from last position

##### PDF Viewer
- In-browser PDF rendering
- Zoom and navigation controls
- Download option
- Page bookmarking

##### Week Navigation
- Sidebar with week list
- Lesson completion checkmarks
- Locked/unlocked indicators
- Progress bar per week

#### 3. Assessment Taking

**Assessment Player**:
- Full-screen assessment mode
- Question navigation
- Timer display (if time-limited)
- Auto-save answers
- Submit confirmation

**Proctoring Features** (when enabled):
- Disable copy/paste
- Block right-click
- Prevent printing
- Block developer tools
- Track tab switches
- Warning notifications

**Results Display**:
- Score and percentage
- Correct/incorrect indicators
- Explanations (if enabled)
- Retry option (if attempts remaining)

#### 4. Dashboard

**Location**: `/dashboard`

**Widgets**:
- Enrolled courses
- In-progress courses
- Completed courses
- Upcoming assessments
- Recent activity
- Achievement badges

#### 5. Certificates

**Location**: `/certificates`

- View earned certificates
- Download as PDF
- Share on social media
- Certificate verification

#### 6. Profile Management

**Location**: `/profile`

- Personal information
- Avatar upload
- Email preferences
- Password change
- Learning preferences

---

## 📊 Data Models

### Course Structure

```typescript
interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  previewVideo?: string;
  category: string;
  tags: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  language: string;
  status: 'Draft' | 'Published' | 'Archived';
  instructors: CourseInstructor[];
  weeks: Week[];
  settings: CourseSettings;
  pricing?: CoursePricing;
  learningObjectives: string[];
  prerequisites: string[];
  targetAudience: string[];
  estimatedDuration: number; // total hours
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}
```

### Week Structure

```typescript
interface Week {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
  unlockDate?: Date;
  isLocked?: boolean;
}
```

### Lesson Structure

```typescript
interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: 'Video' | 'PDF' | 'Assessment';
  assets: Asset[];
  assessment?: AssessmentConfig; // Only for Assessment type
  duration?: number; // estimated duration in minutes
  order: number;
  isPreview?: boolean; // Can be viewed without enrollment
}
```

### Assessment Structure (Updated)

```typescript
interface AssessmentConfig {
  id: string;
  title: string;
  description?: string;
  type: 'quiz' | 'exam' | 'practice';
  
  // Timing
  timeLimit?: number; // in minutes, undefined for no limit
  evaluationDuration?: number; // minutes for manual evaluation
  
  // Attempts & Scoring
  maxAttempts: number;
  passingScore: number; // percentage
  
  // Display Options
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResults: 'immediately' | 'after-submission' | 'after-due-date' | 'never';
  showCorrectAnswers: boolean;
  
  // Security & Proctoring
  proctoring: {
    enabled: boolean;
    copyPasteAllowed: boolean;
    rightClickAllowed: boolean;
    printAllowed: boolean;
    devToolsAllowed: boolean;
    tabSwitchLimit?: number; // undefined for unlimited
  };
  
  // Questions (stored directly in assessment)
  questions: Question[];
  totalMarks: number;
  
  // Optional Features
  aiVoice?: string; // AI voice for reading questions
  ogImage?: string; // Social sharing image
}
```

### Question Structure

```typescript
interface Question {
  id: string;
  title: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  duration: number; // minutes
  category: string;
  topic: string;
  subtopic: string;
  description: string;
  options: AnswerOption[]; // For multiple-choice questions
  explanation?: string; // Shown after answering
}

interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}
```

### Asset Structure

```typescript
interface Asset {
  id: string;
  name: string;
  type: 'video' | 'pdf' | 'image';
  url?: string;
  size?: number;
  duration?: number; // for videos, in seconds
  uploadedAt?: Date;
}
```

---

## 📝 Assessment System

### Updated Design Philosophy

> [!NOTE]
> **Simplified Approach**: We've moved away from external platform integration to a simpler, more integrated approach where assessments are created directly within the platform and tied to specific weeks.

### Assessment Creation Workflow

1. **Add Assessment to Week**
   - Navigate to desired week in course builder
   - Click "Add Test" button
   - Assessment lesson is created

2. **Configure Assessment**
   - Click "Configure" on assessment lesson
   - Set basic configuration (title, type, time limit)
   - Configure security and proctoring settings
   - Set display and scoring options

3. **Create Questions**
   - Navigate to "Questions" tab
   - Click "Add Question"
   - Fill in question details
   - Add answer options (for multiple choice)
   - Mark correct answer(s)
   - Save question

4. **Review & Publish**
   - Review all questions
   - Check total marks calculation
   - Verify settings
   - Save assessment configuration

### Assessment Types

#### Quiz
- **Purpose**: Quick knowledge checks
- **Typical Settings**:
  - 10-20 questions
  - 15-30 minute time limit
  - Multiple attempts allowed
  - Immediate results
  - Flexible security

#### Exam
- **Purpose**: Formal evaluation
- **Typical Settings**:
  - 20-50 questions
  - 60-120 minute time limit
  - 1-2 attempts
  - Results after submission
  - Strict security/proctoring

#### Practice Test
- **Purpose**: Self-assessment and learning
- **Typical Settings**:
  - Unlimited questions
  - No time limit
  - Unlimited attempts
  - Immediate results with explanations
  - No proctoring

### Question Types

#### Multiple Choice
- Single correct answer
- 2-6 options
- Automatic grading
- Supports explanations

#### True/False
- Binary choice
- Automatic grading
- Quick assessment

#### Short Answer
- Text input (1-2 sentences)
- Manual or AI-assisted grading
- Keyword matching possible

#### Essay
- Long-form text response
- Manual grading required
- Rubric-based evaluation

### Proctoring Levels

#### Flexible (Default)
- All browser features allowed
- Unlimited tab switches
- Suitable for practice tests and low-stakes quizzes

#### Moderate
- Copy/paste allowed
- Right-click allowed
- Limited tab switches (3-5)
- Suitable for regular quizzes

#### Strict
- No copy/paste
- No right-click
- No printing
- No developer tools
- Limited tab switches (1-2)
- Suitable for exams and high-stakes assessments

---

## 🔌 Backend Integration Requirements

### API Endpoints Needed

#### Course Management

```
POST   /api/courses                    # Create course
GET    /api/courses                    # List courses
GET    /api/courses/:id                # Get course details
PUT    /api/courses/:id                # Update course
DELETE /api/courses/:id                # Delete course
POST   /api/courses/:id/publish        # Publish course
POST   /api/courses/:id/archive        # Archive course
```

#### Week Management

```
POST   /api/courses/:courseId/weeks           # Add week
PUT    /api/courses/:courseId/weeks/:weekId   # Update week
DELETE /api/courses/:courseId/weeks/:weekId   # Delete week
PUT    /api/courses/:courseId/weeks/reorder   # Reorder weeks
```

#### Lesson Management

```
POST   /api/weeks/:weekId/lessons             # Add lesson
PUT    /api/weeks/:weekId/lessons/:lessonId   # Update lesson
DELETE /api/weeks/:weekId/lessons/:lessonId   # Delete lesson
PUT    /api/weeks/:weekId/lessons/reorder     # Reorder lessons
```

#### Asset Upload

```
POST   /api/lessons/:lessonId/assets          # Upload asset
GET    /api/lessons/:lessonId/assets          # List assets
DELETE /api/assets/:assetId                   # Delete asset
GET    /api/assets/:assetId/url               # Get signed URL
```

#### Assessment Management

```
POST   /api/lessons/:lessonId/assessment      # Create/update assessment config
GET    /api/lessons/:lessonId/assessment      # Get assessment config
POST   /api/assessments/:assessmentId/questions  # Add question
PUT    /api/questions/:questionId             # Update question
DELETE /api/questions/:questionId             # Delete question
PUT    /api/assessments/:assessmentId/questions/reorder  # Reorder questions
```

#### Learner Progress

```
GET    /api/learners/:learnerId/courses       # Enrolled courses
POST   /api/learners/:learnerId/enroll        # Enroll in course
GET    /api/learners/:learnerId/progress      # Overall progress
PUT    /api/progress/:courseId/:lessonId      # Update lesson progress
POST   /api/progress/:courseId/:lessonId/complete  # Mark lesson complete
```

#### Assessment Attempts

```
POST   /api/assessments/:assessmentId/start  # Start assessment attempt
PUT    /api/attempts/:attemptId/answer       # Save answer
POST   /api/attempts/:attemptId/submit       # Submit assessment
GET    /api/attempts/:attemptId/results      # Get results
GET    /api/attempts/:attemptId/review       # Review attempt
```

#### Certificates

```
GET    /api/learners/:learnerId/certificates # List certificates
POST   /api/certificates/generate            # Generate certificate
GET    /api/certificates/:certificateId/pdf  # Download PDF
GET    /api/certificates/:certificateId/verify  # Verify certificate
```

#### Reports & Analytics

```
GET    /api/reports/courses/:courseId/enrollment  # Enrollment stats
GET    /api/reports/courses/:courseId/completion  # Completion rates
GET    /api/reports/assessments/:assessmentId/performance  # Assessment stats
GET    /api/reports/learners/:learnerId/activity  # Learner activity
```

### Database Schema Requirements

#### Tables Needed

1. **users** - User accounts (learners, instructors, admins)
2. **courses** - Course metadata
3. **weeks** - Week structure
4. **lessons** - Lesson details
5. **assets** - Uploaded files
6. **assessments** - Assessment configurations
7. **questions** - Assessment questions
8. **answer_options** - Multiple choice options
9. **enrollments** - Course enrollments
10. **lesson_progress** - Lesson completion tracking
11. **assessment_attempts** - Assessment attempt records
12. **attempt_answers** - Submitted answers
13. **certificates** - Issued certificates
14. **proctoring_logs** - Proctoring event logs

### File Storage

**Requirements**:
- Cloud storage (AWS S3, Google Cloud Storage, Azure Blob)
- CDN for video delivery
- Signed URLs for secure access
- Video transcoding pipeline
- Thumbnail generation

**File Organization**:
```
/courses/{courseId}/
  /weeks/{weekId}/
    /lessons/{lessonId}/
      /videos/
      /pdfs/
      /images/
```

### Authentication & Authorization

**Required Features**:
- JWT-based authentication
- Role-based access control (RBAC)
  - Admin: Full access
  - Instructor: Course management
  - Learner: Course consumption
- Session management
- Password reset flow
- Email verification

---

## 💻 Technology Stack

### Frontend

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Hooks + Context API
- **Form Handling**: React Hook Form (future)
- **Data Fetching**: SWR or React Query (future)

### UI Components

- **Component Library**: Custom components in `/components/ui`
- **Icons**: Heroicons (SVG)
- **Animations**: CSS transitions + Framer Motion (future)

### Current State

- **Data Persistence**: localStorage (temporary)
- **Authentication**: Mock authentication
- **File Upload**: Simulated upload

### Future Backend Stack (Recommendations)

- **API**: Node.js + Express or Next.js API Routes
- **Database**: PostgreSQL or MongoDB
- **File Storage**: AWS S3 or similar
- **CDN**: CloudFront or Cloudflare
- **Authentication**: NextAuth.js or Auth0
- **Video Processing**: AWS MediaConvert or Cloudinary

---

## 🎨 Design System

### Brand Colors

```css
--primary-navy: #0F3B5F;      /* Main brand color */
--gold-accent: #D4AF37;       /* Highlights and badges */
--light-bg: #F8F9FA;          /* Page background */
--dark-text: #1A2332;         /* Headings */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--success: #10B981;
--error: #EF4444;
--warning: #F59E0B;
```

### Typography

- **Headings**: System font stack
- **Body**: System font stack
- **Code**: Monospace

### Component Variants

#### Buttons
- `primary` - Navy background
- `secondary` - Gold background
- `outline` - Border only
- `ghost` - No background

#### Badges
- `video` - Blue
- `pdf` - Red
- `assessment` - Purple
- `draft` - Gray
- `published` - Green

---

## 📱 Responsive Design

### Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Layout Strategy

- **Desktop**: Sidebar navigation + main content
- **Tablet**: Collapsible sidebar
- **Mobile**: Bottom navigation + hamburger menu

---

## 🔐 Security Considerations

### Frontend Security

- Input validation and sanitization
- XSS prevention
- CSRF protection (when backend integrated)
- Secure file upload validation
- Content Security Policy headers

### Assessment Security

- Proctoring features (configurable)
- Tab switch detection
- Copy/paste prevention
- Right-click blocking
- Developer tools detection
- Time-based session tokens

---

## 🚀 Future Enhancements

### Planned Features

1. **Live Classes**: Real-time video sessions
2. **Discussion Forums**: Course-specific forums
3. **Peer Review**: Student peer assessment
4. **Gamification**: Badges, leaderboards, streaks
5. **Mobile Apps**: iOS and Android native apps
6. **Offline Mode**: Download content for offline viewing
7. **AI Features**:
   - Auto-generated quizzes
   - Personalized learning paths
   - Chatbot tutor
8. **Advanced Analytics**:
   - Learning analytics dashboard
   - Predictive performance modeling
   - Engagement heatmaps

---

## 📞 Support & Maintenance

### Development Guidelines

- Follow TypeScript strict mode
- Use ESLint and Prettier
- Write component documentation
- Maintain type definitions
- Test before committing

### Deployment

- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Production**: `npm start`

---

## 📄 License

© 2026 Virtual Film Office Academy. All rights reserved.

---

## 📧 Contact

For technical questions or support:
- **Email**: dev@virtualfilmoffice.com
- **Documentation**: [Internal Wiki]
- **Issue Tracker**: [GitHub/Jira]
