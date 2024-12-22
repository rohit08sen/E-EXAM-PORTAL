const postbtn=document.querySelector('.post-btn');
const queryBox=document.querySelector(".query-box")
const postDisplay=document.querySelector(".post-display");
const clear=document.querySelector(".clear-post")

//step1
postbtn.addEventListener("click",()=>{
  const queryText=queryBox.value.trim();//get the value from query box when button is clicked,

  if(queryText!==""){
    const postItem=document.createElement("div")
    postItem.className="post-item";
     // Create the content element
    const postContent=document.createElement("div");
    postContent.className="post-content"
    postContent.textContent=queryText;

     // Append the author and content to the post item
     postItem.appendChild(postContent);
     

     // Append the post item to the post display container
     postDisplay.appendChild(postItem);

     queryBox.value="";
  }else{
    alert("Please write something before posting")
  }
  clear.style.display="inline-block";

  clear.addEventListener('click',()=>{
    postDisplay.innerHTML=" "
    clear.style.display="none";
  })
});