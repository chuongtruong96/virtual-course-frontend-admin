// src/types/course.ts
export enum CourseStatus {
    DRAFT = 'DRAFT',           // Initial state when instructor is working on it
    PENDING = 'PENDING',       // Submitted for review
    APPROVED = 'APPROVED',     // Ready to be published
    REJECTED = 'REJECTED',     // Needs revision
    PUBLISHED = 'PUBLISHED',   // Live and available to students
    UNPUBLISHED = 'UNPUBLISHED' // Temporarily hidden
  }
  
  export interface CourseApprovalCriteria {
    contentQuality: boolean;     // Course content meets quality standards
    mediaQuality: boolean;       // Videos/images are high quality
    pricing: boolean;           // Price is reasonable for content
    description: boolean;       // Clear and accurate description
    requirements: boolean;      // Clear prerequisites/requirements
    structure: boolean;         // Well-organized content structure
    completeness: boolean;      // All required sections are complete
  }
  