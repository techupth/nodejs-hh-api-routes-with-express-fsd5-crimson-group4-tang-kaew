// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let mockUpAssignmentData = assignments;

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;
  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }

  const limitedAssignments = mockUpAssignmentData.slice(0, limit);

  return res.json({
    message: "Complete Fetching assignments",
    data: limitedAssignments,
  });
});

app.get("/assignments/:assignmentsId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);
  let assignmentData = mockUpAssignmentData.filter(
    (item) => item.id === assignmentIdFromClient
  );

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentData[0],
  });
});

app.post("/assignments", (req, res) => {
  mockUpAssignmentData.push({
    id: mockUpAssignmentData[mockUpAssignmentData.length - 1].id + 1,
    ...req.body,
  });

  return res.json({
    message: "New assignment has been created successfully",
    data: mockUpAssignmentData,
  });
});

app.delete("/assignments/:assignmentsId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);

  let newAssignment = mockUpAssignmentData.filter((item) => {
    return item.id !== assignmentIdFromClient;
  });

  if (newAssignment.length === mockUpAssignmentData.length) {
    return res.json({
      message: "Cannot delete, No data available!",
    });
  }

  mockUpAssignmentData = newAssignment;

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been deleted successfully`,
  });
});

app.put("/assignments/:assignmentsId", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);
  const assignmentIndex = mockUpAssignmentData.findIndex((item) => {
    return item.id === assignmentIdFromClient;
  });

  if (assignmentIndex === -1) {
    return res.status(404).json({
      message: "Cannot update, No data available!",
    });
  } else {
    mockUpAssignmentData[assignmentIndex] = {
      id: assignmentIdFromClient,
      ...req.body,
    };

    return res.json({
      message: `Assignment Id : ${assignmentIdFromClient}  has been updated successfully`,
      data: mockUpAssignmentData[assignmentIndex],
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
