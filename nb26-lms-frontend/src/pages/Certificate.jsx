import { useEffect, useState } from 'react';
import { Award, CheckCircle, Search } from 'lucide-react';
import { getEmployees, getEmployeeCourses } from '../api';

const API_BASE_URL =
  'https://tq1py1806g.execute-api.us-east-1.amazonaws.com';

function Certificate() {
  const [employees, setEmployees] = useState([]);
  const [courses, setCourses] = useState([]);

  const [employeeId, setEmployeeId] = useState('');
  const [courseId, setCourseId] = useState('');

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [error, setError] = useState('');

  // Load employees
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setDataLoading(true);

        const data = await getEmployees();

        const employeeList = Array.isArray(data?.employees)
          ? data.employees
          : Array.isArray(data)
          ? data
          : [];

        setEmployees(employeeList);
      } catch (error) {
        console.error(error);
        setError('Failed to load employees');
      } finally {
        setDataLoading(false);
      }
    };

    loadEmployees();
  }, []);

  // Load only passed courses
  useEffect(() => {
    const loadCourses = async () => {
      if (!employeeId) {
        setCourses([]);
        setCourseId('');
        return;
      }

      try {
        setCoursesLoading(true);
        setCourses([]);
        setCourseId('');
        setError('');

        const data = await getEmployeeCourses(employeeId);

        const courseList = Array.isArray(data?.courses)
          ? data.courses
          : [];

        const passedCourses = courseList.filter(
          (course) =>
            course.status?.toLowerCase().trim() === 'passed'
        );

        setCourses(passedCourses);
      } catch (error) {
        console.error(error);
        setError('Failed to load employee courses');
      } finally {
        setCoursesLoading(false);
      }
    };

    loadCourses();
  }, [employeeId]);

  // Generate certificate
  const generateCertificate = async () => {
    try {
      setLoading(true);
      setError('');
      setCertificate(null);

      const response = await fetch(
        `${API_BASE_URL}/certificates`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            employee_id: employeeId,
            course_id: courseId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to generate certificate'
        );
      }

      setCertificate(data);
    } catch (error) {
      console.error(error);
      setError(
        error.message ||
        'Failed to generate certificate'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3>Certificate</h3>
          <p>
            Generate a course completion certificate
          </p>
        </div>

        <Award size={30} />
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="form-grid">

        <div className="form-group">
          <label>Employee</label>

          <select
            value={employeeId}
            onChange={(e) =>
              setEmployeeId(e.target.value)
            }
            disabled={dataLoading}
          >
            <option value="">
              {dataLoading
                ? 'Loading employees...'
                : 'Select Employee'}
            </option>

            {employees.map((employee) => (
              <option
                key={employee.employee_id}
                value={employee.employee_id}
              >
                {employee.employee_id} -{' '}
                {employee.first_name}{' '}
                {employee.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Completed Course</label>

          <select
            value={courseId}
            onChange={(e) =>
              setCourseId(e.target.value)
            }
            disabled={
              !employeeId || coursesLoading
            }
          >
            <option value="">
              {coursesLoading
                ? 'Loading passed courses...'
                : 'Select Passed Course'}
            </option>

            {courses.map((course) => (
              <option
                key={course.course_id}
                value={course.course_id}
              >
                {course.course_id} -{' '}
                {course.course_title}
              </option>
            ))}
          </select>

          {employeeId &&
            !coursesLoading &&
            courses.length === 0 && (
              <small>
                No passed courses available for this employee.
              </small>
            )}
        </div>

      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="primary-button"
          onClick={generateCertificate}
          disabled={
            loading ||
            !employeeId ||
            !courseId
          }
        >
          <Award size={18} />

          {loading
            ? 'Generating...'
            : 'Generate Certificate'}
        </button>
      </div>

      {certificate && (
        <div
          className="form-message"
          style={{
            marginTop: '25px',
            display: 'block',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle size={20} />

            <strong>
              Certificate generated successfully
            </strong>
          </div>

          <div style={{ marginTop: '15px' }}>
            <p>
              <strong>Certificate ID:</strong>{' '}
              {certificate.certificate_id}
            </p>

            <p>
              <strong>Employee:</strong>{' '}
              {certificate.employee_name}
            </p>

            <p>
              <strong>Course:</strong>{' '}
              {certificate.course_name}
            </p>

            <p>
              <strong>Completion Date:</strong>{' '}
              {certificate.completion_date}
            </p>

            <p>
              <strong>Status:</strong>{' '}
              {certificate.status}
            </p>
          </div>

          {certificate.certificate_url && (
            <a
              href={certificate.certificate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button"
              style={{
                display: 'inline-flex',
                marginTop: '15px',
                textDecoration: 'none',
              }}
            >
              View Certificate PDF
            </a>
          )}
        </div>
      )}

      <div
        style={{
          marginTop: '40px',
          paddingTop: '25px',
          borderTop: '1px solid #ddd',
        }}
      >
        <h3>Verify Certificate</h3>

        <CertificateVerification />
      </div>
    </div>
  );
}

function CertificateVerification() {
  const [certificateId, setCertificateId] =
    useState('');

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const verifyCertificate = async () => {
    try {
      setLoading(true);
      setResult(null);

      const response = await fetch(
        `${API_BASE_URL}/verify/${encodeURIComponent(
          certificateId
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Certificate verification failed'
        );
      }

      setResult(data);
    } catch (error) {
      setResult({
        valid: false,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '10px',
        }}
      >
        <input
          type="text"
          value={certificateId}
          onChange={(e) =>
            setCertificateId(e.target.value)
          }
          placeholder="CERT-41607B1577DA"
        />

        <button
          type="button"
          className="primary-button"
          onClick={verifyCertificate}
          disabled={
            loading ||
            !certificateId.trim()
          }
        >
          <Search size={18} />

          {loading
            ? 'Checking...'
            : 'Verify'}
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
          }}
        >
          <strong>
            {result.valid
              ? '✓ Certificate is valid'
              : '✗ Certificate is invalid'}
          </strong>

          <p>{result.message}</p>

          {result.valid && (
            <>
              <p>
                <strong>Employee:</strong>{' '}
                {result.employee_name}
              </p>

              <p>
                <strong>Course:</strong>{' '}
                {result.course_name}
              </p>

              <p>
                <strong>Completion Date:</strong>{' '}
                {result.completion_date}
              </p>

              <p>
                <strong>Status:</strong>{' '}
                {result.status}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Certificate;
