# Resume Author 📄

A modern, web-based tool for creating and managing verifiable resumes that empowers individuals to showcase their skills and experiences securely using blockchain technology and verifiable credentials.

## 🌟 Project Overview

Resume Author is part of the **T3 Innovation Network** initiative, designed to create more equitable and effective learning and career pathways. This application enables users to:

- **Create Professional Resumes**: Build comprehensive resumes with multiple sections including work experience, education, skills, certifications, and more
- **Verifiable Credentials Integration**: Import and verify credentials from various sources using W3C Verifiable Credentials standards
- **Digital Wallet Authentication**: Secure login using Learner Credential Wallet and other digital identity solutions
- **Cloud Storage**: Save and manage multiple resumes with Google Drive integration
- **PDF Export**: Generate professional PDF versions of resumes
- **Real-time Collaboration**: Share and collaborate on resume content

### Key Features

- 🔐 **Secure Authentication**: Multiple authentication methods including Google OAuth, Auth0, and digital wallet integration
- 📱 **Responsive Design**: Works seamlessly across desktop and mobile devices
- 🎨 **Rich Text Editor**: Advanced text editing capabilities with custom formatting
- 📊 **Progress Tracking**: Visual indicators for resume completion
- 🔗 **Credential Verification**: Integration with verifiable credential ecosystems
- 💾 **Auto-save**: Automatic saving of work with draft management
- 📤 **Multiple Export Options**: PDF generation and sharing capabilities

## 🚀 Technology Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **UI Framework**: Material-UI (MUI) v6
- **Authentication**: Auth0, Google OAuth
- **Storage**: Google Drive API, Firebase
- **PDF Generation**: jsPDF, html2pdf.js
- **Text Editor**: Quill.js with custom extensions
- **Routing**: React Router v7
- **Build Tool**: Create React App with Craco

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Google Cloud Platform account (for Google Drive integration)
- Auth0 account (for authentication)
- Firebase project (for additional storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/resume-author.git
   cd resume-author
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Google OAuth
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   REACT_APP_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

   # Auth0 Configuration
   REACT_APP_AUTH0_DOMAIN=your_auth0_domain
   REACT_APP_AUTH0_CLIENT_ID=your_auth0_client_id

   # Backend Server
   REACT_APP_SERVER_URL=https://linkedcreds.allskillscount.org

   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   ```

4. **Start the development server**

   ```bash
   npm start
   # or
   yarn start
   ```

   The application will open at [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
# or
yarn build
```

This builds the app for production to the `build` folder, optimized for deployment.

### Running Tests

```bash
npm test
# or
yarn test
```

## 📋 Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run format` - Formats code using Prettier
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Editor.tsx       # Main resume editor
│   ├── ResumeEditor/    # Resume-specific components
│   ├── TextEditor/      # Rich text editor components
│   └── common/          # Shared components
├── pages/               # Page-level components
├── redux/               # State management
│   ├── slices/         # Redux slices
│   └── store.ts        # Store configuration
├── services/           # API services
├── tools/              # Utility functions
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── firebase/           # Firebase configuration
├── styles/             # CSS and styling files
└── assets/             # Static assets
```

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following our coding standards
4. Write or update tests as needed
5. Run the test suite: `npm test`
6. Format your code: `npm run format`
7. Commit your changes: `git commit -m "Add your feature"`
8. Push to your branch: `git push origin feature/your-feature-name`
9. Open a Pull Request

### Code Standards

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Format code using the project's Prettier configuration
- **Component Structure**: Use functional components with hooks
- **State Management**: Use Redux Toolkit for global state
- **Styling**: Use Material-UI components and sx prop for styling
- **Testing**: Write unit tests for new features using React Testing Library

### Pull Request Process

1. Ensure your PR addresses a specific issue or feature request
2. Update documentation as needed
3. Add tests for new functionality
4. Ensure all tests pass
5. Request review from maintainers
6. Address feedback promptly

### Issue Reporting

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

## 🌐 Related Projects

- **[OpenCreds](https://www.opencreds.net/)** - Platform for issuing and managing verifiable credentials
- **T3 Innovation Network** - Exploring emerging technologies in the talent marketplace

## 📞 Support

- **Live Demo**: [https://resume.allskillscount.org/](https://resume.allskillscount.org/)
- **Documentation**: Check the `/docs` folder for detailed documentation
- **Issues**: Report bugs and feature requests in the GitHub Issues section
- **FAQ**: Visit `/faq` route in the application for frequently asked questions

## 🔄 Changelog

### Version 0.1.0

- Initial release with core resume editing functionality
- Google Drive integration for storage
- Verifiable credentials support
- PDF export capabilities
- Multi-section resume builder
- Authentication system integration

---

**Built with ❤️ by the T3 Innovation Network team**

_Empowering individuals to showcase their skills and experiences securely in the digital age._
