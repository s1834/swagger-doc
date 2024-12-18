const express = require("express");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");

const app = express();

const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader.indexOf("Basic ") !== 0) {
    res.set("WWW-authenticate", 'Basic realm="Restricted Area"');
    return res.status(401).send({ message: "Authentication required" });
  }
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  const validUser = username === "admin" && password === "password";
  if (!validUser) {
    return res.status(401).send({ message: "Invalid credentials" });
  }

  next();
};

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
    },
    components: {
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
          headers: {
            WWW_Authenticate: {
              schema: {
                type: "string",
              },
            },
          },
        },
      },
      securitySchemes: {
        basicAuth: {
          type: "http",
          scheme: "basic",
        },
      },
    },
    security: [
      {
        basicAuth: [],
      },
    ],
  },
  apis: ["app.js"],
};

const swaggerDocs = swaggerjsdoc(swaggerOptions);
console.log(swaggerDocs);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerDocs));
app.use(basicAuth);

/**
 * @swagger
 * /books:
 *      get:
 *          description: Get all books
 *          security:
 *              - basicAuth: []
 *          responses:
 *              200:
 *                  description: Success
 *              401:
 *                  $ref: '#/components/responses/UnauthorizedError'
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
 *          security:
 *            - basicAuth: []
 *          requestBody:
 *            content:
 *              application/x-www-form-urlencoded:
 *                schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                      description: Title of the book
 *                      example: "Harry Potter"
 *          responses:
 *              201:
 *                  description: Added new book
 *              401:
 *                  $ref: '#/components/responses/UnauthorizedError'
 */
app.post("/books", (req, res) => {
  res.status(201).send();
});

app.listen(3000, () => console.log("listening on port 3000"));
