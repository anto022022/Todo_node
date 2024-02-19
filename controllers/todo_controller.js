const Todo = require("../models/todo");

const returnRes = (res, status, message, code, data) => {
  return res.json({
    success: status,
    message: message,
    ...(code == 500 && data && { error: data }),
    ...(code != 500 && data && { data: data }),
  });
};

module.exports = {
  Create: async (req, res) => {
    try {
      let { task_name } = req.body;
      if (!task_name || !task_name.trim())
        return returnRes(res, false, "Empty response", 200, "");
      let totalCount = await Todo.countDocuments();
      if (totalCount > 29)
        return returnRes(res, false, "Max limit of tasks reached!", 200, "");
      let taskNameExist = await Todo.find({
        task_name: task_name.toLowerCase(),
      });
      if (taskNameExist.length > 0)
        return returnRes(res, false, "Duplicate task", 200, "");
      let data = new Todo({
        task_name: task_name.toLowerCase(),
        is_completed: false,
      });
      data.save();
      if (!data) return returnRes(res, false, "Task creation failed", 200, "");
      return returnRes(res, true, "Task created successfully", 200, "");
    } catch (error) {
      return returnRes(res, false, "Something went wrong", 500, error.message);
    }
  },

  PatchTask: async (req, res) => {
    try {
      let { _id, task_name } = req.body;
      if (!_id || !task_name || !_id.trim() || !task_name.trim())
        return returnRes(res, false, "Empty response", 200, "");
      let taskNameExist = await Todo.find({
        task_name: task_name.toLowerCase(),
      });
      if (taskNameExist.length > 0)
        return returnRes(res, false, "Duplicate task", 200, "");
      let result = await Todo.findByIdAndUpdate(_id, {
        task_name: task_name.toLowerCase(),
      });
      if (!result) return returnRes(res, false, "Task not found", 200, result);
      return returnRes(res, true, "Task updated successfully", 200, "");
    } catch (error) {
      return returnRes(res, false, "Something went wrong", 500, error.message);
    }
  },

  PatchStatus: async (req, res) => {
    try {
      let { _id } = req.body;
      if (!_id || !_id.trim())
        return returnRes(res, false, "Empty id", 200, "");
      let result = await Todo.findByIdAndUpdate(_id, { is_completed: true });
      if (!result) return returnRes(res, false, "Task not found", 200, "");
      return returnRes(res, true, "Task updated successfully", 200, "");
    } catch (error) {
      return returnRes(res, false, "Something went wrong", 500, error.message);
    }
  },

  Delete: async (req, res) => {
    try {
      let { _id } = req.body;
      if (!_id || !_id.trim())
        return returnRes(res, false, "Empty id", 200, "");
      let result = await Todo.findByIdAndDelete(_id);
      if (!result) return returnRes(res, false, "Task not found", 200, "");
      return returnRes(res, true, "Task deleted successfully", 200, "");
    } catch (error) {
      return returnRes(res, false, "Something went wrong", 500, error.message);
    }
  },

  DeleteAll: async (req, res) => {
    try {
      let result = await Todo.deleteMany({});
      if (!result) return returnRes(res, false, "Task not found", 200, "");
      return returnRes(res, true, "Tasks deleted successfully", 200, "");
    } catch (error) {
      return returnRes(res, false, "Something went wrong", 500, error.message);
    }
  },

  List: async (req, res) => {
    try {
      const { page, limit } = req.query;
      if (!page || !page.trim() || !limit || !limit.trim())
        return returnRes(res, false, "fetching tasks failed", 200, "");
      const startIndex = (page - 1) * limit;
      let data = await Todo.find().skip(startIndex).limit(limit);
      let totalCount = await Todo.countDocuments();
      if (!data || !totalCount)
        return returnRes(res, false, "fetching tasks failed", 200, "");
      return returnRes(res, true, "List fetched successfully", 200, {
        list: data,
        total: totalCount,
      });
    } catch (error) {
      return returnRes(res, false, "Something went wrong", 500, error.message);
    }
  },
};
