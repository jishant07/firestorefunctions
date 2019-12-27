const functions = require('firebase-functions');
var admin = require("firebase-admin");
var serviceAccount = require("./credentials.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://health-card-5c612.firebaseio.com"
});

var dbref = admin.firestore();

// *************************************
// Assumed Variable names in POST
// Search Patient : tobeRetrived [used in : search,update,delete]
// tobeUpdated(index = Array)  [used in : update]
// newValue = (Array) [used in : update]
// **************************************


exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.addPatient = functions.https.onRequest((req,res)=>{
    if(req.method === 'POST')
    {
        let data = req.body;
        dbref.collection('patient-data').add(req.body)
        .then(retdata =>{
            res.json({
                message: "Patient added to the database",
                retdata: retdata.id
            })
            return null;
        })
        .catch(err =>{
            res.json({
                err
            })
        })
    }
})


exports.addDoctor = functions.https.onRequest((req,res)=>{
    if(req.method === 'POST')
    {
        let data = req.body;
        dbref.collection('doctor-data').add(req.body)
        .then(retdata =>{
            res.json({
                message: "Doctor added to the database",
                retdata: retdata.id
            })
            return null;
        })
        .catch(err =>{
            res.json({
                err
            })
        })
    }
})

exports.allPatients = functions.https.onRequest((req,res)=>{
    if(req.method === 'GET')
    {
        dbref.collection('patient-data').get()
        .then(snapshot =>{
            var data = []
            snapshot.forEach(doc=>{
                data.push({id:doc.id,data:doc.data()})
            })        
            res.json(data)   
            return null;
        })
        .catch(err =>{
            res.json({
                err
            })
        })
    }
})

exports.allDoctors = functions.https.onRequest((req,res)=>{
    if(req.method === 'GET')
    {
        dbref.collection('doctor-data').get()
        .then(snapshot =>{
            var data = []
            snapshot.forEach(doc=>{
                data.push({id:doc.id,data:doc.data()})
            })        
            res.json(data)   
            return null;
        })
        .catch(err =>{
            res.json({
                err
            })
        })
    }
})

exports.searchPatient = functions.https.onRequest((req,res)=>{
    if(req.method === 'POST')
    {
        dbref.collection('patient-data').doc(req.body.tobeRetrived).get()
        .then(doc=>{
            if(!doc.exists)
            {
                res.json({
                    message : "The requested data isn't available"
                })
            }
            else
            {
                let data = doc.data();
                let id = doc.id;
                res.json({
                    message : "Retrival succes",
                    id,
                    data
                })
            }
            return null;
        })
        .catch(err => {
            res.json({
                err
            })
        })
    }
})

exports.searchDoctor = functions.https.onRequest((req,res)=>{
    if(req.method === 'POST')
    {
        dbref.collection('doctor-data').doc(req.body.tobeRetrived).get()
        .then(doc=>{
            if(!doc.exists)
            {
                res.json({
                    message : "The requested data isn't available"
                })
            }
            else
            {
                let data = doc.data();
                let id = doc.id;
                res.json({
                    message : "Retrival success",
                    id,
                    data
                })
            }
            return null;
        })
        .catch(err =>{
            res.json({
                err
            })
        })
    }
})

exports.updatePatient = functions.https.onRequest((req,res)=>{
    if(req.method === 'POST')
    {
        var index = req.body.index;
        var newval = req.body.newValue;
        if(index.length === newval.length && index.length>0)
        {
            dbref.collection('patient-data').doc(req.body.tobeRetrived).get()
            .then(doc =>{
                if(!doc.exists)
                {
                    res.json({
                        message:"No such document found"
                    })
                }
                else
                {
                    for(var i=0;i<index.length;i++)
                    {
                        dbref.collection('patient-data').doc(req.body.tobeRetrived).update(index[i],newval[i]);
                    }
                    res.json({
                        message : "Update successful"
                    })
                }
                return null;
            })
            .catch(err =>{
                res.json({
                    err
                })
            })
        }
    }
})

exports.updateDoctor = functions.https.onRequest((req,res)=>{
    if(req.method === 'POST')
    {
        var index = req.body.index;
        var newval = req.body.newValue;
        console.log(req.body);
        if(index.length === newval.length && index.length>0)
        {
            dbref.collection('doctor-data').doc(req.body.tobeRetrived).get()
            .then(doc =>{
                if(!doc.exists)
                {
                    res.json({
                        message:"No such document found"
                    })
                }
                else
                {
                    for(var i=0;i<index.length;i++)
                    {
                        dbref.collection('doctor-data').doc(req.body.tobeRetrived).update(index[i],newval[i]);
                    }
                    res.json({
                        message : "Update successful"
                    })
                }
                return null;
            })
            .catch(err =>{
                res.json({
                    err
                })
            })
        }
    }
})

exports.deletePatient = functions.https.onRequest((req,res)=>{
    if(req.method === 'POST')
    {
        dbref.collection('patient-data').doc(req.body.tobeRetrived).get()
        .then(doc=>{
            if(!doc.exists)
            {
                res.json({
                    message:"No document found to delete"
                })
            }
            else
            {
                dbref.collection('patient-data').doc(req.body.tobeRetrived).delete()
                .then(()=>{
                    res.json({
                        message:"The document was deleted"
                    })
                    return null;
                })
                .catch(err =>{
                    res.json({
                        err
                    })
                })
                
            }
            return null;
        })
        .catch(err =>{
            res.json({
                err
            })
        })
    }
})

exports.deleteDoctor = functions.https.onRequest((req,res)=>{
    if(req.method === 'POST')
    {
        dbref.collection('doctor-data').doc(req.body.tobeRetrived).get()
        .then(doc=>{
            if(!doc.exists)
            {
                res.json({
                    message:"No document found to delete"
                })
            }
            else
            {
                dbref.collection('doctor-data').doc(req.body.tobeRetrived).delete()
                .then(()=>{
                    res.json({
                        message:"The document was deleted"
                    })
                    return null;
                })
                .catch(err =>{
                    res.json({
                        err
                    })
                })
            }
            return null;
        })
        .catch(err =>{
            res.json({
                err
            })
        })
    }
})