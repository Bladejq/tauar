import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import "./utils/local-strategy.mjs";
import passport from "passport";
import pgSimpleSession from "connect-pg-simple";
import pool from "./db.mjs";
const pgSession = pgSimpleSession(session);
import cors from "cors";
import appRouter from "./routes/routes.mjs";

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser("Nurnazsecret"));
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: "Nurnazsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api",appRouter);

app.get("/", (req, res) => {
  if (req.user) {
    res.send(req.user.firstname + " " + req.user.lastname);
  } else {
    res.send("Hello!")
  }
});

const appStart = () => {
  try {
    app.listen(8000, () => {
      console.log(`Server running on port 8000`);
    });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

appStart();
