/**
 * Constants for instructor approval process
 * Contains evaluation criteria and common rejection reasons
 */

/**
 * Criteria used to evaluate instructor applications
 * Each criterion has:
 * - id: unique identifier
 * - label: display name
 * - description: detailed explanation
 * - required: whether this criterion must be evaluated
 * - options: possible evaluation options (exceeds/meets/below expectations)
 */
export const APPROVAL_CRITERIA = [
    {
      id: 'qualifications',
      label: 'Educational Qualifications',
      description: 'Academic degrees, certifications, and formal education relevant to teaching area',
      required: true,
      options: [
        {
          value: 'exceeds',
          label: 'Exceeds Requirements',
          description: 'Advanced degree(s) in relevant field with additional specialized certifications'
        },
        {
          value: 'meets',
          label: 'Meets Requirements',
          description: 'Relevant degree or equivalent certifications in teaching area'
        },
        {
          value: 'below',
          label: 'Below Requirements',
          description: 'Insufficient or unrelated educational background'
        }
      ]
    },
    {
      id: 'experience',
      label: 'Professional Experience',
      description: 'Relevant work experience in the field they intend to teach',
      required: true,
      options: [
        {
          value: 'exceeds',
          label: 'Exceeds Requirements',
          description: '5+ years of professional experience with leadership roles'
        },
        {
          value: 'meets',
          label: 'Meets Requirements',
          description: '2-5 years of relevant professional experience'
        },
        {
          value: 'below',
          label: 'Below Requirements',
          description: 'Less than 2 years or unrelated experience'
        }
      ]
    },
    {
      id: 'teaching',
      label: 'Teaching Experience',
      description: 'Previous teaching, training, or mentoring experience',
      required: true,
      options: [
        {
          value: 'exceeds',
          label: 'Exceeds Requirements',
          description: 'Extensive teaching experience with proven track record and positive evaluations'
        },
        {
          value: 'meets',
          label: 'Meets Requirements',
          description: 'Some teaching or training experience with satisfactory outcomes'
        },
        {
          value: 'below',
          label: 'Below Requirements',
          description: 'Little to no teaching experience or poor evaluations'
        }
      ]
    },
    {
      id: 'materials',
      label: 'Course Materials',
      description: 'Quality and completeness of proposed course materials and curriculum',
      required: true,
      options: [
        {
          value: 'exceeds',
          label: 'Exceeds Requirements',
          description: 'Comprehensive, well-structured materials with innovative teaching approaches'
        },
        {
          value: 'meets',
          label: 'Meets Requirements',
          description: 'Complete and adequate course materials covering essential topics'
        },
        {
          value: 'below',
          label: 'Below Requirements',
          description: 'Incomplete, disorganized, or low-quality materials'
        }
      ]
    },
    {
      id: 'communication',
      label: 'Communication Skills',
      description: 'Ability to communicate clearly and effectively in writing and speaking',
      required: true,
      options: [
        {
          value: 'exceeds',
          label: 'Exceeds Requirements',
          description: 'Exceptional communication skills with ability to explain complex concepts simply'
        },
        {
          value: 'meets',
          label: 'Meets Requirements',
          description: 'Clear and effective communication suitable for teaching'
        },
        {
          value: 'below',
          label: 'Below Requirements',
          description: 'Poor communication skills that may hinder effective teaching'
        }
      ]
    },
    {
      id: 'technology',
      label: 'Technical Proficiency',
      description: 'Familiarity with online teaching tools and technologies',
      required: false,
      options: [
        {
          value: 'exceeds',
          label: 'Exceeds Requirements',
          description: 'Advanced technical skills with experience using multiple teaching platforms'
        },
        {
          value: 'meets',
          label: 'Meets Requirements',
          description: 'Sufficient technical skills to effectively deliver online courses'
        },
        {
          value: 'below',
          label: 'Below Requirements',
          description: 'Limited technical skills that may impact course delivery'
        }
      ]
    },
    {
      id: 'availability',
      label: 'Availability & Commitment',
      description: 'Time commitment and availability for teaching and student support',
      required: false,
      options: [
        {
          value: 'exceeds',
          label: 'Exceeds Requirements',
          description: 'High availability with flexible schedule and strong commitment'
        },
        {
          value: 'meets',
          label: 'Meets Requirements',
          description: 'Sufficient availability to meet teaching and support requirements'
        },
        {
          value: 'below',
          label: 'Below Requirements',
          description: 'Limited availability or concerns about commitment'
        }
      ]
    }
  ];
  
  /**
   * Common reasons for rejecting instructor applications
   * Organized by category with specific reasons in each
   */
  export const COMMON_REJECTION_REASONS = [
    {
      category: 'Insufficient Qualifications',
      reasons: [
        'Educational background does not meet minimum requirements',
        'Lack of relevant certifications required for the subject area',
        'Qualifications cannot be verified with provided documentation',
        'Degree or certification is not from an accredited institution'
      ]
    },
    {
      category: 'Inadequate Experience',
      reasons: [
        'Insufficient professional experience in the subject area',
        'Lack of teaching or training experience',
        'Experience is outdated or not relevant to current industry standards',
        'Unable to demonstrate practical application of subject knowledge'
      ]
    },
    {
      category: 'Course Content Issues',
      reasons: [
        'Proposed course materials are incomplete or insufficient',
        'Course content does not meet quality standards',
        'Content overlaps significantly with existing courses',
        'Course structure lacks clear learning objectives or outcomes',
        'Materials contain factual errors or outdated information'
      ]
    },
    {
      category: 'Communication Concerns',
      reasons: [
        'Written communication skills below required standard',
        'Language proficiency insufficient for effective teaching',
        'Sample lecture or presentation was unclear or disorganized',
        'Unable to explain complex concepts in an accessible manner'
      ]
    },
    {
      category: 'Technical Limitations',
      reasons: [
        'Insufficient technical skills to deliver online courses effectively',
        'Unable to use required teaching platform or tools',
        'Poor audio/video quality in sample materials',
        'Technical setup inadequate for professional course delivery'
      ]
    },
    {
      category: 'Availability & Commitment',
      reasons: [
        'Unable to commit to required teaching hours',
        'Limited availability for student support and engagement',
        'Schedule conflicts with platform requirements',
        'Concerns about long-term commitment to the platform'
      ]
    },
    {
      category: 'Policy Compliance',
      reasons: [
        'Application materials contain plagiarized content',
        'Violation of platform terms of service or community guidelines',
        'Failure to disclose conflicts of interest',
        'Misrepresentation of credentials or experience',
        'Incomplete or falsified application information'
      ]
    }
  ];