export const useInstructorCourses = (instructorId) => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);
  const [filters, setFilters] = useState({
    status: '',
    page: 0,
    size: 10,
    sort: 'createdAt',
    direction: 'desc'
  });

  const {
    data: coursesData,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['instructor-courses', instructorId, filters],
    () => InstructorService.getInstructorCourses(instructorId, filters),
    {
      enabled: !!instructorId,
      keepPreviousData: true,
      onError: (error) => {
        addNotification('Failed to load courses', 'error');
        console.error('Error fetching courses:', error);
      }
    }
  );

  const updateCourseStatus = useMutation(
    ({ courseId, status }) => InstructorService.updateCourseStatus(courseId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['instructor-courses', instructorId]);
        addNotification('Course status updated successfully', 'success');
      },
      onError: (error) => {
        addNotification('Failed to update course status', 'error');
        console.error('Error updating course status:', error);
      }
    }
  );

  const deleteCourse = useMutation(
    (courseId) => InstructorService.deleteCourse(courseId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['instructor-courses', instructorId]);
        addNotification('Course deleted successfully', 'success');
      },
      onError: (error) => {
        addNotification('Failed to delete course', 'error');
        console.error('Error deleting course:', error);
      }
    }
  );

  return {
    courses: coursesData?.content || [],
    totalElements: coursesData?.totalElements || 0,
    totalPages: coursesData?.totalPages || 0,
    currentPage: filters.page,
    pageSize: filters.size,
    isLoading,
    error,
    filters,
    updateFilters: setFilters,
    updateCourseStatus: updateCourseStatus.mutate,
    deleteCourse: deleteCourse.mutate,
    refetchCourses: refetch
  };
};