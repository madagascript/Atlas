let client;
let db;
const clientPromise = stitch.StitchClientFactory.create('personal-sphcw');
function displayCommentsOnLoad() {
   clientPromise.then(stitchClient => {
       client = stitchClient;
       db = client.service('mongodb', 'mongodb-atlas').db('blog');
       return client.login().then(displayComments)
   });
}

function displayComments() {
  db.collection('comments').find({}).execute().then(docs => {
    var html = docs.map(c => '<div>' + c.comment + '</div>').join('');
    comments.innerHTML = html;    
    tuID.innerText = client.authedId()
    debug.innerText = JSON.stringify(client)
  });
  
}

function addComment() {  
  db.collection('comments').insertOne({ 
    owner_id : client.authedId(), 
    comment: new_comment.value      
  })
  .then(displayComments);
  new_comment.value = '';
 }