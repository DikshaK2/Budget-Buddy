// const model = require('../models/model');

// //post: http://localhost:8080/api/categories
// async function create_Categories(req,res){
//     const Create = new model.Categories({
//         type:"Savings",
//         color:'#1F3B5C',//dark color
//     })

//     await Create.save(function(err){
//         if(!err) return res.json(Create);
//         return res.status(400).json({message:`Error while creating categories ${err}`});
//     });
// }

// module.exports={
//     create_Categories
// }

 //OR

const model = require('../models/model');

// POST: http://localhost:8080/api/categories
async function create_Categories(req, res) {
    try {
        const Create = new model.Categories({
            type: "Investment",
            color: '#fcbe44', // dark color
        });

        // Use async/await for the save operation
        const result = await Create.save();

        // If save is successful, send the result back as JSON
        res.json(result);
    } catch (err) {
        // Catch any errors and send a 400 status with the error message
        res.status(400).json({ message: `Error while creating categories: ${err.message}` });
    }
}

// get: http://localhost:8080/api/categories
async function get_Categories(req,res) {
    let data = await model.Categories.find({})

    let filter=await data.map(v=> Object.assign({},{type:v.type,color:v.color}));
    return res.json(filter);
}

// post: http://localhost:8080/api/transaction
async function create_Transaction(req, res) {
    if (!req.body) return res.status(400).json("Post HTTP Data not Provided");
    
    try {
        let { name, type, amount } = req.body;

        const create = new model.Transaction({
            name,
            type,
            amount,
            date: new Date()
        });

        // Save the transaction and wait for the result
        const result = await create.save();
        
        // Return the created transaction as a response
        return res.json(result);
    } catch (err) {
        // Return an error message if the save fails
        return res.status(400).json({ message: `Error while creating transaction: ${err.message}` });
    }
}


// async function create_Transaction(req,res) {
//     if(!req.body) return res.status(400).json("Post HTTP Data not Provided");
//     let{name,type,amount}=req.body;

//     const create = await new model.Transaction({
//         name,
//         type,
//         amount,
//         date:new Date()
//     });

//     create.save(function(err){
//         if(!err) return res.json(create);
//         return res.status(400).json({message:`Error while creating transaction ${err}`});
//     });
// }

// get: http://localhost:8080/api/transaction
async function get_Transaction(req,res) {
    let data = await model.Transaction.find({});
    return res.json(data);
}

// delete: http://localhost:8080/api/transaction
async function delete_Transaction(req, res) {
    if (!req.body) {
        return res.status(400).json({ message: "Request body not Found" });
    }
    try {
        const result = await model.Transaction.deleteOne(req.body);
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No record found to delete" });
        }

        res.json({ message: "Record Deleted...!" });
    } catch (err) {
        res.status(500).json({ message: `Error while deleting Transaction Record: ${err}` });
    }
}


// async function delete_Transaction(req,res) {
//     if(!req.body)res.status(400).json({message:"Request body not Found"});
//     await model.Transaction.deleteOne(req.body,function(err){
//         if(!err)res.json("Record Deleted...!");
//     }).clone().catch(function(err){res.json("Error while deleting Transaction Record")});
// }

// get: http://localhost:8080/api/labels
async function get_Labels(req, res) {
    model.Transaction.aggregate([
        {
            $lookup: {
                from: "categories", // Ensure this matches your MongoDB collection name
                localField: 'type',
                foreignField: "type",
                as: "categories_info"
            }
        },
        {
            $unwind: "$categories_info" // Correct case
        }
    ]).then(result => {
        let data = result.map(v => 
            Object.assign({}, {
                _id: v._id,
                name: v.name,
                type: v.type,
                amount: v.amount,
                color: v.categories_info['color'] // Correct case
            })
        );
        res.json(data);
    }).catch(error => {
        res.status(400).json({ message: "Lookup Collection Error", error }); // Improved error response
    });
}


module.exports = {
    create_Categories,
    get_Categories,
    create_Transaction,
    get_Transaction,
    delete_Transaction,
    get_Labels
};