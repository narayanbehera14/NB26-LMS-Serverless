const API_BASE_URL =
  "https://tq1py1806g.execute-api.us-east-1.amazonaws.com";

export async function getEmployees() {
  const response = await fetch(`${API_BASE_URL}/employees`);

  if (!response.ok) {
    throw new Error(`Failed to fetch employees: ${response.status}`);
  }

  return await response.json();
}

export async function getEmployeeCourses(employeeId) {
  const url = `${API_BASE_URL}/employee-courses?employee_id=${encodeURIComponent(
    employeeId
  )}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Failed to fetch employee courses: ${response.status}`
    );
  }

  return data;
}

export async function createEmployee(employeeData) {
  const response = await fetch(`${API_BASE_URL}/employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employeeData),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }
  if (!response.ok) {
    throw new Error(
      data.message ||
      data.error ||
      `Failed to create employee: ${response.status}`
    );
  }
  return data;
}

export async function createCourse(courseData) {
  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(courseData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Failed to create course: ${response.status}`
    );
  }

  return data;
}

export async function getCourses() {
  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: "GET",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.message || `Failed to fetch courses: ${response.status}`
    );
  }
  return data;
}

export async function assignCourse(courseData) {
  const response = await fetch(`${API_BASE_URL}/assign-course`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(courseData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Failed to assign course: ${response.status}`
    );
  }

  return data;
}

export async function getSkillGap(employeeId = null) {
  let url = `${API_BASE_URL}/skill-gap`;

  if (employeeId) {
    url += `?employee_id=${encodeURIComponent(employeeId)}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch skill gap: ${response.status}`);
  }

  return await response.json();
}

export async function createQuiz(quizData) {
  const response = await fetch(`${API_BASE_URL}/quizzes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quizData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Failed to create quiz: ${response.status}`
    );
  }

  return data;
}

export async function submitQuiz(quizData) {
  const response = await fetch(`${API_BASE_URL}/quiz/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quizData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Failed to submit quiz: ${response.status}`
    );
  }

  return data;
}

export async function getQuiz(courseId) {
  const url = `${API_BASE_URL}/quizzes?course_id=${encodeURIComponent(courseId)}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Failed to fetch quiz: ${response.status}`
    );
  }

  return data;
}

export async function getCertificates() {
  const response = await fetch(`${API_BASE_URL}/certificates`, {
    method: "GET",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.message || `Failed to fetch certificates: ${response.status}`
    );
  }
  return data;
}
