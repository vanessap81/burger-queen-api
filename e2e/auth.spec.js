const config = require('../config');

const { fetch, fetchWithAuth } = process;

describe('POST /auth', () => {
  it('should respond with 400 when email and password missing', () => (
    fetch('/login', { method: 'POST' })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should respond with 400 when email is missing', () => (
    fetch('/login', {
      method: 'POST',
      body: { email: '', password: 'xxxx' },
    })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should respond with 400 when password is missing', () => (
    fetch('/login', {
      method: 'POST',
      body: { email: 'foo@bar.baz' },
    })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('fail with 404 credentials dont match', () => (
    fetch('/login', {
      method: 'POST',
      body: { email: `foo-${Date.now()}@bar.baz`, password: 'xxxx', role: 'waiter' },
    })
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should create new auth token', () => (
    fetch('/login', {
      method: 'POST',
      body: { email: config.adminEmail, password: config.adminPassword, role: 'admin' },
    })
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
  ));
});
