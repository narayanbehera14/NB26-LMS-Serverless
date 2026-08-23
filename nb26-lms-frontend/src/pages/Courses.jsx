import { useEffect, useState } from 'react';
import { BookOpen, Plus, X, RefreshCw } from 'lucide-react';
import { createCourse, getCourses } from '../api';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    external_video_url: '',
    passing_score: 70,
  });

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setMessage('');
      setError('');

      const result = await createCourse({
        ...formData,
        passing_score: Number(formData.passing_score),
      });

      setMessage(result.message || 'Course created successfully');

      setFormData({
        course_id: '',
        title: '',
        description: '',
        external_video_url: '',
        passing_score: 70,
      });

      setShowForm(false);

      await loadCourses();
    } catch (err) {
      setError(err.message || 'Failed to create course');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3>Courses</h3>
          <p>Create and manage LMS courses</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={loadCourses}
            disabled={loading}
            title="Refresh courses"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() => {
              setShowForm(true);
              setMessage('');
              setError('');
            }}
          >
            <Plus size={18} />
            Add Course
          </button>
        </div>
      </div>

      {message && (
        <div className="success-banner">
          {message}
        </div>
      )}

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {showForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowForm(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Add Course</h2>
                <p>Create a new learning module</p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Course ID</label>
                  <input
                    type="text"
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    placeholder="COURSE_101"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="AWS Fundamentals"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the course objective and content"
                    rows={4}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>External Video URL</label>
                  <input
                    type="url"
                    name="external_video_url"
                    value={formData.external_video_url}
                    onChange={handleChange}
                    placeholder="https://example.com/video"
                  />
                </div>

                <div className="form-group">
                  <label>Passing Score</label>
                  <input
                    type="number"
                    name="passing_score"
                    min="0"
                    max="100"
                    value={formData.passing_score}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="primary-button"
                >
                  {creating ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <BookOpen size={28} />
          <p>Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={28} />
          <p>No courses created yet</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div
              className="course-card"
              key={course.course_id}
            >
              <div className="course-card-header">
                <div className="course-icon">
                  <BookOpen size={22} />
                </div>

                <span className="course-id">
                  {course.course_id}
                </span>
              </div>

              <h3>{course.title}</h3>

              <p className="course-description">
                {course.description}
              </p>

              <div className="course-details">
                <div>
                  <span>Passing Score</span>
                  <strong>{course.passing_score}%</strong>
                </div>

                <div>
                  <span>Mandatory</span>
                  <strong>
                    {course.mandatory ? 'Yes' : 'No'}
                  </strong>
                </div>
              </div>

              {course.external_video_url && (
                <a
                  href={course.external_video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="course-video-link"
                >
                  View Course Video
                </a>
              )}

              {course.assigned_roles?.length > 0 && (
                <div className="course-roles">
                  <span>Assigned Roles</span>

                  <div>
                    {course.assigned_roles.map((role) => (
                      <span key={role} className="role-tag">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
