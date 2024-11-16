// zkrácení zálisu odkazů
const herniPrvek = document.querySelector(".objekt")
const odpocetKrouzek = document.querySelector(".odpocet")
const hraciPlocha = document.querySelector(`.plocha`)
const dolniTabulka = document.querySelector(".tabulka")
const restartTlacitko = document.querySelector(".restart")
const hlavniMenuTlacitko = document.querySelector(".exit-hlavni-menu")
const startMenu = document.querySelector(".start-menu")
const startButton = document.querySelector(".start-button")
const settingsButton = document.querySelector(".settings-button")
const exitButton = document.querySelector(".exit-button")
const verzeHry = document.querySelector(".verze")
const gameOverText = document.querySelector(".konec")
const gameScore = document.querySelector(".score")
const gameLives = document.querySelector(".zivoty")

// přiřazení hodnot
let score = 0
let pocetChyb = 3
let rychlost = 0
let rychlostPoRestartu = 0
let intervalOdpoctu = rychlost / 1000
let pohybInterval
let odpocetInterval

// Funkce pro nastavení rychlosti s náhodným číslem
function rychlostHry() {
    rychlost = Math.floor(Math.random() * (9000 - 1100 + 1) + 1100);
    rychlostPoRestartu = Math.floor(Math.random() * (9000 - 1100 + 1) + 1100);
    intervalOdpoctu = rychlost / 1000;
    startOdpocet()
}

// nastavení odpočtu
function startOdpocet() {
    odpocetKrouzek.textContent = Math.floor(intervalOdpoctu)
    clearInterval(odpocetInterval)  
    odpocetInterval = setInterval(function() {
        intervalOdpoctu -= 1
        odpocetKrouzek.textContent = Math.floor(intervalOdpoctu)
        if (intervalOdpoctu <= 0) {
            clearInterval(odpocetInterval)
        }
    }, 1000)
}

// náhodný pohyb objektu po hrací ploše
const pohybObjektu = function pohybObjektu() {
    // -8 je odečtení rámečku hrací plochy
    const hraciPlochaWidth = hraciPlocha.clientWidth - 8
    const hraciPlochaHeight = hraciPlocha.clientHeight - 8
    const x = Math.random() * (hraciPlochaWidth - herniPrvek.clientWidth)
    const y = Math.random() * (hraciPlochaHeight - herniPrvek.clientHeight)
    herniPrvek.style.left = `${x}px`
    herniPrvek.style.top = `${y}px`
    rychlostHry()
    pohybInterval = setTimeout(pohybObjektu, rychlost)
}

// logika bodování
let hlavniHra = function(event) {
    if (!herniPrvek.contains(event.target)) {
        // ubere 1 život
        const pocetChybOut = gameLives.innerText = `lives: ${--pocetChyb}`.toUpperCase()
    } else {
        const scoreOut = gameScore.innerText = `score: ${++score}`.toUpperCase()
    }
    if (pocetChyb === 0) {
        konecHry() 
    }
}

// tady se spustí hra
function startGame() {
    startMenu.style.display = "none"
    hraciPlocha.style.display = "block"
    herniPrvek.style.display = "block"
    verzeHry.style.display = "none"
    dolniTabulka.style.display = ""
    hraciPlocha.addEventListener("click", hlavniHra)
    pohybObjektu()
}

// funkce exit - konec celé hry
function exitGame() {
    exitButton.addEventListener("click", function() {
        exitButton.classList.add("active")
        // Přidání class třídy .hidden pro skrytí
        document.querySelectorAll('.plocha, .start-menu, .exit-button, .hlavicka, .nadpis, .verze').forEach(element => {
            element.classList.add("hidden") 
        })
    })
}

// toto je jen pro startovní obrazovku - náhodně umístěný objekt, nastavení rychlosti a vypíše počáteční hodnotu score
document.querySelector(".score").innerText = `score: 0`.toUpperCase()
document.querySelector(".zivoty").innerText = `lives: ${pocetChyb}`.toUpperCase()

// funkce při skončení hry
// když bude pocetChyb, vypíše konec hry
function konecHry() {
    herniPrvek.style.display = "none"
    verzeHry.style.display = "block"
    gameOverText.innerText = `Game over!`.toUpperCase()
    // napíše hlášku
    restartTlacitko.style.display = "block"
    restartTlacitko.innerText = "- restart -"
    hlavniMenuTlacitko.style.display = "block"
    hlavniMenuTlacitko.innerText = `- exit to menu -`
    // zmizí objekt
    clearTimeout(pohybInterval)
    // přestane reagovat na klik
    hraciPlocha.removeEventListener("click", hlavniHra)
    restartTlacitko.addEventListener("click", restartHry)
    hlavniMenuTlacitko.addEventListener("click", zobrazitHlavniMenu)
}

// funkce pro restart hry
function restartHry(event){
    event.stopPropagation()
    score = 0
    pocetChyb = 3
    rychlost = rychlostPoRestartu
    intervalOdpoctu = rychlost / 1000    
    hlavniMenuTlacitko.innerText = ""    
    clearInterval(odpocetInterval)
    gameOverText.innerText = ""
    restartTlacitko.style.display = "none"
    herniPrvek.style.display = "block"
    gameScore.innerText = `score: ${score}`.toUpperCase()
    gameLives.innerText = `lives: ${pocetChyb}`.toUpperCase()
    hraciPlocha.addEventListener("click", hlavniHra)
    startOdpocet()
    pohybObjektu()
}

// funkce návratu do hlavního menu
function zobrazitHlavniMenu() {
    // Skryje herní obrazovku a zobrazí hlavní menu
    hraciPlocha.style.display = "none"
    hlavniMenuTlacitko.style.display = "none"
    startMenu.style.display = "block"
    dolniTabulka.style.display = "none"
    gameOverText.innerText = ""
    restartTlacitko.innerText = ""
    score = 0
    pocetChyb = 3
    gameScore.innerText = `score: ${score}`.toUpperCase()
    gameLives.innerText = `lives: ${pocetChyb}`.toUpperCase()
}

// toto je první načtení po nahrání, nebo obnovení stránky
window.onload = function(){
    startMenu.style.display = "block"
    hraciPlocha.style.display = "none"
    dolniTabulka.style.display = "none"
    // reakce na tlačítka v menu
    startButton.addEventListener("click", function(){
        startButton.classList.add("active")
        setTimeout(function(){
            startButton.classList.remove("active")
            startGame()
        }, 700)
    })
    settingsButton.addEventListener("click", function(){
        settingsButton.classList.add("active")
        setTimeout(function(){
            settingsButton.classList.remove("active")
        }, 700)
    })
    exitButton.addEventListener("click", function(){
        exitButton.classList.add("active")
        setTimeout(function(){
            exitButton.classList.remove("active")
            window.location.href = "index.html"
            exitButton.style.display = "none"    
        }, 700)
        
    })
    exitGame()
}