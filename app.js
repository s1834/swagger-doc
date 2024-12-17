const express = require("express");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Library API",
      version: "1.0.0",
    },
  },
  apis: ["app.js"],
};

const swaggerDocs = swaggerjsdoc(swaggerOptions);
console.log(swaggerDocs);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerDocs));

/**
 * @swagger
 * /books:
 *      get:
 *          description: Get all books
 *          responses:
 *              200:
 *                  description: Success
 */

app.get("/books", (req, res) => {
  res.send([
    {
      id: 1,
      title: "Harry Potter",
    },
  ]);
});

/**
 * @swagger
 * /books:
 *      post:
 *          description: Add new Book
 *          parameters:
 *             - name: title
 *               description: Title of the book
 *               in: formData
 *               required: true
 *               type: string
 *          responses:
 *              201:
 *                  description: Added new book
 */
app.post("/books", (req, res) => {
  res.status(201).send();
});

app.listen(3000, () => console.log("listening on port 3000"));
