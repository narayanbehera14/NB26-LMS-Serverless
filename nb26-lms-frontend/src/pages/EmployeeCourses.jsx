import { useEffect, useState } from "react";
import {
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
} from "lucide-react";
import { getEmployeeCourses } from "../api";

function EmployeeCourses({ setCurrentPage }) {
  const employeeId = "EMP001";

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEmployeeCourses(employeeId);

        console.log("Employee Courses API:", data);

        setCourses(
          Array.isArray(data?.courses) ? data.courses : []
        );
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const getStatusIcon = (status) => {
    if (status === "passed") {
      return <CheckCircle size={18} />;
    }

    if (status === "failed") {
      return <AlertCircle size={18} />;
    }

    return <Clock size={18} />;
  };

  const getStatusClass = (status) => {
    return status.replace(/\s+/g, "-").toLowerCase();
  };

  return (
    <div className="card employees-page">
      <div className="card-header">
        <div>
          <h3>My Courses</h3>
          <p>
            Courses assigned to employee {employeeId}
          </p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          Loading assigned courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={28} />
          <p>No courses assigned</p>
        </div>
      ) : (
        <div className="employee-list">
          {courses.map((course) => (
            <div
              className="employee-card"
              key={course.course_id}
            >
              <div>
                <h4>{course.course_title}</h4>

                <p>
                  Course ID: {course.course_id}
                </p>

                <p>
                  Due: {course.due_date}
                </p>

                <p>
                  Progress: {course.progress}%
                </p>
              </div>

              <div>
                <span
                  className={`status-pill ${getStatusClass(
                    course.status
                  )}`}
                >
                  {getStatusIcon(course.status)}
                  {course.status}
                </span>

                <p>
                  Attempts: {course.attempt_count}/3
                </p>

                {course.status === "passed" && (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      setCurrentPage("certificate")
                    }
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    <Award size={18} />
                    View Certificate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeeCourses;