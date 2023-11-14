# Burger Queen - API Node.js

## Contents

- [1. Preface](#1-preface)
- [2. Project summary](#2-project-summary)
- [3. Getting started](#3-getting-started)
- [4. Routes](#4-routes)
- [5. Technologies](#4-technologies-used)
- [6. Author](#6-author)

---

## 1. Preface

In the the restaurant industry, efficient order management is crucial for providing quality service and ensuring customer satisfaction. As my client, the Burger Queen restaurant, expanded its operations and experienced an increase in orders, the need for an efficient system became evident.

To meet this demand, it was developed the Burger Queen API, a flexible backend application designed to handle order processing and staff management. This API serves as the backbone of an application that makes the restaurant staff manage orders more easylly, resulting in a smoother workflow and enhanced customer experience.

## 2. Project Summary

The Burger Queen API is a Node.js-based backend solution designed for handling orders in a dynamic restaurant environment. This project was based in the needs of the day to day workflow of the client, looking into streamling the orders process.

**Key Features:**

- Order Processing: Manage incoming orders, track their status, and update in real-time.

- Menu Integration: Integrate the restaurant's menu to facilitate accurate order creation and customization.

- User Authentication: Secure user authentication ensures that only authorized personnel can access and manage orders, and that certains features are for highier roles.

- Scalability: Built with scalability in mind to accommodate the restaurant's expanding operations.

- Real-time Updates: Keep staff informed with real-time updates on order status.

## 3. Getting started

Here you can find the [API URL](http://burger-queen-api-dusky.vercel.app) that can be used in your front-end application.

## 4. Routes

`/`

- `GET /`

<img src='./assets/GET NAME VERSION.png'>

`/login`

- `POST /login`

The request for this route must send an object containing the fields:

<img src='./assets/POST LOGIN REQ.png'>

The response should be a code `200`.

<img src='./assets/POST LOGIN RESP.png'>

`/users`

- `GET /users`

There must be an authorization header, type Bearer with the generated token, or an `401` code will be returned.

If the token is not of an user with the role admin, a `403` code will be returned.

When the token is of an admin user, the response should be a array of objects, containing all users, with the code `200`.

<img src='./assets/GET USERS.png'>

- `GET /users/:id`

There must be an authorization header, type Bearer with the generated token, or an `401` code will be returned.

If the token is not of an user with the role admin, a `403` code will be returned.

When the token is of an admin user, the response should be an object, containing the searched user, with the code `200`.

<img src='./assets/GET USERS BY ID.png'>

- `POST /users`

The body for this request must have the required fields.

<img src='./assets/POST USERS.png'>

There must be an authorization header, type Bearer with the generated token, or an `401` code will be returned.

If the token is not of an user with the role admin, a `403` code will be returned.

When all fields are sent in the request, and the token is of an admin user, the response should be a code `201`;

<img src='./assets/PUT USERS REQ.png'>

- `PUT /users/:id`

The body for this request must have the user fields.

<img src='./assets/PUT USERS REQ.png'>

There must be an authorization header, type Bearer with the generated token, or an `401` code will be returned.

If the token is not of an user with the role admin, a `403` code will be returned.

When fields are sent in the request, and the token is of an admin user, the response should be a code `200`;

<img src='./assets/PUT USERS RESP.png'>

- `DELETE /users/:id`

There must be an authorization header, type Bearer with the generated token, or an `401` code will be returned.

If the token is not of an user with the role admin, a `403` code will be returned.

When the token is of an admin user, the response should be a code `200`;

<img src='./assets/DELETE USERS.png'>

`/products`

- `GET /products`
  There must be an authorization header, type Bearer with the generated token, or an `401` code will be returned.

The response should be a array of objects, containing all products with the code `200`.

<img src='./assets/GET PRODUCTS.png'>

- `GET /products/:id`
  There must be an authorization header, type Bearer with the generated token, or an `401` code will be returned.

The response should be an object, containing the searched product with the code `200`.

<img src='./assets/GET PRODUCTS BY id.png'>

- `POST /products`

The body for this request must have the `name`, `type` and `price` fields.

<img src='./assets/POST PRODUCTS REQ.png'>

There must be an authorization header, type Bearer with the generated token, or an `401` code will be returned.

If the token is not of an user with the role admin, a `403` code will be returned.

When fields are sent in the request, and the token is of an admin user, the response should be a code `201`.

<img src='./assets/POST PRODUCTS RESP.png'>

- `PUT /products/:id`

The body for this request must have the product fields.

<img src='./assets/PUT PRODUCTS REQ.png'>

There must be an authorization header, type Bearer with the generated token, or an `401` code will be returned.

If the token is not of an user with the role admin, a `403` code will be returned.

When fields are sent in the request, and the token is of an admin user, the response should be a code `200`.

<img src='./assets/PUT PRODUCTS RESP.png'>

- `DELETE /products/:id`

There must be an authorization header, type Bearer with the generated token, or an `401` code will be returned.

If the token is not of an user with the role admin, a `403` code will be returned.

When the token is of an admin user, the response should be a code `200`.

<img src='./assets/DELETE USERS.png'>

`/orders`

- `GET /orders`

There must be an authorization header, type Bearer with the generated token, or an `401` code will be returned.

The response should be a array of objects, containing all orders, code `200`.
<img src='./assets/GET ORDERS.png'>

The `status` field has 5 options:

`
pending
`

`
canceled
` 

`
delivering
` 

`
delivered
` 

- `GET /orders/:id`

There must be an authorization header, type Bearer with the generated token, or an `401` code will be returned.

The response should be an object, containing the searched order, with the code `200`.

<img src='./assets/GET ORDERS BY ID.png'>

- `POST /orders`

The body for this request must have the `userId` and `products` fields.

<img src='./assets/POST ORDERS REQ.png'>

There must be an authorization header, type Bearer with the generated token, or an `401` code will be returned.

When fields are sent in the request, and the token is of an authenticated user, the response should be a code `201`.

<img src='./assets/POST ORDERS RESP.png'>

- `PUT /orders/:id`

The body for this request should have the orders fields.

<img src='./assets/PUT ORDERS REQ.png'>

There must be an authorization header, type Bearer with the generated token, or an `401` code will be returned.

When fields are sent in the request, and the token is of an authenticated user, the response should be a code `200`

<img src='./assets/PUT ORDERS RESP.png'>

- `DELETE /orders/:id`

There must be an authorization header, type Bearer with the generated token, or an `401` code will be returned.

When the token is of an admin user, the response should be a code `200`

<img src='./assets/DELETE USERS.png'>

## 5. Technologies Used

- Node.js
- Express
- Postman
- MongoDB
- HTTP

## 6. Author

**Gabriela Faria**

- On github: [@gabrielafaria608](https://github.com/gabrielafaria608)
- On Linkedin: [@gabrielafaria](https://www.linkedin.com/in/gabriela-faria-649503182/)
