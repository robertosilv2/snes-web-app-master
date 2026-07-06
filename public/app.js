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

        gameContainer.innerHTML = '';

        window.EJS_player = '#game-container';
        window.EJS_core = 'snes'; 
        window.EJS_gameUrl = `/roms/${selectedRom}`; 
        window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/'; 

        // ==========================================
        // TELEMETRÍA GTM: ENVIAR DATOS AL DATALAYER
        // ==========================================
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'rom_loaded',          // Nombre del evento que leerá Tag Manager
            'rom_name': selectedRom,        // Dato dinámico del juego
            'category': 'Emulation'
        });
        console.log(`📡 Evento 'rom_loaded' empujado al dataLayer para: ${selectedRom}`);

        // Inyección dinámica del script de carga del emulador
        const script = document.createElement('script');
        script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
        document.body.appendChild(script);
        
        btnLoad.textContent = 'Juego en ejecución...';
        btnLoad.disabled = true;
    });