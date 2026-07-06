document.addEventListener('DOMContentLoaded', async () => {
    const romSelector = document.getElementById('romSelector');
    const btnLoad = document.getElementById('btnLoad');
    const btnStop = document.getElementById('btnStop'); 
    const gameContainer = document.getElementById('game-container');

    try {
        const response = await fetch('/api/v1/roms');
        const result = await response.json();

        romSelector.innerHTML = ''; 

        if (result.success && result.count > 0) {
            result.data.forEach(rom => {
                const option = document.createElement('option');
                option.value = rom;
                option.textContent = rom;
                romSelector.appendChild(option);
            });
            btnLoad.disabled = false;
        } else {
            romSelector.innerHTML = '<option value="">No se encontraron ROMs en el servidor</option>';
            btnLoad.disabled = true;
        }
    } catch (error) {
        console.error('Error de red al consultar la API:', error);
        romSelector.innerHTML = '<option value="">Error de conexión con el backend</option>';
    }

    btnLoad.addEventListener('click', () => {
        const selectedRom = romSelector.value;
        if (!selectedRom) return;

        gameContainer.innerHTML = '';

        window.EJS_player = '#game-container';
        window.EJS_core = 'snes'; 
        window.EJS_gameUrl = `/roms/${selectedRom}`; 
        window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/'; 

        if (typeof _paq !== 'undefined') {
            _paq.push(['trackEvent', 'Emulacion', 'Juego_Cargado', selectedRom]);
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
        document.body.appendChild(script);
        
        btnLoad.style.display = 'none'; 
        romSelector.disabled = true;    
        btnStop.style.display = 'inline-block'; 
    });

    btnStop.addEventListener('click', () => {
        if (typeof _paq !== 'undefined') {
            _paq.push(['trackEvent', 'Emulacion', 'Juego_Detenido', romSelector.value]);
        }
        window.location.reload();
    });
});