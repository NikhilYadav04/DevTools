# 🔧 DevTools – AI-Powered Link Checker & Fixer for Developers

**DevTools** is a smart, developer-focused platform that scans websites for broken links, categorizes them as internal or external, and suggests AI-generated fixes using Gemini. With an intuitive dashboard, scheduled scans, and email reports, DevTools streamlines website maintenance and SEO optimization. It's a one-stop tool for ensuring link integrity across growing websites.

---

## ⚙️ Functionality Overview

### 1. 🔐 User Authentication
- Register/login using email and password
- Passwords encrypted using `bcryptjs`
- JWT-based session management

### 2. 🌐 URL Submission & Scan Configuration
- Input website URL
- Choose how many pages/links to crawl
- Select to scan internal, external, or both link types

### 3. 🕷️ Python-Based Web Crawler
- Crawls up to the defined limit
- Checks each link’s status code
- Classifies links into:
  - ✅ Working
  - ❌ Broken
  - 🌐 External
  - 🏠 Internal

### 4. 📊 Visual Dashboard
- Displays results with:
  - Bar charts (working vs broken)
  - Pie charts (internal vs external)
- Expandable lists of categorized links

### 5. 🤖 Gemini AI Link Restoration
- Select broken links and send to Gemini
- Receives fixed/recommended alternatives
- Manual review and apply option

### 6. 📅 Scheduled Crawls
- Set daily/weekly/monthly scans
- Email report with summary and visual results

---

## 🧰 Tech Stack

### Frontend: `React.js`  
### Backend: `Node.js + Express`  
### Link Crawler: `Python`  
### Database: `MongoDB`  
### Email & Scheduling: `Node-Cron`, `Nodemailer`  
### AI: `Gemini AI API`  

---

## 📦 Dependencies

| Category              | Packages |
|-----------------------|----------|
| AI                   | `@google/genai` |
| HTTP & APIs          | `axios`, `cors`, `dotenv` |
| Auth                 | `bcryptjs`, `jsonwebtoken`, `joi` |
| Backend              | `express`, `nodemon` |
| Database             | `mongoose` |
| Scheduler            | `node-cron` |
| Email Notifications  | `nodemailer` |

---

## 🗂 Folder Structure

```
project-root/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── crawler/                # Python crawler
└── README.md
```

---

## 🧪 Example Workflow

1. User logs in  
2. Inputs a site URL and scan settings  
3. Starts scan → crawler runs  
4. Dashboard displays categorized link results  
5. Broken links can be selected and fixed via Gemini AI  
6. User schedules future checks → gets periodic reports via email  

---

## 📈 Future Plans

- 🧩 **Browser Extension**: Develop a Chrome/Edge extension to scan the current page in real-time and highlight broken links directly in the browser.
- 🔐 OAuth integration (Google/GitHub login support)
- 🔔 Slack/Discord notifications for scan reports
- 📤 Export reports in CSV or PDF formats
- 🔁 Auto-fix broken links via CMS (WordPress, Ghost, etc.) integration
- 🧠 Add AI-powered SEO metadata audit (titles, descriptions, keywords)