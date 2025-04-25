# Candidate Evaluation System

A web application for evaluating and flagging candidate applications using Node.js, TypeScript, and AngularJS.

## Project Overview

This system helps reviewers evaluate candidate applications by:
- Processing candidate information through a flagging service
- Displaying flags based on predefined rules
- Allowing manual override of flags
- Storing evaluation results

## Features

- **Candidate Data Input:**
  - Personal Information (Name, Contact Details)
  - Professional Qualifications (NAC Exam, MCCQE1 Result)
  - Experience Details (Canadian Experience, Practice Gaps)
  - Additional Documentation

- **Automated Flagging System:**
  - Real-time flag generation
  - Multiple severity levels (High, Medium, Low)
  - Rule-based evaluation
  - Manual override capability

- **Review Interface:**
  - PrimeNG-based UI components
  - Interactive flag management
  - Status tracking
  - Data persistence

## Technology Stack

### Backend
- Node.js with Express
- TypeScript
- REST API endpoints
- Mock database for development

### Frontend
- AngularJS (1.x)
- PrimeNG UI components
- Bootstrap for responsive design

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   The server will run on http://localhost:3000

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The application will be available at http://localhost:8080

## API Endpoints

### Evaluation Endpoint
- **POST** `/api/evaluate`
  - Accepts candidate data
  - Returns list of generated flags
  ```json
  {
    "flags": [
      {
        "type": "CRIMINAL_HISTORY",
        "severity": "HIGH",
        "description": "Criminal history reported"
      }
    ]
  }
  ```

### Authentication Endpoints
- **POST** `/api/auth/login`
- **POST** `/api/auth/register`

### Application Endpoints
- **GET** `/api/applications`
- **POST** `/api/applications`
- **GET** `/api/applications/:id`
- **PUT** `/api/applications/:id`

## Mock Data

The system includes a mock database (`mockData.json`) with sample:
- Applications in different states (Pending, In Review, Approved)
- User accounts (Applicants and Reviewers)
- Pre-generated flags

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   └── database/
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── controllers/
│   │   └── views/
│   └── index.html
└── README.md
```

## Development Guidelines

1. **TypeScript Usage**
   - Maintain strict typing
   - Use interfaces for data models
   - Implement proper error handling

2. **AngularJS Best Practices**
   - Follow component-based architecture
   - Use services for data management
   - Implement proper dependency injection

3. **PrimeNG Integration**
   - Utilize PrimeNG components for UI elements
   - Follow PrimeNG theming guidelines
   - Ensure responsive design

## Testing

1. Start both backend and frontend servers.
2. Register a new applicant account.
3. Login using the newly created applicant credentials.
4. Submit an application.
5. Logout.
6. Register a new reviewer account by checking the reviewer checkbox during registration (available for debugging purposes).
7. Login using the newly created reviewer credentials.
8. Inspect the list of submitted applications.
9. View the detailed information of selected applications.
10. Override application flags where appropriate.


## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
