import { useEffect, useState } from "react";
import {
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  ClipboardList,
} from "lucide-react";
import { getEmployees, getEmployeeCourses } from "../api";

function EmployeeCourses({ navigateTo }) {
  const params = new URLSearchParams(window.location.search);
  const requestedEmployeeId = params.get("employee_id") || "";

  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState(requestedEmployeeId);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getEmployees();
        const employeeList = Array.isArray(data?.employees)
          ? data.employees
          : Array.isArray(data)
          ? data
          : [];

        setEmployees(employeeList);
        if (!requestedEmployeeId) {
          setEmployeeId(
            employeeList.some((employee) => employee.employee_id === "EMP001")
              ? "EMP001"
              : employeeList[0]?.employee_id || ""
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setEmployeesLoading(false);
      }
    };

    loadEmployees();
  }, [requestedEmployeeId]);

  useEffect(() => {
    const loadCourses = async () => {
      if (!employeeId) {
        setCourses([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getEmployeeCourses(employeeId);

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
  }, [employeeId]);

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

      <div className="form-group" style={{ maxWidth: "420px", marginBottom: "20px" }}>
        <label htmlFor="employee-select">Employee</label>
        <select
          id="employee-select"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          disabled={employeesLoading}
        >
          <option value="">
            {employeesLoading ? "Loading employees..." : "Select employee"}
          </option>
          {employees.map((employee) => (
            <option key={employee.employee_id} value={employee.employee_id}>
              {employee.employee_id} - {employee.first_name} {employee.last_name}
            </option>
          ))}
        </select>
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

                {course.status === "passed" ? (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      navigateTo("certificates", {
                        employee_id: employeeId,
                        course_id: course.course_id,
                      })
                    }
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    <Award size={18} />
                    View Certificate
                  </button>
                ) : (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      navigateTo("take-quiz", {
                        employee_id: employeeId,
                        course_id: course.course_id,
                      })
                    }
                    style={{ marginTop: "10px" }}
                  >
                    <ClipboardList size={18} />
                    Take Quiz
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