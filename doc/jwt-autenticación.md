
# 🔐 JWT Authentication Service Guide

## 📘 Introduction

Authentication based on **JWT (JSON Web Token)** allows verifying a user's identity using **digitally signed tokens** without needing to maintain sessions on the server. This facilitates application scalability and improves the user experience.

---

## ⚙️ General Workflow

1. **Login**: The user sends their credentials to the server.
2. **Token generation**: The server generates a JWT if the credentials are valid.
3. **Token reception**: The client stores the token (usually in localStorage or cookies).
4. **Protected access**: The client sends the token in requests to access protected routes.
5. **Token verification**: The server validates the JWT before granting access.
6. **Renewal or revocation**: Refresh tokens and revocation can be implemented as needed.

---

## 🧩 JWT Structure

A JWT consists of three parts:

* **Header**: Token type and signing algorithm (e.g. HS256 or RS256).
* **Payload**: User data (claims).
* **Signature**: Token signature generated using a secret key or RSA key pair.

Example of Header and Payload:

```json
{
  "alg": "RS256",
  "typ": "JWT"
}
{
  "userId": "1",
  "email": "admin@example.com",
  "iat": 1750306753,
  "exp": 1750310353,
  "aud": "Open Science API",
  "iss": "Open Science API"
}
```

---

## 🚀 JWT Authentication Service Implementation

### 1. **Key Dependencies**

* `jsonwebtoken`: To generate and verify JWTs.
* `express`: HTTP framework.
* `zod`: Schema validation.

---

### 2. **Singleton Service: `AuthSingleton`**

This service centralizes token management:

* Signs access tokens.
* Verifies incoming tokens.
* Provides middleware to protect routes.

Usage:

```ts
const authService = AuthSingleton.getInstance();
const token = authService.generateAccessToken({ userId: '1', email });
```

Middleware:

```ts
userRouter.delete('/', authService.getMiddleware(), deleteUser);
```

---

### 3. **Define Protected Routes**

#### user.controller.ts

```ts
const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email === 'admin@example.com' && password === '123456789') {
    const token = authService.generateAccessToken({ userId: '1', email });
    return res.status(HttpStatus.OK).json({ token });
  }
  res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
};
```

#### user.routes.ts

```ts
userRouter.post('/login', validateMiddleware(loginSchema), login);
userRouter.delete('/', authService.getMiddleware(), deleteUser);
```

---

### 4. **Validation with Zod**

```ts
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
```

---

## 🧪 Authenticated Request Example

Once the JWT token is obtained after login:

```http
GET /api/user
Authorization: Bearer <token>
```

The middleware extracts the token, verifies it, and allows access if valid.

---

## ✅ Best Practices

* Use `RS256` for stronger security (private/public key pair).
* Encrypt tokens if storing in cookies.
* Implement `refresh tokens` to maintain the session.
* Revoke tokens from the backend when the user logs out.

---

## 📚 Conclusion

This guide provides the foundations for implementing JWT-based authentication in an Express application. Using a singleton service allows for a clean, centralized, and secure structure to protect routes and manage stateless sessions. For production environments, it is recommended to add refresh token storage, short expirations, and active security monitoring.
