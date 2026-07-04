# User Persona Audits: Identifying Points of Friction & Disappointment

This audit evaluates the SLS Consultants website from three distinct user perspectives: **The Industrial EPC Client**, **The Senior Web Engineer**, and **The Non-Technical Layperson**.

---

## 1. The Potential Client (Industrial Plant Owner / EPC Manager)
*A high-value decision-maker who values credibility, engineering codes (ASME/API), regulatory compliance (EIL audits), and structural safety.*

### 🔍 Moments of Disappointment:

*   **"Simulated" PDF Case Study Downloads:**
    *   **The Scenario:** The client opens the premium *Projects Detail Modal*, sees the button **"Download Case Study PDF,"** and clicks it expecting a printable datasheet to show their engineering board.
    *   **The Friction:** Instead of a PDF download, they get a browser popup alert: `Simulating PDF download: Case Study for "ASME Heat Exchanger..."`. 
    *   **The Disappointment:** To a high-value industrial client, a simulated alert box instantly signals that the website is a mockup, severely damaging the company's credibility and professional image.
*   **Empty Mapped Services:**
    *   **The Scenario:** The client clicks "Book Service" on *Municipality Relation Services* or *Software & AI Solutions*. 
    *   **The Friction:** The confirmation step tells them there are "0 recently delivered case studies" matching this service.
    *   **The Disappointment:** Seeing "0 Projects" makes the service look like an empty offering, causing them to doubt the company's regulatory liaison or automation capabilities.
*   **Confidentiality & Copyright Concerns:**
    *   **The Scenario:** A plant manager reviews detailed CAD elevation drawings on the Gallery page.
    *   **The Friction:** They notice drawings from major refineries (e.g., EIL/Bina/Kochi specs) are displayed without any explicit "Authorized for Public Release" watermark or notice.
    *   **The Disappointment:** Because proprietary data is highly protected in EPC contracts, they worry their own designs might be published online without consent.

---

## 2. The Senior Software/Web Builder Client
*An experienced developer who audits performance, responsive design, bundle sizes, accessibility (a11y), and semantic DOM structure.*

### 🔍 Moments of Disappointment:

*   **Monolithic JS Bundle Size (No Code Splitting):**
    *   **The Scenario:** They inspect the build output or network waterfall chart on load.
    *   **The Friction:** They notice a single minified bundle: `index-B4njUirq.js` weighing in at **1.15 MB** (with Three.js, Lucide, and Framer Motion loaded on the home page).
    *   **The Disappointment:** The lack of lazy-loading (e.g. `React.lazy` / dynamic imports for the heavy Three.js viewer) causes slow initial loading on weak mobile connections, lowering search index rankings.
*   **Three.js Canvas Instantiation Re-Mounts:**
    *   **The Scenario:** They switch back and forth between the "Interactive 3D CAD Models" tab and the "Design Drawings" tab.
    *   **The Friction:** Every time they click the 3D tab, the entire Three.js scene, textures, and geometry re-instantiate from scratch, causing a brief layout flash and repeating the camera lerp animation.
    *   **The Disappointment:** They expect canvas caching, state preservation, or a single persistent renderer instance to keep transitions instant.
*   **File Upload State Blocking:**
    *   **The Scenario:** They try to attach a 14MB CAD drawing zip file to the contact form and click submit.
    *   **The Friction:** The submit button doesn't show a progress percentage or upload speed bar.
    *   **The Disappointment:** For heavy files (up to 15MB), senior builders expect progress bars. A lack of loading status makes them think the browser is frozen.
*   **WCAG Contrast & Font Readability Warnings:**
    *   **The Scenario:** They review the 3D model toolbar overlays and the stats footer on a laptop.
    *   **The Friction:** Tiny text labels (like `text-[8px] uppercase tracking-wider text-white/35` in the legend) have poor color contrast against dynamic light and dark model backgrounds.
    *   **The Disappointment:** Fails basic WCAG AA accessibility audits for low-vision users.

---

## 3. The Non-Technical Person
*A standard web visitor who expects buttons to just work, navigation to be idiot-proof, and mobile gestures to behave normally.*

### 🔍 Moments of Disappointment:

*   **The Mobile Scroll Trap (WebGL Canvas Hijack):**
    *   **The Scenario:** They browse the website on a mobile phone, open the 3D Models page, and scroll down to read the project overview text.
    *   **The Friction:** They place their thumb in the middle of the screen to swipe down. However, the screen doesn't scroll—instead, it spins the 3D stack because their touch was captured by the WebGL canvas.
    *   **The Disappointment:** They feel "stuck" or think the page is broken. Without a clear text boundary or indicator instructing them to scroll using the page margin, they exit in frustration.
*   **Calendly Popup Script Blocks:**
    *   **The Scenario:** A client clicks "Book a Call" on a device running a script-blocker or high-privacy browser.
    *   **The Friction:** The custom `initPopupWidget` Calendly iframe script fails to load, and the button does not respond at all.
    *   **The Disappointment:** Because there is no visible loading indicator or immediate redirection link, they think the booking system is down.
*   **Form Submission Feedback Silence:**
    *   **The Scenario:** They complete the form and click "Request My Free Consultation".
    *   **The Friction:** On a slow cellular connection, there is no loading spinner on the button. 
    *   **The Disappointment:** They click the button three times in rapid succession, resulting in duplicate API submissions because the submit button is not disabled during the request.
