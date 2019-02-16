
const rheroes = []
heroesINeed.forEach((hero)=>{
  const url = getURL('characters', [`nameStartsWith=${hero}`])
  callApi(url,  (res)=>{
    if (res.data.results.length) {
      let firstOne = res.data.results[0]
      rheroes.push({id: firstOne.id, name: firstOne.name})
    }
    if (heroesINeed.findIndex((h)=>h === hero) === heroesINeed.length-1) {
      rheroes.forEach(h=>console.log(JSON.stringify(h) + ','))
    }
  })
})
let filtered = heroes.sort((prev, cur)=>{
  if (prev.name < cur.name) return -1
  else return 1
})
console.log(filtered);
