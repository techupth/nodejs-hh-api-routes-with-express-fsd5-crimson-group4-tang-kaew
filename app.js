// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mockUpAssignmentData = assignments;
const mockUpCommentData = comments.slice();

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

app.get("/assignments/:assignmentsId/comments", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);
  const assignmentComment = mockUpCommentData.filter(
    (comment) => comment.assignmentId === assignmentIdFromClient
  );
  if (assignmentComment.length === 0) {
    return res.status(404).json({
      message: "This Assignment doesn't have any comment",
      data: assignmentComment,
    });
  } else {
    return res.json({
      message: "Complete fetching comments",
      data: assignmentComment,
    });
  }
});

app.post("/assignments/:assignmentsId/comments", (req, res) => {
  let assignmentIdFromClient = Number(req.params.assignmentsId);

  const newCommentId =
    mockUpCommentData.length > 0
      ? mockUpCommentData[mockUpCommentData.length - 1].id + 1
      : 1;

  const newComment = {
    id: newCommentId,
    assignmentId: assignmentIdFromClient,
    ...req.body,
  };

  mockUpCommentData.push(newComment);

  return res.json({
    message: "New assignment's comment has been created successfully",
    data: newComment,
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
