# ♔ DIA Bank - Core Backend System (NibssByPhoenix)

### 🌐 **Live Deployment:** [https://dia-digital-bank.onrender.com/](https://dia-digital-bank.onrender.com/)

---

## 🎯 Project Objective
Developed as the sole Backend Engineer for **DIA Bank**, this system is a functional, secure banking core integrated with **NibssByPhoenix APIs**. It supports real-time customer onboarding, multi-bank settlements, and strict data privacy.

## 🚀 Quick Access for Supervisors
* **Production URL:** `https://dia-digital-bank.onrender.com/`
* **Bank Name:** DIA Bank
* **Bank Code:** 878
* **Inter-bank Partner:** PIN Bank (Code: 232)

## ✅ Implemented Assignment Requirements

### 1. Customer Onboarding & KYC
* **Verified Enrollment:** Integrated **BVN/NIN** verification via NibssByPhoenix endpoints.
* **Onboarding Gate:** Account creation is strictly prohibited until successful KYC verification is confirmed.

### 2. Account Management
* **NUBAN Issuance:** Enforced single-account-per-customer logic.
* **Automated Pre-funding:** Every validated account is automatically pre-funded with **₦15,000** for immediate transaction testing as per assignment guidelines.

### 3. Core Banking Operations
* **Live Name Enquiry:** Integrated real-time recipient verification to prevent erroneous transfers.
* **Settlement Routing:** * **Intra-bank:** Internal transfers within DIA Bank.
    * **Inter-bank:** Settlement routing to external institutions (e.g., PIN Bank).
* **Data Isolation:** Implemented strict privacy controls using **JWT Authentication**. Users can only access their personal dashboard and transaction history.
* **Status Verification:** Reference-based transaction status checks.

## 🛠 Tech Stack
* **Backend:** Node.js, Express.js
* **Database:** Persistent JSON-based data architecture
* **Security:** JWT for identity management and API security
* **Cloud Hosting:** Render (Web Service)

---
**Candidate:** Diamond Pinxy  
**Role:** Backend Engineer  
**Submission Date:** April 2026  
*NIBSS-Phoenix Digital Banking Assignment Submission*
