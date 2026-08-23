import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { assignCourse } from '../api';

function AssignCourse() {
  const [formData, setFormData] = useState({
    employee_id: '',
    course_id: '',
    due_date: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setMessage('');
      setError('');

      const result = await assignCourse(formData);
      setMessage(
        result.message || `Course ${formData.course_id} assigned successfully`
      );
      setFormData({
        employee_id: '',
        course_id: '',
        due_date: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3>Assign Course</h3>
          <p>Assign a course to an employee</p>
        </div>
      </div>

      {message && <div className="form-message">{message}</div>}
      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Employee ID</label>
            <input
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              placeholder="EMP001"
              required
            />
          </div>

          <div className="form-group">
            <label>Course ID</label>
            <input
              name="course_id"
              value={formData.course_id}
              onChange={handleChange}
              placeholder="CRS005"
              required
            />
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="modal-actions">
          <button type="submit" className="primary-button" disabled={submitting}>
            <ClipboardList size={18} />
            {submitting ? 'Assigning...' : 'Assign Course'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AssignCourse;
