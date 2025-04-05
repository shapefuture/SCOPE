# Technical Requirements Document: ScopeGrab Universal Video Downloader (Stealth Focus)

**Table of Contents**

1.  [Introduction](#1-introduction)
    *   1.1. [Purpose](#11-purpose)
    *   1.2. [Project Goal](#12-project-goal)
    *   1.3. [Target Audience](#13-target-audience)
    *   1.4. [Scope](#14-scope)
        *   1.4.1. [In Scope](#141-in-scope)
        *   1.4.2. [Out of Scope (Version 1.0)](#142-out-of-scope-version-10)
    *   1.5. [Definitions & Glossary](#15-definitions--glossary)
    *   **[NEW]** 1.6. [Stealth Philosophy](#16-stealth-philosophy)
2.  [Functional Requirements (FR)](#2-functional-requirements-fr)
    *   FR-01: [Core Browsing Environment (User Agent Spoofing)](#fr-01-core-browsing-environment-user-agent-spoofing)
    *   FR-02: [Website Authentication Handling](#fr-02-website-authentication-handling)
    *   FR-03: [Video Player Detection & Manual Trigger (Minimized Footprint)](#fr-03-video-player-detection--manual-trigger-minimized-footprint)
    *   FR-04: [Contextual & Persistent Download UI (External Control Panel)](#fr-04-contextual--persistent-download-ui-external-control-panel)
    *   FR-05: [Pre-Download Data Extraction](#fr-05-pre-download-data-extraction)
    *   FR-06: [Multi-Stage Background Download & Capture Workflow (Simulating Browser Network Activity)](#fr-06-multi-stage-background-download--capture-workflow-simulating-browser-network-activity)
        *   FR-06.1: [Stage 1: Primary Download Attempt (`yt-dlp` - Mimicking Browser)](#fr-061-stage-1-primary-download-attempt-yt-dlp---mimicking-browser)
        *   FR-06.2: [Stage 2: Fallback Download Attempt (`yt-dlp` - Variations)](#fr-062-stage-2-fallback-download-attempt-yt-dlp---variations)
        *   FR-06.3: [Stage 3: Fallback Download Attempt (Direct HLS/DASH - *Experimental*)](#fr-063-stage-3-fallback-download-attempt-direct-hlsdash---experimental)
        *   FR-06.4: [Stage 4: Last Resort - Screen Recording Option (User Initiated)](#fr-064-stage-4-last-resort---screen-recording-option-user-initiated)
        *   FR-06.5: [Screen Recording Implementation](#fr-065-screen-recording-implementation)
        *   FR-06.6: [Background Download Persistence](#fr-066-background-download-persistence)
    *   FR-07: [Progress, Status, and Feedback Display (External UI Focus)](#fr-07-progress-status-and-feedback-display-external-ui-focus)
    *   FR-08: [File Saving and Management](#fr-08-file-saving-and-management)
    *   FR-09: [Comprehensive Error Handling and Reporting](#fr-09-comprehensive-error-handling-and-reporting)
    *   FR-10: [Basic Application Controls](#fr-10-basic-application-controls)
    *   FR-11: [Download Management Interface (External UI Focus)](#fr-11-download-management-interface-external-ui-focus)
3.  [Non-Functional Requirements (NFR)](#3-non-functional-requirements-nfr)
    *   NFR-01: [Performance & Responsiveness](#nfr-01-performance--responsiveness)
    *   NFR-02: [Usability & User Experience (UX)](#nfr-02-usability--user-experience-ux)
    *   NFR-03: [Reliability & Robustness](#nfr-03-reliability--robustness)
    *   NFR-04: [Security](#nfr-04-security)
    *   **[NEW]** NFR-04.1: [Detection Evasion (Stealth)](#nfr-041-detection-evasion-stealth)
    *   NFR-05: [Maintainability & Code Quality](#nfr-05-maintainability--code-quality)
    *   NFR-06: [Compatibility](#nfr-06-compatibility)
    *   NFR-07: [Resource Consumption](#nfr-07-resource-consumption)
4.  [System Architecture](#4-system-architecture)
    *   4.1. [Core Framework](#41-core-framework)
    *   4.2. [Process Model](#42-process-model)
    *   4.3. [Key Architectural Components](#43-key-architectural-components)
    *   4.4. [Inter-Process Communication (IPC)](#44-inter-process-communication-ipc)
    *   4.5. [Technology Stack](#45-technology-stack)
    *   **[NEW]** 4.6. [Stealth Implementation Strategy](#46-stealth-implementation-strategy)
5.  [Data Requirements](#5-data-requirements)
    *   5.1. [Session Data (Cookies, Cache)](#51-session-data-cookies-cache)
    *   5.2. [Application Configuration (User Agent)](#52-application-configuration-user-agent)
    *   5.3. [Downloaded Media Files](#53-downloaded-media-files)
    *   5.4. [Active Download State](#54-active-download-state)
6.  [User Interface (UI) / User Experience (UX) Design Principles](#6-user-interface-ui--user-experience-ux-design-principles)
    *   6.1. [Layout and Navigation](#61-layout-and-navigation)
    *   6.2. [Visual Feedback](#62-visual-feedback)
    *   6.3. [Workflow Presentation](#63-workflow-presentation)
    *   6.4. [Cross-Platform Consistency](#64-cross-platform-consistency)
    *   6.5. [Download Management Visibility](#65-download-management-visibility)
    *   **[NEW]** 6.6. [UI Decoupling](#66-ui-decoupling)
7.  [Security Design Considerations](#7-security-design-considerations)
    *   7.1. [Authentication & Session Management](#71-authentication--session-management)
    *   7.2. [Filesystem Access](#72-filesystem-access)
    *   7.3. [Screen Recording Permissions](#73-screen-recording-permissions)
    *   7.4. [Dependency Management](#74-dependency-management)
    *   7.5. [Electron Security Best Practices](#75-electron-security-best-practices)
    *   **[NEW]** 7.6. [Anti-Detection Measures](#76-anti-detection-measures)
8.  [Deployment and Build Process](#8-deployment-and-build-process)
    *   8.1. [Build Tooling](#81-build-tooling)
    *   8.2. [Target Platforms & Architectures](#82-target-platforms--architectures)
    *   8.3. [Packaging Formats](#83-packaging-formats)
    *   8.4. [Code Signing & Notarization](#84-code-signing--notarization)
9.  [Dependencies](#9-dependencies)
    *   9.1. [Core Dependencies](#91-core-dependencies)
    *   9.2. [Bundled Executables](#92-bundled-executables)
    *   9.3. [Key Node.js Modules (Anticipated)](#93-key-nodejs-modules-anticipated)
    *   9.4. [Build Dependencies](#94-build-dependencies)
10. [Future Considerations (Post V1.0)](#10-future-considerations-post-v10)

---

## 1. Introduction

### 1.1. Purpose
This document details the technical requirements for the "ScopeGrab" Universal Video Downloader, focusing on user-friendliness, background downloading, broad compatibility, and **measures to minimize detection by websites**, aiming to appear as standard browser activity.

### 1.2. Project Goal
To deliver a secure, reliable, cross-platform Electron application allowing users to browse authenticated websites and download videos via a background-capable, multi-stage process, while **actively working to emulate standard browser behavior** to reduce the likelihood of being blocked or identified as a specialized tool.

### 1.3. Target Audience
Users needing to download web videos (including Kinescope) from authenticated sites, who require a tool that **blends in with normal browser traffic** and continues downloads after navigation. Assumes legitimate access rights.

### 1.4. Scope

#### 1.4.1. In Scope
*   Chromium-based browsing via Electron (`BrowserView`).
*   Standard web authentication handling.
*   **[MODIFIED]** *Minimized* automatic detection of specific players (Kinescope); focus shifts towards manual trigger.
*   Manual trigger for download analysis on the *current page URL*.
*   **[MODIFIED]** Contextual download UI elements presented in the *application shell*, not injected into web content.
*   Persistent UI element for manual page analysis/download.
*   Extraction of Target URL, Referer URL, and HTTP Cookies.
*   Multi-stage download process using bundled `yt-dlp`.
*   *(Experimental)* Direct HLS/DASH fallback.
*   Last-resort screen recording option.
*   **[MODIFIED]** Background downloads (via `yt-dlp`/direct fetch) that persist after `BrowserView` navigation and **emulate browser network patterns where possible**.
*   Real-time progress/status display in a dedicated management interface.
*   Download management interface for background jobs.
*   User-prompted file saving.
*   Saving final video file locally.
*   Robust error handling.
*   Basic browser navigation controls.
*   **[NEW]** Configurable User-Agent string for browsing and download requests.
*   **[NEW]** Use of standard browser-like HTTP headers in direct fetching attempts.
*   Cross-platform builds (Win/Mac).

#### 1.4.2. Out of Scope (Version 1.0)
*   Guaranteed undetectability (sophisticated anti-bot/fingerprinting can still pose challenges).
*   Bypassing enterprise-grade DRM or advanced anti-bot measures (Cloudflare Turnstile, etc.).
*   Advanced browser features, mobile support, download queueing/pause/resume/cancel, advanced format selection, advanced recording, auto-updates, persistent history/settings, Linux support.
*   Automated solving of CAPTCHAs.
*   Proxy rotation or advanced IP management.

### 1.5. Definitions & Glossary
*   *(Existing definitions)*
*   **User-Agent:** HTTP header identifying the client software (browser).
*   **Fingerprinting:** Techniques used by websites to identify unique browser/system characteristics.
*   **Stealth:** Measures taken to make the application's network activity resemble that of a standard web browser.

### **[NEW]** 1.6. Stealth Philosophy
The primary goal is **not** guaranteed evasion of all detection, but rather **reducing the obvious markers** that identify ScopeGrab as an automated tool. This involves mimicking standard browser identifiers (User-Agent), using appropriate Referers/Cookies, and avoiding injecting easily detectable scripts or UI elements directly into web pages. The download activity itself (high bandwidth over time) can still be anomalous, but the *initiation* and *request patterns* should aim for normalcy. **Screen recording remains detectable if the website employs specific countermeasures against it.**

## 2. Functional Requirements (FR)

### FR-01: Core Browsing Environment (User Agent Spoofing)
*   **FR-01.1:** Utilize Electron `BrowserView` for web content rendering.
*   **FR-01.2:** Provide standard navigation controls.
*   **FR-01.3:** Navigation controls manipulate `BrowserView`.
*   **FR-01.4:** **[NEW]** The application shall allow the user to select or configure a standard, up-to-date browser User-Agent string (e.g., latest Chrome, Firefox, Edge on Win/Mac).
*   **FR-01.5:** **[NEW]** This selected User-Agent string **must** be applied to:
    *   All HTTP requests made by the `BrowserView` itself (`session.setUserAgent`).
    *   All HTTP requests made by the `yt-dlp` download process (`--user-agent` argument).
    *   All HTTP requests made during direct fetching attempts (Fallback Stage 3) via `electron.net`.

### FR-02: Website Authentication Handling
*   *(No changes)* Standard login form/cookie support via `BrowserView` and `session`. Ephemeral session.

### FR-03: Video Player Detection & Manual Trigger (Minimized Footprint)
*   **FR-03.1:** Main process monitors `BrowserView` navigation.
*   **FR-03.2:** **[MODIFIED]** Upon load, *optionally* and *minimally* inject script to detect *only highly specific, known selectors* (like Kinescope iframe) if automatic detection is enabled. This script **must be lightweight and avoid easily fingerprintable techniques**. Consider making auto-detect optional/disabled by default.
*   **FR-03.3:** Detection results returned to Main process.
*   **FR-03.4:** A persistent, primary UI element allows manual trigger for download analysis of the *current page URL*. **This is the preferred interaction model for stealth.**

### FR-04: Contextual & Persistent Download UI (External Control Panel)
*   **FR-04.1:** **[MODIFIED]** A dedicated Download Control Panel resides *strictly* within the application shell UI (Renderer), **never injected into the web page**.
*   **FR-04.2:** Panel contains:
    *   Primary button: "Analyze/Download Current Page" (manual trigger).
    *   *Conditional* section (if auto-detect enabled & successful): Buttons for specifically detected players.
    *   Status/progress display area.
*   **FR-04.3:** Detected player buttons update based on navigation *only if* auto-detect is active. Manual button is always present.

### FR-05: Pre-Download Data Extraction
*   *(No changes)* Upon user action (manual or detected), Renderer signals Main. Main retrieves Target URL (detected src or current page URL), Referer (current page URL), and relevant Cookies from the `BrowserView` session.

### FR-06: Multi-Stage Background Download & Capture Workflow (Simulating Browser Network Activity)
*   **FR-06.1: Stage 1: Primary Download Attempt (`yt-dlp` - Mimicking Browser)**
    *   a) Trigger: User initiates download. Job ID assigned.
    *   b) Action: Main process spawns `yt-dlp`.
    *   c) `yt-dlp` Arguments: **[MODIFIED]** Include Target URL, `--referer` (FR-05.2), `--cookies-from-browser` or `--cookies` (FR-05.2), **`--user-agent` (FR-01.5)**, standard output/format/progress args. Use appropriate format selection based on trigger type (manual vs. detected Kinescope).
    *   d) Monitoring: Track Job ID, parse progress, watch exit code. Update Manager (FR-11) / Status (FR-07).
    *   e) Success: Proceed to FR-08.
    *   f) Failure: Analyze error. Proceed to Stage 2 if recoverable. Offer Stage 4 if DRM/critical. Update UI/Manager.
*   **FR-06.2: Stage 2: Fallback Download Attempt (`yt-dlp` - Variations)**
    *   a) Trigger: Stage 1 fails recoverably.
    *   b) Action: Main spawns second `yt-dlp` instance for Job ID.
    *   c) `yt-dlp` Arguments: **[MODIFIED]** Similar to Stage 1 (including User-Agent, Cookies, Referer), but vary format selection or other potentially problematic flags based on Stage 1 error analysis.
    *   d) Monitoring: Same as Stage 1.
    *   e) Success: Proceed to FR-08.
    *   f) Failure: Offer Stage 3 (if implemented) or Stage 4. Update UI/Manager.
*   **FR-06.3: Stage 3: Fallback Download Attempt (Direct HLS/DASH - *Experimental*)**
    *   a) Trigger: Stage 2 fails, feature enabled.
    *   b) Action: Main process attempts direct fetch/parse/decrypt/mux for Job ID.
    *   c) **[MODIFIED]** Network Requests: All requests made via `electron.net` **must** include the correct User-Agent (FR-01.5), Referer (FR-05.2), and Cookies (FR-05.2) headers to mimic browser behavior. Standard Accept/Accept-Language headers should also be considered.
    *   d) Monitoring: Track internal state for Job ID.
    *   e) Success: Proceed to FR-08.
    *   f) Failure: Offer Stage 4. Update UI/Manager.
*   **FR-06.4: Stage 4: Last Resort - Screen Recording Option (User Initiated)**
    *   *(No fundamental changes)* Triggered by download failure or explicit user choice. Button appears in external UI panel.
*   **FR-06.5: Screen Recording Implementation**
    *   *(No fundamental changes)* Use `desktopCapturer`, `getUserMedia`, `MediaRecorder`. Request permissions only when initiated. Save via FR-08. Recording is a foreground activity relative to the capture source.
*   **FR-06.6: Background Download Persistence**
    *   *(No fundamental changes)* Download jobs (Stages 1-3) initiated by Main process continue independently of `BrowserView` navigation. App closure terminates downloads (v1.0).

### FR-07: Progress, Status, and Feedback Display (External UI Focus)
*   **FR-07.1:** Download Control Panel UI shows *contextual* status related to the *current page action*.
*   **FR-07.2:** Download Management Interface (FR-11) displays detailed real-time status/progress for *all background download jobs*.
*   **FR-07.3:** Status examples reflect job progress/stage/errors.
*   **FR-07.4:** Progress bars update based on parsed data or internal tracking in the manager.
*   **FR-07.5:** Recording status displayed prominently in main UI during active recording.

### FR-08: File Saving and Management
*   *(No fundamental changes)* Upon success (any stage), determine filename, prompt user via native "Save File" dialog, move/write file. Update job status in manager. Offer "Show File".

### FR-09: Comprehensive Error Handling and Reporting
*   *(No fundamental changes)* Handle errors gracefully. Parse `yt-dlp` output. Display user-friendly errors contextually (main panel or manager). Implement detailed file logging.

### FR-10: Basic Application Controls
*   *(No fundamental changes)* Standard window controls. Basic menu (Quit, About, Toggle Download Manager). Prompt on close if downloads active.

### FR-11: Download Management Interface (External UI Focus)
*   **FR-11.1:** Dedicated UI section (panel/view) displays status of all active/recent *background* download jobs (Stages 1-3) for the session.
*   **FR-11.2:** Display Job ID/Target, Status, Progress Bar, Actions ("Show File").
*   **FR-11.3:** Allows monitoring independently of the `BrowserView`.
*   **FR-11.4:** Allow clearing finished jobs from the list.

## 3. Non-Functional Requirements (NFR)

### NFR-01: Performance & Responsiveness
*   *(No changes)* Responsive UI, efficient background processing, reasonable startup, optimized recording.

### NFR-02: Usability & User Experience (UX)
*   *(No changes)* Intuitive interface, clear feedback, predictable workflow, easy access to download manager.

### NFR-03: Reliability & Robustness
*   *(No changes)* Resilient detection (if used), reliable background persistence, robust error handling.

### NFR-04: Security
*   *(See Section 7)* No credential storage, explicit recording consent, limited filesystem access, dependency updates, Electron best practices.

### **[NEW]** NFR-04.1: Detection Evasion (Stealth)
*   **NFR-04.1.1:** Application network requests (BrowserView, `yt-dlp`, direct fetch) must use a standard, configurable User-Agent string matching a common browser.
*   **NFR-04.1.2:** Automatic player detection scripts (if enabled) must be minimal and avoid techniques easily identifiable by anti-bot systems (e.g., unusual DOM traversal patterns, accessing fingerprintable browser APIs beyond necessity).
*   **NFR-04.1.3:** No UI elements or scripts should be injected directly into the web page content of the `BrowserView`. All ScopeGrab UI is external within the app shell.
*   **NFR-04.1.4:** Direct fetching (Stage 3) should include standard browser-like HTTP headers (Accept, Accept-Language) in addition to User-Agent, Cookies, and Referer.
*   **NFR-04.1.5:** Acknowledge that sophisticated fingerprinting or behavioral analysis by websites may still detect automation; the goal is to pass basic checks.

### NFR-05: Maintainability & Code Quality
*   *(No changes)* Modular code, standards, comments, config, easy updates.

### NFR-06: Compatibility
*   *(No changes)* Win 10+/macOS 10.15+.

### NFR-07: Resource Consumption
*   *(No changes)* Typical Electron idle use, scales with download/recording activity. Manage background processes efficiently.

## 4. System Architecture

### 4.1. Core Framework
*   Electron.

### 4.2. Process Model
*   Main (Node.js), Renderer (Chromium UI), `BrowserView` Content (Isolated Web).

### 4.3. Key Architectural Components
*   `BrowserManager` (Main)
*   `DetectionService` (Main - optional/minimal)
*   `UIManager` (Renderer)
*   `DownloadManager` (Main - tracks background jobs)
*   `DownloadWorkflow` (Main - orchestrates single job stages)
*   `YtDlpRunner` (Main - includes User-Agent/Cookie args)
*   `RecordingService` (Main/Renderer)
*   `IPCService` (Main/Renderer)
*   `FileManager` (Main)
*   **[NEW]** `ConfigService` (Main - manages settings like User-Agent).

### 4.4. Inter-Process Communication (IPC)
*   Use `contextBridge` and async invoke/handle. Use `webContents.send` for broadcasting progress.
*   Define clear channels including User-Agent configuration.

### 4.5. Technology Stack
*   Electron, Node.js, Chromium
*   JS (ES6+), HTML5, CSS3
*   Bundled: `yt-dlp`, `ffmpeg` (recommended).

### **[NEW]** 4.6. Stealth Implementation Strategy
*   **User-Agent:** Apply globally via `session.setUserAgent` and pass explicitly to `yt-dlp` and `electron.net` requests. Make configurable.
*   **DOM Interaction:** Minimize injection. Prefer manual trigger. If auto-detecting, use simple CSS selectors via `executeJavaScript`.
*   **UI:** Keep all app UI strictly outside the `BrowserView` DOM.
*   **Network Requests:** Ensure `yt-dlp` and direct fetch use correct User-Agent, Cookies, Referer. Add standard Accept headers for direct fetch.
*   **Behavior:** Avoid rapid, repetitive actions that look non-human. (Not actively addressed in v1.0 beyond normal operation).

## 5. Data Requirements

### 5.1. Session Data (Cookies, Cache)
*   Managed by Electron `session`. Ephemeral.

### 5.2. Application Configuration (User Agent)
*   **[MODIFIED]** Store selected User-Agent string. Initially could be hardcoded defaults, later potentially using `electron-store` for persistence if settings UI is added.

### 5.3. Downloaded Media Files
*   Saved to user-chosen location.

### 5.4. Active Download State
*   In-memory state managed by `DownloadManager` (Main) for current session.

## 6. User Interface (UI) / User Experience (UX) Design Principles

### 6.1. Layout and Navigation
*   Clean design. Separate browser controls, web content, download controls/manager.

### 6.2. Visual Feedback
*   Clear, immediate feedback for all states/processes.

### 6.3. Workflow Presentation
*   Prioritize manual trigger. Guide user through download/record stages.

### 6.4. Cross-Platform Consistency
*   Consistent core experience, respect OS conventions.

### 6.5. Download Management Visibility
*   Easy access to monitor background jobs (FR-11). Clear indicator of active downloads.

### **[NEW]** 6.6. UI Decoupling
*   Reinforce that the ScopeGrab UI is entirely separate from the web content rendered in the `BrowserView` to minimize detection vectors.

## 7. Security Design Considerations

### 7.1. Authentication & Session Management
*   No password storage. Ephemeral session cookies.

### 7.2. Filesystem Access
*   User-chosen save locations only. Sanitize filenames.

### 7.3. Screen Recording Permissions
*   Explicit, just-in-time user consent.

### 7.4. Dependency Management
*   Keep all dependencies (Electron, Node, npm, `yt-dlp`, `ffmpeg`) updated.

### 7.5. Electron Security Best Practices
*   Mandatory: `contextIsolation`, no `nodeIntegration` in Renderer, `webSecurity`, validate IPC.

### **[NEW]** 7.6. Anti-Detection Measures
*   Implement User-Agent spoofing correctly across all request types.
*   Minimize DOM interaction for detection.
*   Avoid injecting UI into web pages.
*   Use standard headers for direct network requests.
*   **Disclaimer:** Inform the user that stealth is best-effort and may not defeat all website protections. Ethical use is paramount.

## 8. Deployment and Build Process

### 8.1. Build Tooling
*   `electron-builder`.

### 8.2. Target Platforms & Architectures
*   Win x64, macOS Universal.

### 8.3. Packaging Formats
*   Win NSIS (`.exe`), macOS `.dmg`.

### 8.4. Code Signing & Notarization
*   Mandatory for macOS, Highly Recommended for Windows.

## 9. Dependencies

### 9.1. Core Dependencies
*   Electron.

### 9.2. Bundled Executables
*   `yt-dlp` (Win/Mac).
*   `ffmpeg` (Win/Mac - Recommended).

### 9.3. Key Node.js Modules (Anticipated)
*   `electron-log`.
*   `electron-store` (Optional - Config).
*   UUID library.
*   HLS/DASH libs (Optional - Fallback 3).

### 9.4. Build Dependencies
*   `electron-builder` / `electron-packager`.
*   Dev dependencies.

## 10. Future Considerations (Post V1.0)

*   *(Existing future items)*
*   Advanced stealth options (proxy support/rotation, configurable request timing/throttling, more sophisticated fingerprint evasion - complex).
*   Plugin system for detection/download logic.
*   Batch downloading.
*   Persistent download history/settings.
*   Download cancellation.
*   Pause/Resume downloads.
