const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function authHeader() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { ...authHeader(), ...options.headers },
    })
  } catch {
    throw new ApiError('Cannot reach the API. Is the backend running?', 0)
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const detail = body?.detail
    let message
    if (typeof detail === 'string') {
      message = detail
    } else if (Array.isArray(detail)) {
      // FastAPI validation errors arrive as a list of {loc, msg}.
      message = detail.map((d) => d.msg).join('. ')
    } else {
      message = response.statusText
    }
    throw new ApiError(message, response.status)
  }

  return body
}

const json = (method, body) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

// Every path here is relative to BASE_URL (/api), which the backend serves and
// the dev proxy forwards verbatim.
export const api = {
  health: () => request('/health'),
  metrics: () => request('/metrics'),

  /**
   * Scores an image File/Blob via multipart upload. When signed in, the patient
   * details ride along and the backend files the result in the dashboard.
   */
  predict: (file, patient = {}) => {
    const form = new FormData()
    form.append('file', file)
    if (patient.name) form.append('patient_name', patient.name)
    if (patient.gender) form.append('gender', patient.gender)
    if (patient.age) form.append('age', patient.age)
    if (patient.abha) form.append('abha', patient.abha)
    // No Content-Type header: the browser sets the multipart boundary itself.
    return request('/predict', { method: 'POST', body: form })
  },

  screenings: (limit = 10) => request(`/screenings?limit=${limit}`),

  signup: (fullName, email, password) =>
    request('/signup', json('POST', { full_name: fullName, email, password })),

  login: (email, password) => request('/login', json('POST', { email, password })),

  me: () => request('/me'),
}
