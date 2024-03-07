/*
C - POST - hostname:port/api/v1/products + (data)
R - GET(all) - hostname:port/api/v1/products  - https://localhost:3000/api/v1/products
  - GET(byID) - hostname:port/api/v1/products/id
U - PUT - hostname:port/api/v1/products/id + data
D - DELETE - hostname:port/api/v1/products/id 
*/
// axios
var url = "http://localhost:3000/posts"
var globalList;

function Compare(a, b) {
    if (parseInt(a.id) > parseInt(b.id)) {
        return 1;
    } else {
        return -1;
    }
}

function Load() {
    fetch(url).then(function (response) {
        return response.json()
    }).then(function (posts) {
        posts.sort(Compare);
        globalList = posts;
        var tbody = document.getElementById('tbody');
        tbody.innerHTML = "";
        for (const post of posts) {
            tbody.innerHTML += ConvertFormPostToRow(post);
        }
    })
}
function GetmaxID() {
    let ids = globalList.map(element => element.id);
    return Math.max(...ids);
}

function Delete(id) {
    fetch(url + "/" + id, {
        method: 'DELETE'
    }).then(function () {
        Load();
    })

}

function Save() {
    let id = parseInt(document.getElementById('id').value);
    if (isNaN(id)) {
        let newItem = {
            id: (GetmaxID() + 1) + "",
            userId: document.getElementById('userid').value,
            title: document.getElementById('title').value,
            body: document.getElementById('body').value,
        }
        Create(newItem);
    }
    else {
        if (checkExist(id)) {
            let editItem = {
                userId: document.getElementById('userid').value,
                title: document.getElementById('title').value,
                body: document.getElementById('body').value,
            }
            Edit(id, editItem);
        } else {
            let newItem = {
                id: id + "",
                userId: document.getElementById('userid').value,
                title: document.getElementById('title').value,
                body: document.getElementById('body').value,
            }
            Create(newItem);
        }
    }
}

function checkExist(id) {
    let ids = globalList.map((element) => (element.id));
    return ids.includes(id + "");
}
function Edit(id, data) {
    fetch(url + "/" + id, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function () {
        Load();
    })
}


function Create(data) {
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function () {
        Load();
    })
}

function ConvertFormPostToRow(post) {
    var string = '<tr>';
    string += '<td>' + post.id + '</td>';
    string += '<td>' + post.userId + '</td>';
    string += '<td>' + post.title + '</td>';
    string += '<td>' + post.body + '</td>';
    string += '<td><button onclick="Delete(' + post.id + ')">Delete</button></td>';
    string += '</tr>';
    return string;
}