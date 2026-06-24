let lastAlarm = localStorage.getItem("lastAlarm") || "";
let zonaChart;
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTTAgE1S935-2P6AUUddelLeHJBOcUgrzAROMQAzu1AyGhm6SVRncEcuplPqxnvdFKsZDEcIOqyhwbv/pub?output=csv";

const ctx = document.getElementById('zonaChart');

zonaChart = new Chart(ctx,{
    type:'bar',
    data:{
        labels:['Zona 1','Zona 2','Zona 3','Zona 4','Zona 5'],
        datasets:[{
            label:'Meter Hilang',
            data:[0,0,0,0,0],

            backgroundColor:[
                '#8b5cf6',
                '#f59e0b',
                '#3b82f6',
                '#ef4444',
                '#22c55e'
            ],

            borderRadius:8
        }]
    },

    options:{
        responsive:true,
        maintainAspectRatio:false
    }
});
fetch(SHEET_URL)
.then(response => response.text())
.then(csv => {

    const rows = csv.trim().split("\n");
    const header = rows[0];

const dataRows = rows.slice(1);

dataRows.sort((a,b)=>{

    const aCols = a.split(",");
    const bCols = b.split(",");

    const aDate = aCols[0].split("/");
    const bDate = bCols[0].split("/");

    const dateA = new Date(
        aDate[2],
        aDate[1]-1,
        aDate[0]
    );

    const dateB = new Date(
        bDate[2],
        bDate[1]-1,
        bDate[0]
    );

    return dateB - dateA;

});

rows.length = 0;

rows.push(header);

rows.push(...dataRows);

    let zona1 = 0;
    let zona2 = 0;
    let zona3 = 0;
    let zona4 = 0;
    let zona5 = 0;

    let total = rows.length - 1;

    for(let i=1;i<rows.length;i++){

        const cols = rows[i].split(",");

        const zona = cols[1]?.trim().toUpperCase();

        if(zona === "ZONA 1") zona1++;
        if(zona === "ZONA 2") zona2++;
        if(zona === "ZONA 3") zona3++;
        if(zona === "ZONA 4") zona4++;
        if(zona === "ZONA 5") zona5++;
    }

    document.querySelector(".big-number").textContent = total;

    document.getElementById("z1").textContent = zona1;
    document.getElementById("z2").textContent = zona2;
    document.getElementById("z3").textContent = zona3;
    document.getElementById("z4").textContent = zona4;
    document.getElementById("z5").textContent = zona5;
zonaChart.data.datasets[0].data = [
    
    zona1,
    zona2,
    zona3,
    zona4,
    zona5
];
let alarmData = null;

for(let i=1;i<rows.length;i++){

    const cols = rows[i].split(",");

    const status = cols[7]?.trim().toUpperCase();

    if(status === "PROSES" || status === "BARU"){

 alarmData = {
    pelanggan: cols[3],
    zona: cols[1],
    alamat: cols[5],
    telepon: cols[4],
    golongan: cols[6],
    tanggal: cols[0]
};
        break;
    }
}
if(alarmData){

document.getElementById("alarmContainer").innerHTML = `
    <div class="alarm-name">
        👤 ${alarmData.pelanggan}
    </div>

    <div class="alarm-zona">
        📍 ${alarmData.zona}
    </div>

    <div class="alarm-alamat">
        ${alarmData.alamat}
    </div>

    <div class="alarm-telp">
        ☎ ${alarmData.telepon}
    </div>

    <div class="alarm-gol">
        🏷 Gol. ${alarmData.golongan}
    </div>

<div class="alarm-tanggal">
    📅 ${alarmData.tanggal}
</div>
`;
document.getElementById("alarmStatus").innerHTML =
"🔴 ALARM AKTIF";

document.getElementById("alarmStatus")
.classList.remove("normal");

document.getElementById("alarmStatus")
.classList.add("active");
document.getElementById("runningText").innerHTML = `
🔴 ALARM METER HILANG :
${alarmData.pelanggan}
 | ${alarmData.zona}
 | ${alarmData.alamat}
`;
const currentAlarm =
    alarmData.pelanggan + "_" +
    alarmData.tanggal;

if(currentAlarm !== lastAlarm){

    const sound =
        document.getElementById("alarmSound");

    sound.play();

    setTimeout(() => {
        sound.pause();
        sound.currentTime = 0;
    }, 5000);

    localStorage.setItem(
        "lastAlarm",
        currentAlarm
    );
}
}

else{

    document.getElementById("alarmStatus").innerHTML =
    "🟢 NORMAL";

    document.getElementById("alarmStatus")
    .classList.remove("active");

    document.getElementById("alarmStatus")
    .classList.add("normal");

}
const tableBody = document.getElementById("latestTable");

tableBody.innerHTML = "";

let tampil = 0;

for(let i = rows.length - 1; i >= 1; i--){

    if(tampil >= 10) break;

    const cols = rows[i].split(",");

    const tanggal = cols[0] || "";
const zona = cols[1] || "";
const pelanggan = cols[2] || "";
const nama = cols[3] || "";
const telepon = cols[4] || "";
const golongan = cols[6] || "";
const status = cols[7] || "";
let statusClass = "";

if(status.toUpperCase() === "PROSES"){
    statusClass = "status-proses";
}
else if(status.toUpperCase() === "SELESAI"){
    statusClass = "status-selesai";
}
else if(status.toUpperCase() === "BARU"){
    statusClass = "status-baru";
}

tableBody.innerHTML += `
<tr>
    <td>${tanggal}</td>
    <td>${zona}</td>
    <td>${pelanggan}</td>
    <td>${nama}</td>
    <td>${telepon}</td>
    <td>${golongan}</td>
    <td class="${statusClass}">
    ${status}
</td>
</tr>
`;

    tampil++;
}
setInterval(() => {
    location.reload();
}, 60000);
zonaChart.update();
});

function updateClock(){

    const now = new Date();

    const jam = now.toLocaleTimeString('id-ID');

    const tanggal = now.toLocaleDateString('id-ID', {
        day:'2-digit',
        month:'long',
        year:'numeric'
    });

    document.getElementById("jam").textContent =
        jam + " WIB";

    document.getElementById("tanggal").textContent =
        tanggal;
}

updateClock();

setInterval(updateClock,1000);