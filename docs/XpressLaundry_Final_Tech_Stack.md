XpressLaundry - Final Tech Stack
Overview
XpressLaundry is a multi-vendor laundry platform consisting of:
• Customer Mobile App
• Vendor Mobile App
• Super Admin Dashboard
The platform enables customers to place laundry orders, vendors to manage laundry operations, and the platform owner to manage vendors, commissions, and payouts.
Frontend
Mobile Applications
Framework
• React Native
• Expo
Applications
• Customer App
• Vendor App
Navigation
• React Navigation
State Management
• Zustand
API Communication
• Axios
Forms
• React Hook Form

UI Components
• React Native Paper
Push Notifications
• Firebase Cloud Messaging (FCM)
Admin Dashboard
Framework
• React Native Web (Expo Web)
Alternative:
• Next.js (Future Upgrade)
Purpose:
• Vendor Management
• Order Management
• Commission Tracking
• Payout Management
Backend
Framework
FastAPI
Language:
• Python 3.12
Core Packages:
fastapi
uvicorn
sqlalchemy
sqlmodel
pydantic
python-jose
passlib
Database
Supabase PostgreSQL
Used For:
Users
Vendors
Addresses
Orders
Order Items
Services
Coupons
Payments
Payouts
Benefits:
• Managed PostgreSQL
Automatic Backups
• Scalable
• Free Tier Available
Authentication
Supabase Auth
Authentication Methods:
• Phone OTP Login
Google Login
Benefits:
• No OTP Infrastructure Required
• Secure Authentication
• JWT Management Handled by Supabase

Storage
Supabase Storage
Used For:
• User Profile Photos
• Vendor Logos
• Order Images
• Invoice PDFs
Benefits:
• Integrated with Supabase
Simple Access Control
• Free Tier Available
Payments
Razorpay
Supported Methods:
• UPI
• Credit Cards
• Debit Cards
• Net Banking
Commission System
Weekly Payout Model
Customer Pays Online
↓
Platform Receives Payment
↓
Commission Automatically Calculated
↓
Vendor Earnings Updated
↓
Weekly Vendor Payout
Example
Order Amount = ₹500
Commission $=10\%$
Platform Commission $=?50$
Vendor Earnings $=?450$
Vendor Earnings Tracking
Vendor Dashboard
Displays:
Available Payout
12,450
Vendor Profile
Earnings Summary
This Week
Orders: 45
Gross Revenue:  22,500
Commission: ₹2,250
Net Earnings: ₹20,250
Notifications
Firebase Cloud Messaging (FCM)
Used For:
Order Placed
Pickup Scheduled
Picked Up
Washing Started
Out For Delivery
Delivered
Maps
Google Maps API
Used For:
• Address Selection
• Pickup Locations
• Service Coverage Areas

Monitoring
Sentry
Tracks:
• App Crashes
• API Errors
• Exceptions
Analytics
PostHog
Tracks:
• User Signups
• Orders
• Revenue
Customer Retention
Hosting
Backend Hosting
Render
Hosted Services:
FastAPI Backend
• Background Workers
Benefits:
• Easy Deployment
• Auto SSL
• GitHub Integration

Database Hosting
Supabase
Hosted Services:
• PostgreSQL Database
• Authentication
• Storage
Frontend Hosting
Vercel
Used For:
• Admin Dashboard
• Vendor Web Dashboard (Future)
Architecture
Customer App
React Native
FastAPI
(Render)
▼
Supabase
(PostgreSQL Auth Storage)

Razorpay
Vendor App
Super Admin Dashboard
Project Structure
backend/
app
api
models
services
repositories
auth
utils
main.py
frontend/
customer-app
vendor-app
admin-dashboard
MVP Features
Customer App
• Phone OTP Login
• Google Login
• Browse Services
• Select Laundry Package
• Add Dry Cleaning Items

• Schedule Pickup
• Online Payment
• Track Orders
• Wallet & Coupons
• Profile Management
Vendor App
• Dashboard
• Orders Management
• Customer Management
• Services Management
• Earnings Tracking
• Available Payout Tracking
• Profile Management
Super Admin Dashboard
• Vendor Management
• Orders Monitoring
• Revenue Tracking
• Commission Tracking
• Payout Management
• Commission Configuration
Estimated Monthly Cost
Supabase
₹0
Render
१० ₹600
Firebase FCM
१०
PostHog
१०
Sentry
१०
Total Estimated Cost
500 1000/month

Final Stack Summary
Frontend:
• React Native
Expo
React Navigation
• Zustand
• Axios
Backend:
• FastAPI
• Python
Database:
• Supabase PostgreSQL
Authentication:
• Supabase Auth
Storage:
• Supabase Storage
Payments:
• Razorpay
Notifications:
• Firebase Cloud Messaging
Hosting:
Render
• Supabase
Monitoring:
• Sentry
Analytics:
• PostHog