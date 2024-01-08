import express from "express";
import { assignments } from "./data/assignments.js";

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let assignmentsMockDatabase = assignments;

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;
  if (limit >= 10) {
    return res.status(401).json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }
  const assignmentsWithLimit = assignmentsMockDatabase.slice(0, limit);
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsWithLimit,
  });
});

app.get("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  let assignmentsData = assignmentsMockDatabase.filter(
    (item) => item.id === assignmentsIdFromClient
  );

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsData[0],
  });
});

app.post("/assignments", (req, res) => {
  assignmentsMockDatabase.push({
    id: assignmentsMockDatabase[assignmentsMockDatabase.length - 1].id + 1,
    ...req.body,
  });

  return res.json({
    message: "New assignment has been created successfully",
    data: assignmentsMockDatabase,
  });
});

app.put("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  const assignmemtsIndex = assignmentsMockDatabase.findIndex((item) => {
    return item.id === assignmentsIdFromClient;
  });

  assignmentsMockDatabase[assignmemtsIndex] = {
    id: assignmentsIdFromClient,
    ...req.body,
  };

  return res.json({
    message: "Blog post has been updated successfully",
  });
});

app.delete("/assignments/:assignmentsId", (req, res) => {
  let assignmemtsIdFromClient = Number(req.params.assignmentsId);

  const newAssignments = assignmentsMockDatabase.filter((item) => {
    return item.id !== assignmemtsIdFromClient;
  });

  assignmentsMockDatabase = newAssignments;

  return res.json({
    message: "Assignment Id : assigmentsID  has been deleted successfully",
    data: assignmentsMockDatabase,
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
