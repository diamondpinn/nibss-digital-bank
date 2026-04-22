# ♔ DIA Bank - Core Backend System (NibssByPhoenix)

This repository contains the core backend system for **DIA Bank**, developed as part of the Backend Engineering Assignment. The system is designed to support customer onboarding, secure account management, and real-time inter/intra-bank operations.

## 🎯 Project Objective
To build a functional, secure backend system that integrates with **NibssByPhoenix APIs** to facilitate standard banking operations while ensuring strict data privacy and isolation.

## 🚀 Implemented Requirements

### 1. Customer Onboarding & Verification
* **KYC Integration:** Implemented a complete workflow using **BVN/NIN** verification endpoints provided by NibssByPhoenix.
* **Verification Gate:** Account creation is strictly locked until a customer is successfully verified through the NibssByPhoenix onboarding service.

### 2. Account Management
* **NUBAN Generation:** Single-account-per-customer enforcement.
* **Pre-funding Logic:** Every newly created account is automatically pre-funded with **₦15,000** to facilitate immediate testing and transaction flow as per assignment requirements.

### 3. Core Banking Operations
* **Live Name Enquiry:** Integrated recipient verification to ensure valid transfers and prevent transaction errors.
* **Dual-Channel Transfers:** * **Intra-bank:** Seamless transfers between DIA Bank accounts.
    * **Inter-bank:** Settlement routing to external accounts (e.g., PIN Bank/Colleagues' accounts).
* **Security & Privacy:** Enforced **Strict Data Isolation**. Customers can only view their own balances and transaction histories; JWT-based authentication ensures one user cannot access another's data.
* **Status Tracking:** Real-time transaction status checks using reference numbers.

### 4. Technical Integration
* **API Credentials:** Successfully authenticated via NibssByPhoenix onboarding to retrieve unique credentials.
* **Swagger Compliance:** All API calls are mapped to the provided NibssByPhoenix documentation.

## 🛠 Tech Stack
* **Backend:** Node.js, Express.js
* **Security:** JWT (JSON Web Tokens) for session and data isolation
* **Storage:** Persistent JSON-based data architecture
* **Frontend:** Professional Banking UI (Public Folder)

---
**Candidate:** Diamond Pinxy  
**Role:** Sole Backend Engineer  
**Submission Date:** April 2026  
*Developed for the NibssByPhoenix Engineering Assignment*
