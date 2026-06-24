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
            zona: cols[1],
            pelanggan: cols[3],
            telepon: cols[4],
            alamat: cols[5],
            golongan: cols[6]
        };

        break;
    }
}
if(alarmData){

    document.getElementById("alarmStatus").innerHTML =
        "🔴 ALARM AKTIF";

    document.getElementById("alarmStatus").classList.remove("normal");

    document.getElementById("alarmInfo").innerHTML = `
        <b>${alarmData.pelanggan}</b><br>
        ${alarmData.zona}<br><br>

        ${alarmData.alamat}<br><br>

        Telp : ${alarmData.telepon}<br>
        Gol : ${alarmData.golongan}
    `;
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
    const alamat = cols[5] || "";

    tableBody.innerHTML += `
        <tr>
            <td>${tanggal}</td>
            <td>${zona}</td>
            <td>${pelanggan}</td>
            <td>${alamat}</td>
        </tr>
    `;

    tampil++;
}
setInterval(() => {
    location.reload();
}, 60000);
zonaChart.update();
});