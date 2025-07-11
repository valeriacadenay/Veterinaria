const BASE_URL = "http://localhost:3000";

export const api = {
  get: (endpoint) => fetch(`${BASE_URL}/${endpoint}`).then(res => res.json()),
  post: (endpoint, data) => fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  }).then(res => res.json()),
  patch: (endpoint, data) => fetch(`${BASE_URL}/${endpoint}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  }).then(res => res.json()),
  delete: (endpoint) => fetch(`${BASE_URL}/${endpoint}`, {
    method: "DELETE"
  }).then(res => res.json())
};
