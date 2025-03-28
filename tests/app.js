import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/dist", express.static(path.join(__dirname, "..", "dist")));
app.use(express.static(path.join(__dirname, "public")));

app.get("/testcrop", (req, res) => {
  let format = req.query.test.toLowerCase() || "umd";
  res.render("croptesting", { format });
});

app.get("/", (req, res) => {
  res.render("index", {
    title: "Home Page",
    endpoints: ["/testcrop?test=esm", "/testcrop?test=umd"],
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
