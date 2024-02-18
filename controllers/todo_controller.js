const Todo = require("../models/todo")

const returnRes = (res,status, message,code, data) => {
  return res.json({
    success:status,
    message:message,
    ...(code == 500 && data && {error:data}),
    ...(code != 500 && data && {data:data}),
  })
}

module.exports = {
 Create: async(req,res) =>{
  try{
    let {task_name} = req.body
    if(!task_name.trim()) return returnRes(res,false,"Empty response",200,"")
    let taskNameExist = await Todo.find({task_name:task_name.trim()})
    if(taskNameExist.length > 0) return returnRes(res,false,"Duplicate task",200,"")
    let data = new Todo({task_name:task_name, is_completed:false})
    data.save();
    if(!data) return returnRes(res,true,"Task not saved",200,result)
  }catch(error){
    return returnRes(res,false,"Something went wrong",500, error.message)
  }
 },

 PatchTask: async(req,res) =>{
  try{
    let {_id , task_name} = req.body
    if(!_id.trim() || !task_name.trim()) return returnRes(res,false,"Empty response",200,"")
    let taskNameExist = await Todo.find({task_name:task_name.trim()})
    if(taskNameExist.length > 0) return returnRes(res,false,"Duplicate task",200,"")
    let result = await Todo.findByIdAndUpdate(_id, {task_name:task_name})
    console.log('result---->',result);
    if(!result) return returnRes(res,true,"Task not found",200,result)
    return returnRes(res,true,"Task updated successfully",200,'')
  }catch(error){
    return returnRes(res,false,"Something went wrong",500, error.message)
  }
 },

 PatchStatus: async(req,res) =>{
  try{
    let {_id} = req.body
    if(!_id.trim()) return returnRes(res,false,"Empty id",200,"")
    let result = await Todo.findByIdAndUpdate(_id, {is_completed:true})
    console.log('result---->',result);
    if(!result) return returnRes(res,true,"Task not found",200,'')
    return returnRes(res,true,"Task updated successfully",200,'')
  }catch(error){
    return returnRes(res,false,"Something went wrong",500, error.message)
  }
 },

 Delete:async (req,res) =>{ 
    try{
        let {_id} = req.body
        if(!_id.trim()) return returnRes(res,false,"Empty id",200,"")
        let result = await Todo.findByIdAndDelete(_id)
        console.log('result---->',result);
        if(!result) return returnRes(res,true,"Task not found",200,'')
        return returnRes(res,true,"Task deleted successfully",200,'')
    }
    catch(error){
        return returnRes(res,false,"Something went wrong",500, error.message)
    }
 },

 DeleteAll:async (req,res) =>{ 
    try{
        let result = await Todo.deleteMany({})
        console.log('result---->',result);
        if(!result) return returnRes(res,true,"Task not found",200,'')
        return returnRes(res,true,"Tasks deleted successfully",200,'')
    }
    catch(error){
        return returnRes(res,false,"Something went wrong",500, error.message)
    }
 },

 List: async (req, res) => {
    try {
       let data = await Todo.find()
       return returnRes(res,true,"List fetched successfully",200, data)
    }
    catch{
        return returnRes(res,false,"Something went wrong",500, error.message)
    }
 }
}
  

