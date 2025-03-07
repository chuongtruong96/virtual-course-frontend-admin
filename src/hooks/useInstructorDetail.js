// src/hooks/useInstructorDetail.js
import { useState, useEffect } from 'react';
import InstructorService from '../services/instructorService';

export const useInstructorDetail = (instructorId) => {
  const [instructor, setInstructor] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [social, setSocial] = useState(null);
  const [courses, setCourses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Dialog states
  const [statusDialog, setStatusDialog] = useState({ open: false, action: null });
  const [statusNote, setStatusNote] = useState('');
  const [documentPreview, setDocumentPreview] = useState({ open: false, url: '', title: '' });

  useEffect(() => {
    const fetchInstructorData = async () => {
      setIsLoading(true);
      setIsError(false);
      
      try {
        // Fetch basic instructor details
        const instructorData = await InstructorService.fetchById(instructorId);
        setInstructor(instructorData);
        
        // Fetch instructor statistics
        try {
          const statsData = await InstructorService.getInstructorStatistics(instructorId);
          setStatistics(statsData);
        } catch (statsError) {
          console.error('Error fetching instructor statistics:', statsError);
        }
        
        // Fetch instructor profile data (education, experience, skills, social)
        try {
          const profileData = await InstructorService.getInstructorProfileData(instructorId);
          setEducations(profileData.educations || []);
          setExperiences(profileData.experiences || []);
          setSkills(profileData.skills || []);
          setSocial(profileData.social);
        } catch (profileError) {
          console.error('Error fetching instructor profile data:', profileError);
        }
        
        // Fetch instructor courses
        try {
          const coursesData = await InstructorService.getInstructorCourses(instructorId);
          setCourses(coursesData || []);
        } catch (coursesError) {
          console.error('Error fetching instructor courses:', coursesError);
        }
        
        // Fetch instructor documents
        try {
          const documentsData = await InstructorService.getInstructorDocuments(instructorId);
          setDocuments(documentsData || []);
        } catch (documentsError) {
          console.error('Error fetching instructor documents:', documentsError);
        }
        
      } catch (error) {
        console.error('Error fetching instructor:', error);
        setIsError(true);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (instructorId) {
      fetchInstructorData();
    }
  }, [instructorId]);

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Status action handler
  const handleStatusAction = (action) => {
    if (action) {
      setStatusDialog({ open: true, action });
    } else {
      setStatusDialog({ open: false, action: null });
      setStatusNote('');
    }
  };

  // Status confirm handler
  const handleStatusConfirm = async () => {
    try {
      setIsLoading(true);
      
      if (statusDialog.action === 'approve') {
        await InstructorService.approveInstructor(instructorId, statusNote);
      } else if (statusDialog.action === 'reject') {
        await InstructorService.rejectInstructor(instructorId, statusNote);
      } else if (statusDialog.action === 'activate') {
        await InstructorService.updateInstructorStatus(instructorId, 'ACTIVE', statusNote);
      } else if (statusDialog.action === 'deactivate') {
        await InstructorService.updateInstructorStatus(instructorId, 'INACTIVE', statusNote);
      }
      
      // Refresh instructor data
      const updatedInstructor = await InstructorService.fetchById(instructorId);
      setInstructor(updatedInstructor);
      
      // Close dialog
      setStatusDialog({ open: false, action: null });
      setStatusNote('');
    } catch (error) {
      console.error('Error updating instructor status:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Document preview handler
  const handleDocumentPreview = (document) => {
    if (document) {
      setDocumentPreview({
        open: true,
        url: document.url,
        title: document.name || 'Document Preview'
      });
    } else {
      setDocumentPreview({ open: false, url: '', title: '' });
    }
  };

  return {
    instructor: instructor ? {
      ...instructor,
      educations: educations || [],
      experiences: experiences || [],
      skills: skills || [],
      social: social || null
    } : null,
    statistics,
    courses,
    documents,
    isLoading,
    isError,
    error,
    tabValue,
    statusDialog,
    statusNote,
    documentPreview,
    handleTabChange,
    handleStatusAction,
    handleStatusConfirm,
    handleDocumentPreview,
    setStatusNote,
    setDocumentPreview
  };
};

export default useInstructorDetail;