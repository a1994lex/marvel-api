$(document).ready(function() {
  const PUBLICKEY = "72af6fab7d53b26b9b883b381f32439f"
  const MARVEL_URL = "http://gateway.marvel.com/v1/public"
  const characterBtn = document.getElementById("characterBtn")
  const form = document.getElementById('form')
  const backBtn = document.getElementById("backBtn")
  const heroDiv = document.getElementById("heroDiv")
  const spinner = document.getElementById("waitSpinner")
  const dataStack = []
  let currentComponent = form
  addCharacterOptions()

  function getURL(query, params) {
    let qParams = null
    if (params) {
     qParams = params.reduce((paramStr, param)=>paramStr += `${param}&`, '')
    }
    return `${MARVEL_URL}/${query}?${qParams || ''}apikey=${PUBLICKEY}`
  }

  characterBtn.addEventListener("click", function(event) {
    event.preventDefault();
    const value = document.getElementById("characterInput").value;
    if (value === "")
      return;
    getCharacter(value)
  });

  backBtn.addEventListener("click", ()=> {
    event.preventDefault()
    currentComponent.classList.add('hidden')
    const lastElem = dataStack.pop()
    if (lastElem) {
      lastElem.classList.remove("hidden")
    }
  })

  function nextScreen(oldComponent, nextComponent) {
    dataStack.push(oldComponent)
    oldComponent.classList.add("hidden")
    nextComponent.classList.remove("hidden")
    currentComponent = nextComponent
  }

  function addCharacterOptions() {
    const characterSelect = document.getElementById('characterInput')
    heroes.forEach(hero=>{
      const option = document.createElement("option")
      option.value = hero.id
      optionText = document.createTextNode(hero.name)
      option.appendChild(optionText)
      characterSelect.appendChild(option)
    })
  }

  function getCharacter(hero) {
    $("#loader-container").html("<div class='loader'/>")
    $("#characterBtn").prop("disabled", true)
    const url = getURL('characters', [`id=${hero}`])
    callApi(url, (result)=>{
      $('#loader-container').html('')
      $("#characterBtn").prop("disabled", false)

      const heroData = result.data.results.length ? result.data.results[0] : null
      fillHeroDiv(heroData)
    })
  }

  function fillHeroDiv(data) {
    nextScreen(form, heroDiv)
    if (!data) {
      heroDiv.appendChild(document.createTextNode("Sorry Something went wrong!"))
    }
    const src= `${data.thumbnail.path}.${data.thumbnail.extension}`
    $('#hero-thumbnail').attr('src', src);
    $('#hero-name').text(data.name);
    $('#hero-description').text(data.description.length ?  data.description : "No Description Available")
    $('#hero-links').empty()
    data.urls.forEach(url=>{
      let prompt = url.type === 'detail' ? "Details" : url.type === 'wiki' ? "Wiki" : "Comics"
      $('#hero-links').append(`<a href='${url.url}' class="btn btn-primary">${prompt}</a>`)
    })
  }

  function callApi(url, onReturn) {
    fetch(url)
      .then(res => {
        return res.json()
      }).then(json => {
        onReturn(json)
      }).catch(e=>{
        console.log(e)
      })
  }
})
