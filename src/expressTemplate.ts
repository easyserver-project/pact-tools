export const getTemplate = (
  interactionOptions: { interaction: string; given: string[] }[],
  config: { [index: string]: string }
) => `<html lang="en">
<head>
<title>Interaction control</title>
<script>
function handleClick(interaction, given){
    fetch("/__interactions", {method: "POST", body: JSON.stringify({interaction, given}), headers: {"Content-Type": "application/json"}})
    document.getElementById("selected-"+interaction).innerHTML = given
}
</script>
<style> 
.flex{
display: flex; 
flex-direction: row;
margin-bottom: 1rem;;
}
</style>
</head>
<body>
${interactionOptions
  .map(
    (io) => `
<div>
<div>
<span>${io.interaction}:</span> <span id="selected-${io.interaction}">${config[io.interaction]}</span>
</div>
<div class="flex">
${io.given
  .map(
    (g) => `
<button onclick="handleClick('${io.interaction}','${g}')">${g}</button>
`
  )
  .join('')}
</div>
</div>`
  )
  .join('')}
<br/>
<hr/>
</body>
</html>`
