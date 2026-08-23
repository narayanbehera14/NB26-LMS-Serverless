import { useEffect, useState } from 'react';
import {
  Users,
  BookOpen,
  ClipboardList,
  Award,
  X,
} from 'lucide-react';

import {
  getSkillGap,
  createEmployee,
  getEmployees,
} from './api';

import Employees from './pages/Employees';
import EmployeeCourses from './pages/EmployeeCourses';
import AssignCourse from './pages/AssignCourse';
import Quiz from './pages/Quiz';
import Courses from './pages/Courses';
import Certificate from './pages/Certificate';

import './App.css';

function App() {
const getPageFromURL = () => {
  const path = window.location.pathname;

  if (path === '/employees') return 'employees';
  if (path === '/employee-courses') return 'employee-courses';
  if (path === '/courses') return 'courses';
  if (path === '/certificates') return 'certificates';
  if (path === '/assign-course') return 'assign-course';
  if (path === '/quiz') return 'quiz';

  return 'dashboard';
};

const [currentPage, setCurrentPage] = useState(getPageFromURL);
  const navigateTo = (page) => {
    const paths = {
      dashboard: '/',
      employees: '/employees',
      'employee-courses': '/employee-courses',
      courses: '/courses',
      certificates: '/certificates',
      'assign-course': '/assign-course',
      quiz: '/quiz',
    };
    const path = paths[page] || '/';
    window.history.pushState({}, '', path);
    setCurrentPage(page);
    setShowEmployeeForm(false);
  };
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [skillGapData, setSkillGapData] = useState(null);

  const [showEmployeeForm, setShowEmployeeForm] = useState(false);

  const [employee, setEmployee] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    role: '',
    manager: '',
    joining_date: '',
    employment_type: 'Full-time',
    status: 'active',
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromURL());
      setShowEmployeeForm(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // =========================
  // LOAD EMPLOYEES
  // =========================
  async function loadEmployees() {
    try {
      setLoading(true);
      setError('');

      const data = await getEmployees();

      console.log('Employees API:', data);

      const employeeList = Array.isArray(data?.employees)
        ? data.employees
        : Array.isArray(data)
        ? data
        : [];

      setEmployees(employeeList);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load employees.');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    loadEmployees();

    async function fetchSkillGap() {
      try {
        setLoading(true);
        setError('');

        const data = await getSkillGap();

        console.log('Skill Gap API:', data);

        setSkillGapData(data);
      } catch (err) {
        console.error(err);
        setError(
          err.message || 'Failed to load skill gap data.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSkillGap();
  }, []);

  // =========================
  // EMPLOYEE FORM
  // =========================
  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CREATE EMPLOYEE
  // =========================
  const handleCreateEmployee = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setMessage('');

      const result = await createEmployee(employee);

      setMessage(
        `Employee ${result.employee_id} created successfully`
      );

      if (result.email_status === 'Failed to send welcome email') {
        setMessage(
          `Employee ${result.employee_id} created successfully, but the welcome email could not be sent.`
        );
      }

      setEmployee({
        employee_id: '',
        first_name: '',
        last_name: '',
        email: '',
        department: '',
        role: '',
        manager: '',
        joining_date: '',
        employment_type: 'Full-time',
        status: 'active',
      });

      // Refresh employee list
      await loadEmployees();
    } catch (error) {
      console.error(error);

      setMessage(
        error.message || 'Failed to create employee.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // SKILL GAP DATA
  // =========================
  const departments = Array.isArray(
    skillGapData?.skill_matrix
  )
    ? skillGapData.skill_matrix
    : [];

  // =========================
  // EMPLOYEE COUNTS
  // =========================
  const activeEmployees = employees.filter(
    (employee) => employee.status === 'active'
  ).length;

  const onboardingEmployees = employees.filter(
    (employee) => employee.status === 'Onboarding'
  ).length;

  // =========================
  // DEPARTMENT PROGRESS
  // =========================
  const calculateDepartmentProgress = (department) => {
    return Number(
      department?.completion_percentage || 0
    );
  };

  // =========================
  // PAGE ROUTING
  // =========================
  return (
    <div className="app-shell">
      <main className="main">
        <section className="content">

          {/* =========================
              EMPLOYEES PAGE
          ========================= */}
          {currentPage === 'employees' ? (
            <Employees />

          /* =========================
             EMPLOYEE COURSES PAGE
          ========================= */
          ) : currentPage === 'employee-courses' ? (
            <EmployeeCourses />

          /* =========================
             CREATE COURSE PAGE
          ========================= */
          ) : currentPage === 'courses' ? (
            <Courses />

           /* =========================
             ASSIGN COURSE PAGE
           ========================= */
           ) : currentPage === 'assign-course' ? (
            <AssignCourse />

           /* =========================
             CERTIFICATES PAGE
           ========================= */
           ) : currentPage === 'certificates' ? (
            <Certificate />

           /* =========================
             QUIZ PAGE
           ========================= */
           ) : currentPage === 'quiz' ? (
            <Quiz />

          /* =========================
             LOADING
          ========================= */
          ) : loading ? (
            <div className="card">
              <div className="card-header">
                <div>
                  <h3>Loading</h3>
                  <p>
                    Fetching department skill data...
                  </p>
                </div>
              </div>
            </div>

          /* =========================
             ERROR
          ========================= */
          ) : error ? (
            <div className="card">
              <div className="card-header">
                <div>
                  <h3>Unable to load data</h3>
                  <p>{error}</p>
                </div>
              </div>
            </div>

          /* =========================
             DASHBOARD
          ========================= */
          ) : (
            <>
              {/* =========================
                  EMPLOYEES
              ========================= */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <h3>Employees</h3>
                    <p>
                      Employees registered in the LMS
                    </p>
                  </div>
                </div>

                {loading && (
                  <p>Loading employees...</p>
                )}

                {error && (
                  <p className="error">
                    {error}
                  </p>
                )}

                {!loading && !error && (
                  <div className="employee-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Employee ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Department</th>
                          <th>Role</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {employees.length === 0 ? (
                          <tr>
                            <td
                              colSpan="6"
                              style={{
                                textAlign: 'center',
                                padding: '20px',
                              }}
                            >
                              No employees found.
                            </td>
                          </tr>
                        ) : (
                          employees.map((employee) => (
                            <tr
                              key={
                                employee.employee_id
                              }
                            >
                              <td>
                                {
                                  employee.employee_id
                                }
                              </td>

                              <td>
                                {
                                  employee.first_name
                                }{' '}
                                {
                                  employee.last_name
                                }
                              </td>

                              <td>
                                {employee.email}
                              </td>

                              <td>
                                {
                                  employee.department
                                }
                              </td>

                              <td>
                                {employee.role}
                              </td>

                              <td>
                                <span className="status">
                                  {employee.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* =========================
                  OVERVIEW
              ========================= */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <h3>Overview</h3>
                    <p>
                      Current learning summary
                    </p>
                  </div>
                </div>

                <div className="overview-grid">

                  <div className="overview-item">
                    <Users size={22} />

                    <div>
                      <strong>
                        {loading
                          ? '...'
                          : employees.length}
                      </strong>

                      <span>
                        Total Employees
                      </span>
                    </div>
                  </div>

                  <div className="overview-item">
                    <Users size={22} />

                    <div>
                      <strong>
                        {loading
                          ? '...'
                          : activeEmployees}
                      </strong>

                      <span>
                        Active Employees
                      </span>
                    </div>
                  </div>

                  <div className="overview-item">
                    <ClipboardList size={22} />

                    <div>
                      <strong>
                        {loading
                          ? '...'
                          : onboardingEmployees}
                      </strong>

                      <span>
                        Onboarding
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* =========================
                  DEPARTMENT PROGRESS
              ========================= */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <h3>
                      Department Progress
                    </h3>

                    <p>
                      Training completion by team
                    </p>
                  </div>
                </div>

                <div className="department-list">

                  {departments.length === 0 ? (
                    <p>
                      No departments available.
                    </p>
                  ) : (
                    departments.map(
                      (department, index) => {

                        const departmentName =
                          department.department_name ||
                          department.department ||
                          department.name ||
                          `Department ${
                            index + 1
                          }`;

                        const employeeCount =
                          Number(
                            department.employee_count ||
                              department.employeeCount ||
                              0
                          );

                        const percent =
                          calculateDepartmentProgress(
                            department
                          );

                        return (
                          <div
                            className="department-row"
                            key={`${departmentName}-${index}`}
                          >
                            <div className="department-info">
                              <strong>
                                {departmentName}
                              </strong>

                              <span>
                                {employeeCount}{' '}
                                employee
                                {employeeCount === 1
                                  ? ''
                                  : 's'}
                              </span>
                            </div>

                            <div className="progress-container">

                              <div className="progress">
                                <div
                                  className="progress-fill"
                                  style={{
                                    width: `${percent}%`,
                                  }}
                                />
                              </div>

                              <span>
                                {percent}%
                              </span>

                            </div>
                          </div>
                        );
                      }
                    )
                  )}

                </div>
              </div>

              {/* =========================
                  QUICK ACTIONS
              ========================= */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <h3>Quick Actions</h3>
                    <p>
                      Frequently used actions
                    </p>
                  </div>
                </div>

                <div className="quick-actions">

                  {/* ADD EMPLOYEE */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowEmployeeForm(true)
                    }
                  >
                    <Users size={20} />
                    Add Employee
                  </button>

                  {/* EMPLOYEES */}
                  <button
                    type="button"
                    onClick={() =>
                      navigateTo('employees')
                    }
                  >
                    <Users size={20} />
                    Employees
                  </button>

                  {/* MY COURSES */}
                  <button
                    type="button"
                    onClick={() =>
                      navigateTo(
                        'employee-courses'
                      )
                    }
                  >
                    <BookOpen size={20} />
                    My Courses
                  </button>

                  {/* CREATE COURSE */}
                  <button
                    type="button"
                    onClick={() => navigateTo('courses')}
                  >
                    <BookOpen size={20} />
                    Create Course
                  </button>

                  {/* ASSIGN COURSE */}
                  <button
                    type="button"
                    onClick={() =>
                      navigateTo(
                        'assign-course'
                      )
                    }
                  >
                    <ClipboardList size={20} />
                    Assign Course
                  </button>

                  {/* QUIZ */}
                  <button
                    type="button"
                    onClick={() =>
                      navigateTo('quiz')
                    }
                  >
                    <ClipboardList size={20} />
                    Take Quiz
                  </button>

                  {/* CERTIFICATES */}
                  <button
                    type="button"
                    onClick={() =>
                      navigateTo('certificates')
                    }
                  >
                    <Award size={20} />
                    View Certificates
                  </button>

                </div>
              </div>
            </>
          )}

          {/* =========================
              ADD EMPLOYEE MODAL
          ========================= */}
          {showEmployeeForm &&
            currentPage !== 'employees' && (
              <div
                className="modal-overlay"
                onClick={() =>
                  setShowEmployeeForm(false)
                }
              >
                <div
                  className="modal-content"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >

                  {/* MODAL HEADER */}
                  <div className="modal-header">

                    <div>
                      <h2>Add Employee</h2>
                      <p>
                        Create a new team member
                      </p>
                    </div>

                    <button
                      type="button"
                      className="close-button"
                      onClick={() =>
                        setShowEmployeeForm(false)
                      }
                      aria-label="Close form"
                    >
                      <X size={18} />
                    </button>

                  </div>

                  {/* FORM */}
                  <form
                    onSubmit={
                      handleCreateEmployee
                    }
                  >

                    <div className="form-grid">

                      {/* EMPLOYEE ID */}
                      <div className="form-group">
                        <label>
                          Employee ID
                        </label>

                        <input
                          type="text"
                          name="employee_id"
                          value={
                            employee.employee_id
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="EMP-1001"
                          required
                        />
                      </div>

                      {/* FIRST NAME */}
                      <div className="form-group">
                        <label>
                          First Name
                        </label>

                        <input
                          type="text"
                          name="first_name"
                          value={
                            employee.first_name
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="John"
                          required
                        />
                      </div>

                      {/* LAST NAME */}
                      <div className="form-group">
                        <label>
                          Last Name
                        </label>

                        <input
                          type="text"
                          name="last_name"
                          value={
                            employee.last_name
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Doe"
                          required
                        />
                      </div>

                      {/* EMAIL */}
                      <div className="form-group">
                        <label>
                          Email
                        </label>

                        <input
                          type="email"
                          name="email"
                          value={employee.email}
                          onChange={
                            handleChange
                          }
                          placeholder="john@example.com"
                          required
                        />
                      </div>

                      {/* DEPARTMENT */}
                      <div className="form-group">
                        <label>
                          Department
                        </label>

                        <select
                          name="department"
                          value={
                            employee.department
                          }
                          onChange={
                            handleChange
                          }
                          required
                        >
                          <option value="">
                            Select Department
                          </option>

                          <option value="Engineering">
                            Engineering
                          </option>

                          <option value="HR">
                            HR
                          </option>

                          <option value="Finance">
                            Finance
                          </option>

                          <option value="Marketing">
                            Marketing
                          </option>

                          <option value="Sales">
                            Sales
                          </option>
                        </select>
                      </div>

                      {/* ROLE */}
                      <div className="form-group">
                        <label>
                          Role
                        </label>

                        <input
                          type="text"
                          name="role"
                          value={employee.role}
                          onChange={
                            handleChange
                          }
                          placeholder="Cloud Engineer"
                          required
                        />
                      </div>

                      {/* MANAGER */}
                      <div className="form-group">
                        <label>
                          Manager
                        </label>

                        <input
                          type="text"
                          name="manager"
                          value={
                            employee.manager
                          }
                          onChange={
                            handleChange
                          }
                          placeholder="Manager Name"
                          required
                        />
                      </div>

                      {/* JOINING DATE */}
                      <div className="form-group">
                        <label>
                          Joining Date
                        </label>

                        <input
                          type="date"
                          name="joining_date"
                          value={
                            employee.joining_date
                          }
                          onChange={
                            handleChange
                          }
                          required
                        />
                      </div>

                      {/* EMPLOYMENT TYPE */}
                      <div className="form-group">
                        <label>
                          Employment Type
                        </label>

                        <select
                          name="employment_type"
                          value={
                            employee.employment_type
                          }
                          onChange={
                            handleChange
                          }
                        >
                          <option value="Full-time">
                            Full-time
                          </option>

                          <option value="Part-time">
                            Part-time
                          </option>

                          <option value="Intern">
                            Intern
                          </option>

                          <option value="Contract">
                            Contract
                          </option>
                        </select>
                      </div>

                    </div>

                    {/* MESSAGE */}
                    {message && (
                      <div className="form-message">
                        {message}
                      </div>
                    )}

                    {/* ACTIONS */}
                    <div className="modal-actions">

                      <button
                        type="button"
                        onClick={() =>
                          setShowEmployeeForm(
                            false
                          )
                        }
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={submitting}
                      >
                        {submitting
                          ? 'Creating...'
                          : 'Create Employee'}
                      </button>

                    </div>

                  </form>
                </div>
              </div>
            )}

        </section>
      </main>
    </div>
  );
}

export default App;