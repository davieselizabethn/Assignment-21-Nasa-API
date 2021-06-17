const inputNumber = document.getElementById('input-number')
const submitBtn = document.getElementById('submit-btn')
const imageDetails = document.getElementById('image-details')
const gallery = document.getElementById('gallery')
let information = []

// events listeners
inputNumber.addEventListener('keyup', function () {
  if (Number(inputNumber.value)) {
    submitBtn.removeAttribute('disabled')
  } else {
    submitBtn.setAttribute('disabled', true)
  }
})

submitBtn.addEventListener('click', function (event) {
  event.preventDefault()

  let inputValue = inputNumber.value

  imageDetails.innerHTML = "";
  gallery.innerHTML = `<img src="./spinner.gif">`

  fetch(
    `https://api.nasa.gov/planetary/apod?api_key=EhMgBqUdZxDDpg3OhNPV7ibf0RhhEmP7J8mxquDu&count=${inputValue}&thumbs=true`
  )
    .then((res) => res.json())
    .then((data) => {
      information = data
      render(information)
    })
})

gallery.addEventListener('click', function (event) {
  let itemIndex = "";

  if (event.target.classList.value === "overlay") {
    itemIndex = event.target.parentElement.getAttribute("data-index");
  } else if (event.target.parentElement.classList.value === "overlay") {
    itemIndex = event.target.parentElement.parentElement.getAttribute("data-index");
  }

  let item = information[itemIndex];
  imageDetails.innerHTML = renderItemDetails(item);
})

imageDetails.addEventListener("click", function (event) {
  if (event.target.tagName === "BUTTON") {
    imageDetails.innerHTML = "";
  }
})

// functions
function render(data) {
  let index = 0;

  gallery.innerHTML = data.reduce((result, media) => {
    const { date, media_type, title, url, thumbnail_url } = media
    if (media_type !== 'other') {
      result += `
      <div class="gallery-item" data-index=${index++}>
        <h4>${media_type}</h4>
        <div class="overlay">
          <h3>${title}</h3>
          <p>${date}</p>
        </div>
        <embed src="${media_type === "video" ? thumbnail_url : url}" id="embed">
      </div>
    `
    }

    return result
  }, '')
}

function renderItemDetails(item) {
  const { title, explanation, url, media_type, copyright, thumbnail_url } = item;
  let result = "";

  result += `
    <h2>${title}</h2>
    <p>${explanation}</p>
    ${media_type === "video" ? `<a href="${url}" target="_blank">see video</a>` : ""}
    <embed
      src="${media_type === "video" ? thumbnail_url : url}">
    ${copyright ? `<p class="copyright">©copyright ${copyright}</p>` : ""}
    <button>X</button>
  `

  return result;
}