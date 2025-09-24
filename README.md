# Medisynq Telemedicine Platform

A modern web-based telemedicine platform for Patients and Doctors.

## Features
- Secure JWT-based registration and login for Patients and Doctors
- Role-based dashboards and access control
- Profile management (contact details, DOB, specialization for doctors)
- Vital signs monitoring and history (BP, Heart Rate, Glucose, Temperature)
- Vitals history in table and chart format (ngx-charts)
- Appointment booking and management (Patients)
- Appointment management and consultation notes (Doctors)
- Patient list for doctors
- Responsive, modern UI (React + TailwindCSS)
- RESTful API backend (Django + DRF)
- Environment variable management
- Static file serving for production

## Tech Stack
- **Backend:** Python 3.x, Django 4.x, Django REST Framework, djangorestframework-simplejwt, django-cors-headers, django-environ, WhiteNoise, SQLite (default), PostgreSQL (structure)
- **Frontend:** React, TailwindCSS
- **Database:** SQLite (default), PostgreSQL (structure)

## Getting Started

### Backend
1. Install Python 3.x
2. Create a virtual environment and activate it
3. Install dependencies (see backend requirements.txt)
4. Run migrations and start the server

### Frontend
1. Install Node.js and npm
2. Install dependencies (see frontend package.json)
3. Start the development server

## Deployment
- Backend: WhiteNoise for static files, environment variables via django-environ
- Frontend: Build and deploy React app

## License
MIT
