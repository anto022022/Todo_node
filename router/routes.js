const express = require("express");
const router = express.Router();

const todoController = require("../controllers/todo_controller")

router.post("/addTask", todoController.Create);
router.patch("/patchTask", todoController.PatchTask);
router.patch("/completeTask", todoController.PatchStatus);
router.delete("/deleteTask", todoController.Delete);
router.delete("/deleteAll", todoController.DeleteAll);
router.get("/list", todoController.List);

module.exports = router