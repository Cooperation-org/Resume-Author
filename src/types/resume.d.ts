// Base Interfaces for VC
interface IssuerInfo {
  id: string;
  name: string;
  type: 'organization' | 'institution' | 'individual';
  verificationURL?: string;
  logo?: string;
}

interface VerificationCredential {
  vcId?: string; // Google Drive ID OR DID if using decentralized storage
  vcDid?: string; // DID if using decentralized storage
  issuer: IssuerInfo;
  dateVerified: string;
  expiryDate?: string;
  status: 'valid' | 'expired' | 'revoked';
}

interface VerifiableItem {
  id: string;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  verifiedCredentials?: VerificationCredential[];
}

// Resume Section Interfaces
interface Contact {
  fullName: string;
  email: string;
  phone?: string;
  location?: {
    street?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
  };
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
}

interface WorkExperience extends VerifiableItem {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description: string;
  achievements: string[];
}

interface Education extends VerifiableItem {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  location?: string;
  gpa?: string;
  honors?: string[];
  thesis?: string;
  relevantCourses?: string[];
}

interface Skill extends VerifiableItem {
  name: string;
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience?: number;
}

interface Conference extends VerifiableItem {
  name: string;
  role: 'Attendee' | 'Speaker' | 'Organizer' | 'Presenter' | 'Panelist';
  date: string;
  location: string;
  description?: string;
  presentationTitle?: string;
  url?: string;
}

interface Award extends VerifiableItem {
  title: string;
  issuer: string;
  date: string;
  description?: string;
  recognition?: string;
}

interface Publication extends VerifiableItem {
  title: string;
  type: 'Journal' | 'Conference' | 'Book' | 'Article' | 'Patent' | 'Other';
  publishedDate: string;
  publisher: string;
  authors: string[];
  url?: string;
  doi?: string;
  citation?: string;
  abstract?: string;
  impact?: string;
}

interface Certification extends VerifiableItem {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialURL?: string;
  score?: string;
}

interface ProfessionalAffiliation extends VerifiableItem {
  organization: string;
  role?: string;
  startDate: string;
  endDate?: string;
  membershipId?: string;
  description?: string;
  benefits?: string[];
}

interface VolunteerWork extends VerifiableItem {
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: string;
  achievements?: string[];
  cause?: string;
}

interface Language extends VerifiableItem {
  name: string;
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Native';
  certification?: string;
  writingLevel?: string;
  speakingLevel?: string;
  readingLevel?: string;
}

interface Testimonial {
  id: string;
  author: string;
  position?: string;
  company?: string;
  relationship?: string;
  content: string;
  date: string;
}

interface ExecutiveQualification extends VerifiableItem {
  category: string;
  description: string;
  examples: string[];
  skills?: string[];
}

// Main Resume Interface
interface Resume {
  id: string;
  userId: string;
  lastUpdated: string;
  version?: number;

  contact: Contact;
  summary: string;
  executiveSummary?: string;
  executiveQualifications?: {
    items: ExecutiveQualification[];
  };

  experience: {
    items: WorkExperience[];
  };
  education: {
    items: Education[];
  };
  skills: {
    items: Skill[];
  };
  conferences: {
    items: Conference[];
  };
  accomplishments: {
    items: string[];
  };
  awards: {
    items: Award[];
  };
  publications: {
    items: Publication[];
  };
  certifications: {
    items: Certification[];
  };
  professionalAffiliations: {
    items: ProfessionalAffiliation[];
  };
  volunteerWork: {
    items: VolunteerWork[];
  };
  hobbiesAndInterests: string[];
  languages: {
    items: Language[];
  };
  testimonials: {
    items: Testimonial[];
  };

  // Metadata
  privacy?: {
    isPublic: boolean;
    sharedWith?: string[];
  };
  settings?: {
    template?: string;
    fontSize?: string;
    fontFamily?: string;
    color?: string;
  };
}
