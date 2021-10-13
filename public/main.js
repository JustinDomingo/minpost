window.onload= function() {
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("prof-options-btn")) {
            alert("Test")
        }
    })

    //Selecting Elements

    let formTwo = document.querySelector('#formTwo')
    let postsContainer = document.querySelector('#postInput')
    let dropBtn = document.querySelector('#dropBtn')
    let dropMenu = document.querySelector('#dropMenu')
    let error = document.querySelector('#err')
    let active = false
    let a = document.querySelector('#a')
    let postData
    let toggled = false
    let editToggled = false

    //Getting data

    function htmlHandle(data) {
        postsContainer.innerHTML = data.map(item => {
            return `
                <div class="post-container">
                    <a class="a" href='/user/${item.author}'><h3 class="author">${item.author}</h3></a>
                    <div class="date">${item.date.toLocaleString()}</div>
                    <div class="options-cont">
                    <button id="optionsBtn" class="options-btn"><i class="fas fa-ellipsis-v" style="color: gray;"></i></button>
                        <button data-author="${item.author}" data-id="${item._id}" data-text="${item.body}" id="editBtn" class="edit inside-btn invisible">Edit</button><button data-author="${item.author}" data-id="${item._id}" id="deleteBtn" class="delete inside-btn invisible">Delete</button>
                        <br>
                        <button class="invisible-two">Delete</button>
                    </div>
                    <p class="body-text">${item.body}</p>
                </div>
            `
        }).join('')
    }

    fetch('/api/data')
        .then(res => res.json())
        .then(data => {
            data.sort(function(a,b){
                    return new Date(b.date) - new Date(a.date);
            })
            postData = data
            htmlHandle(data)
            let activeTwo = false
            document.addEventListener("click", e => {
                if (e.target.classList.contains("options-btn")) {
                    if (!activeTwo) {
                        var btns = e.target.parentElement.children
                        for (var i=0;i<btns.length; i++) {
                            btns[i].classList.remove("invisible");
                        }
                        activeTwo = true
                    } else {
                        var btns = document.getElementsByClassName("inside-btn")
                        for (var i=0;i<btns.length; i++) {
                            btns[i].classList.add("invisible");
                        }
                        activeTwo = false
                    }
                }
            })
        })

    //Events

    a.addEventListener("click", () => {
        formTwo.submit()
    })
    
    dropBtn.addEventListener("click", () => {
        if (!active) {
            dropMenu.classList.remove("invisible")
            active = true
        } else {
            dropMenu.classList.add("invisible")
            active = false
        }
    })

    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains("menu-btn") && active) {
            dropMenu.classList.add("invisible")
            active = false
        } else {
            return
        }
    })

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete")) {
            let author = e.target.getAttribute("data-author")
            let id = e.target.getAttribute("data-id")
            axios.post('/delete-item', {_id: id, author: author}).then(() => {
                e.target.parentElement.parentElement.remove()
            }).catch((err) => {
                let HTML = `<div class="error-msg">You can only delete your own posts</div>`
                if (!toggled) {
                    error.insertAdjacentHTML('beforeend', HTML)
                    toggled = true
                } else {
                    console.log("Ran")
                    return
                } 
            })
        }
    })

    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("edit")) {
            let id = e.target.getAttribute("data-id")
            let author = e.target.getAttribute("data-author")
            let text = e.target.getAttribute("data-text")

            function isOwnPost() {
                return new Promise((resolve, reject) => {
                    axios.post('/check-post', {author: author}).then((res) => {
                        resolve(true)
                    }).catch(() => {
                        reject()
                    })
                })
            }

            try {
                let postBool = await isOwnPost()
                if (postBool) {
                e.target.parentElement.parentElement.children[3].innerHTML = `
                    <form id="editForm">
                        <input id="editInput" value='${text}' class="edit-input"></input><button class="upd-btn">Post</button>
                    </form>      
                `
                let editForm = document.querySelector('#editForm')
                let editInput = document.querySelector('#editInput')
                editForm.addEventListener("submit", (e) => {
                    e.preventDefault()
                    axios.post('/edit-item', {_id: id, updateText: editInput.value, author: author}).then((response) => {
                        e.target.parentElement.parentElement.children[3].innerHTML = `${response.data}`
                    }).catch((err) => {
                        console.log(err)
                    })
                })
                }
            } catch {
                let HTML = `<div class="error-msg">You can only edit your own posts</div>`
                if (!toggled) {
                    error.insertAdjacentHTML('beforeend', HTML)
                    toggled = true
                } else {
                    console.log("Ran")
                    return
                } 
            }
        }
    })
}