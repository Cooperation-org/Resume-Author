export interface Skill {
  id: string;
  name: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  years: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: number;
}

export interface Resume {
  id: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  verification: {
    isVerified: boolean;
    skillsVerified: string[]; // IDs of verified skills
  };
}
