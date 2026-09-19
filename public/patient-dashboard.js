const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const toast=$("#toast");function show(t){toast.innerHTML="✓ <span>"+t+"</span>";toast.classList.add("show");clearTimeout(window.x);window.x=setTimeout(()=>toast.classList.remove("show"),2600)}
$$(".moods button").forEach(b=>b.addEventListener("click",()=>{$$(".moods button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");show("Mood set to "+b.dataset.mood)}));
function slider(id,val){const x=$(id),v=$(val);x?.addEventListener("input",()=>v.textContent=x.value+"/10")}slider("#comfort","#comfortVal");slider("#energy","#energyVal");
$("#saveCheckin")?.addEventListener("click",()=>show("Check-in saved successfully."));
$("#messageTeam")?.addEventListener("click",()=>show("Your care team has been notified."));
$("#invite")?.addEventListener("click",()=>show("Invite link prepared."));
$$(".complete").forEach(b=>b.addEventListener("click",()=>{const t=b.closest(".task");t.classList.toggle("done");b.textContent=t.classList.contains("done")?"✓":"○";show(t.classList.contains("done")?"Task completed":"Task reopened")}));
$("#showQr")?.addEventListener("click",()=>$("#medCard").classList.add("flipped"));$("#hideQr")?.addEventListener("click",()=>$("#medCard").classList.remove("flipped"));
$("#record")?.addEventListener("click",()=>show("Camera-ready demo opened. Connect your video service to record."));
$("#notify")?.addEventListener("click",()=>show("You have 2 care-team notifications."));
