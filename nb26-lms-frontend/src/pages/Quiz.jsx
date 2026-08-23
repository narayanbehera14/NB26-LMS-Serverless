import { useState } from 'react';
import { ClipboardList, CheckCircle } from 'lucide-react';
import { createQuiz } from '../api';

function Quiz() {
  const [formData, setFormData] = useState({
    question_id: '',
    course_id: '',
    question_text: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correct_answer: '',
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

      const quizData = {
        question_id: formData.question_id,
        course_id: formData.course_id,
        question_text: formData.question_text,
        options: [
          formData.option1,
          formData.option2,
          formData.option3,
          formData.option4,
        ],
        correct_answer: formData.correct_answer,
      };

      const result = await createQuiz(quizData);

      setMessage(
        result.message || 'Quiz question created successfully'
      );

      setFormData({
        question_id: '',
        course_id: '',
        question_text: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correct_answer: '',
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
          <h3>Create Quiz Question</h3>
          <p>Add a multiple-choice question to a course</p>
        </div>
      </div>

      {message && (
        <div className="form-message">
          <CheckCircle size={18} />
          {message}
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">

          <div className="form-group">
            <label>Question ID</label>
            <input
              type="text"
              name="question_id"
              value={formData.question_id}
              onChange={handleChange}
              placeholder="Q006"
              required
            />
          </div>

          <div className="form-group">
            <label>Course ID</label>
            <input
              type="text"
              name="course_id"
              value={formData.course_id}
              onChange={handleChange}
              placeholder="CRS005"
              required
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Question</label>
            <textarea
              name="question_text"
              value={formData.question_text}
              onChange={handleChange}
              placeholder="Which AWS service is used to run code without managing servers?"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Option 1</label>
            <input
              type="text"
              name="option1"
              value={formData.option1}
              onChange={handleChange}
              placeholder="EC2"
              required
            />
          </div>

          <div className="form-group">
            <label>Option 2</label>
            <input
              type="text"
              name="option2"
              value={formData.option2}
              onChange={handleChange}
              placeholder="Lambda"
              required
            />
          </div>

          <div className="form-group">
            <label>Option 3</label>
            <input
              type="text"
              name="option3"
              value={formData.option3}
              onChange={handleChange}
              placeholder="S3"
              required
            />
          </div>

          <div className="form-group">
            <label>Option 4</label>
            <input
              type="text"
              name="option4"
              value={formData.option4}
              onChange={handleChange}
              placeholder="DynamoDB"
              required
            />
          </div>

          <div className="form-group">
            <label>Correct Answer</label>
            <select
              name="correct_answer"
              value={formData.correct_answer}
              onChange={handleChange}
              required
            >
              <option value="">Select correct answer</option>
              <option value={formData.option1}>
                {formData.option1 || 'Option 1'}
              </option>
              <option value={formData.option2}>
                {formData.option2 || 'Option 2'}
              </option>
              <option value={formData.option3}>
                {formData.option3 || 'Option 3'}
              </option>
              <option value={formData.option4}>
                {formData.option4 || 'Option 4'}
              </option>
            </select>
          </div>

        </div>

        <div className="modal-actions">
          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            <ClipboardList size={18} />
            {submitting ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Quiz;
