# 🎯 AI IDE App Planning & Execution Protocol (2025)

*AI IDE App Planning & Execution Protocol (2025 Edition, Full Detail)*

This protocol defines the **complete sequence** for building a new feature or app using an AI IDE and human review loop. It incorporates:

- Planning phases that maximize clarity and minimize confusion
- Enforcement of `IDE Rules and Guardrails 2025`
- Context refresh, file structure hygiene, and task QA
- Simplicity-first principles and capital-letter alerts for feature creep

---

## 🎯 Overview

Planning is broken into 3 required phases before any task execution:

1. **Architecture Planning** — What we're building, why, and how it works.
2. **UX Design Planning** — What it looks and feels like to use.
3. **Technical Spec Planning** — How exactly we'll build it.

Each uses a **role prompt**, **clarifying questions**, and **structured markdown output** to avoid ambiguity.

---

## 1️⃣ Architecture Planning

### 🎯 Goal:
Clarify the product before code begins. Define users, value, features, systems, and post-MVP scope.

### 🎬 Prompt Format:
> **Role:** "You are a senior software engineer. We are brainstorming the structure of a new project."
> Ask and answer:
> - What are we building?
> - Who is it for?
> - Why is it valuable?
> - How is it different?

### ✅ Response Output:
```md
## MVP Flow
<step-by-step experience as the user>

## Feature Breakdown
For each feature:
- Name
- Summary
- Core Requirements
- Tech Stack
- Implementation Notes

## Post-MVP Features
Same breakdown

## System Diagram
Textual description of services, frontend, backend, APIs

## Clarifying Questions
Unclear parts, unknowns

## Guardrails
Warnings, simplicity enforcement, scaling concerns, infra notes
```

💾 **Save to** `/planning/01_architecture.md`

---

## 2️⃣ UX Design Planning

### 🎯 Goal:
Previsualize every state of every screen. Define user states, interactivity, logic, and element behaviors.

### 🎬 Prompt Format:
**Role:** "You are a senior SaaS product designer. Your job is to define screens and UI logic."

**Instructions:**
- Go **feature by feature**
- Then go **screen by screen**
- Then define **3–5 UI states** for each screen

### 🎯 Design Principles:
- Progressive Disclosure
- State Feedback (success/fail/loading)
- Physics-Based Motion
- Content-First Layouts
- Visual Hierarchy
- Accessibility Defaults

### ✅ Response Output:

## Feature: [Name]

### Screen: [e.g. Recipe List]
- Blank state:
  - [description of layout + content]
- Loaded state:
  - [what's visible]
- Loading state:
  - [what user sees]
- Edit/Delete/Error states:
  - [details]
- Interaction notes:
  - [animations, transitions, feedback]

### 🔐 States & Rights:
Ask the human:
- What roles exist (guest, free, premium, admin)?
- Which screens are visible to which roles?
- Which buttons and actions are restricted?

### 🎯 Functionalities:
For each screen, document:
- All interaction elements (buttons, inputs, sliders)
- What function or DB/API call each triggers
- In which state(s) each element is active
- Where each interaction redirects, and with what context/cache/state

**Wireframes:**
- Create for each screen and state a wireframe for human to review

💾 **Save to** `/planning/02_ux_design.md`

---

## 3️⃣ Technical Spec Planning

### 🎯 Goal:
Fully map the implementation before any code is written. Structure only — not execution.

### 🎬 Prompt Format:
**Role:** "You are a senior engineer writing detailed implementation specs."

**Instructions:**
- Do not generate real code
- Use pseudocode **only** when essential
- Be explicit and exhaustive

### ✅ Response Output:

## Project File Structure

### Frontend Repo
- /screens/
- /components/
- /lib/
- /constants/
- /types/

### Backend Repo
- /services/
- /auth/
- /uploads/
- /recipe-generator/
...

## Feature: [Authentication]

### Goal
Short description of purpose

### API Relationships
- Supabase Auth API
- User DB Service
- Email Service
- Stripe (optional)

### Detailed Requirements
- Email/password signup
- Session persistence
- Forgot/reset flow
...

### Implementation Guide
- Architecture Fit
- DB Schema (e.g., users, preferences)
- Migrations
- Endpoints (e.g., POST /login)
- Frontend Components (e.g., LoginForm.tsx)
- Security Notes (e.g., JWT, XSS)
- Edge Cases (e.g., invalid token, blocked user)

💾 **Save to** `/planning/03_technical_spec.md`

---

## 📋 Post-Planning Options

You can now:
- Generate a PRD
- Generate a Task List
- Run a Mock Execution
- Trigger real development

---

## 🛡️ Global Enforcement (Applied Throughout)

### ✅ Simplicity Enforcement
- No overly complex flows, referrals, or convoluted data pipes.
- Every decision must be understandable by a **non-technical product manager**.

### ✅ Codebase Hygiene
- No saving files outside proper folders (`/components`, `/services`, `/screens`)
- No junk files, test debris, or TODOs in commits
- Follow project structure strictly

### 🚨 Feature Creep Detection

If any unspec'd feature or flow is generated:
- AI IDE must write:
**"UNSPECIFIED FEATURE DETECTED: [FEATURE NAME]"**
- AI must ask:
"Should I update the PRD/task list to include this, or remove it?"

---

## 🏁 Next Phases (Summary)

Continue with:
- **PRD Generation** → `/tasks/prd-[feature].md`
- **Task Breakdown** → `/tasks/tasks-[feature].md`
- **Mock Execution Review** → `/review/mock-review.md`
- **Task Revision** → update tasks after review
- **Task Execution** → sub-task by sub-task, with `git commit`
- **Code Review** → `/review/review-[task-id].md`

Every step must reference the outputs of `/planning/*.md`.

---