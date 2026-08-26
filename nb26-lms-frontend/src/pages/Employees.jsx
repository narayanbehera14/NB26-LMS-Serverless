import { useEffect, useState } from 'react';
import { Search, Plus, Users, X } from 'lucide-react';
import { getEmployees, createEmployee } from '../api';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
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
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getEmployees();
      setEmployees(Array.isArray(data?.employees) ? data.employees : Array.isArray(data?.Items) ? data.Items : Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      setFormError('');
      await createEmployee(formData);
      setShowForm(false);
      setFormData({
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
      await loadEmployees();
    } catch (err) {
      console.error(err);
      setFormError(err.message);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    const value = [
      employee.employee_id,
      employee.first_name,
      employee.last_name,
      employee.email,
      employee.department,
      employee.role,
      employee.status,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return value.includes(search.toLowerCase());
  });

  return (
    <div className="card employees-page">
      <div className="card-header">
        <div>
          <h3>Employees</h3>
          <p>Manage employee records</p>
        </div>
      </div>

      <div className="employees-toolbar">
        <div className="search-wrapper">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search employees"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="button" className="primary-button" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading employees...</div>
      ) : (
        <>
          {filteredEmployees.length === 0 ? (
            <div className="empty-state">
              <Users size={28} />
              <p>No employees found</p>
            </div>
          ) : (
            <div className="employee-list">
              {filteredEmployees.map((employee) => (
                <div className="employee-card" key={employee.employee_id || employee.email || employee.id}>
                  <div>
                    <h4>
                      {employee.first_name} {employee.last_name}
                    </h4>
                    <p>{employee.email}</p>
                    <p>
                      {employee.department} • {employee.role}
                    </p>
                  </div>
                  <span className={`status-pill ${employee.status}`}>{employee.status}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="employee-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Add Employee</h2>
                <p>Create a new team member</p>
              </div>
              <button type="button" className="close-button" onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Employee ID</label>
                  <input
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    placeholder="EMP-1001"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@company.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Engineering"
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Frontend Engineer"
                  />
                </div>
                <div className="form-group">
                  <label>Manager</label>
                  <input
                    name="manager"
                    value={formData.manager}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                  />
                </div>
                <div className="form-group">
                  <label>Joining Date</label>
                  <input
                    type="date"
                    name="joining_date"
                    value={formData.joining_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Employment Type</label>
                  <select name="employment_type" value={formData.employment_type} onChange={handleChange}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="active">Active</option>
                    <option value="onboarding">Onboarding</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {formError && <div className="error-banner">{formError}</div>}

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={creating}>
                  {creating ? 'Saving...' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
