const url = new URL(location.href);
const movieId = url.searchParams.get("id");
const movieTitle = url.searchParams.get("title");

const APILiNK = "http://127.0.0.1:8000/api/v1/reviews/";

const main = document.getElementById("section");
const title = document.getElementById("title");

title.innerText = movieTitle;

returnReviews(APILiNK);

const div_new = document.createElement('div');
div_new.innerHTML=`
    <div class="row">
        <div class="column">
            <div class="card">
                New Review
                <p><strong>Review: </strong>
                    <input class="new_review" type="text" id="new_review" value="">
                </p>
                <p><strong>User: </strong>
                    <input class="new_user" type="text" id="new_user" value="">
                </p>
                <p><a href="#" onclick="saveReview('new_review', 'new_user')" style="text-decoration :none; color: lightblue; border-bottom: 2px solid white;">save</a>
                </p>
            </div>
        </div>
    </div>
`
main.appendChild(div_new);

function returnReviews(url){
    fetch(url + "movie/" + movieId).then(res => res.json()).then(function(data){
        console.log(data);
        data.forEach(review =>{
            const div_card = document.createElement('div');
            div_card.innerHTML = `
                    <div class="row">
                        <div class="column">
                            <div class="card" id="${review._id}">
                                <p><strong>Review: </strong>${review.review}</p>
                                <p><strong>User: </strong>${review.user}</p>
                                <p>
                                    <a href="#" data-id="${review._id}" data-review="${review.review}" data-user="${review.user}" onclick="editReview(this)" style="text-decoration :none; color: lightblue; border-bottom: 2px solid white;">edit</a> 
                                    <a href="#" onclick="deleteReview('${review._id}')" style="text-decoration :none; color: lightblue; border-bottom: 2px solid white;">delete</a>
                                </p>
                            </div>
                        </div>
                    </div>            
                `;
            main.appendChild(div_card);
        });
    });
}

function editReview(element){
    const id = element.getAttribute('data-id');
    const review = element.getAttribute('data-review');
    const user = element.getAttribute('data-user');
    
    const card = document.getElementById(id);
    const reviewInputId = "review" + id;
    const userInputId = "user" + id;
    
    card.innerHTML = `
        <p><strong>Review: </strong>
            <input class="review-input" type = "text" id="${reviewInputId}" value="${review}">
            </p>
        <p><strong>User: </strong>
            <input class="review-input" type ="text" id="${userInputId}" value="${user}">
            </p>
            <p><a href="#" onclick="saveReview('${reviewInputId}', '${userInputId}', '${id}')" style="text-decoration :none; color: lightblue; border-bottom: 2px solid white;">save</a>
            </p>
    
    `
}

function saveReview(reviewInputId, userInputId, id=""){
    const review = document.getElementById(reviewInputId).value
    const user = document.getElementById(userInputId).value

    if (id) {
        fetch(APILiNK + id, {
            method: 'PUT',
            headers:{
                'Accept':'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"user":user, "review":review})
        }).then(res => res.json())
          .then(res => {
            console.log(res)
            location.reload();
          });
    } else {
        fetch(APILiNK + "new", {
            method: 'POST',
            headers:{
                'Accept':'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"user":user, "review":review, "movieId": movieId})
        }).then(res => res.json())
          .then(res => {
            console.log(res)
            location.reload();
            })
        }
}

function deleteReview(review_Id){
    fetch(APILiNK + review_Id,{
        method: "DELETE"
    }).then(res => res.json())
    .then(res => {
        console.log(res)
        location.reload();
        })
}