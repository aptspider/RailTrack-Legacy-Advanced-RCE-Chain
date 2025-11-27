# 🚂 RailTrack Legacy — Advanced RCE Chain

A realistic, self-contained educational lab that simulates a **Critical Kill Chain** — starting from a simple Config Leak and escalating to full **Remote Code Execution (RCE)**.

Unlike basic labs that give you a file upload button, this lab forces you to abuse **MySQL `FILE` privileges** to write your own web shell using SQL injection patterns (`INTO OUTFILE`).

---

##  What You’ll Learn

- How to **chain low-severity bugs** (Info Disclosure) into Criticals (RCE)
- Why **database privileges** (`FILE`) are dangerous
- How to write web shells using **SQL Injection** when no upload feature exists
- How to perform manual recon to find hidden administrative consoles

---

##  Scenario

You are targeting the **RailTrack Logistics** legacy infrastructure.

Your goal: Start from zero access, find the hidden entry point, and achieve full **Remote Code Execution** on the server.

> **Target:** RT-LEGACY-01 Node
> **Objective:** `uid=0(root)`

---

## Features

- **Realistic Recon:** Find leftover backup files (`.bak`) in a production-style environment
- **Hidden Admin Console:** No obvious links; requires information gathering to locate
- **Advanced Exploitation:** Simulate writing files to disk via SQL queries
- **Web Shell Simulation:** Execute system commands directly through the browser
- **Self-Contained:** Runs locally on Node.js with no external database required

---


Disclaimer

This application contains intentional security vulnerabilities.

    Do NOT run this application on a public server or production environment.

    Use only for educational purposes and authorized testing.

## 🛠️ Tech Stack

- **Node.js** (v14+)
- **Express.js** (Backend)
- **Vanilla JS** (Frontend simulation of PHP/MySQL environment)

---

##  Installation & Setup

### Prerequisites
- Node.js **v14+**

### Quick Start

```bash
git clone [https://github.com/aptspider/railtrack-legacy-rce.git](https://github.com/aptspider/railtrack-legacy-rce.git)
cd railtrack-legacy-rce
npm install
node server.js
