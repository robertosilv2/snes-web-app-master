document.addEventListener('DOMContentLoaded', async () => {
    const romSelector = document.getElementById('romSelector');
    const btnLoad = document.getElementById('btnLoad');
    const gameContainer = document.getElementById('game-container');

    // 1. Consumir la API REST local para poblar el selector
    try {
        const response = await fetch('/api/v1/roms');
        const result = await response.json();

        romSelector.innerHTML = ''; // Limpiar estado inicial

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

    // 2. Lógica de instanciación del emulador
    btnLoad.addEventListener('click', () => {
        const selectedRom = romSelector.value;
        if (!selectedRom) return;

        // Resetear el contenedor en caso de que ya hubiera un juego corriendo
        gameContainer.innerHTML = '';

        // Variables globales requeridas por la arquitectura de EmulatorJS
        window.EJS_player = '#game-container';
        window.EJS_core = 'snes'; 
        window.EJS_gameUrl = `/roms/${selectedRom}`; 
        window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/'; 

        // ==========================================
        // TELEMETRÍA MATOMO: EVENTO PERSONALIZADO
        // ==========================================
        if (typeof _paq !== 'undefined') {
            _paq.push(['trackEvent', 'Emulacion', 'Juego_Cargado', selectedRom]);
            console.log(`📡 Evento enviado a Matomo: Juego_Cargado -> ${selectedRom}`);
        }

        // Inyección dinámica del script de carga del emulador
        const script = document.createElement('script');
        script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
        document.body.appendChild(script);
        
        btnLoad.textContent = 'Juego en ejecución...';
        btnLoad.disabled = true;
    }); // <-- Probablemente esta llave y paréntesis se habían borrado
}); // <-- O estos de aquí abajo