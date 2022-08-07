import { join, dirname } from "path";
import { fileURLToPath } from "url";
import swaggerAutogen from "swagger-autogen";

const __dirname = dirname(fileURLToPath(import.meta.url));

const doc = {
  // общая информация
  info: {
    title: "MaileHereko API",
    version: "1.0.0",
  },
  // что-то типа моделей
  definitions: {
    User: {
      email: "example@gmail.com",
      movies_ids: [],
      tv_shows_ids: [],
      suggestions_ids: [],
      manual_suggestions_ids: [],
    },
    Credentials: {
      email: "example@gmail.com",
      password: "some_password_value",
    },
    Success: {
      ok: true,
    },
    Failed: {
      ok: false,
    },
    SuccessLogin: {
      ok: true,
      token: "access_token_example",
      user: {
        $ref: "#/definitions/User",
      },
    },
    EmailAlready: {
      ok: false,
      message: "User with such an email already exists",
    },
    FailedRegister: {
      ok: false,
      message: "Failed to register. Try again",
    },
    FailedLogin: {
      ok: false,
      message: "Failed to login. Try again",
    },
    InvalidEmail: {
      ok: false,
      email: {
        message: "Invalid email format",
      },
    },
    IncorrectCredentials: {
      ok: false,
      message: "Incorrect email or password",
    },
    InvalidPassword: {
      ok: false,
      password: {
        message: "Password must be at least <count> characters long",
      },
    },
    IncorrectAccessToken: {
      ok: false,
      message: "Access denied",
    },
    NotFoundUser: {
      ok: false,
      message: "User not found",
    },
  },
};

// путь и название генерируемого файла
const outputFile = join(__dirname, "../swagger_docs.json");
// массив путей к роутерам
const endpointsFiles = [join(__dirname, "../index.js")];

swaggerAutogen(/* options */)(outputFile, endpointsFiles, doc);
