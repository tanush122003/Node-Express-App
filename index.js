const express = require('express');
const storage = require('node-persist');
const app = express();
app.use(express.json());
const port = 8000;

storage.init();

app.post("/students", async(req,res)=>
{
    const {student_id,student_name,student_gpa} = req.body;
    await storage.setItem(student_id,student_name,student_gpa);

    res.send(`Added student`);
    console.log("Post request initiated.");

});

app.get("/students", async(req,res)=>
{
    const students = await storage.getItem("students");
    res.json({
        students: students
    });
})

app.get('/student/:id',async(req,res)=>
{
    console.log(req.params)
    const students = await storage.getItem('students')
    const student = students.filter((student)=>
    {
        if(student?.student_id==req.params.id)
        {
            return student
        }
    })
    res.json({student})
})

app.get('/topper',async(req,res)=>
{
    const students = await storage.getItem('students')
    const gpaArray = students.map((student)=>
    {
        return student.student_gpa
    }).sort((a,b)=>b-a)

    const sameHighest = gpaArray.map((singleGPA)=>
    {
        const greatest = gpaArray[0]
        if(singleGPA===greatest)
        {
            return singleGPA
        }
    }).filter((singleElement)=>singleElement!==undefined)

    const topper = students.map((student)=>
    {
        for(element of sameHighest)
        {
            if(student?.student_gpa===element)
            {
                return student
            }
        }
    }).filter((singleElement)=>singleElement!==undefined)
    console.log(topper,'sameHighest')
})


app.listen(port,()=>{
    console.log(`Server started at the port ${port}`);
})