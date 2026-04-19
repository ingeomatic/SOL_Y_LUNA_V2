/* =====================================================
   CONFIGURACIÓN INICIAL
   ===================================================== */

mapboxgl.accessToken = 'pk.eyJ1Ijoicm9tdWxvY29yZGVybyIsImEiOiJjbWd4emVpeW0wNWEyMmxxOWZnaDJrMGQ2In0.0t1RZwHup3NH5Y_M3UN6pA';

const SUPABASE_CONFIG = {
    url: 'https://fjgfhagxeuhgsdiefrik.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqZ2ZoYWd4ZXVoZ3NkaWVmcmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNDEwMDQsImV4cCI6MjA4MDgxNzAwNH0._PATt7qZTME_bv4VNshAU0FyOZaWYI0EwjC4V2qTUJs'
};

/* =====================================================
   CONFIGURACIÓN DE LA EMPRESA — Editar aquí para adaptar
   el sistema a cualquier empresa inmobiliaria
   ===================================================== */
const APP_CONFIG = {
    nombre_empresa:   'SOL Y LUNA URBANIZACIONES',
    subtitulo:        'Gestión de Urbanizaciones',
    pie_pagina:       'Sistema Inmobiliario ©2026 — INGEOMATIC.TECH',
    whatsapp:         '0000000',
    nit_empresa:      '0000000',
    razon_social:     'NN',
    direccion:        'NN',
    municipio:        'NN',
    telefono:         'NN',
    sucursal:         'NN',
    // ── Número inicial de facturas ──────────────────────────────
    // Cambie este valor para establecer desde qué número inician las facturas.
    // Por ejemplo: 1000 → la primera factura será FAC-2026-1000
    NUMERO_INICIAL_FACTURA: 1,
    NUMERO_INICIAL_RECIBO:  1,
};

// ── Contadores de facturas persistentes en localStorage ──────────────────────
// Se reinician cada año automáticamente (clave incluye el año)
// Esto previene duplicados entre recargas de página dentro del mismo año.
function _getContador(tipo) {
    const anio = new Date().getFullYear();
    const clave = `geoportal_contador_${tipo}_${anio}`;
    const val = parseInt(localStorage.getItem(clave) || '0', 10);
    return isNaN(val) ? 0 : val;
}
function _setContador(tipo, valor) {
    const anio = new Date().getFullYear();
    const clave = `geoportal_contador_${tipo}_${anio}`;
    try { localStorage.setItem(clave, String(valor)); } catch(e) { /* cuota excedida */ }
}

// Inicializar desde localStorage (si hay valor guardado, usarlo; si no, usar el de APP_CONFIG)
let _facturaContador  = Math.max(APP_CONFIG.NUMERO_INICIAL_FACTURA, _getContador('fac'));
let _reservaContador  = Math.max(APP_CONFIG.NUMERO_INICIAL_RECIBO,  _getContador('res'));

function getNextFacturaNumero(prefijo = 'FAC') {
    const anio = new Date().getFullYear();
    const num  = String(_facturaContador).padStart(4, '0');
    _setContador('fac', _facturaContador + 1);
    _facturaContador++;
    return `${prefijo}-${anio}-${num}`;
}
function getNextReciboNumero(prefijo = 'RES') {
    const anio = new Date().getFullYear();
    const num  = String(_reservaContador).padStart(4, '0');
    _setContador('res', _reservaContador + 1);
    _reservaContador++;
    return `${prefijo}-${anio}-${num}`;
}

const MAP_CONFIG = {
    center: [-67.109691, -17.961529],
    zoom: 12,
    style: 'mapbox://styles/mapbox/streets-v12',
    pitch: 0,
    bearing: 0
};

const URB_NOMBRES = {
    '1': '10 DE FEBRERO',
    '2': 'LA RIOJA',
    '3': 'PLAYA BLANCA',
    '4': 'WILLYEFER',
    '5': 'AGUAS CALIENTES',
    '6': 'ABOARQ',
    '7': 'SOL Y LUNA', // ⚠️ Verificar: era igual a clave '5'. Renombrar si son urbs distintas.
    '8': 'PLAYA VERDE',
};

const USUARIOS_AUTORIZADOS = {
    'admin': { password: 'admin', tipo: 'administrador' },
    'blanca.choque': { password: 'Red_1', tipo: 'administrador' },
    'olga.cahuana': { password: 'Red_2', tipo: 'administrador' }
};

// Usuarios secundarios - solo pueden cambiar de DISPONIBLE a RESERVADO
const USUARIOS_SECUNDARIOS = {
    'usuario1': { password: 'usuario1', tipo: 'secundario' },
    'jessica.pamela': { password: 'jessica2002', tipo: 'secundario' }
};

const ZOOM_LEVELS = {
    lotes: { minzoom: 14, maxzoom: 22 },
    manzanos: { minzoom: 12, maxzoom: 22 },
    vias: { minzoom: 13, maxzoom: 22 },
    cotas: { minzoom: 15, maxzoom: 22 },
    praderas: { minzoom: 13, maxzoom: 22 },
    equipamiento: { minzoom: 13, maxzoom: 22 },
    rutas: { minzoom: 7, maxzoom: 22 },
    centros: { minzoom: 0, maxzoom: 22 },
    veredas: { minzoom: 15, maxzoom: 22 },
    fotos: { minzoom: 0, maxzoom: 22 },
    labels: {
        lotes: { minzoom: 16, maxzoom: 22 },
        manzanos: { minzoom: 14, maxzoom: 22 },
        vias: { minzoom: 13, maxzoom: 22 },
        cotas: { minzoom: 16, maxzoom: 22 },
        praderas: { minzoom: 15, maxzoom: 22 },
        equipamiento: { minzoom: 15, maxzoom: 22 },
        centros: { minzoom: 0, maxzoom: 22 }
    }
};

const COLOR_PALETTE = {
    lotes: {
        vendido: '#ff0000',
        disponible: '#3ac91d',
        reservado: '#ffd900',
        default: '#0000ff',
        opacity: 0.3,
        borderColor: '#000000',
        borderWidth: 0.7,
        hoverOpacity: 0.7
    },
    manzanos: {
        fillColor: '#0000ff',
        fillOpacity: 0.02,
        lineColor: '#0000ff',
        lineWidth: 1,
        lineOpacity: 0.3
    },
    vias: {
        lineColor: '#ff0202',
        lineWidth: 20,
        lineOpacity: 0.15
    },
    cotas: {
        lineColor: '#000000',
        lineWidth: 1,
        lineOpacity: 0.1
    },
    praderas: {
        fillColor: '#04593e',
        fillOpacity: 0.5,
        lineColor: '#000000',
        lineWidth: 1,
        lineOpacity: 1
    },
    equipamiento: {
        fillColor: '#0000ff',
        fillOpacity: 0.35,
        lineColor: '#000000',
        lineWidth: 1,
        lineOpacity: 1
    },
    rutas: {
        lineColor: '#ff0202',
        lineWidth: 20,
        lineOpacity: 0.15
    },
    veredas: {
        fillColor: '#d1d5db',
        fillOpacity: 0.1,
        lineColor: '#000000',
        lineWidth: 1.5,
        lineOpacity: 0.9
    },
    fotos: {
        iconSize: 0.8,
        iconColor: '#e11d48'
    },
    labels: {
        lotes: { textColor: '#000000', haloColor: '#ffffff', haloWidth: 2, textSize: 12 },
        manzanos: { textColor: '#ffffff', haloColor: '#000000', haloWidth: 2, textSize: 13 },
        vias: { textColor: '#000000', haloColor: '#ffffff', haloWidth: 2, textSize: 10 },
        cotas: { textColor: '#131513', haloColor: '#ffffff', haloWidth: 2, textSize: 10 },
        praderas: { textColor: '#006400', haloColor: '#ffffff', haloWidth: 2, textSize: 11 },
        equipamiento: { textColor: '#00008b', haloColor: '#ffffff', haloWidth: 2, textSize: 11 },
        centros: { textColor: '#e11d48', haloColor: '#ffffff', haloWidth: 2, textSize: 12 }
    }
};

const CENTRO_ICONS = {
    'centro': 'fas fa-map-marker-alt',
    'oficina': 'fas fa-building',
    'transporte': 'fas fa-bus',
    'default': 'fas fa-map-pin'
};

const ESTADOS_DISPONIBLES = ['VENDIDO', 'DISPONIBLE', 'RESERVADO'];

const ESTADO_COLORS = {
    'VENDIDO': COLOR_PALETTE.lotes.vendido,
    'DISPONIBLE': COLOR_PALETTE.lotes.disponible,
    'RESERVADO': COLOR_PALETTE.lotes.reservado,
    'default': COLOR_PALETTE.lotes.default
};

let map;
let draw;
let urbData = {};
let currentPopup = null;
let currentFeatureId = null;
let currentUrb = null;
let idFieldName = 'gid';
let currentBaseLayer = 'mapbox';
let hoveredStateId = null;
let currentLoteData = null;
let rutasData = null;
let centrosData = null;
let fotosData = null;
let pendingEstadoChange = null;
let isUserLoggedIn = false;
let currentUsername = null;
let currentUserType = null; // 'administrador' o 'secundario'

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);

/* =====================================================
   SISTEMA DE ALERTAS PERSONALIZADAS (reemplaza alert/confirm nativos)
   ===================================================== */

function showAlert(type, title, message) {
    return new Promise(resolve => {
        const overlay = document.getElementById('custom-alert-overlay');
        const iconWrap = document.getElementById('alert-icon-wrap');
        const alertTitle = document.getElementById('alert-title');
        const alertMessage = document.getElementById('alert-message');
        const btnRow = document.getElementById('alert-btn-row');

        // Config por tipo
        const configs = {
            success: {
                iconClass: 'success',
                icon: `<svg class="alert-checkmark-svg" viewBox="0 0 52 52" fill="none" stroke="#16a34a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="14,27 22,35 38,19"/></svg>`,
                titleColor: '#16a34a', btnClass: 'success', btnLabel: 'Aceptar'
            },
            error: {
                iconClass: 'error',
                icon: `<svg class="alert-x-svg" viewBox="0 0 52 52" fill="none" stroke="#dc2626" stroke-width="4" stroke-linecap="round">
                    <line class="alert-x-line" x1="16" y1="16" x2="36" y2="36"/>
                    <line class="alert-x-line" x1="36" y1="16" x2="16" y2="36"/></svg>`,
                titleColor: '#dc2626', btnClass: 'error', btnLabel: 'Cerrar'
            },
            warning: {
                iconClass: 'warning',
                icon: `<div class="alert-pulse-ring"></div><i class="fas fa-exclamation-triangle" style="font-size:38px;"></i>`,
                titleColor: '#d97706', btnClass: 'warning', btnLabel: 'Entendido'
            },
            info: {
                iconClass: 'info',
                icon: `<i class="fas fa-info-circle" style="font-size:38px;"></i>`,
                titleColor: '#2563eb', btnClass: 'info', btnLabel: 'OK'
            }
        };
        const cfg = configs[type] || configs.info;

        iconWrap.className = `alert-icon-wrap ${cfg.iconClass}`;
        iconWrap.innerHTML = cfg.icon;
        alertTitle.textContent = title;
        alertTitle.style.color = cfg.titleColor;
        alertMessage.innerHTML = message;

        btnRow.innerHTML = `<button class="alert-btn alert-btn-ok ${cfg.btnClass}" id="alert-ok-btn">${cfg.btnLabel}</button>`;

        overlay.classList.add('active');

        document.getElementById('alert-ok-btn').onclick = () => {
            overlay.classList.remove('active');
            resolve(true);
        };
    });
}

function showConfirm(title, message, btnYesText = 'Sí, Confirmar', btnNoText = 'No, Cancelar') {
    return new Promise(resolve => {
        const overlay = document.getElementById('custom-alert-overlay');
        const iconWrap = document.getElementById('alert-icon-wrap');
        const alertTitle = document.getElementById('alert-title');
        const alertMessage = document.getElementById('alert-message');
        const btnRow = document.getElementById('alert-btn-row');

        iconWrap.className = 'alert-icon-wrap confirm';
        iconWrap.innerHTML = `<div class="alert-pulse-ring"></div><i class="fas fa-question-circle" style="font-size:38px;"></i>`;
        alertTitle.textContent = title;
        alertTitle.style.color = '#7c3aed';
        alertMessage.innerHTML = message;

        btnRow.innerHTML = `
            <button class="alert-btn alert-btn-no" id="alert-no-btn"><i class="fas fa-times"></i> ${btnNoText}</button>
            <button class="alert-btn alert-btn-yes" id="alert-yes-btn"><i class="fas fa-check"></i> ${btnYesText}</button>
        `;

        overlay.classList.add('active');

        document.getElementById('alert-yes-btn').onclick = () => { overlay.classList.remove('active'); resolve(true); };
        document.getElementById('alert-no-btn').onclick = () => { overlay.classList.remove('active'); resolve(false); };
    });
}

function showConfirmDanger(title, message, btnYesText = 'Sí, Continuar') {
    return new Promise(resolve => {
        const overlay = document.getElementById('custom-alert-overlay');
        const iconWrap = document.getElementById('alert-icon-wrap');
        const alertTitle = document.getElementById('alert-title');
        const alertMessage = document.getElementById('alert-message');
        const btnRow = document.getElementById('alert-btn-row');

        iconWrap.className = 'alert-icon-wrap error';
        iconWrap.innerHTML = `<div class="alert-pulse-ring"></div><i class="fas fa-exclamation-triangle" style="font-size:38px;"></i>`;
        alertTitle.textContent = title;
        alertTitle.style.color = '#dc2626';
        alertMessage.innerHTML = message;

        btnRow.innerHTML = `
            <button class="alert-btn alert-btn-no" id="alert-no-btn"><i class="fas fa-times"></i> No, Cancelar</button>
            <button class="alert-btn alert-btn-ok error" id="alert-yes-btn"><i class="fas fa-check"></i> ${btnYesText}</button>
        `;

        overlay.classList.add('active');

        document.getElementById('alert-yes-btn').onclick = () => { overlay.classList.remove('active'); resolve(true); };
        document.getElementById('alert-no-btn').onclick = () => { overlay.classList.remove('active'); resolve(false); };
    });
}

function showToast(type, message, duration = 3500) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    toast.className = `toast-item ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type] || 'fa-bell'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('out');
        setTimeout(() => toast.remove(), 350);
    }, duration);
}

/* =====================================================
   PREVENCIÓN DE DESCARGA EN MÓVIL
   ===================================================== */

// Guardar estado del mapa y datos en localStorage
function guardarEstadoMapa() {
    if (!map) return;

    const estadoMapa = {
        center: map.getCenter(),
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing(),
        baseLayer: currentBaseLayer,
        timestamp: Date.now()
    };

    try {
        localStorage.setItem('geoportal_map_state', JSON.stringify(estadoMapa));
    } catch (e) {
        console.warn('No se pudo guardar el estado del mapa:', e);
    }
}

// Restaurar estado del mapa desde localStorage
function restaurarEstadoMapa() {
    try {
        const estadoGuardado = localStorage.getItem('geoportal_map_state');
        if (!estadoGuardado) return false;

        const estado = JSON.parse(estadoGuardado);

        // Solo restaurar si el estado tiene menos de 1 hora
        const tiempoTranscurrido = Date.now() - estado.timestamp;
        if (tiempoTranscurrido > 3600000) { // 1 hora en milisegundos
            localStorage.removeItem('geoportal_map_state');
            return false;
        }

        // Restaurar vista del mapa
        if (map && estado.center && estado.zoom) {
            map.setCenter(estado.center);
            map.setZoom(estado.zoom);
            map.setPitch(estado.pitch || 0);
            map.setBearing(estado.bearing || 0);

            // Restaurar capa base si es diferente
            if (estado.baseLayer && estado.baseLayer !== 'mapbox') {
                setTimeout(() => {
                    const radioBtn = document.getElementById(
                        estado.baseLayer === 'terrain-3d' ? 'terrain-3d' :
                            estado.baseLayer === 'satellite-3d' ? 'satellite-3d' :
                                estado.baseLayer === 'google-satellite' ? 'google-satellite' :
                                    'mapbox-base'
                    );
                    if (radioBtn) radioBtn.click();
                }, 1000);
            }
        }

        return true;
    } catch (e) {
        console.warn('Error restaurando estado del mapa:', e);
        return false;
    }
}

// Guardar estado cuando la página pierde visibilidad
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        guardarEstadoMapa();
    }
});

// Guardar estado antes de cerrar/recargar página
window.addEventListener('beforeunload', () => {
    guardarEstadoMapa();
});

// Guardar estado periódicamente (cada 30 segundos)
setInterval(() => {
    if (!document.hidden) {
        guardarEstadoMapa();
    }
}, 30000);

// Mantener estado del mapa guardado periódicamente
if (typeof navigator !== 'undefined') {
    // Service Worker placeholder (no registrado en esta versión)
}


/* =====================================================
   INICIALIZACIÓN DE APP_CONFIG EN CAMPOS DE FACTURA
   Sincroniza los campos de NIT/Razón Social/etc. desde
   APP_CONFIG al cargar el DOM, evitando valores hardcodeados
   ===================================================== */
function inicializarCamposFactura() {
    const mapaCampos = {
        'fact-nit-empresa':    APP_CONFIG.nit_empresa,
        'fact-razon-social':   APP_CONFIG.razon_social,
        'fact-direccion':      APP_CONFIG.direccion,
        'fact-municipio':      APP_CONFIG.municipio,
        'fact-telefono':       APP_CONFIG.telefono,
        'fact-sucursal':       APP_CONFIG.sucursal,
        'res-fact-nit-empresa':  APP_CONFIG.nit_empresa,
        'res-fact-razon-social': APP_CONFIG.razon_social,
        'res-fact-direccion':    APP_CONFIG.direccion,
        'res-fact-municipio':    APP_CONFIG.municipio,
        'res-fact-telefono':     APP_CONFIG.telefono,
        'res-fact-sucursal':     APP_CONFIG.sucursal
    };
    Object.entries(mapaCampos).forEach(([id, valor]) => {
        const el = document.getElementById(id);
        if (el && valor) el.value = valor;
    });
}

/* =====================================================
   UTILIDAD: Bloquear/desbloquear botón con spinner
   ===================================================== */
function setBtnLoading(btnEl, loading, textoOriginal) {
    if (!btnEl) return;
    if (loading) {
        btnEl.disabled = true;
        btnEl._textoOriginal = btnEl.innerHTML;
        btnEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    } else {
        btnEl.disabled = false;
        btnEl.innerHTML = textoOriginal !== undefined ? textoOriginal : (btnEl._textoOriginal || btnEl.innerHTML);
    }
}

function checkStoredSession() {
    const storedUser = localStorage.getItem('geoportal_user');
    const storedUserType = localStorage.getItem('geoportal_user_type');
    if (storedUser && storedUserType) {
        currentUsername = storedUser;
        currentUserType = storedUserType;
        isUserLoggedIn = true;
        updateUIForLoggedInUser();
    }
}

function updateUIForLoggedInUser() {
    const userBtn = document.getElementById('user-btn');
    userBtn.classList.add('user-logged');
    userBtn.title = `Usuario: ${currentUsername}`;
}

function updateUIForLoggedOutUser() {
    const userBtn = document.getElementById('user-btn');
    userBtn.classList.remove('user-logged');
    userBtn.title = 'Usuario';
}

function loginUser(username, password) {
    // Verificar usuarios administradores
    if (USUARIOS_AUTORIZADOS[username] && USUARIOS_AUTORIZADOS[username].password === password) {
        isUserLoggedIn = true;
        currentUsername = username;
        currentUserType = 'administrador';
        localStorage.setItem('geoportal_user', username);
        localStorage.setItem('geoportal_user_type', 'administrador');
        updateUIForLoggedInUser();
        return true;
    }
    // Verificar usuarios secundarios
    if (USUARIOS_SECUNDARIOS[username] && USUARIOS_SECUNDARIOS[username].password === password) {
        isUserLoggedIn = true;
        currentUsername = username;
        currentUserType = 'secundario';
        localStorage.setItem('geoportal_user', username);
        localStorage.setItem('geoportal_user_type', 'secundario');
        updateUIForLoggedInUser();
        return true;
    }
    return false;
}

function logoutUser() {
    isUserLoggedIn = false;
    currentUsername = null;
    currentUserType = null;
    localStorage.removeItem('geoportal_user');
    localStorage.removeItem('geoportal_user_type');
    updateUIForLoggedOutUser();
    if (currentPopup) {
        currentPopup.remove();
    }
}

function canAccessRestrictedFeatures() {
    return isUserLoggedIn;
}

map = new mapboxgl.Map({
    container: 'map',
    style: MAP_CONFIG.style,
    center: MAP_CONFIG.center,
    zoom: MAP_CONFIG.zoom,
    pitch: MAP_CONFIG.pitch,
    bearing: MAP_CONFIG.bearing,
    preserveDrawingBuffer: true,
    refreshExpiredTiles: false,
    antialias: true
});

map.addControl(new mapboxgl.NavigationControl(), 'top-right');
map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true
}), 'top-right');

const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: 'bo',
    placeholder: 'Buscar lugares en Bolivia...',
    language: 'es'
});
document.getElementById('geocoder-container').appendChild(geocoder.onAdd(map));

draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: { line_string: true, trash: true }
});
map.addControl(draw, 'top-right');

document.getElementById('toggle-sidebar').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    const legend = document.getElementById('sidebar-legend');
    if (sidebar.classList.contains('visible')) {
        sidebar.classList.remove('visible');
    } else {
        // Cerrar la leyenda si está abierta para evitar superposición
        if (legend.classList.contains('visible')) legend.classList.remove('visible');
        sidebar.classList.add('visible');
    }
});

document.getElementById('close-sidebar').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('visible');
});

const infoModal = document.getElementById('info-modal');
document.getElementById('info-btn').addEventListener('click', () => {
    infoModal.classList.add('active');
});

document.getElementById('close-info-modal').addEventListener('click', () => {
    infoModal.classList.remove('active');
});

infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) infoModal.classList.remove('active');
});

const reporteModal = document.getElementById('reporte-modal');
document.getElementById('close-reporte-modal').addEventListener('click', () => {
    reporteModal.classList.remove('active');
});

reporteModal.addEventListener('click', (e) => {
    if (e.target === reporteModal) reporteModal.classList.remove('active');
});

const ventaModal = document.getElementById('venta-modal');
document.getElementById('close-venta-modal').addEventListener('click', () => {
    ventaModal.classList.remove('active');
    document.getElementById('venta-form').reset();
    document.getElementById('venta-cuotas-container').style.display = 'none';
    document.getElementById('venta-info-reserva').style.display = 'none';
    pendingEstadoChange = null;
});

document.getElementById('omitir-registro-btn').addEventListener('click', () => {
    if (!pendingEstadoChange) return;
    ventaModal.classList.remove('active');
    guardarEstadoSinDatos(pendingEstadoChange.featureId, pendingEstadoChange.nuevoEstado, pendingEstadoChange.urb);
    document.getElementById('venta-form').reset();
    pendingEstadoChange = null;
});

document.getElementById('layer-rutas').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('rutas-line')) {
        map.setLayoutProperty('rutas-line', 'visibility', visibility);
    }
});

document.getElementById('layer-centros').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    if (map.getLayer('centros-symbol')) {
        map.setLayoutProperty('centros-symbol', 'visibility', visibility);
    }
    if (map.getLayer('centros-label')) {
        map.setLayoutProperty('centros-label', 'visibility', visibility);
    }
});

document.getElementById('layer-fotos').addEventListener('change', (e) => {
    const visibility = e.target.checked ? 'visible' : 'none';
    Object.keys(urbData).forEach(urb => {
        const layerId = `fotos-${urb}-symbol`;
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', visibility);
        }
    });
});

const userModal = document.getElementById('user-modal');
const loginFormContainer = document.getElementById('login-form-container');
const userInfoContainer = document.getElementById('user-info-container');
const modalTitle = document.getElementById('modal-title');

document.getElementById('user-btn').addEventListener('click', () => {
    if (isUserLoggedIn) {
        modalTitle.textContent = 'Mi Cuenta';
        loginFormContainer.style.display = 'none';
        // Actualizar mensaje según tipo de usuario
        const accessLevelText = document.getElementById('access-level-text');
        if (accessLevelText) {
            if (currentUserType === 'administrador') {
                accessLevelText.textContent = 'Tienes acceso completo a todas las funcionalidades del sistema.';
            } else {
                accessLevelText.textContent = 'Puedes cambiar lotes DISPONIBLES a RESERVADOS únicamente.';
            }
        }
        userInfoContainer.style.display = 'block';
        document.getElementById('logged-username').textContent = currentUsername;
    } else {
        modalTitle.textContent = 'Iniciar Sesión';
        loginFormContainer.style.display = 'block';
        userInfoContainer.style.display = 'none';
        document.getElementById('login-error').classList.remove('show');
    }
    userModal.classList.add('active');
});

document.getElementById('close-user-modal').addEventListener('click', () => {
    userModal.classList.remove('active');
    document.getElementById('login-form').reset();
    document.getElementById('login-error').classList.remove('show');
});

userModal.addEventListener('click', (e) => {
    if (e.target === userModal) {
        userModal.classList.remove('active');
        document.getElementById('login-form').reset();
        document.getElementById('login-error').classList.remove('show');
    }
});

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');

    if (loginUser(username, password)) {
        userModal.classList.remove('active');
        document.getElementById('login-form').reset();
        errorDiv.classList.remove('show');
        showAlert('success', `¡Bienvenido, ${currentUsername}!`, 'Ahora tienes acceso completo a todas las funcionalidades del sistema.');
    } else {
        errorDiv.textContent = '❌ Usuario o contraseña incorrectos';
        errorDiv.classList.add('show');
    }
});

document.getElementById('logout-btn').addEventListener('click', async () => {
    const ok = await showConfirmDanger('¿Cerrar sesión?', 'Serás desconectado del sistema. ¿Deseas continuar?', 'Sí, cerrar sesión');
    if (ok) {
        logoutUser();
        userModal.classList.remove('active');
        showToast('info', 'Sesión cerrada exitosamente');
    }
});

const excelModal = document.getElementById('excel-modal');
document.getElementById('export-excel-btn').addEventListener('click', () => {
    if (!canAccessRestrictedFeatures()) {
        showAlert('warning', 'Acceso Restringido', 'Debes iniciar sesión para exportar a Excel.<br>Haz clic en el botón de usuario para iniciar sesión.');
        return;
    }
    mostrarModalExcel();
});

document.getElementById('close-excel-modal').addEventListener('click', () => {
    excelModal.classList.remove('active');
});

excelModal.addEventListener('click', (e) => {
    if (e.target === excelModal) excelModal.classList.remove('active');
});

function getColorByEstado(estado) {
    return ESTADO_COLORS[estado] || ESTADO_COLORS.default;
}

function procesarUrlImagen(url) {
    if (!url) {
        console.error('❌ URL vacía o nula');
        return null;
    }

    url = url.trim();
    console.log('🔍 Procesando URL:', url);

    if (url.includes('imgur.com')) {
        if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            console.log('✅ URL de Imgur válida:', url);
            return url;
        }

        if (url.match(/imgur\.com\/[a-zA-Z0-9]+$/)) {
            const urlWithExtension = url + '.jpg';
            console.log('✅ URL de Imgur corregida:', urlWithExtension);
            return urlWithExtension;
        }

        if (url.match(/i\.imgur\.com\/[a-zA-Z0-9]+$/)) {
            const urlWithExtension = url + '.jpg';
            console.log('✅ URL de Imgur corregida:', urlWithExtension);
            return urlWithExtension;
        }
    }

    console.log('✅ URL procesada:', url);
    return url;
}

function generarPopupFotos(properties) {
    const urlOriginal = properties.foto || properties.FOTO || properties.url || properties.URL;
    const fotoUrl = procesarUrlImagen(urlOriginal);
    const nombre = properties.nombre || properties.NOMBRE || 'Sin título';
    const descripcion = properties.descripcion || properties.DESCRIPCION || '';
    const uniqueId = Math.random().toString(36).substr(2, 9);

    console.log('📸 Generando popup para:', { nombre, urlOriginal, fotoUrl });

    let html = '<div class="photo-popup">';

    if (fotoUrl) {
        html += `
            <div style="width: 100%; min-height: 200px; background: #f1f5f9; border-radius: 8px; margin-bottom: 10px; position: relative; overflow: hidden;">
                <div id="photo-loading-${uniqueId}" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; z-index: 1;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #001562;"></i>
                    <p style="margin-top: 10px; font-size: 12px; color: #64748b;">Cargando imagen...</p>
                </div>
                <img 
                    id="photo-img-${uniqueId}"
                    src="${fotoUrl}" 
                    alt="${nombre}"
                    style="width: 100%; height: auto; display: none; border-radius: 8px; cursor: pointer; transition: transform 0.2s ease; position: relative; z-index: 2;"
                    onload="this.style.display='block'; document.getElementById('photo-loading-${uniqueId}').style.display='none'; document.getElementById('fullscreen-btn-${uniqueId}').style.display='block';"
                    onerror="document.getElementById('photo-loading-${uniqueId}').innerHTML='<div style=\\'background:#fee2e2; padding:15px; border-radius:8px; color:#dc2626; font-size:12px; text-align:center;\\'><i class=\\'fas fa-exclamation-triangle\\'></i><br><strong>Error al cargar</strong><br><small>Verifica la URL</small><br><a href=\\\'${fotoUrl}\\\' target=\\'_blank\\' style=\\'color:#0ea5e9; text-decoration:underline; margin-top:5px; display:inline-block;\\'>Abrir imagen</a></div>';"
                    onclick="window.abrirImagenPantallaCompleta('${fotoUrl}', '${nombre.replace(/'/g, "\\'")}')"
                />
                <button id="fullscreen-btn-${uniqueId}" onclick="window.abrirImagenPantallaCompleta('${fotoUrl}', '${nombre.replace(/'/g, "\\'")}'); event.stopPropagation();" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; display: none; z-index: 3; transition: all 0.2s ease;">
                    <i class="fas fa-expand"></i> Ampliar
                </button>
            </div>
        `;
    } else {
        html += `
            <div style="padding: 20px; background: #fef3c7; border-radius: 8px; text-align: center; margin-bottom: 10px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 24px; color: #f59e0b;"></i>
                <p style="margin-top: 10px; font-size: 13px; color: #92400e;"><strong>No hay foto disponible</strong></p>
                <small style="color: #92400e;">El campo FOTO está vacío</small>
            </div>
        `;
    }

    html += `
        <div style="margin-bottom: 8px; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
            <strong style="color: #001562; font-size: 11px; text-transform: uppercase; display: flex; align-items: center; gap: 5px;">
                <i class="fas fa-image"></i> Nombre:
            </strong>
            <div style="color: #334155; font-size: 13px; font-weight: 500; margin-top: 3px;">${nombre}</div>
        </div>
    `;

    if (descripcion) {
        html += `
            <div style="margin-bottom: 8px; padding: 8px 0;">
                <strong style="color: #001562; font-size: 11px; text-transform: uppercase; display: flex; align-items: center; gap: 5px;">
                    <i class="fas fa-align-left"></i> Descripción:
                </strong>
                <div style="color: #334155; font-size: 13px; font-weight: 500; margin-top: 3px;">${descripcion}</div>
            </div>
        `;
    }

    html += '</div>';
    return html;
}

window.abrirImagenPantallaCompleta = function (url, nombre) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.95); z-index: 10000; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20px; cursor: zoom-out; animation: fadeIn 0.3s ease;`;

    const img = document.createElement('img');
    img.src = url;
    img.alt = nombre;
    img.style.cssText = `max-width: 90%; max-height: 85vh; object-fit: contain; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); cursor: default; animation: zoomIn 0.3s ease;`;

    const title = document.createElement('div');
    title.textContent = nombre;
    title.style.cssText = `color: white; font-size: 16px; font-weight: 600; margin-top: 15px; text-align: center; text-shadow: 0 2px 4px rgba(0,0,0,0.5);`;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i> Cerrar';
    closeBtn.style.cssText = `position: absolute; top: 20px; right: 20px; background: rgba(255, 255, 255, 0.2); color: white; border: 2px solid white; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.3s ease; backdrop-filter: blur(10px);`;

    closeBtn.onmouseover = () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        closeBtn.style.transform = 'scale(1.05)';
    };
    closeBtn.onmouseout = () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        closeBtn.style.transform = 'scale(1)';
    };

    const closeOverlay = () => {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (overlay.parentNode) {
                document.body.removeChild(overlay);
            }
        }, 300);
    };

    closeBtn.onclick = closeOverlay;
    overlay.onclick = (e) => {
        if (e.target === overlay) closeOverlay();
    };
    img.onclick = (e) => e.stopPropagation();

    const style = document.createElement('style');
    style.textContent = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } } @keyframes zoomIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }`;
    document.head.appendChild(style);

    overlay.appendChild(closeBtn);
    overlay.appendChild(img);
    overlay.appendChild(title);
    document.body.appendChild(overlay);
};

async function loadLayer(tableName) {
    try {
        console.log(`🔥 Cargando tabla: ${tableName}`);
        let allData = [];
        let offset = 0;
        const limit = 1000;
        let hasMore = true;

        while (hasMore) {
            const response = await fetch(
                `${SUPABASE_CONFIG.url}/rest/v1/${tableName}?select=*&limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        'apikey': SUPABASE_CONFIG.key,
                        'Authorization': `Bearer ${SUPABASE_CONFIG.key}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'count=exact'
                    }
                }
            );

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            allData = allData.concat(data);
            console.log(`   📦 Lote ${offset}-${offset + data.length} cargado (${allData.length} registros acumulados)`);

            if (data.length < limit) {
                hasMore = false;
            } else {
                offset += limit;
            }
        }

        console.log(`✅ ${tableName} cargado completamente: ${allData.length} registros`);

        if (allData.length > 0) {
            const firstRow = allData[0];
            if ('gid' in firstRow) idFieldName = 'gid';
            else if ('objectid' in firstRow) idFieldName = 'objectid';
            else if ('fid' in firstRow) idFieldName = 'fid';
            else if ('id' in firstRow) idFieldName = 'id';
            console.log(`🔑 Campo ID detectado para ${tableName}: ${idFieldName}`);
        }

        const features = allData
            .filter(row => row.geom)
            .map(row => {
                const { geom, ...properties } = row;
                return {
                    type: 'Feature',
                    geometry: geom,
                    properties: properties,
                    id: row[idFieldName]
                };
            });

        return { type: 'FeatureCollection', features: features };
    } catch (error) {
        console.error(`❌ Error cargando ${tableName}:`, error);
        return { type: 'FeatureCollection', features: [] };
    }
}

function groupByUrb(geojson, tableName) {
    if (!geojson || !geojson.features) return;

    geojson.features.forEach(feature => {
        const urb = feature.properties.urb || feature.properties.URB || 'SIN_URB';
        if (!urbData[urb]) {
            urbData[urb] = { lotes: [], manzanos: [], vias: [], cotas: [], praderas: [], equipamiento: [], veredas: [], fotos: [] };
        }
        urbData[urb][tableName].push(feature);
    });
}

function generarPopupContent(properties, editMode = false) {
    const color = getColorByEstado(properties.estado);
    const featureId = properties[idFieldName];
    const loteValue = properties.lote || 'N/A';
    const manzanoValue = properties.manzano || 'N/A';
    const supm2Value = properties['supm2'] || properties.supm2 || 'N/A';
    const precioLot = properties.precio_lot || 'N/A';
    const isLoggedIn = canAccessRestrictedFeatures();

    let html = '<div>';

    if (!editMode) {
        html += `<div class="popup-field"><strong>LOTE:</strong><div class="value">${loteValue}</div></div>`;
        html += `<div class="popup-field"><strong>MANZANO:</strong><div class="value">${manzanoValue}</div></div>`;
        html += `<div class="popup-field"><strong>SUPERFICIE:</strong><div class="value">${supm2Value}</div></div>`;
        html += `<div class="popup-field"><strong>PRECIO:</strong><div class="value">${precioLot} $us</div></div>`;
        html += `<div class="popup-field"><strong>ESTADO:</strong><div class="value"><span class="estado-badge" style="background:${color}">${properties.estado || 'N/A'}</span></div></div>`;

        if (isLoggedIn) {
            html += `<button class="popup-btn" onclick="window.editarEstado(${featureId})"><i class="fas fa-edit"></i> Editar Estado</button>`;
            html += `<button class="popup-btn popup-btn-secondary" onclick="window.abrirFormularioReporte(${featureId})"><i class="fas fa-file-pdf"></i> Cotizar Lote</button>`;
            // Botón Ver Info Cliente — abre ventana flotante (VENDIDO o RESERVADO)
            if (properties.estado === 'VENDIDO' || properties.estado === 'RESERVADO') {
                const bgCliente = properties.estado === 'VENDIDO' ? '#dc2626' : '#d97706';
                html += `<button class="popup-btn" onclick="window.toggleClienteInfo(${featureId})" style="margin-top:5px; background:${bgCliente};"><i class="fas fa-user"></i> Ver Info Cliente</button>`;
            }
        } else {
            html += `<div style="margin-top: 10px; padding: 10px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; font-size: 11px; color: #92400e;">
                        <i class="fas fa-lock"></i> <strong>Funciones restringidas</strong><br>
                        Contactate con el administrador.
                     </div>`;
        }
    } else {
        html += `<div class="popup-field"><strong>LOTE:</strong><div class="value">${loteValue}</div></div>`;
        html += `<div class="popup-field"><strong>MANZANO:</strong><div class="value">${manzanoValue}</div></div>`;
        html += `<div class="popup-field"><strong>SUPERFICIE:</strong><div class="value">${supm2Value}</div></div>`;
        html += `<div class="popup-field"><strong>PRECIO:</strong><div class="value">${precioLot} $us</div></div>`;
        html += `<div class="popup-field full-width"><strong>CAMBIAR ESTADO:</strong><select id="estado-select-${featureId}">`;

        // Si es usuario secundario, solo mostrar DISPONIBLE y RESERVADO
        if (currentUserType === 'secundario') {
            const estadosPermitidos = ['DISPONIBLE', 'RESERVADO'];
            estadosPermitidos.forEach(estado => {
                html += `<option value="${estado}" ${properties.estado === estado ? 'selected' : ''}>${estado}</option>`;
            });
        } else {
            // Usuario administrador: mostrar todas las opciones
            ESTADOS_DISPONIBLES.forEach(estado => {
                html += `<option value="${estado}" ${properties.estado === estado ? 'selected' : ''}>${estado}</option>`;
            });
        }

        html += `</select></div>`;
        html += `<button class="popup-btn" onclick="window.guardarEstado(${featureId})"><i class="fas fa-save"></i> Guardar</button>`;
        html += `<button class="popup-btn" onclick="window.cancelarEdicion(${featureId})" style="background:#6c757d;margin-top:5px;"><i class="fas fa-times"></i> Cancelar</button>`;
    }

    html += '</div>';
    return html;
}

function zoomToFeatures(features) {
    if (!features || features.length === 0) return;
    const bounds = new mapboxgl.LngLatBounds();
    features.forEach(feature => {
        const geomType = feature.geometry.type;
        if (geomType === 'Point') {
            bounds.extend(feature.geometry.coordinates);
        } else if (geomType === 'LineString') {
            feature.geometry.coordinates.forEach(coord => bounds.extend(coord));
        } else if (geomType === 'Polygon') {
            feature.geometry.coordinates[0].forEach(coord => bounds.extend(coord));
        } else if (geomType === 'MultiPolygon') {
            feature.geometry.coordinates.forEach(polygon => {
                polygon[0].forEach(coord => bounds.extend(coord));
            });
        }
    });
    map.fitBounds(bounds, { padding: 50, duration: 1000 });
}

function updateMeasureVisibility() {
    const measureContainer = document.getElementById('measure-container');
    if (currentBaseLayer !== 'mapbox') {
        measureContainer.style.display = 'none';
    }
}

function getCentroid(geometry) {
    if (geometry.type === 'Polygon') {
        const coords = geometry.coordinates[0];
        let x = 0, y = 0;
        coords.forEach(coord => { x += coord[0]; y += coord[1]; });
        return [x / coords.length, y / coords.length];
    } else if (geometry.type === 'MultiPolygon') {
        const coords = geometry.coordinates[0][0];
        let x = 0, y = 0;
        coords.forEach(coord => { x += coord[0]; y += coord[1]; });
        return [x / coords.length, y / coords.length];
    }
    return null;
}

window.abrirFormularioReporte = function (featureId) {
    if (!canAccessRestrictedFeatures()) {
        showAlert('warning', 'Acceso Restringido', 'Debes iniciar sesión para generar cotizaciones.');
        return;
    }

    if (!currentUrb) {
        showToast('error', 'Error: No se pudo identificar la urbanización');
        return;
    }

    const lote = urbData[currentUrb].lotes.find(l => l.properties[idFieldName] === featureId);
    if (!lote) {
        showToast('error', 'Error: No se encontró el lote');
        return;
    }

    currentLoteData = {
        id: featureId,
        properties: lote.properties,
        geometry: lote.geometry,
        urb: currentUrb
    };

    document.getElementById('form-lote').value = lote.properties.lote || 'N/A';
    document.getElementById('form-manzano').value = lote.properties.manzano || 'N/A';
    document.getElementById('form-Supm2').value = lote.properties['supm2'] || lote.properties.Supm2 || 'N/A';
    document.getElementById('form-precio-contado').value = '';
    document.getElementById('form-precio').value = '';
    document.getElementById('form-cuota-inicial').value = '';
    document.getElementById('form-plazo-anos').value = '';
    document.getElementById('form-cuota-mensual').value = '';
    document.getElementById('form-observaciones').value = '';
    document.querySelectorAll('#reporte-form input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('reporte-modal').classList.add('active');
};

document.getElementById('reporte-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!currentLoteData) {
        showToast('error', 'Error: No hay datos del lote');
        return;
    }

    const formData = {
        lote: document.getElementById('form-lote').value,
        manzano: document.getElementById('form-manzano').value,
        Supm2: document.getElementById('form-Supm2').value,
        precioContado: parseFloat(document.getElementById('form-precio-contado').value) || 0,
        precio: parseFloat(document.getElementById('form-precio').value) || 0,
        cuotaInicial: parseFloat(document.getElementById('form-cuota-inicial').value) || 0,
        plazoAnos: parseInt(document.getElementById('form-plazo-anos').value) || 0,
        cuotaMensual: parseFloat(document.getElementById('form-cuota-mensual').value) || 0,
        observaciones: document.getElementById('form-observaciones').value,
        servicios: []
    };

    document.querySelectorAll('#reporte-form input[type="checkbox"]:checked').forEach(cb => {
        formData.servicios.push(cb.value);
    });

    await generarPDF(formData);
    document.getElementById('reporte-modal').classList.remove('active');
});

async function generarPDF(formData) {
    try {
        showToast('info', 'Generando PDF... Por favor espere.');

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 15;
        let yPos = margin;

        pdf.setFillColor(0, 31, 98);
        pdf.rect(0, 0, pageWidth, 30, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(22);
        pdf.setFont(undefined, 'bold');
        pdf.text(APP_CONFIG.nombre_empresa, margin, 13);

        const nombreUrbanizacion = URB_NOMBRES[currentLoteData.urb] || `URB: ${currentLoteData.urb}`;
        pdf.setFontSize(15);
        pdf.setFont(undefined, 'normal');
        pdf.text(`URBANIZACIÓN: ${nombreUrbanizacion}`, margin, 21);

        const fecha = new Date().toLocaleDateString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        pdf.setFontSize(9);
        pdf.text(fecha, pageWidth - margin, 13, { align: 'right' });
        yPos = 38;

        const centroid = getCentroid(currentLoteData.geometry);

        if (centroid) {
            try {
                const originalCenter = map.getCenter();
                const originalZoom = map.getZoom();
                const originalPitch = map.getPitch();
                if (currentPopup) currentPopup.remove();
                document.querySelectorAll('.mapboxgl-ctrl-top-right, .mapboxgl-ctrl-bottom-right, .mapboxgl-ctrl-bottom-left').forEach(el => {
                    el.style.display = 'none';
                });

                map.setLayoutProperty('google-satellite-layer', 'visibility', 'visible');
                map.setLayoutProperty('terrain-3d-layer', 'visibility', 'none');
                map.setPitch(0);
                map.setTerrain(null);
                await new Promise(resolve => setTimeout(resolve, 500));

                const tempSourceId = 'temp-lote-pdf';
                if (map.getSource(tempSourceId)) {
                    map.removeLayer(`${tempSourceId}-fill`);
                    map.removeLayer(`${tempSourceId}-line`);
                    map.removeSource(tempSourceId);
                }

                map.addSource(tempSourceId, {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [{
                            type: 'Feature',
                            geometry: currentLoteData.geometry,
                            properties: currentLoteData.properties
                        }]
                    }
                });

                map.addLayer({
                    id: `${tempSourceId}-fill`,
                    type: 'fill',
                    source: tempSourceId,
                    paint: {
                        'fill-color': getColorByEstado(currentLoteData.properties.estado),
                        'fill-opacity': 0.7
                    }
                });

                map.addLayer({
                    id: `${tempSourceId}-line`,
                    type: 'line',
                    source: tempSourceId,
                    paint: {
                        'line-color': '#ff0000',
                        'line-width': 5
                    }
                });

                map.jumpTo({ center: centroid, zoom: 19 });
                map.triggerRepaint();
                await new Promise(resolve => setTimeout(resolve, 2000));

                await new Promise(resolve => {
                    if (map.loaded() && map.areTilesLoaded()) {
                        resolve();
                    } else {
                        const checkLoaded = () => {
                            if (map.loaded() && map.areTilesLoaded()) {
                                map.off('render', checkLoaded);
                                resolve();
                            }
                        };
                        map.on('render', checkLoaded);
                        setTimeout(resolve, 3000);
                    }
                });

                const mapCanvas = map.getCanvas();
                const mapImage = mapCanvas.toDataURL('image/png', 1.0);

                if (mapImage && mapImage.length > 100) {
                    const imgWidth = pageWidth - (margin * 2);
                    const imgHeight = 70;
                    pdf.addImage(mapImage, 'PNG', margin, yPos, imgWidth, imgHeight);
                    yPos += imgHeight + 5;
                }

                if (map.getLayer(`${tempSourceId}-fill`)) map.removeLayer(`${tempSourceId}-fill`);
                if (map.getLayer(`${tempSourceId}-line`)) map.removeLayer(`${tempSourceId}-line`);
                if (map.getSource(tempSourceId)) map.removeSource(tempSourceId);

                if (currentBaseLayer === 'mapbox') {
                    map.setLayoutProperty('google-satellite-layer', 'visibility', 'none');
                    map.setTerrain(null);
                } else if (currentBaseLayer === 'terrain-3d') {
                    map.setLayoutProperty('google-satellite-layer', 'visibility', 'none');
                    map.setLayoutProperty('terrain-3d-layer', 'visibility', 'visible');
                    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
                } else if (currentBaseLayer === 'satellite-3d') {
                    map.setLayoutProperty('google-satellite-layer', 'visibility', 'visible');
                    map.setLayoutProperty('terrain-3d-layer', 'visibility', 'none');
                    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
                } else if (currentBaseLayer === 'google-satellite') {
                    map.setLayoutProperty('google-satellite-layer', 'visibility', 'visible');
                    map.setLayoutProperty('terrain-3d-layer', 'visibility', 'none');
                    map.setTerrain(null);
                }

                map.jumpTo({ center: originalCenter, zoom: originalZoom });
                map.setPitch(originalPitch);
                document.querySelectorAll('.mapboxgl-ctrl-top-right, .mapboxgl-ctrl-bottom-right, .mapboxgl-ctrl-bottom-left').forEach(el => {
                    el.style.display = '';
                });
            } catch (error) {
                console.error('Error capturando miniatura:', error);
            }
        }

        pdf.setTextColor(0, 31, 98);
        pdf.setFontSize(13);
        pdf.setFont(undefined, 'bold');
        pdf.text('INFORMACIÓN DEL LOTE', margin, yPos);
        yPos += 2;
        pdf.setDrawColor(0, 31, 98);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 6;

        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'bold');
        pdf.text('Lote N°:', margin, yPos);
        pdf.setFont(undefined, 'normal');
        pdf.text(formData.lote, margin + 20, yPos);
        pdf.setFont(undefined, 'bold');
        pdf.text('Manzano:', pageWidth / 2, yPos);
        pdf.setFont(undefined, 'normal');
        pdf.text(formData.manzano, pageWidth / 2 + 22, yPos);
        yPos += 5;

        pdf.setFont(undefined, 'bold');
        pdf.text('Superficie:', margin, yPos);
        pdf.setFont(undefined, 'normal');
        pdf.text(`${formData.Supm2} m²`, margin + 25, yPos);

        const estado = currentLoteData.properties.estado || 'N/A';
        pdf.setFont(undefined, 'bold');
        pdf.text('Estado:', pageWidth / 2, yPos);
        const colorEstado = getColorByEstado(estado);
        pdf.setTextColor(colorEstado);
        pdf.setFont(undefined, 'bold');
        pdf.text(estado, pageWidth / 2 + 17, yPos);
        pdf.setTextColor(0, 0, 0);
        yPos += 8;

        if (formData.precioContado > 0) {
            pdf.setTextColor(0, 31, 98);
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'bold');
            pdf.text('PRECIO AL CONTADO', margin, yPos);
            yPos += 2;
            pdf.setDrawColor(0, 31, 98);
            pdf.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 6;
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'bold');
            pdf.text('Precio Total:', margin, yPos);
            pdf.setFont(undefined, 'normal');
            pdf.text(`Dólares $. ${formData.precioContado.toLocaleString('es-BO')}`, margin + 27, yPos);
            yPos += 8;
        }

        if (formData.precio > 0) {
            pdf.setTextColor(0, 31, 98);
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'bold');
            pdf.text('PRECIO A CRÉDITO', margin, yPos);
            yPos += 2;
            pdf.setDrawColor(0, 31, 98);
            pdf.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 6;
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'bold');
            pdf.text('Precio Total :', margin, yPos);
            pdf.setFont(undefined, 'normal');
            pdf.text(`Dólares $. ${formData.precio.toLocaleString('es-BO')}`, margin + 27, yPos);
            pdf.setFont(undefined, 'bold');
            pdf.text('Cuota Inicial:', pageWidth / 2, yPos);
            pdf.setFont(undefined, 'normal');
            pdf.text(`Bs. ${formData.cuotaInicial.toLocaleString('es-BO')}`, pageWidth / 2 + 28, yPos);
            yPos += 5;

            if (formData.plazoAnos > 0) {
                pdf.setFont(undefined, 'bold');
                pdf.text('Plazo:', margin, yPos);
                pdf.setFont(undefined, 'normal');
                pdf.text(`${formData.plazoAnos} años`, margin + 15, yPos);
            }
            pdf.setFont(undefined, 'bold');
            pdf.text('Cuota Mensual:', pageWidth / 2, yPos);
            pdf.setFont(undefined, 'normal');
            pdf.text(`Bs. ${formData.cuotaMensual.toLocaleString('es-BO')}`, pageWidth / 2 + 33, yPos);
            yPos += 8;
        }

        if (formData.servicios.length > 0) {
            pdf.setTextColor(0, 31, 98);
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'bold');
            pdf.text('SERVICIOS DISPONIBLES', margin, yPos);
            yPos += 2;
            pdf.setDrawColor(0, 31, 98);
            pdf.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 6;
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(9);
            pdf.setFont(undefined, 'normal');
            const colWidth = (pageWidth - margin * 2) / 2;
            formData.servicios.forEach((servicio, index) => {
                const col = index % 2;
                const xPos = margin + (col * colWidth);
                pdf.text(`✓ ${servicio}`, xPos, yPos);
                if (col === 1 || index === formData.servicios.length - 1) {
                    yPos += 5;
                }
            });
            yPos += 3;
        }

        if (formData.observaciones) {
            pdf.setTextColor(0, 31, 98);
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'bold');
            pdf.text('OBSERVACIONES', margin, yPos);
            yPos += 2;
            pdf.setDrawColor(0, 31, 98);
            pdf.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 6;
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(9);
            pdf.setFont(undefined, 'normal');
            const lines = pdf.splitTextToSize(formData.observaciones, pageWidth - (margin * 2));
            pdf.text(lines, margin, yPos);
            yPos += lines.length * 5 + 3;
        }

        if (centroid) {
            pdf.setTextColor(0, 31, 98);
            pdf.setFontSize(11);
            pdf.setFont(undefined, 'bold');
            pdf.text('VER UBICACIÓN EN GOOGLE MAPS:', margin, yPos);
            yPos += 5;
            const mapsLink = `https://www.google.com/maps?q=${centroid[1]},${centroid[0]}`;
            pdf.setTextColor(14, 165, 233);
            pdf.setFontSize(12);
            pdf.textWithLink(mapsLink, margin, yPos, { url: mapsLink });
        }

        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(7);
        pdf.setFont(undefined, 'italic');
        pdf.text(APP_CONFIG.pie_pagina, pageWidth / 2, 287, { align: 'center' });

        const nombreArchivo = `Lote_${formData.lote}_Mz_${formData.manzano}_${new Date().getTime()}.pdf`;
        pdf.save(nombreArchivo);
        showToast('success', 'PDF generado exitosamente');
    } catch (error) {
        console.error('Error generando PDF:', error);
        showAlert('error', 'Error al Generar PDF', 'No se pudo generar el PDF: ' + error.message);
    }
}

document.getElementById('venta-tipo').addEventListener('change', function () {
    const cuotasContainer = document.getElementById('venta-cuotas-container');
    cuotasContainer.style.display = this.value === 'CREDITO' ? 'block' : 'none';
    if (this.value !== 'CREDITO') document.getElementById('venta-cuotas').value = '';
});

document.getElementById('venta-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!pendingEstadoChange) {
        showToast('error', 'Error: No hay cambio de estado pendiente');
        return;
    }

    const tipoVenta = document.getElementById('venta-tipo').value;
    const cuotas = tipoVenta === 'CREDITO' ? parseInt(document.getElementById('venta-cuotas').value) : null;

    if (tipoVenta === 'CREDITO' && (!cuotas || cuotas < 1)) {
        showAlert('warning', 'Datos Incompletos', 'Ingrese el número de meses/cuotas para venta a crédito.');
        return;
    }

    const datosVenta = {
        nom_cliente: document.getElementById('venta-cliente').value.trim(),
        ci_cliente: document.getElementById('venta-ci').value.trim(),
        cel_cliente: document.getElementById('venta-celular').value.trim(),
        precio_vent: parseFloat(document.getElementById('venta-precio').value),
        monto_bs: document.getElementById('venta-monto-bs').value ? parseFloat(document.getElementById('venta-monto-bs').value) : null,
        tipo_venta: tipoVenta,
        nro_cuotas: cuotas,
        vendedor: document.getElementById('venta-vendedor').value.trim()
    };

    if (!datosVenta.nom_cliente || !datosVenta.ci_cliente || !datosVenta.cel_cliente || !datosVenta.precio_vent || !datosVenta.tipo_venta || !datosVenta.vendedor) {
        showAlert('warning', 'Campos Obligatorios', 'Por favor complete todos los campos obligatorios.');
        return;
    }

    if (isNaN(datosVenta.precio_vent) || datosVenta.precio_vent <= 0) {
        showAlert('warning', 'Precio Inválido', 'El precio de venta debe ser un número mayor a 0.');
        return;
    }

    const accion = pendingEstadoChange.nuevoEstado === 'RESERVADO' ? 'reservar' : 'registrar la venta de';
    const confirmar = await showConfirm(
        `Confirmar ${pendingEstadoChange.nuevoEstado === 'RESERVADO' ? 'Reserva' : 'Venta'}`,
        `¿Está seguro de ${accion} este lote para <strong>${datosVenta.nom_cliente}</strong>?`,
        'Sí, Confirmar', 'No, Revisar'
    );
    if (!confirmar) return;

    ventaModal.classList.remove('active');
    await guardarEstadoConDatos(pendingEstadoChange.featureId, pendingEstadoChange.nuevoEstado, datosVenta, pendingEstadoChange.urb);
    document.getElementById('venta-form').reset();
    document.getElementById('venta-cuotas-container').style.display = 'none';
    document.getElementById('venta-info-reserva').style.display = 'none';
    document.getElementById('venta-monto-reserva-info').style.display = 'none';
    pendingEstadoChange = null;
});

async function guardarEstadoConDatos(featureId, nuevoEstado, datosVenta, urb) {
    const lotesSourceId = `lotes-${urb}`;

    try {
        // Construir updateData de forma defensiva - solo campos que existen en la tabla base
        let updateData = { estado: nuevoEstado };

        if (nuevoEstado === 'RESERVADO') {
            // DISPONIBLE → RESERVADO
            updateData.nom_cliente = datosVenta.nom_cliente || null;
            updateData.cel_cliente = datosVenta.cel_cliente || null;
            updateData.vendedor = datosVenta.vendedor || currentUsername || null;
            // Limpiar datos de venta previos
            updateData.precio_vent = null;
            updateData.monto_bs = null;
            updateData.tipo_venta = null;
        } else if (nuevoEstado === 'VENDIDO') {
            // DISPONIBLE/RESERVADO → VENDIDO
            updateData.nom_cliente = datosVenta.nom_cliente || null;
            updateData.cel_cliente = datosVenta.cel_cliente || null;
            updateData.precio_vent = datosVenta.precio_vent || null;
            updateData.monto_bs = datosVenta.monto_bs || null;
            updateData.tipo_venta = datosVenta.tipo_venta || null;
            updateData.vendedor = datosVenta.vendedor || currentUsername || null;
        }

        // Intentar envío principal (con campos extendidos si existen)
        let updateDataExtended = Object.assign({}, updateData);
        if (nuevoEstado === 'RESERVADO' && datosVenta.ci_cliente) updateDataExtended.ci_cliente = datosVenta.ci_cliente;
        if (nuevoEstado === 'RESERVADO' && datosVenta.monto_reserva) updateDataExtended.monto_reserva = datosVenta.monto_reserva;
        if (nuevoEstado === 'VENDIDO' && datosVenta.ci_cliente) updateDataExtended.ci_cliente = datosVenta.ci_cliente;
        if (nuevoEstado === 'VENDIDO' && datosVenta.nro_cuotas) updateDataExtended.nro_cuotas = datosVenta.nro_cuotas;

        console.log('📤 Enviando a Supabase:', updateDataExtended);

        let response = await fetch(
            `${SUPABASE_CONFIG.url}/rest/v1/lotes?${idFieldName}=eq.${featureId}`,
            {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_CONFIG.key,
                    'Authorization': `Bearer ${SUPABASE_CONFIG.key}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(updateDataExtended)
            }
        );

        // Si falla por columna no encontrada, reintentar con solo campos base
        if (!response.ok) {
            const errorText = await response.text();
            if (errorText.includes('Could not find') || errorText.includes('column') || errorText.includes('PGRST204')) {
                console.warn('⚠️ Reintentando sin campos extendidos. Ejecuta el SQL de migración en Supabase.');
                response = await fetch(
                    `${SUPABASE_CONFIG.url}/rest/v1/lotes?${idFieldName}=eq.${featureId}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'apikey': SUPABASE_CONFIG.key,
                            'Authorization': `Bearer ${SUPABASE_CONFIG.key}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify(updateData)
                    }
                );
                if (!response.ok) {
                    const err2 = await response.text();
                    throw new Error(`HTTP ${response.status}: ${err2}`);
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
        }

        const data = await response.json();
        console.log('📥 Respuesta de Supabase:', data);

        if (!data || data.length === 0) {
            showAlert('warning', 'Registro No Encontrado', 'No se encontró el registro a actualizar.');
            return;
        }

        // Actualizar datos locales con lo que se guardó
        const loteIndex = urbData[urb].lotes.findIndex(l => l.properties[idFieldName] === featureId);
        if (loteIndex !== -1) {
            Object.assign(urbData[urb].lotes[loteIndex].properties, updateDataExtended);
        }
        const source = map.getSource(lotesSourceId);
        if (source) {
            source.setData({ type: 'FeatureCollection', features: urbData[urb].lotes });
        }

        const msg = nuevoEstado === 'RESERVADO' ? '¡Reserva Registrada!' : '¡Venta Registrada!';
        const detail = nuevoEstado === 'RESERVADO' ? 'La reserva fue registrada exitosamente.' : 'La venta fue registrada exitosamente.';
        showAlert('success', msg, detail + ' Los datos están guardados y listos para exportar a Excel.');
        if (currentPopup) setTimeout(() => currentPopup.remove(), 1000);
    } catch (error) {
        console.error('❌ Error al guardar:', error);
        showAlert('error', 'Error al Guardar', 'No se pudo actualizar el registro: ' + error.message);
    }
}
// Función para guardar estado sin datos de venta (cambio a DISPONIBLE)
async function guardarEstadoSinDatos(featureId, nuevoEstado, urb) {
    const lotesSourceId = `lotes-${urb}`;

    try {
        // Solo campos base que siempre existen en la tabla
        const updateDataBase = {
            estado: nuevoEstado,
            nom_cliente: null,
            cel_cliente: null,
            precio_vent: null,
            monto_bs: null,
            tipo_venta: null,
            vendedor: null
        };

        // Intentar también limpiar campos extendidos
        const updateDataExtended = Object.assign({}, updateDataBase, {
            ci_cliente: null,
            nro_cuotas: null,
            monto_reserva: null
        });

        console.log('📤 Enviando a Supabase (→DISPONIBLE):', updateDataExtended);

        let response = await fetch(
            `${SUPABASE_CONFIG.url}/rest/v1/lotes?${idFieldName}=eq.${featureId}`,
            {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_CONFIG.key,
                    'Authorization': `Bearer ${SUPABASE_CONFIG.key}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(updateDataExtended)
            }
        );

        // Si falla por columna nueva no encontrada, reintentar solo con campos base
        if (!response.ok) {
            const errorText = await response.text();
            if (errorText.includes('Could not find') || errorText.includes('PGRST204')) {
                console.warn('⚠️ Reintentando sin campos extendidos...');
                response = await fetch(
                    `${SUPABASE_CONFIG.url}/rest/v1/lotes?${idFieldName}=eq.${featureId}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'apikey': SUPABASE_CONFIG.key,
                            'Authorization': `Bearer ${SUPABASE_CONFIG.key}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify(updateDataBase)
                    }
                );
            }
            if (!response.ok) {
                const err2 = await response.text();
                throw new Error(`HTTP ${response.status}: ${err2}`);
            }
        }

        const data = await response.json();
        if (!data || data.length === 0) {
            showAlert('warning', 'Registro No Encontrado', 'No se encontró el registro a actualizar.');
            return;
        }

        // Actualizar datos locales
        const loteIndex = urbData[urb].lotes.findIndex(l => l.properties[idFieldName] === featureId);
        if (loteIndex !== -1) {
            Object.assign(urbData[urb].lotes[loteIndex].properties, updateDataBase);
        }
        const source = map.getSource(lotesSourceId);
        if (source) {
            source.setData({ type: 'FeatureCollection', features: urbData[urb].lotes });
        }

        showAlert('success', '¡Lote Disponible!', 'El lote fue cambiado a <strong>DISPONIBLE</strong> exitosamente. Los datos del cliente fueron eliminados.');
        if (currentPopup) setTimeout(() => currentPopup.remove(), 1000);
    } catch (error) {
        console.error('❌ Error al guardar:', error);
        showAlert('error', 'Error al Actualizar', 'No se pudo cambiar el estado: ' + error.message);
    }
}

function mostrarModalExcel() {
    const urbList = document.getElementById('urb-list-excel');
    urbList.innerHTML = '';

    Object.keys(urbData).forEach(urb => {
        const div = document.createElement('div');
        div.className = 'urb-excel-item';
        div.innerHTML = `<i class="fas fa-file-excel"></i><span>${URB_NOMBRES[urb] || `URB: ${urb}`}</span>`;
        div.addEventListener('click', () => exportarExcel(urb));
        urbList.appendChild(div);
    });

    excelModal.classList.add('active');
}

async function exportarExcel(urb) {
    try {
        excelModal.classList.remove('active');
        showToast('info', 'Generando Excel... Por favor espere.');

        // Campos exactos de la tabla lotes en Supabase
        const camposSelect = 'lote,manzano,superficie,precio_lot,estado,vendedor,nom_cliente,cel_cliente,ci_cliente,precio_vent,monto_bs,tipo_venta';

        let allData = [];
        let offset  = 0;
        const limit = 1000;
        let hasMore = true;

        console.log(`📊 Exportando Excel para URB: ${urb}`);

        while (hasMore) {
            const response = await fetch(
                `${SUPABASE_CONFIG.url}/rest/v1/lotes?urb=eq.${urb}&select=${camposSelect}&limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        'apikey': SUPABASE_CONFIG.key,
                        'Authorization': `Bearer ${SUPABASE_CONFIG.key}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                const errBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status} — ${errBody}`);
            }

            const data = await response.json();
            allData = allData.concat(data);
            console.log(`   📦 Registros acumulados: ${allData.length}`);

            if (data.length < limit) { hasMore = false; } else { offset += limit; }
        }

        console.log(`✅ Total registros: ${allData.length}`);

        if (!allData || allData.length === 0) {
            showAlert('warning', 'Sin Datos', 'No hay datos disponibles para esta urbanización.');
            return;
        }

        const v = (val) => (val !== null && val !== undefined ? val : '');

        const excelData = allData.map(row => ({
            'LOTE':                  v(row.lote),
            'MANZANO':               v(row.manzano),
            'SUPERFICIE':            v(row.superficie),
            'PRECIO ($us)':          v(row.precio_lot),
            'ESTADO':                v(row.estado),
            'VENDEDOR':              v(row.vendedor),
            'NOMBRE CLIENTE':        v(row.nom_cliente),
            'CELULAR CLIENTE':       v(row.cel_cliente),
            'CARNET CLIENTE':        v(row.ci_cliente),
            'PRECIO DE VENTA ($us)': v(row.precio_vent),
            'PRECIO DE VENTA (Bs)':  v(row.monto_bs),
            'TIPO DE VENTA':         v(row.tipo_venta)
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        ws['!cols'] = [
            { wch: 10 }, { wch: 12 }, { wch: 16 }, { wch: 14 },
            { wch: 14 }, { wch: 22 }, { wch: 30 }, { wch: 18 },
            { wch: 22 }, { wch: 20 }, { wch: 20 }, { wch: 16 }
        ];

        const nombreUrb = URB_NOMBRES[urb] || `URB_${urb}`;
        XLSX.utils.book_append_sheet(wb, ws, nombreUrb.substring(0, 31));

        const fecha = new Date().toISOString().split('T')[0];
        const nombreArchivo = `Reporte_${nombreUrb.replace(/\s+/g, '_')}_${fecha}.xlsx`;
        XLSX.writeFile(wb, nombreArchivo);

        showAlert('success', '¡Excel Generado!',
            `El archivo <strong>${nombreArchivo}</strong> fue generado con <strong>${allData.length}</strong> registros.`);
    } catch (error) {
        console.error('❌ Error al exportar Excel:', error);
        showAlert('error', 'Error al Generar Excel', 'No se pudo generar el archivo Excel: ' + error.message);
    }
}

window.editarEstado = function (featureId) {
    if (!canAccessRestrictedFeatures()) {
        showAlert('warning', 'Acceso Restringido', 'Debes iniciar sesión para editar estados de los lotes.');
        return;
    }

    if (!currentUrb) {
        showToast('error', 'Error: No se pudo identificar la urbanización');
        return;
    }
    const lote = urbData[currentUrb].lotes.find(l => l.properties[idFieldName] === featureId);
    if (!lote) {
        showToast('error', 'Error: No se encontró el lote');
        return;
    }
    const content = generarPopupContent(lote.properties, true);
    if (currentPopup) currentPopup.setHTML(content);
};

window.cancelarEdicion = function (featureId) {
    if (!currentUrb) return;
    const lote = urbData[currentUrb].lotes.find(l => l.properties[idFieldName] === featureId);
    if (!lote) return;
    const content = generarPopupContent(lote.properties, false);
    if (currentPopup) currentPopup.setHTML(content);
};

window.toggleClienteInfo = function (featureId) {
    // Buscar propiedades del lote en urbData (todos los urb)
    let loteProps = null;
    for (const urb of Object.keys(urbData)) {
        const lote = (urbData[urb].lotes || []).find(l => l.properties[idFieldName] === featureId);
        if (lote) { loteProps = lote.properties; break; }
    }
    if (!loteProps) { showToast('error', 'No se pudieron cargar los datos del cliente'); return; }

    // Cerrar ventana previa si existe
    const existente = document.getElementById('cliente-flotante-modal');
    if (existente) existente.remove();

    const estado = loteProps.estado;
    const esVendido = estado === 'VENDIDO';
    const colorHeader = esVendido ? 'linear-gradient(135deg,#dc2626,#b91c1c)' : 'linear-gradient(135deg,#d97706,#b45309)';
    const iconColor   = esVendido ? '#fca5a5' : '#fde68a';
    const badgeBg     = esVendido ? '#fee2e2' : '#fef3c7';
    const badgeColor  = esVendido ? '#991b1b' : '#92400e';

    const v = (val) => (val !== null && val !== undefined && val !== '') ? val : '—';

    let bodyHtml = '';
    if (esVendido) {
        const precioVentaBs = loteProps.monto_bs
            ? `Bs ${parseFloat(loteProps.monto_bs).toLocaleString('es-BO', {minimumFractionDigits:2})}`
            : '—';
        const precioVentaUsd = loteProps.precio_vent
            ? `$us ${parseFloat(loteProps.precio_vent).toLocaleString('es-BO', {minimumFractionDigits:2})}`
            : '—';
        const tipoBg  = loteProps.tipo_venta === 'CONTADO' ? '#dcfce7' : '#dbeafe';
        const tipoCol = loteProps.tipo_venta === 'CONTADO' ? '#166534' : '#1e40af';
        bodyHtml = `
            <div class="cfm-row"><span class="cfm-label"><i class="fas fa-user" style="color:#7c3aed;"></i>Cliente</span><span class="cfm-value">${v(loteProps.nom_cliente)}</span></div>
            <div class="cfm-row"><span class="cfm-label"><i class="fas fa-id-card" style="color:#7c3aed;"></i>CI / Carnet</span><span class="cfm-value">${v(loteProps.ci_cliente)}</span></div>
            <div class="cfm-row"><span class="cfm-label"><i class="fas fa-phone" style="color:#7c3aed;"></i>Celular</span><span class="cfm-value">${v(loteProps.cel_cliente)}</span></div>
            <div class="cfm-divider"></div>
            <div class="cfm-row"><span class="cfm-label"><i class="fas fa-user-tie" style="color:#1e40af;"></i>Vendedor</span><span class="cfm-value">${v(loteProps.vendedor)}</span></div>
            <div class="cfm-row"><span class="cfm-label"><i class="fas fa-dollar-sign" style="color:#059669;"></i>Precio ($us)</span><span class="cfm-value cfm-green">${precioVentaUsd}</span></div>
            <div class="cfm-row"><span class="cfm-label"><i class="fas fa-coins" style="color:#059669;"></i>Monto Total (Bs)</span><span class="cfm-value cfm-green">${precioVentaBs}</span></div>
            <div class="cfm-row"><span class="cfm-label"><i class="fas fa-handshake" style="color:#7c3aed;"></i>Tipo de Venta</span><span class="cfm-value"><span style="background:${tipoBg};color:${tipoCol};padding:2px 10px;border-radius:20px;font-weight:700;font-size:12px;">${v(loteProps.tipo_venta)}</span></span></div>
        `;
    } else {
        const montoRes = loteProps.monto_reserva
            ? `Bs ${parseFloat(loteProps.monto_reserva).toLocaleString('es-BO', {minimumFractionDigits:2})}`
            : '—';
        bodyHtml = `
            <div class="cfm-row"><span class="cfm-label"><i class="fas fa-user" style="color:#d97706;"></i>Cliente</span><span class="cfm-value">${v(loteProps.nom_cliente)}</span></div>
            <div class="cfm-row"><span class="cfm-label"><i class="fas fa-id-card" style="color:#d97706;"></i>CI / Carnet</span><span class="cfm-value">${v(loteProps.ci_cliente)}</span></div>
            <div class="cfm-row"><span class="cfm-label"><i class="fas fa-phone" style="color:#d97706;"></i>Celular</span><span class="cfm-value">${v(loteProps.cel_cliente)}</span></div>
            <div class="cfm-divider"></div>
            <div class="cfm-row"><span class="cfm-label"><i class="fas fa-user-tie" style="color:#1e40af;"></i>Vendedor</span><span class="cfm-value">${v(loteProps.vendedor)}</span></div>
            <div class="cfm-row"><span class="cfm-label"><i class="fas fa-bookmark" style="color:#d97706;"></i>Monto Reserva</span><span class="cfm-value cfm-gold">${montoRes}</span></div>
        `;
    }

    const loteLabel = `Mz ${loteProps.manzano || '?'} — Lote ${loteProps.lote || '?'}`;

    // Inyectar estilos una sola vez
    if (!document.getElementById('cfm-styles')) {
        const st = document.createElement('style');
        st.id = 'cfm-styles';
        st.textContent = `
            @keyframes cfmIn { from{opacity:0;transform:translate(-50%,-47%) scale(0.95)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
            .cfm-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid #f1f5f9;font-size:13px;gap:12px}
            .cfm-row:last-child{border-bottom:none}
            .cfm-label{color:#64748b;font-weight:600;display:flex;align-items:center;gap:6px;white-space:nowrap;flex-shrink:0}
            .cfm-value{color:#0f172a;font-weight:600;text-align:right;word-break:break-word}
            .cfm-green{color:#059669!important;font-weight:700!important}
            .cfm-gold{color:#d97706!important;font-weight:700!important}
            .cfm-divider{height:1px;background:linear-gradient(to right,transparent,#e2e8f0,transparent);margin:4px 0}
            #cfm-closebtn:hover{background:rgba(255,255,255,0.35)!important}
        `;
        document.head.appendChild(st);
    }

    const modal = document.createElement('div');
    modal.id = 'cliente-flotante-modal';
    modal.innerHTML = `
        <div id="cfm-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9998;"></div>
        <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:16px;
            box-shadow:0 24px 64px rgba(0,0,0,0.35);width:380px;max-width:94vw;z-index:9999;
            font-family:'Inter',-apple-system,sans-serif;animation:cfmIn 0.22s ease;overflow:hidden;">
            <div style="background:${colorHeader};padding:16px 20px;display:flex;justify-content:space-between;align-items:flex-start;">
                <div>
                    <div style="color:white;font-size:15px;font-weight:800;display:flex;align-items:center;gap:8px;">
                        <i class="fas fa-user-circle"></i> Información del Cliente
                    </div>
                    <div style="color:${iconColor};font-size:12px;margin-top:5px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                        <i class="fas fa-map-marker-alt"></i> ${loteLabel}
                        &nbsp;|&nbsp;
                        <span style="background:${badgeBg};color:${badgeColor};padding:1px 9px;border-radius:20px;font-weight:700;font-size:11px;">${estado}</span>
                    </div>
                </div>
                <button id="cfm-closebtn" style="background:rgba(255,255,255,0.2);border:none;color:white;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-left:10px;transition:background 0.15s;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div style="padding:18px 22px 22px;">${bodyHtml}</div>
        </div>
    `;

    document.body.appendChild(modal);
    const close = () => { const m = document.getElementById('cliente-flotante-modal'); if(m) m.remove(); };
    document.getElementById('cfm-closebtn').addEventListener('click', close);
    document.getElementById('cfm-overlay').addEventListener('click', close);
};

window.guardarEstado = async function (featureId) {
    const selectElement = document.getElementById(`estado-select-${featureId}`);
    if (!selectElement) {
        showToast('error', 'Error: No se encontró el selector de estado');
        return;
    }

    const nuevoEstado = selectElement.value;
    const loteActual = urbData[currentUrb].lotes.find(l => l.properties[idFieldName] === featureId);
    const estadoActual = loteActual?.properties.estado;

    // Validación para usuarios secundarios
    if (currentUserType === 'secundario') {
        if (estadoActual !== 'DISPONIBLE') {
            showAlert('warning', 'Permiso Denegado', 'Como usuario secundario, solo puedes editar lotes que están <strong>DISPONIBLES</strong>.');
            selectElement.value = estadoActual;
            return;
        }
        if (nuevoEstado !== 'RESERVADO') {
            showAlert('warning', 'Permiso Denegado', 'Como usuario secundario, solo puedes cambiar lotes <strong>DISPONIBLES</strong> a <strong>RESERVADOS</strong>.');
            selectElement.value = estadoActual;
            return;
        }
    }

    // CASO: Cambiar a DISPONIBLE (desde RESERVADO o VENDIDO) → confirmar
    if (nuevoEstado === 'DISPONIBLE' && estadoActual !== 'DISPONIBLE') {
        pendingEstadoChange = { featureId, nuevoEstado, urb: currentUrb };
        if (currentPopup) currentPopup.remove();
        document.getElementById('confirm-disponible-modal').classList.add('active');
        return;
    }

    // CASO: DISPONIBLE → RESERVADO
    if (nuevoEstado === 'RESERVADO' && estadoActual === 'DISPONIBLE') {
        pendingEstadoChange = { featureId, nuevoEstado, urb: currentUrb, loteProps: loteActual?.properties || {} };
        if (currentPopup) currentPopup.remove();
        document.getElementById('reserva-modal').classList.add('active');
        return;
    }

    // CASO: DISPONIBLE → VENDIDO
    if (nuevoEstado === 'VENDIDO' && estadoActual === 'DISPONIBLE') {
        pendingEstadoChange = { featureId, nuevoEstado, urb: currentUrb };
        if (currentPopup) currentPopup.remove();
        document.getElementById('venta-modal-title').innerHTML = '<i class="fas fa-handshake"></i> Registrar Venta';
        document.getElementById('venta-info-reserva').style.display = 'none';
        document.getElementById('venta-monto-reserva-info').style.display = 'none';
        // Limpiar form
        document.getElementById('venta-form').reset();
        document.getElementById('venta-cuotas-container').style.display = 'none';
        document.getElementById('venta-vendedor').value = currentUsername || '';
        ventaModal.classList.add('active');
        return;
    }

    // CASO: RESERVADO → VENDIDO (Consolidación)
    if (nuevoEstado === 'VENDIDO' && estadoActual === 'RESERVADO') {
        pendingEstadoChange = { featureId, nuevoEstado, urb: currentUrb };
        const props = loteActual.properties;
        if (currentPopup) currentPopup.remove();

        // Pre-cargar datos de la reserva
        document.getElementById('venta-modal-title').innerHTML = '<i class="fas fa-star"></i> Consolidar Venta (desde Reserva)';
        document.getElementById('venta-info-reserva').style.display = 'block';
        document.getElementById('venta-form').reset();
        document.getElementById('venta-cuotas-container').style.display = 'none';

        document.getElementById('venta-cliente').value = props.nom_cliente || '';
        document.getElementById('venta-ci').value = props.ci_cliente || '';
        document.getElementById('venta-celular').value = props.cel_cliente || '';
        document.getElementById('venta-vendedor').value = currentUsername || '';

        // Mostrar monto de reserva si existe
        if (props.monto_reserva && parseFloat(props.monto_reserva) > 0) {
            document.getElementById('venta-monto-reserva-info').style.display = 'block';
            document.getElementById('venta-reserva-monto-display').textContent = `Bs ${parseFloat(props.monto_reserva).toLocaleString('es-BO', { minimumFractionDigits: 2 })}`;
        } else {
            document.getElementById('venta-monto-reserva-info').style.display = 'none';
        }

        ventaModal.classList.add('active');
        return;
    }

    // Sin cambio de estado
    if (nuevoEstado === estadoActual) {
        if (currentPopup) currentPopup.remove();
        return;
    }

    // Otros cambios directos (fallback)
    const lotesSourceId = `lotes-${currentUrb}`;
    selectElement.disabled = true;
    try {
        const response = await fetch(
            `${SUPABASE_CONFIG.url}/rest/v1/lotes?${idFieldName}=eq.${featureId}`,
            {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_CONFIG.key,
                    'Authorization': `Bearer ${SUPABASE_CONFIG.key}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({ estado: nuevoEstado })
            }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        const data = await response.json();
        if (!data || data.length === 0) { showAlert('warning', 'Registro No Encontrado', 'No se encontró el registro a actualizar.'); selectElement.disabled = false; return; }
        const loteIndex = urbData[currentUrb].lotes.findIndex(l => l.properties[idFieldName] === featureId);
        if (loteIndex !== -1) urbData[currentUrb].lotes[loteIndex].properties.estado = nuevoEstado;
        const source = map.getSource(lotesSourceId);
        if (source) source.setData({ type: 'FeatureCollection', features: urbData[currentUrb].lotes });
        showToast('success', 'Estado actualizado exitosamente');
        if (currentPopup) setTimeout(() => currentPopup.remove(), 1000);
    } catch (error) {
        console.error('❌ Error al guardar:', error);
        showAlert('error', 'Error al Actualizar', 'No se pudo actualizar: ' + error.message);
        selectElement.disabled = false;
    }
};

function updateMeasurement() {
    if (currentBaseLayer !== 'mapbox') {
        document.getElementById('measure-container').style.display = 'none';
        return;
    }
    const data = draw.getAll();
    if (data.features.length > 0) {
        const line = data.features[data.features.length - 1];
        if (line.geometry.type === 'LineString') {
            const length = turf.length(line, { units: 'meters' });
            const lengthKm = (length / 1000).toFixed(2);
            const lengthM = length.toFixed(2);
            document.getElementById('measure-container').style.display = 'block';
            document.getElementById('measure-result').innerHTML =
                `<div style="font-size: 14px; font-weight: 600; color: var(--primary-color);">${lengthM} m</div>
                 <div style="font-size: 11px; color: #64748b; margin-top: 2px;">(${lengthKm} km)</div>`;
        }
    }
}

map.on('draw.create', updateMeasurement);
map.on('draw.update', updateMeasurement);
map.on('draw.delete', () => {
    document.getElementById('measure-container').style.display = 'none';
});


/* =====================================================
   INICIALIZACIÓN DE CAMPOS DE EMPRESA (APP_CONFIG)
   ===================================================== */
function inicializarCamposEmpresa() {
    // Factura de cobro
    const campos = [
        ['fact-nit-empresa',    'res-fact-nit-empresa',    APP_CONFIG.nit_empresa],
        ['fact-razon-social',   'res-fact-razon-social',   APP_CONFIG.razon_social   || APP_CONFIG.nombre_empresa],
        ['fact-direccion',      'res-fact-direccion',      APP_CONFIG.direccion],
        ['fact-municipio',      'res-fact-municipio',      APP_CONFIG.municipio],
        ['fact-telefono',       'res-fact-telefono',       APP_CONFIG.telefono],
        ['fact-sucursal',       'res-fact-sucursal',       APP_CONFIG.sucursal],
    ];
    campos.forEach(([id1, id2, val]) => {
        if (!val) return;
        const el1 = document.getElementById(id1);
        const el2 = document.getElementById(id2);
        if (el1) el1.value = val;
        if (el2) el2.value = val;
    });
    // Título de info modal
    const infoTitle = document.getElementById('info-modal-empresa');
    if (infoTitle) infoTitle.textContent = APP_CONFIG.nombre_empresa + ' — Sistema Inmobiliario';
}

function actualizarNombreEmpresaUI() {
    // Header
    const headerNombre = document.getElementById('header-empresa-nombre');
    if (headerNombre) headerNombre.textContent = APP_CONFIG.nombre_empresa;
    // Loading overlay
    const loadingNombre = document.getElementById('loading-empresa-nombre');
    if (loadingNombre) loadingNombre.textContent = APP_CONFIG.nombre_empresa;
    // Page title
    document.title = APP_CONFIG.nombre_empresa + ' — Sistema Inmobiliario';
}

map.on('load', async () => {
    try {
        console.log('🚀 Iniciando carga de capas...');
        LoadingManager.set(15, 'Conectando a Supabase...');

        checkStoredSession();

        // Poblar campos de APP_CONFIG en facturas y UI
        inicializarCamposEmpresa();
        actualizarNombreEmpresaUI();

        // Intentar restaurar estado guardado del mapa
        setTimeout(() => {
            const restaurado = restaurarEstadoMapa();
            if (restaurado) {
                console.log('✅ Estado del mapa restaurado desde localStorage');
            }
        }, 1000);

        const [lotesData, manzanosData, viasData, cotasData, praderasData, equipamientoData, rutasDataResult, centrosDataResult, veredasData, fotosDataResult] = await Promise.all([
            loadLayer('lotes'),
            loadLayer('manzanos'),
            loadLayer('vias'),
            loadLayer('cotas'),
            loadLayer('praderas'),
            loadLayer('equipamiento'),
            loadLayer('rutas'),
            loadLayer('centros'),
            loadLayer('veredas'),
            loadLayer('fotos')
        ]);

        rutasData = rutasDataResult;
        centrosData = centrosDataResult;
        fotosData = fotosDataResult;

        LoadingManager.set(60, 'Agrupando datos por urbanización...');

        groupByUrb(lotesData, 'lotes');
        groupByUrb(manzanosData, 'manzanos');
        groupByUrb(viasData, 'vias');
        groupByUrb(cotasData, 'cotas');
        groupByUrb(praderasData, 'praderas');
        groupByUrb(equipamientoData, 'equipamiento');
        groupByUrb(veredasData, 'veredas');
        groupByUrb(fotosData, 'fotos');

        LoadingManager.set(75, 'Construyendo capas del mapa...');
        console.log('📊 URB Data agrupada:', urbData);

        map.addSource('mapbox-dem', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
            tileSize: 512,
            maxzoom: 14
        });

        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

        map.addLayer({
            id: 'terrain-3d-layer',
            type: 'hillshade',
            source: 'mapbox-dem',
            layout: { visibility: 'none' },
            paint: {
                'hillshade-exaggeration': 0.8
            }
        });

        map.addSource('google-satellite', {
            type: 'raster',
            tiles: [
                'https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                'https://mt2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                'https://mt3.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
            ],
            tileSize: 256
        });

        map.addLayer({
            id: 'google-satellite-layer',
            type: 'raster',
            source: 'google-satellite',
            layout: { visibility: 'none' }
        });

        if (Object.keys(urbData).length === 0) {
            showToast('warning', 'No se encontraron datos con campo URB');
            return;
        }

        if (rutasData && rutasData.features.length > 0) {
            console.log('🛣️ Agregando capa de Rutas...');
            map.addSource('rutas', { type: 'geojson', data: rutasData });
            map.addLayer({
                id: 'rutas-line',
                type: 'line',
                source: 'rutas',
                paint: {
                    'line-color': COLOR_PALETTE.rutas.lineColor,
                    'line-width': COLOR_PALETTE.rutas.lineWidth,
                    'line-opacity': COLOR_PALETTE.rutas.lineOpacity
                },
                layout: { visibility: 'none' },
                minzoom: ZOOM_LEVELS.rutas.minzoom,
                maxzoom: ZOOM_LEVELS.rutas.maxzoom
            });
        }

        if (centrosData && centrosData.features.length > 0) {
            console.log('📍 Agregando capa de Centros...');
            map.addSource('centros', { type: 'geojson', data: centrosData });

            const iconTypes = ['centro', 'oficina', 'transporte'];
            const iconColors = { 'centro': '#e11d48', 'oficina': '#2563eb', 'transporte': '#16a34a' };

            const createFontAwesomeIcon = (iconClass, color) => {
                return new Promise((resolve, reject) => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 48;
                    canvas.height = 48;
                    const ctx = canvas.getContext('2d');
                    ctx.beginPath();
                    ctx.arc(24, 24, 20, 0, 2 * Math.PI);
                    ctx.fillStyle = color;
                    ctx.fill();
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    ctx.font = 'bold 24px "Font Awesome 6 Free"';
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    let iconChar = '';
                    if (iconClass.includes('map-marker')) iconChar = '\uf3c5';
                    else if (iconClass.includes('building')) iconChar = '\uf1ad';
                    else if (iconClass.includes('bus')) iconChar = '\uf207';
                    ctx.fillText(iconChar, 24, 24);
                    canvas.toBlob((blob) => {
                        const img = new Image();
                        img.onload = () => resolve(img);
                        img.onerror = reject;
                        img.src = URL.createObjectURL(blob);
                    });
                });
            };

            for (const tipo of iconTypes) {
                const iconClass = CENTRO_ICONS[tipo] || CENTRO_ICONS.default;
                const color = iconColors[tipo] || '#6b7280';
                try {
                    const img = await createFontAwesomeIcon(iconClass, color);
                    if (!map.hasImage(`icon-${tipo}`)) {
                        map.addImage(`icon-${tipo}`, img, { sdf: false });
                    }
                } catch (error) {
                    console.warn(`No se pudo cargar el icono ${tipo}:`, error);
                }
            }

            map.addLayer({
                id: 'centros-symbol',
                type: 'symbol',
                source: 'centros',
                layout: {
                    'icon-image': [
                        'case',
                        ['==', ['downcase', ['get', 'TIPO']], 'centro'], 'icon-centro',
                        ['==', ['downcase', ['get', 'TIPO']], 'oficina'], 'icon-oficina',
                        ['==', ['downcase', ['get', 'TIPO']], 'transporte'], 'icon-transporte',
                        'icon-centro'
                    ],
                    'icon-size': 0.8,
                    'icon-allow-overlap': true,
                    'icon-ignore-placement': true,
                    visibility: 'none'
                },
                minzoom: ZOOM_LEVELS.centros.minzoom,
                maxzoom: ZOOM_LEVELS.centros.maxzoom
            });

            map.addLayer({
                id: 'centros-label',
                type: 'symbol',
                source: 'centros',
                layout: {
                    'text-field': ['get', 'NOMBRE'],
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                    'text-size': COLOR_PALETTE.labels.centros.textSize,
                    'text-offset': [0, 2],
                    'text-anchor': 'top',
                    visibility: 'none'
                },
                paint: {
                    'text-color': COLOR_PALETTE.labels.centros.textColor,
                    'text-halo-color': COLOR_PALETTE.labels.centros.haloColor,
                    'text-halo-width': COLOR_PALETTE.labels.centros.haloWidth
                },
                minzoom: ZOOM_LEVELS.labels.centros.minzoom,
                maxzoom: ZOOM_LEVELS.labels.centros.maxzoom
            });

            map.on('click', 'centros-symbol', (e) => {
                if (e.features.length > 0) {
                    const feature = e.features[0];
                    const properties = feature.properties;
                    const popupContent = generarPopupFotos(properties);

                    currentPopup = new mapboxgl.Popup({ maxWidth: '350px' })
                        .setLngLat(e.lngLat)
                        .setHTML(popupContent)
                        .addTo(map);

                    currentPopup.on('close', () => {
                        currentPopup = null;
                    });
                }
            });

            map.on('mouseenter', 'centros-symbol', () => {
                map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mouseleave', 'centros-symbol', () => {
                map.getCanvas().style.cursor = '';
            });

            let pulseOpacity = 1;
            let pulseDirection = -1;
            setInterval(() => {
                pulseOpacity += pulseDirection * 0.05;
                if (pulseOpacity <= 0.4 || pulseOpacity >= 1) {
                    pulseDirection *= -1;
                }
                if (map.getLayer('centros-symbol')) {
                    map.setPaintProperty('centros-symbol', 'icon-opacity', pulseOpacity);
                }
            }, 50);
        }

        const createCameraIcon = (color) => {
            return new Promise((resolve, reject) => {
                const canvas = document.createElement('canvas');
                canvas.width = 48;
                canvas.height = 48;
                const ctx = canvas.getContext('2d');
                ctx.beginPath();
                ctx.arc(24, 24, 20, 0, 2 * Math.PI);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.font = 'bold 24px "Font Awesome 6 Free"';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('\uf030', 24, 24);
                canvas.toBlob((blob) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = URL.createObjectURL(blob);
                });
            });
        };

        try {
            const cameraImg = await createCameraIcon('#e11d48');
            if (!map.hasImage('camera-icon')) {
                map.addImage('camera-icon', cameraImg, { sdf: false });
            }
        } catch (error) {
            console.warn('No se pudo cargar el icono de cámara:', error);
        }

        Object.keys(urbData).forEach((urb) => {
            const urbLayers = urbData[urb];

            if (urbLayers.fotos && urbLayers.fotos.length > 0) {
                console.log(`📸 Agregando capa de Fotos para URB: ${urb} - ${urbLayers.fotos.length} fotos`);
                const fotosSourceId = `fotos-${urb}`;

                map.addSource(fotosSourceId, {
                    type: 'geojson',
                    data: { type: 'FeatureCollection', features: urbLayers.fotos }
                });

                map.addLayer({
                    id: `${fotosSourceId}-symbol`,
                    type: 'symbol',
                    source: fotosSourceId,
                    layout: {
                        'icon-image': 'camera-icon',
                        'icon-size': COLOR_PALETTE.fotos.iconSize,
                        'icon-allow-overlap': true,
                        'icon-ignore-placement': true,
                        visibility: 'none'
                    },
                    minzoom: ZOOM_LEVELS.fotos.minzoom,
                    maxzoom: ZOOM_LEVELS.fotos.maxzoom
                });

                map.on('click', `${fotosSourceId}-symbol`, (e) => {
                    if (e.features.length > 0) {
                        const feature = e.features[0];
                        const properties = feature.properties;
                        const popupContent = generarPopupFotos(properties);

                        currentPopup = new mapboxgl.Popup({ maxWidth: '350px' })
                            .setLngLat(e.lngLat)
                            .setHTML(popupContent)
                            .addTo(map);

                        currentPopup.on('close', () => {
                            currentPopup = null;
                        });
                    }
                });

                map.on('mouseenter', `${fotosSourceId}-symbol`, () => {
                    map.getCanvas().style.cursor = 'pointer';
                });

                map.on('mouseleave', `${fotosSourceId}-symbol`, () => {
                    map.getCanvas().style.cursor = '';
                });
            }

            if (urbLayers.lotes.length > 0) {
                const lotesSourceId = `lotes-${urb}`;
                map.addSource(lotesSourceId, {
                    type: 'geojson',
                    data: { type: 'FeatureCollection', features: urbLayers.lotes }
                });

                map.addLayer({
                    id: `${lotesSourceId}-fill`,
                    type: 'fill',
                    source: lotesSourceId,
                    paint: {
                        'fill-color': [
                            'match',
                            ['get', 'estado'],
                            'VENDIDO', COLOR_PALETTE.lotes.vendido,
                            'DISPONIBLE', COLOR_PALETTE.lotes.disponible,
                            'RESERVADO', COLOR_PALETTE.lotes.reservado,
                            COLOR_PALETTE.lotes.default
                        ],
                        'fill-opacity': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            COLOR_PALETTE.lotes.hoverOpacity,
                            COLOR_PALETTE.lotes.opacity
                        ]
                    },
                    layout: { visibility: 'none' },
                    minzoom: ZOOM_LEVELS.lotes.minzoom,
                    maxzoom: ZOOM_LEVELS.lotes.maxzoom
                });

                map.addLayer({
                    id: `${lotesSourceId}-line`,
                    type: 'line',
                    source: lotesSourceId,
                    paint: {
                        'line-color': COLOR_PALETTE.lotes.borderColor,
                        'line-width': COLOR_PALETTE.lotes.borderWidth
                    },
                    layout: { visibility: 'none' },
                    minzoom: ZOOM_LEVELS.lotes.minzoom,
                    maxzoom: ZOOM_LEVELS.lotes.maxzoom
                });

                map.addLayer({
                    id: `${lotesSourceId}-label`,
                    type: 'symbol',
                    source: lotesSourceId,
                    layout: {
                        'text-field': ['to-string', ['get', 'lote']],
                        'text-size': COLOR_PALETTE.labels.lotes.textSize,
                        visibility: 'none'
                    },
                    paint: {
                        'text-color': COLOR_PALETTE.labels.lotes.textColor,
                        'text-halo-color': COLOR_PALETTE.labels.lotes.haloColor,
                        'text-halo-width': COLOR_PALETTE.labels.lotes.haloWidth
                    },
                    minzoom: ZOOM_LEVELS.labels.lotes.minzoom,
                    maxzoom: ZOOM_LEVELS.labels.lotes.maxzoom
                });

                map.on('mousemove', `${lotesSourceId}-fill`, (e) => {
                    if (e.features.length > 0) {
                        if (hoveredStateId !== null && hoveredStateId !== e.features[0].id) {
                            map.setFeatureState({ source: lotesSourceId, id: hoveredStateId }, { hover: false });
                        }
                        hoveredStateId = e.features[0].id;
                        map.setFeatureState({ source: lotesSourceId, id: hoveredStateId }, { hover: true });
                    }
                    map.getCanvas().style.cursor = 'pointer';
                });

                map.on('mouseleave', `${lotesSourceId}-fill`, () => {
                    if (hoveredStateId !== null) {
                        map.setFeatureState({ source: lotesSourceId, id: hoveredStateId }, { hover: false });
                    }
                    hoveredStateId = null;
                    map.getCanvas().style.cursor = '';
                });

                map.on('click', `${lotesSourceId}-fill`, (e) => {
                    if (e.features.length > 0) {
                        const feature = e.features[0];
                        const properties = feature.properties;

                        // Si estamos en modo selección de lote para cobros
                        if (modoSeleccionMapa) {
                            const gid = properties[idFieldName];
                            const loteNumero = properties.lote;
                            const manzanoNumero = properties.manzano;
                            const urbActual = properties.urb;

                            // Verificar que el lote esté en la lista de disponibles para cobro
                            const loteEncontrado = lotesDisponiblesParaCobro.find(l => l.gid === gid);

                            if (loteEncontrado) {
                                // Seleccionar el lote en el dropdown
                                const loteSelect = document.getElementById('cobros-lote-select');
                                loteSelect.value = gid;

                                // Disparar evento change manualmente
                                const event = new Event('change');
                                loteSelect.dispatchEvent(event);

                                // Desactivar modo selección
                                desactivarModoSeleccionMapa();

                                const manzanoText = manzanoNumero ? `Mz ${manzanoNumero} ` : '';
                                showToast('success', `${manzanoText}Lt ${loteNumero} seleccionado`);
                            } else {
                                showAlert('warning', 'Lote No Disponible', 'Este lote no está disponible para cobros.<br>Debe ser un lote <strong>VENDIDO</strong> de la urbanización seleccionada.');
                            }

                            return; // No mostrar popup normal
                        }

                        // Comportamiento normal (mostrar popup)
                        currentUrb = urb;
                        currentFeatureId = properties[idFieldName];
                        const popupContent = generarPopupContent(properties, false);
                        currentPopup = new mapboxgl.Popup()
                            .setLngLat(e.lngLat)
                            .setHTML(popupContent)
                            .addTo(map);
                        currentPopup.on('close', () => {
                            currentPopup = null;
                            currentFeatureId = null;
                            currentUrb = null;
                        });
                    }
                });
            }

            ['veredas', 'manzanos', 'vias', 'cotas', 'praderas', 'equipamiento'].forEach(layerType => {
                if (urbLayers[layerType] && urbLayers[layerType].length > 0) {
                    const sourceId = `${layerType}-${urb}`;
                    map.addSource(sourceId, {
                        type: 'geojson',
                        data: { type: 'FeatureCollection', features: urbLayers[layerType] }
                    });

                    if (layerType === 'veredas' || layerType === 'manzanos' || layerType === 'praderas' || layerType === 'equipamiento') {
                        map.addLayer({
                            id: `${sourceId}-fill`,
                            type: 'fill',
                            source: sourceId,
                            paint: {
                                'fill-color': COLOR_PALETTE[layerType].fillColor,
                                'fill-opacity': COLOR_PALETTE[layerType].fillOpacity
                            },
                            layout: { visibility: 'none' },
                            minzoom: ZOOM_LEVELS[layerType].minzoom,
                            maxzoom: ZOOM_LEVELS[layerType].maxzoom
                        });
                    }

                    map.addLayer({
                        id: `${sourceId}-line`,
                        type: 'line',
                        source: sourceId,
                        paint: {
                            'line-color': COLOR_PALETTE[layerType].lineColor,
                            'line-width': COLOR_PALETTE[layerType].lineWidth,
                            'line-opacity': COLOR_PALETTE[layerType].lineOpacity
                        },
                        layout: { visibility: 'none' },
                        minzoom: ZOOM_LEVELS[layerType].minzoom,
                        maxzoom: ZOOM_LEVELS[layerType].maxzoom
                    });

                    if (layerType !== 'veredas') {
                        const labelField = layerType === 'manzanos' ? 'manzano' : (layerType === 'vias' ? 'clase' : (layerType === 'cotas' ? 'cota' : 'nombre'));
                        const isLineBased = (layerType === 'vias' || layerType === 'cotas');
                        // Construir layout sin propiedades undefined para evitar errores silenciosos en Mapbox GL JS
                        const labelLayout = {
                            'text-field': ['to-string', ['get', labelField]],
                            'text-size': COLOR_PALETTE.labels[layerType].textSize,
                            'symbol-placement': isLineBased ? 'line' : 'point',
                            visibility: 'visible'  // Siempre visible; se controla con setLayoutProperty
                        };
                        if (!isLineBased) {
                            labelLayout['text-anchor'] = 'center';
                        } else {
                            // Para capas de línea: permitir más repetición de etiquetas a lo largo de la vía
                            labelLayout['symbol-spacing'] = 200;
                            labelLayout['text-max-angle'] = 30;
                        }
                        map.addLayer({
                            id: `${sourceId}-label`,
                            type: 'symbol',
                            source: sourceId,
                            layout: labelLayout,
                            paint: {
                                'text-color': COLOR_PALETTE.labels[layerType].textColor,
                                'text-halo-color': COLOR_PALETTE.labels[layerType].haloColor,
                                'text-halo-width': COLOR_PALETTE.labels[layerType].haloWidth
                            },
                            minzoom: ZOOM_LEVELS.labels[layerType].minzoom,
                            maxzoom: ZOOM_LEVELS.labels[layerType].maxzoom
                        });
                        // Ocultar hasta que el usuario active la capa
                        map.setLayoutProperty(`${sourceId}-label`, 'visibility', 'none');
                    }
                }
            });
        });

        const urbLayersDiv = document.getElementById('urb-layers');
        Object.keys(urbData).forEach(urb => {
            const div = document.createElement('div');
            div.className = 'layer-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `urb-${urb}`;
            checkbox.addEventListener('change', (e) => {
                const visibility = e.target.checked ? 'visible' : 'none';
                ['lotes', 'manzanos', 'vias', 'cotas', 'praderas', 'equipamiento', 'veredas'].forEach(layer => {
                    const sourceId = `${layer}-${urb}`;
                    ['fill', 'line', 'label'].forEach(suffix => {
                        const layerId = `${sourceId}-${suffix}`;
                        if (map.getLayer(layerId)) {
                            map.setLayoutProperty(layerId, 'visibility', visibility);
                        }
                    });
                });
                if (e.target.checked && urbData[urb]) {
                    const allFeatures = [
                        ...urbData[urb].lotes,
                        ...urbData[urb].manzanos,
                        ...urbData[urb].vias,
                        ...urbData[urb].cotas,
                        ...urbData[urb].praderas,
                        ...urbData[urb].equipamiento,
                        ...urbData[urb].veredas
                    ];
                    if (allFeatures.length > 0) {
                        zoomToFeatures(allFeatures);
                    }
                }
            });
            const label = document.createElement('label');
            label.htmlFor = `urb-${urb}`;
            label.textContent = URB_NOMBRES[urb] || `URB: ${urb}`;
            const icon = document.createElement('i');
            icon.className = 'fas fa-crosshairs';
            div.appendChild(checkbox);
            div.appendChild(label);
            div.appendChild(icon);
            urbLayersDiv.appendChild(div);
        });

        const baseLayersDiv = document.getElementById('base-layers');
        const baseLayersConfig = [
            { id: 'mapbox-base', label: 'Google Maps', icon: 'fas fa-map', checked: true, layer: 'mapbox' },
            { id: 'google-satellite', label: 'Imagen Satelital', icon: 'fas fa-satellite', checked: false, layer: 'google-satellite' },
            { id: 'satellite-3d', label: 'Satélite 3D con Relieve', icon: 'fas fa-globe-americas', checked: false, layer: 'satellite-3d' },
            { id: 'terrain-3d', label: 'Mapa 3D con Relieve', icon: 'fas fa-mountain', checked: false, layer: 'terrain-3d' }
        ];

        baseLayersConfig.forEach(config => {
            const div = document.createElement('div');
            div.className = 'layer-item';
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'base-layer';
            radio.id = config.id;
            radio.checked = config.checked;
            radio.addEventListener('change', () => {
                if (config.layer === 'mapbox') {
                    map.setLayoutProperty('terrain-3d-layer', 'visibility', 'none');
                    map.setLayoutProperty('google-satellite-layer', 'visibility', 'none');
                    map.setPitch(0);
                    map.setTerrain(null);
                    currentBaseLayer = 'mapbox';
                } else if (config.layer === 'terrain-3d') {
                    map.setLayoutProperty('terrain-3d-layer', 'visibility', 'visible');
                    map.setLayoutProperty('google-satellite-layer', 'visibility', 'none');
                    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
                    map.easeTo({ pitch: 60, duration: 1000 });
                    currentBaseLayer = 'terrain-3d';
                } else if (config.layer === 'satellite-3d') {
                    map.setLayoutProperty('terrain-3d-layer', 'visibility', 'none');
                    map.setLayoutProperty('google-satellite-layer', 'visibility', 'visible');
                    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
                    map.easeTo({ pitch: 60, duration: 1000 });
                    currentBaseLayer = 'satellite-3d';
                } else if (config.layer === 'google-satellite') {
                    map.setLayoutProperty('google-satellite-layer', 'visibility', 'visible');
                    map.setLayoutProperty('terrain-3d-layer', 'visibility', 'none');
                    map.setPitch(0);
                    map.setTerrain(null);
                    currentBaseLayer = 'google-satellite';
                }
                updateMeasureVisibility();
            });
            const label = document.createElement('label');
            label.htmlFor = config.id;
            label.textContent = config.label;
            const icon = document.createElement('i');
            icon.className = config.icon;
            div.appendChild(radio);
            div.appendChild(label);
            div.appendChild(icon);
            baseLayersDiv.appendChild(div);
        });

        LoadingManager.set(95, 'Finalizando...');
        setTimeout(() => LoadingManager.ocultar(), 300);
        actualizarContadoresLeyenda();
        console.log('✅ Capas cargadas exitosamente');
        console.log('✨ MEJORAS IMPLEMENTADAS:');
        console.log('   ✅ Mapa 3D con visualización de relieve');
        console.log('   ✅ Imagen satelital 3D con relieve');
        console.log('   ✅ Capa de fotos con popups interactivos y pantalla completa');
        console.log('   ✅ Fotos en centros con mismo sistema de iconos');
        console.log('   ✅ Sistema de autenticación implementado');
        console.log('   ✅ Edición de estados CORREGIDA (usando gid)');
        console.log('   ✅ Carga optimizada de datos');
        console.log('   ✅ Campo monto en bolivianos agregado');
        console.log('   ✅ Módulo de cobros completo');
        console.log('   ✅ Persistencia de estado en móvil');
    } catch (error) {
        LoadingManager.ocultar(); // ocultar aunque haya error
        console.error('❌ Error general cargando capas:', error);
        showAlert('error', 'Error de Carga', 'Error cargando capas: ' + error.message);
    }
});

/* =====================================================
   MÓDULO DE COBROS
   ===================================================== */

// Variables globales para cobros
let loteSeleccionadoCobro = null;
let cobrosDelLote = [];
let modoSeleccionMapa = false;
let lotesDisponiblesParaCobro = [];

// Abrir modal de cobros
document.getElementById('cobros-btn').addEventListener('click', async () => {
    if (!isUserLoggedIn) {
        showToast('warning', 'Debe iniciar sesión para acceder al módulo de cobros');
        document.getElementById('user-modal').style.display = 'flex';
        return;
    }

    document.getElementById('cobros-modal').style.display = 'flex';

    // Cargar urbanizaciones solo en selector de vendidos
    const urbOptions = '<option value="">Seleccione...</option>' +
        Object.keys(URB_NOMBRES).map(urb => `<option value="${urb}">${URB_NOMBRES[urb]}</option>`).join('');

    document.getElementById('cobros-urb-select').innerHTML = urbOptions;
});

// Cerrar modal de cobros
document.getElementById('close-cobros-modal').addEventListener('click', () => {
    document.getElementById('cobros-modal').style.display = 'none';

    // Desactivar modo selección si está activo
    if (modoSeleccionMapa) {
        desactivarModoSeleccionMapa();
    }

    // Limpiar búsqueda
    document.getElementById('cobros-lote-buscar').value = '';

    limpiarSeleccionCobro();
});

// Cambio de urbanización
document.getElementById('cobros-urb-select').addEventListener('change', async (e) => {
    const urb = e.target.value;
    const loteSelect = document.getElementById('cobros-lote-select');
    const loteBuscar = document.getElementById('cobros-lote-buscar');
    const btnSeleccionarMapa = document.getElementById('seleccionar-desde-mapa-btn');

    if (!urb) {
        loteSelect.disabled = true;
        loteBuscar.disabled = true;
        btnSeleccionarMapa.disabled = true;
        loteSelect.innerHTML = '<option value="">Seleccione urbanización primero...</option>';
        lotesDisponiblesParaCobro = [];
        limpiarSeleccionCobro();
        return;
    }

    // Cargar lotes SOLO VENDIDOS de la urbanización (punto 7)
    try {
        // Primero intentar con todos los campos nuevos
        let data = null;
        let error = null;

        const result1 = await supabaseClient
            .from('lotes')
            .select('gid, lote, manzano, estado, nom_cliente, precio_vent, monto_bs, monto_reserva, ci_cliente, cel_cliente, nro_cuotas, tipo_venta')
            .eq('urb', urb)
            .eq('estado', 'VENDIDO')
            .order('manzano')
            .order('lote');

        if (result1.error && (result1.error.message.includes('column') || result1.error.code === 'PGRST204')) {
            // Fallback: consulta solo con campos base
            console.warn('⚠️ Campos extendidos no encontrados, usando campos base para cobros');
            const result2 = await supabaseClient
                .from('lotes')
                .select('gid, lote, manzano, estado, nom_cliente, precio_vent, monto_bs, tipo_venta, cel_cliente')
                .eq('urb', urb)
                .eq('estado', 'VENDIDO')
                .order('manzano')
                .order('lote');
            data = result2.data;
            error = result2.error;
        } else {
            data = result1.data;
            error = result1.error;
        }

        if (error) throw error;

        lotesDisponiblesParaCobro = data || [];

        if (lotesDisponiblesParaCobro.length > 0) {
            renderizarListaLotes(lotesDisponiblesParaCobro);
            loteSelect.disabled = false;
            loteBuscar.disabled = false;
            btnSeleccionarMapa.disabled = false;
        } else {
            loteSelect.innerHTML = '<option value="">No hay lotes vendidos en esta urbanización</option>';
            loteSelect.disabled = true;
            loteBuscar.disabled = true;
            btnSeleccionarMapa.disabled = true;
            lotesDisponiblesParaCobro = [];
        }

        limpiarSeleccionCobro();
    } catch (error) {
        console.error('Error cargando lotes:', error);
        showToast('error', 'Error al cargar los lotes');
    }
});

// Cambio de lote
document.getElementById('cobros-lote-select').addEventListener('change', async (e) => {
    const gid = e.target.value;

    if (!gid) {
        limpiarSeleccionCobro();
        return;
    }

    const selectedOption = e.target.options[e.target.selectedIndex];
    loteSeleccionadoCobro = JSON.parse(selectedOption.dataset.loteData);

    // Cargar historial de cobros
    await cargarHistorialCobros(gid);

    // Mostrar información del lote
    mostrarInfoLote();

    // Habilitar botón de registrar cobro
    document.getElementById('registrar-cobro-btn').disabled = false;
});

// Función para cargar historial de cobros
async function cargarHistorialCobros(loteGid) {
    try {
        // Cargar cobros (cuotas)
        const { data: cobros, error: errCobros } = await supabaseClient
            .from('cobros')
            .select('*')
            .eq('lote_gid', loteGid)
            .order('nro_cuota', { ascending: true });
        if (errCobros) throw errCobros;

        // Cargar factura del adelanto (para obtener N° y fecha)
        let facturaAdelanto = null;
        try {
            const { data: facAd } = await supabaseClient
                .from('facturas')
                .select('nro_factura, tipo_factura, total, fecha_emision, nombre_cliente')
                .eq('lote_gid', loteGid)
                .ilike('tipo_factura', 'ADELANTO%')
                .order('fecha_emision', { ascending: true })
                .limit(1)
                .maybeSingle();
            facturaAdelanto = facAd || null;
        } catch (e) { facturaAdelanto = null; }

        cobrosDelLote = cobros || [];

        // SIEMPRE mostrar el adelanto si monto_reserva > 0 en el lote
        // La factura es opcional (si existe muestra el N°, sino muestra solo el monto)
        const montoReserva = parseFloat(loteSeleccionadoCobro?.monto_reserva || 0);
        mostrarHistorialCobros(montoReserva, facturaAdelanto);
    } catch (error) {
        console.error('Error cargando historial:', error);
        cobrosDelLote = [];
        mostrarHistorialCobros(0, null);
    }
}

// Función para mostrar historial de cobros
function mostrarHistorialCobros(montoReserva = 0, facturaAdelanto = null) {
    const historialDiv = document.getElementById('cobros-historial');
    const tieneAdelanto = montoReserva > 0;

    if (cobrosDelLote.length === 0 && !tieneAdelanto) {
        historialDiv.innerHTML = `
            <div style="text-align:center; color:#6b7280; padding:40px 20px;">
                <i class="fas fa-inbox" style="font-size:36px; color:#d1d5db; margin-bottom:12px; display:block;"></i>
                No hay cobros registrados para este lote
            </div>
        `;
        // Resetear totales
        document.getElementById('info-total-cobrado').textContent = 'Bs 0.00';
        const montoBs = parseFloat(loteSeleccionadoCobro?.monto_bs || 0);
        document.getElementById('info-saldo').textContent = `Bs ${montoBs.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`;
        return;
    }

    let totalCobrado = 0;
    let html = '<div style="display:grid; gap:8px;">';

    // ── ADELANTO DE RESERVA — leído directamente del lote ─────────
    if (tieneAdelanto) {
        totalCobrado += montoReserva;
        const fechaAd = facturaAdelanto?.fecha_emision
            ? new Date(facturaAdelanto.fecha_emision).toLocaleDateString('es-BO')
            : '—';
        const nroFac = facturaAdelanto?.nro_factura || null;
        html += `
            <div style="padding:14px 16px; background:#fefce8; border:1px solid #fde047; border-radius:10px; position:relative; overflow:hidden;">
                <div style="position:absolute; top:0; left:0; bottom:0; width:4px; background:#eab308; border-radius:10px 0 0 10px;"></div>
                <div style="padding-left:8px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span style="font-weight:700; color:#713f12; font-size:11px; text-transform:uppercase; letter-spacing:0.6px; display:flex; align-items:center; gap:5px;">
                            <i class="fas fa-bookmark" style="color:#ca8a04;"></i> Adelanto / Reserva
                        </span>
                        <span style="font-size:17px; font-weight:800; color:#ca8a04;">Bs ${montoReserva.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style="font-size:12px; color:#78350f; display:flex; flex-wrap:wrap; gap:8px;">
                        ${fechaAd !== '—' ? `<span><i class="fas fa-calendar-alt"></i> ${fechaAd}</span>` : '<span><i class="fas fa-calendar-alt"></i> Fecha registrada en reserva</span>'}
                        ${nroFac ? `<span><i class="fas fa-receipt"></i> Fac. N° ${nroFac}</span>` : '<span style="opacity:0.7;"><i class="fas fa-info-circle"></i> Sin factura registrada</span>'}
                        <span style="background:#fef08a; color:#713f12; padding:1px 7px; border-radius:12px; font-weight:700; font-size:11px;">SE DESCUENTA EN CUOTA 1</span>
                    </div>
                </div>
            </div>
        `;
    }

    // ── CUOTAS PAGADAS ────────────────────────────────────────────
    cobrosDelLote.forEach(cobro => {
        totalCobrado += parseFloat(cobro.monto);
        const fecha = new Date(cobro.fecha_cobro).toLocaleDateString('es-BO');
        const tieneFactura = !!cobro.nro_factura;

        html += `
            <div style="padding:14px 16px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px; position:relative; overflow:hidden;">
                <div style="position:absolute; top:0; left:0; bottom:0; width:4px; background:#3b82f6; border-radius:10px 0 0 10px;"></div>
                <div style="padding-left:8px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span style="font-weight:700; color:#1e40af; font-size:12px; display:flex; align-items:center; gap:5px;">
                            <i class="fas fa-circle-check" style="color:#3b82f6;"></i> Cuota N° ${cobro.nro_cuota}
                        </span>
                        <span style="font-size:17px; font-weight:800; color:#059669;">Bs ${parseFloat(cobro.monto).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style="font-size:12px; color:#6b7280; display:flex; flex-wrap:wrap; gap:8px;">
                        <span><i class="fas fa-calendar-alt"></i> ${fecha}</span>
                        ${tieneFactura ? `<span><i class="fas fa-receipt"></i> Fac. N° ${cobro.nro_factura}</span>` : ''}
                        <span><i class="fas fa-user-circle"></i> ${cobro.usuario}</span>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    historialDiv.innerHTML = html;

    // Actualizar totales
    document.getElementById('info-total-cobrado').textContent = `Bs ${totalCobrado.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`;
    const montoBs = parseFloat(loteSeleccionadoCobro?.monto_bs || 0);
    const saldo = montoBs - totalCobrado;
    const saldoFinal = Math.max(0, saldo);
    document.getElementById('info-saldo').textContent = `Bs ${saldoFinal.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`;

    // ── MENSAJE DE LOTE CANCELADO COMPLETAMENTE ──
    if (saldoFinal <= 0 && montoBs > 0) {
        historialDiv.innerHTML += `
        <div style="margin-top:14px; padding:18px 16px; background:linear-gradient(135deg,#d1fae5,#a7f3d0); border:2px solid #10b981; border-radius:14px; text-align:center; box-shadow:0 4px 14px rgba(16,185,129,0.18);">
            <i class="fas fa-check-circle" style="font-size:36px; color:#059669; margin-bottom:8px; display:block;"></i>
            <div style="font-size:16px; font-weight:800; color:#065f46; margin-bottom:4px;">🎉 ¡LOTE CANCELADO COMPLETAMENTE!</div>
            <div style="font-size:13px; color:#047857; font-weight:600;">
                ${loteSeleccionadoCobro?.nom_cliente ? '<i class="fas fa-user-check"></i> ' + loteSeleccionadoCobro.nom_cliente + ' ha' : 'El cliente ha'} terminado de cancelar el lote.
            </div>
            <div style="font-size:12px; color:#059669; margin-top:6px; font-weight:700;">Saldo Pendiente: Bs 0.00 ✓</div>
        </div>`;
        // También actualizar el color del saldo en el panel de info
        const saldoEl = document.getElementById('info-saldo');
        if (saldoEl) saldoEl.style.color = '#059669';
    }
}

// Función para mostrar información del lote
function mostrarInfoLote() {
    const lote = loteSeleccionadoCobro;
    const montoReserva = parseFloat(lote.monto_reserva || 0);
    document.getElementById('cobros-lote-info').style.display = 'block';
    document.getElementById('info-cliente').textContent = lote.nom_cliente || 'Sin registro';
    // CI
    const ciEl = document.getElementById('info-ci');
    if (ciEl) ciEl.textContent = lote.ci_cliente || '—';
    // Precio en USD
    document.getElementById('info-precio').textContent = lote.precio_vent ?
        `$us ${parseFloat(lote.precio_vent).toLocaleString('es-BO', { minimumFractionDigits: 2 })}` :
        'No registrado';
    // Precio en Bolivianos
    const preciosBsEl = document.getElementById('info-precio-bs');
    if (preciosBsEl) {
        preciosBsEl.textContent = lote.monto_bs ?
            `Bs ${parseFloat(lote.monto_bs).toLocaleString('es-BO', { minimumFractionDigits: 2 })}` :
            'No registrado';
    }
    // Mostrar monto reserva en info panel
    const reservaInfoEl = document.getElementById('info-monto-reserva-panel');
    if (reservaInfoEl) {
        if (montoReserva > 0) {
            reservaInfoEl.style.display = 'block';
            reservaInfoEl.innerHTML = `<i class="fas fa-bookmark" style="color:#ca8a04;"></i> <strong>Adelanto:</strong> <span style="color:#ca8a04; font-weight:700;">Bs ${montoReserva.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</span> <span style="font-size:11px; color:#6b7280;">(se descuenta en cuota 1)</span>`;
        } else {
            reservaInfoEl.style.display = 'none';
        }
    }
}

// Función para limpiar selección
function limpiarSeleccionCobro() {
    loteSeleccionadoCobro = null;
    cobrosDelLote = [];
    document.getElementById('cobros-lote-info').style.display = 'none';
    document.getElementById('registrar-cobro-btn').disabled = true;
    document.getElementById('cobros-historial').innerHTML = `
        <p style="text-align: center; color: #64748b; padding: 40px;">
            Seleccione un lote para ver su historial de cobros
        </p>
    `;
}

// Función para renderizar lista de lotes (ordenados Manzano ASC, Lote ASC)
function renderizarListaLotes(lotes) {
    const loteSelect = document.getElementById('cobros-lote-select');
    loteSelect.innerHTML = '';

    if (lotes.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No se encontraron lotes vendidos';
        loteSelect.appendChild(option);
        return;
    }

    // Ordenar: manzano ASC (numérico), luego lote ASC (numérico)
    const sorted = [...lotes].sort((a, b) => {
        const ma = parseInt(a.manzano) || 0;
        const mb = parseInt(b.manzano) || 0;
        if (ma !== mb) return ma - mb;
        return (parseInt(a.lote) || 0) - (parseInt(b.lote) || 0);
    });

    sorted.forEach(lote => {
        const option = document.createElement('option');
        option.value = lote.gid;
        const manzanoText = lote.manzano ? `Mz ${lote.manzano} ` : '';
        option.textContent = `${manzanoText}Lt ${lote.lote} — ${lote.nom_cliente || 'Sin cliente'}`;
        option.dataset.loteData = JSON.stringify(lote);
        loteSelect.appendChild(option);
    });
}

// Búsqueda de lotes
document.getElementById('cobros-lote-buscar').addEventListener('input', (e) => {
    const busqueda = e.target.value.toLowerCase().trim();

    if (!busqueda) {
        renderizarListaLotes(lotesDisponiblesParaCobro);
        return;
    }

    const lotesFiltrados = lotesDisponiblesParaCobro.filter(lote => {
        const numeroLote = lote.lote.toString().toLowerCase();
        const numeroManzano = lote.manzano ? lote.manzano.toString().toLowerCase() : '';
        const cliente = (lote.nom_cliente || '').toLowerCase();
        return numeroLote.includes(busqueda) ||
            numeroManzano.includes(busqueda) ||
            cliente.includes(busqueda);
    });

    renderizarListaLotes(lotesFiltrados);
});

// Activar modo de selección desde mapa
document.getElementById('seleccionar-desde-mapa-btn').addEventListener('click', () => {
    modoSeleccionMapa = true;
    document.getElementById('seleccionar-desde-mapa-btn').style.display = 'none';

    // Mostrar banner flotante con botón cancelar visible sobre el mapa
    const banner = document.getElementById('mapa-seleccion-banner');
    if (banner) banner.style.display = 'flex';

    // Minimizar el modal de cobros (no cerrar, solo minimizar)
    document.getElementById('cobros-modal').style.opacity = '0.25';
    document.getElementById('cobros-modal').style.pointerEvents = 'none';

    // Cambiar cursor del mapa
    map.getCanvas().style.cursor = 'crosshair';
});

// Cancelar selección desde banner flotante
const bannerCancelBtn = document.getElementById('cancelar-seleccion-mapa-banner-btn');
if (bannerCancelBtn) {
    bannerCancelBtn.addEventListener('click', () => desactivarModoSeleccionMapa());
}

function desactivarModoSeleccionMapa() {
    modoSeleccionMapa = false;
    document.getElementById('seleccionar-desde-mapa-btn').style.display = 'block';

    // Ocultar banner flotante
    const banner = document.getElementById('mapa-seleccion-banner');
    if (banner) banner.style.display = 'none';

    // Restaurar modal de cobros
    document.getElementById('cobros-modal').style.opacity = '1';
    document.getElementById('cobros-modal').style.pointerEvents = 'all';

    // Restaurar cursor del mapa
    map.getCanvas().style.cursor = '';
}


// Abrir modal de nuevo cobro
document.getElementById('registrar-cobro-btn').addEventListener('click', () => {
    const lote = loteSeleccionadoCobro;

    // ── Datos del cobro ──────────────────────────────────────────
    const proximaCuota = cobrosDelLote.length + 1;
    document.getElementById('nuevo-cobro-cuota').value = proximaCuota;
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('nuevo-cobro-fecha').value = hoy;

    // Resumen del cliente en panel izquierdo
    document.getElementById('cobro-resumen-nombre').textContent = lote.nom_cliente || 'Sin registro';
    document.getElementById('cobro-resumen-ci').textContent = lote.ci_cliente || '—';
    document.getElementById('cobro-resumen-cel').textContent = lote.cel_cliente || '—';
    document.getElementById('cobro-resumen-lote').textContent =
        `Lote ${lote.lote || '?'} — Manzano ${lote.manzano || '?'}`;

    // Descuento por reserva (primera cuota) — SOLO INFORMATIVO, el vendedor ingresa el monto
    const montoReserva = parseFloat(lote.monto_reserva || 0);
    const infoReservaDiv = document.getElementById('cobro-reserva-descuento-info');
    const montoBs = parseFloat(lote.monto_bs || 0);
    const nroCuotas = parseInt(lote.nro_cuotas || 1);
    const cuotaNormal = nroCuotas > 0 ? (montoBs / nroCuotas) : montoBs;

    let descuentoAplicado = 0;

    if (proximaCuota === 1 && montoReserva > 0) {
        infoReservaDiv.style.display = 'block';
        document.getElementById('cobro-reserva-monto-display').textContent =
            `Bs ${montoReserva.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`;
        descuentoAplicado = montoReserva;
        // NO auto-rellenamos el monto — el vendedor debe ingresarlo manualmente
        document.getElementById('nuevo-cobro-monto').value = '';
        document.getElementById('nuevo-cobro-monto').placeholder = `Ej: ${Math.max(0, cuotaNormal - montoReserva).toFixed(2)} (cuota - reserva)`;
    } else {
        infoReservaDiv.style.display = 'none';
        // NO auto-rellenamos el monto — el vendedor debe ingresarlo manualmente
        document.getElementById('nuevo-cobro-monto').value = '';
        document.getElementById('nuevo-cobro-monto').placeholder = cuotaNormal > 0 ? `Ej: ${cuotaNormal.toFixed(2)}` : 'Ingrese el monto';
    }

    // ── Pre-llenar datos del cliente en sección FACTURA ──────────
    document.getElementById('fact-cliente-ci').value = lote.ci_cliente || '';
    document.getElementById('fact-cliente-nombre').value = lote.nom_cliente || '';

    // Descripción automática
    const mzText = lote.manzano ? `Mz ${lote.manzano} ` : '';
    document.getElementById('fact-descripcion').value =
        `Pago Cuota N°${proximaCuota} — Lote ${lote.lote || '?'} ${mzText}— ${lote.nom_cliente || ''}`;

    // En la factura: dejar monto en blanco para que el vendedor lo ingrese
    document.getElementById('fact-cantidad').value = 1;
    document.getElementById('fact-monto').value = '';
    document.getElementById('fact-monto').placeholder = 'Ingrese el monto';
    // Si es primera cuota con reserva, pre-llenar el descuento
    document.getElementById('fact-descuento').value = descuentoAplicado > 0 ? descuentoAplicado.toFixed(2) : '0';
    actualizarTotalFactura();

    // Generar N° factura y CUF automáticos
    const nroAuto = getNextFacturaNumero('FAC');
    document.getElementById('fact-numero').value = nroAuto;
    generarCUF();

    // Mostrar modal
    document.getElementById('nuevo-cobro-modal').style.display = 'flex';
});

// Cerrar modal de nuevo cobro
document.getElementById('close-nuevo-cobro-modal').addEventListener('click', () => {
    document.getElementById('nuevo-cobro-modal').style.display = 'none';
    document.getElementById('nuevo-cobro-form').reset();
});

document.getElementById('omitir-factura-cobro-btn').addEventListener('click', async () => {
    const monto = parseFloat(document.getElementById('nuevo-cobro-monto').value);
    const fecha = document.getElementById('nuevo-cobro-fecha').value;
    const cuota = parseInt(document.getElementById('nuevo-cobro-cuota').value);

    if (!monto || monto <= 0 || !fecha || !cuota) {
        showAlert('warning', 'Datos Incompletos', 'Complete el monto y la fecha del cobro antes de continuar.');
        return;
    }

    const confirmar = await showConfirm(
        'Guardar SIN Factura',
        `¿Desea registrar el cobro de <strong>Bs ${monto.toFixed(2)}</strong> <strong>sin generar factura</strong>?<br><br>El cobro quedará registrado con indicación <em>"SIN FACTURA"</em>. <strong>No podrá generarse factura después.</strong>`,
        'Sí, Guardar SIN Factura', 'No, Cancelar'
    );
    if (!confirmar) return;

    const btn = document.getElementById('omitir-factura-cobro-btn');
    setBtnLoading(btn, true);
    try {
        const urb = document.getElementById('cobros-urb-select').value;
        const cobro_payload_sf = {
            lote_gid: loteSeleccionadoCobro.gid,
            urb: urb,
            lote: loteSeleccionadoCobro.lote,
            monto: monto,
            fecha_cobro: new Date(fecha + 'T12:00:00').toISOString(),
            nro_factura: 'SIN FACTURA',
            nro_cuota: cuota,
            usuario: currentUsername
        };
        const { error } = await supabaseClient.from('cobros').insert([cobro_payload_sf]);
        if (error) throw error;
        showToast('info', 'Cobro guardado — SIN FACTURA');
        document.getElementById('nuevo-cobro-modal').style.display = 'none';
        document.getElementById('nuevo-cobro-form').reset();
        await cargarHistorialCobros(loteSeleccionadoCobro.gid);
    } catch (err) {
        showAlert('error', 'Error al Guardar', 'No se pudo registrar el cobro: ' + err.message);
    } finally {
        setBtnLoading(btn, false);
    }
});
// Lógica: Precio/Monto (factura) = monto ingresado por vendedor
//         Descuento = adelanto/reserva ya pagado (pre-cargado automáticamente)
//         Total factura = Precio/Monto − Descuento (lo que el cliente paga HOY)
document.getElementById('nuevo-cobro-monto').addEventListener('input', () => {
    const v = parseFloat(document.getElementById('nuevo-cobro-monto').value) || 0;
    // El precio en la factura es exactamente el monto que el vendedor ingresó
    document.getElementById('fact-monto').value = v > 0 ? v.toFixed(2) : '';
    actualizarTotalFactura();
});

// Guardar nuevo cobro
document.getElementById('nuevo-cobro-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const monto = parseFloat(document.getElementById('nuevo-cobro-monto').value);
    const fecha = document.getElementById('nuevo-cobro-fecha').value;
    const cuota = parseInt(document.getElementById('nuevo-cobro-cuota').value);

    if (!monto || monto <= 0) {
        showAlert('warning', 'Monto requerido', 'Por favor ingrese el monto del cobro.');
        return;
    }

    // Validación: no permitir cobro mayor al saldo
    const montoBs = parseFloat(loteSeleccionadoCobro.monto_bs || 0);
    const totalCobrado = cobrosDelLote.reduce((sum, c) => sum + parseFloat(c.monto), 0)
                       + parseFloat(loteSeleccionadoCobro.monto_reserva || 0); // incluir adelanto
    const saldo = montoBs - totalCobrado;

    if (monto > saldo && saldo > 0) {
        const continuar = await showConfirm(
            '¿Monto excede el saldo?',
            `El monto ingresado (<strong>Bs ${monto.toFixed(2)}</strong>) es mayor al saldo pendiente (<strong>Bs ${saldo.toFixed(2)}</strong>).<br><br>¿Desea continuar de todas formas?`,
            'Sí, continuar', 'No, corregir'
        );
        if (!continuar) return;
    }

    // Confirmar antes de guardar
    const confirmar = await showConfirm(
        'Confirmar Cobro',
        `¿Está seguro de registrar el cobro por <strong>Bs ${monto.toFixed(2)}</strong>?`,
        'Sí, Registrar', 'No, Cancelar'
    );
    if (!confirmar) return;

    const submitBtn = document.querySelector('#nuevo-cobro-form [type="submit"]') ||
                      document.getElementById('registrar-solo-cobro-btn');
    setBtnLoading(submitBtn, true);
    try {
        const urb = document.getElementById('cobros-urb-select').value;

        const cobro_payload = {
            lote_gid: loteSeleccionadoCobro.gid,
            urb: urb,
            lote: loteSeleccionadoCobro.lote,
            monto: monto,
            fecha_cobro: new Date(fecha + 'T12:00:00').toISOString(),
            nro_factura: null,
            nro_cuota: cuota,
            usuario: currentUsername
        };

        const { data, error } = await supabaseClient
            .from('cobros')
            .insert([cobro_payload])
            .select();

        if (error) throw error;

        showAlert('success', '¡Cobro Registrado!', `El cobro de <strong>Bs ${monto.toFixed(2)}</strong> fue registrado exitosamente.`);
        document.getElementById('nuevo-cobro-modal').style.display = 'none';
        document.getElementById('nuevo-cobro-form').reset();
        await cargarHistorialCobros(loteSeleccionadoCobro.gid);
    } catch (error) {
        console.error('Error guardando cobro:', error);
        showAlert('error', 'Error al Registrar', 'No se pudo registrar el cobro: ' + error.message);
    } finally {
        setBtnLoading(submitBtn, false);
    }
});

// Guardar cobro + generar factura PDF directamente
document.getElementById('generar-factura-cobro-btn').addEventListener('click', async () => {
    const monto = parseFloat(document.getElementById('nuevo-cobro-monto').value);
    const fecha = document.getElementById('nuevo-cobro-fecha').value;
    const cuota = parseInt(document.getElementById('nuevo-cobro-cuota').value);
    const nroFac = document.getElementById('fact-numero').value || '';

    if (!monto || monto <= 0 || !fecha || !cuota) {
        showAlert('warning', 'Datos Incompletos', 'Complete el monto y la fecha del cobro antes de facturar.');
        return;
    }
    if (!document.getElementById('fact-cliente-nombre').value) {
        showAlert('warning', 'Datos Incompletos', 'Complete el nombre del cliente en la sección de factura.');
        return;
    }

    const confirmar = await showConfirm(
        'Confirmar Facturación',
        `¿Está seguro de registrar el cobro y generar la factura por <strong>Bs ${monto.toFixed(2)}</strong>?<br><small style="color:#64748b;">Esta acción no se puede deshacer.</small>`,
        'Sí, Generar Factura', 'No, Cancelar'
    );
    if (!confirmar) return;

    const btn = document.getElementById('generar-factura-cobro-btn');
    setBtnLoading(btn, true);

    try {
        // 1. Guardar cobro en Supabase
        const urb = document.getElementById('cobros-urb-select').value;
        const cobro_payload2 = {
            lote_gid: loteSeleccionadoCobro.gid,
            urb: urb,
            lote: loteSeleccionadoCobro.lote,
            monto: monto,
            fecha_cobro: new Date(fecha + 'T12:00:00').toISOString(),
            nro_factura: nroFac || null,
            nro_cuota: cuota,
            usuario: currentUsername
        };
        const { error } = await supabaseClient.from('cobros').insert([cobro_payload2]);
        if (error) throw error;
    } catch (err) {
        setBtnLoading(btn, false);
        showAlert('error', 'Error al Guardar', 'No se pudo guardar el cobro: ' + err.message);
        return;
    }

    // 2. Generar PDF de factura directamente
    await generarPDFFactura();

    setBtnLoading(btn, false);
    // 3. Recargar historial y cerrar modal
    document.getElementById('nuevo-cobro-modal').style.display = 'none';
    document.getElementById('nuevo-cobro-form').reset();
    await cargarHistorialCobros(loteSeleccionadoCobro.gid);
});

// abrirFacturaConDatos — ahora solo actualiza campos dentro del modal integrado
function abrirFacturaConDatos(lote, monto, cuota, fecha) {
    document.getElementById('fact-cliente-ci').value = lote.ci_cliente || lote.nom_cliente || '';
    document.getElementById('fact-cliente-nombre').value = lote.nom_cliente || '';
    const mzText = lote.manzano ? `Mz ${lote.manzano} ` : '';
    document.getElementById('fact-descripcion').value =
        `Pago Cuota N°${cuota} — Lote ${lote.lote} ${mzText}— ${lote.nom_cliente || ''}`;
    document.getElementById('fact-monto').value = monto.toFixed(2);
    document.getElementById('fact-cantidad').value = 1;
    document.getElementById('fact-descuento').value = 0;
    actualizarTotalFactura();
    generarCUF();
    const nroAuto = getNextFacturaNumero('FAC');
    document.getElementById('fact-numero').value = nroAuto;
    // Ya no abre otro modal — todo está en nuevo-cobro-modal
}

function generarCUF() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    const cuf = Array.from(arr).map(b => chars[b % chars.length]).join('');
    document.getElementById('fact-cuf').value = cuf;
    return cuf;
}

function actualizarTotalFactura() {
    const cantidad = parseFloat(document.getElementById('fact-cantidad').value) || 1;
    const monto = parseFloat(document.getElementById('fact-monto').value) || 0;
    const descuento = parseFloat(document.getElementById('fact-descuento').value) || 0;
    const total = (cantidad * monto) - descuento;
    document.getElementById('fact-total-display').textContent = `Bs ${total.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`;
    document.getElementById('fact-literal-display').textContent = numeroALiteral(total) + ' BOLIVIANOS';
}

['fact-cantidad', 'fact-monto', 'fact-descuento'].forEach(id => {
    document.getElementById(id).addEventListener('input', actualizarTotalFactura);
});

function numeroALiteral(num) {
    const entero = Math.floor(num);
    const decimales = Math.round((num - entero) * 100);
    const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE',
        'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
    const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS',
        'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

    function menorMil(n) {
        if (n === 0) return '';
        if (n === 100) return 'CIEN';
        let res = '';
        if (n >= 100) { res += centenas[Math.floor(n / 100)] + ' '; n %= 100; }
        if (n >= 20) { res += decenas[Math.floor(n / 10)]; if (n % 10) res += ' Y ' + unidades[n % 10]; }
        else if (n > 0) res += unidades[n];
        return res.trim();
    }

    if (entero === 0) return `CERO ${decimales}/100`;
    let resultado = '';
    if (entero >= 1000) {
        const miles = Math.floor(entero / 1000);
        resultado += (miles === 1 ? 'MIL' : menorMil(miles) + ' MIL') + ' ';
    }
    resultado += menorMil(entero % 1000);
    return resultado.trim() + ` ${decimales}/100`;
}

// Los listeners del antiguo factura-modal independiente ya no aplican
// (fue integrado en el modal de cobro). Mantenemos solo generarPDFFactura.

async function generarPDFFactura(guardar = true) {
    const nitEmpresa = document.getElementById('fact-nit-empresa').value.trim();
    const razonSocial = document.getElementById('fact-razon-social').value.trim();
    const direccion = document.getElementById('fact-direccion').value.trim();
    const municipio = document.getElementById('fact-municipio').value.trim();
    const telefono = document.getElementById('fact-telefono').value.trim();
    const sucursal = document.getElementById('fact-sucursal').value.trim();
    const nroFactura = document.getElementById('fact-numero').value.trim();
    const tipoFactura = document.getElementById('fact-tipo').value;
    const cuf = document.getElementById('fact-cuf').value;
    const clienteCI = document.getElementById('fact-cliente-ci').value.trim();
    const clienteNombre = document.getElementById('fact-cliente-nombre').value.trim();
    const descripcion = document.getElementById('fact-descripcion').value.trim();
    const cantidad = parseFloat(document.getElementById('fact-cantidad').value) || 1;
    const montoUnit = parseFloat(document.getElementById('fact-monto').value) || 0;
    const descuento = parseFloat(document.getElementById('fact-descuento').value) || 0;
    const subtotal = cantidad * montoUnit;
    const total = Math.max(0, subtotal - descuento);

    if (!nitEmpresa || !razonSocial || !nroFactura || !clienteCI || !clienteNombre) {
        showAlert('warning', 'Campos Incompletos', 'Complete todos los campos obligatorios de la factura (NIT, Razón Social, N° Factura, NIT/CI y Nombre del cliente).');
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pw = pdf.internal.pageSize.getWidth();   // 210mm
        const ph = pdf.internal.pageSize.getHeight();  // 297mm
        const mg = 14;   // margin horizontal
        const cw = pw - mg * 2;  // content width: 182mm
        let y = 0;

        /* ─── Helper functions ─── */
        const setFont = (size, style = 'normal', color = [50, 50, 50]) => {
            pdf.setFontSize(size);
            pdf.setFont('helvetica', style);
            pdf.setTextColor(...color);
        };
        const fillRect = (x, ry, w, h, r, g, b) => {
            pdf.setFillColor(r, g, b);
            pdf.rect(x, ry, w, h, 'F');
        };

        /* ─── HEADER BAND ─── */
        fillRect(0, 0, pw, 38, 26, 35, 126);
        setFont(16, 'bold', [255, 255, 255]);
        pdf.text(razonSocial, pw / 2, 11, { align: 'center' });
        setFont(9, 'normal', [200, 215, 255]);
        pdf.text(`NIT: ${nitEmpresa}`, pw / 2, 18, { align: 'center' });
        pdf.text(`${direccion} — ${municipio}  |  Tel: ${telefono}  |  Sucursal: ${sucursal}`, pw / 2, 24, { align: 'center' });

        /* Tipo factura badge — esquina derecha */
        fillRect(pw - mg - 38, 2, 36, 10, 250, 204, 21);
        setFont(8, 'bold', [30, 30, 30]);
        pdf.text(`${tipoFactura} N° ${nroFactura}`, pw - mg - 20, 8.5, { align: 'center' });
        y = 44;

        /* ─── FECHA + CUF ─── */
        const ahora = new Date();
        fillRect(mg, y, cw, 11, 240, 243, 255);
        pdf.setDrawColor(180, 190, 240); pdf.setLineWidth(0.3);
        pdf.rect(mg, y, cw, 11);
        setFont(8, 'normal', [60, 60, 120]);
        pdf.text(`Fecha emisión: ${ahora.toLocaleDateString('es-BO')}`, mg + 3, y + 4.5);
        pdf.text(`Hora: ${ahora.toLocaleTimeString('es-BO')}`, mg + 55, y + 4.5);
        setFont(7, 'normal', [100, 100, 150]);
        pdf.text(`CUF: ${cuf}`, mg + 3, y + 9);
        y += 16;

        /* ─── DATOS CLIENTE ─── */
        setFont(8, 'bold', [26, 35, 126]);
        pdf.text('DATOS DEL CLIENTE', mg, y);
        y += 3;
        pdf.setDrawColor(26, 35, 126); pdf.setLineWidth(0.4);
        pdf.line(mg, y, mg + cw, y);
        y += 4;

        fillRect(mg, y, cw, 14, 246, 248, 255);
        pdf.setDrawColor(210, 215, 240); pdf.setLineWidth(0.3);
        pdf.rect(mg, y, cw, 14);
        setFont(8, 'bold', [26, 35, 126]);
        pdf.text('NIT / CI:', mg + 3, y + 5);
        setFont(9, 'normal', [30, 30, 30]);
        pdf.text(clienteCI, mg + 22, y + 5);
        setFont(8, 'bold', [26, 35, 126]);
        pdf.text('Nombre:', mg + 3, y + 11);
        setFont(9, 'bold', [30, 30, 30]);
        pdf.text(clienteNombre, mg + 22, y + 11);
        y += 19;

        /* ─── DETALLE TABLE ─── */
        setFont(8, 'bold', [26, 35, 126]);
        pdf.text('DETALLE', mg, y);
        y += 3;
        pdf.setDrawColor(26, 35, 126); pdf.setLineWidth(0.4);
        pdf.line(mg, y, mg + cw, y);
        y += 2;

        // Anchos de columna recalculados para evitar sobreposición:
        // descripción 82mm | cant 16mm | precio 30mm | descuento 28mm | total 26mm = 182mm total
        const COL_W = { desc: 82, cant: 16, precio: 30, dcto: 28, total: 26 };
        const c1 = mg + 2;
        const c2 = c1 + COL_W.desc;
        const c3 = c2 + COL_W.cant;
        const c4 = c3 + COL_W.precio;
        const c5 = mg + cw - 1; // alineado a la derecha

        // Cabecera de tabla
        fillRect(mg, y, cw, 8, 26, 35, 126);
        setFont(8, 'bold', [255, 255, 255]);
        pdf.text('DESCRIPCIÓN', c1, y + 5.5);
        pdf.text('CANT.', c2 + COL_W.cant / 2, y + 5.5, { align: 'center' });
        pdf.text('PRECIO UNIT.', c3, y + 5.5);
        pdf.text('DESCUENTO', c4, y + 5.5);
        pdf.text('TOTAL', c5, y + 5.5, { align: 'right' });
        y += 10;

        // Fila de datos con altura dinámica según la descripción
        const descLines = pdf.splitTextToSize(descripcion, COL_W.desc - 4);
        const rowH = Math.max(10, descLines.length * 5 + 4);
        fillRect(mg, y, cw, rowH, 248, 249, 255);
        pdf.setDrawColor(220, 225, 240); pdf.setLineWidth(0.2);
        pdf.rect(mg, y, cw, rowH);
        setFont(8, 'normal', [30, 30, 30]);
        // Descripción multilínea
        descLines.forEach((line, i) => {
            pdf.text(line, c1, y + 4 + i * 5);
        });
        // Resto de celdas centradas verticalmente en la fila
        const cellY = y + rowH / 2 + 1.5;
        pdf.text(String(cantidad), c2 + COL_W.cant / 2, cellY, { align: 'center' });
        pdf.text(`Bs ${montoUnit.toFixed(2)}`, c3, cellY);
        pdf.text(`Bs ${descuento.toFixed(2)}`, c4, cellY);
        setFont(9, 'bold', [26, 35, 126]);
        pdf.text(`Bs ${subtotal.toFixed(2)}`, c5, cellY, { align: 'right' });
        y += rowH + 2;

        // Separator
        pdf.setDrawColor(180, 190, 220); pdf.setLineWidth(0.3);
        pdf.line(mg, y, mg + cw, y);
        y += 3;

        // Subtotal / Descuento / Total block — right side
        const bx = mg + cw - 80; // box x
        const bw = 80;
        if (descuento > 0) {
            fillRect(bx, y, bw, 7, 252, 252, 252);
            setFont(8, 'normal', [80, 80, 80]);
            pdf.text('Subtotal:', bx + 3, y + 5);
            setFont(8, 'normal', [30, 30, 30]);
            pdf.text(`Bs ${subtotal.toFixed(2)}`, bx + bw - 2, y + 5, { align: 'right' });
            y += 8;
            fillRect(bx, y, bw, 7, 255, 248, 240);
            setFont(8, 'normal', [180, 60, 0]);
            pdf.text('Descuento reserva:', bx + 3, y + 5);
            pdf.text(`- Bs ${descuento.toFixed(2)}`, bx + bw - 2, y + 5, { align: 'right' });
            y += 9;
        }

        // TOTAL box
        fillRect(bx, y, bw, 12, 26, 35, 126);
        setFont(11, 'bold', [255, 255, 255]);
        pdf.text('TOTAL A PAGAR:', bx + 3, y + 8);
        pdf.text(`Bs ${total.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`, bx + bw - 2, y + 8, { align: 'right' });
        y += 16;

        // Literal
        setFont(8, 'italic', [60, 60, 120]);
        pdf.text(`Son: ${numeroALiteral(total)} BOLIVIANOS`, mg, y);
        y += 12;

        /* ─── QR CODE + FIRMA ─── */
        // QR left side
        try {
            const qrData = `FAC:${nroFactura}|CUF:${cuf}|NIT:${nitEmpresa}|TOTAL:${total.toFixed(2)}|CLI:${clienteNombre}`;
            const qrCanvas = document.createElement('canvas');
            await QRCode.toCanvas(qrCanvas, qrData, { width: 100, margin: 1 });
            const qrBase64 = qrCanvas.toDataURL('image/png');
            pdf.addImage(qrBase64, 'PNG', mg, y, 28, 28);
            setFont(7, 'normal', [100, 100, 100]);
            pdf.text('Escanea para verificar', mg + 14, y + 31, { align: 'center' });
        } catch (qrErr) { console.warn('QR no generado:', qrErr); }

        // Firma — right side of QR area
        const firmaX = mg + 70;
        pdf.setDrawColor(26, 35, 126); pdf.setLineWidth(0.6);
        pdf.line(firmaX, y + 22, firmaX + 70, y + 22);
        setFont(8, 'normal', [80, 80, 80]);
        pdf.text('Firma y Sello Autorizado', firmaX + 35, y + 27, { align: 'center' });
        setFont(7, 'normal', [120, 120, 120]);
        pdf.text(razonSocial, firmaX + 35, y + 32, { align: 'center' });

        /* ─── FOOTER ─── */
        fillRect(0, ph - 12, pw, 12, 26, 35, 126);
        setFont(7, 'normal', [180, 190, 220]);
        pdf.text(APP_CONFIG.pie_pagina + '  |  Este documento es válido como comprobante de pago', pw / 2, ph - 5, { align: 'center' });

        const nombrePDF = `Factura_${nroFactura}_${clienteNombre.replace(/\s+/g, '_')}.pdf`;
        pdf.save(nombrePDF);

        // Guardar en Supabase
        if (guardar) {
            try {
                await supabaseClient.from('facturas').insert([{
                    nro_factura: nroFactura,
                    tipo_factura: tipoFactura,
                    cuf: cuf,
                    nit_empresa: nitEmpresa,
                    razon_social_empresa: razonSocial,
                    nit_ci_cliente: clienteCI,
                    nombre_cliente: clienteNombre,
                    descripcion: descripcion,
                    cantidad: cantidad,
                    precio_unitario: montoUnit,
                    descuento: descuento,
                    total: total,
                    fecha_emision: new Date().toISOString(),
                    usuario_emisor: currentUsername,
                    lote_gid: loteSeleccionadoCobro?.gid || null
                }]);
                showAlert('success', '¡Factura Generada!', `La factura <strong>${nroFactura}</strong> fue generada y guardada exitosamente.`).then(() => {
                    document.getElementById('nuevo-cobro-modal').style.display = 'none';
                    document.getElementById('nuevo-cobro-form').reset();
                });
            } catch (dbErr) {
                console.warn('No se pudo guardar factura en BD:', dbErr.message);
                showToast('success', 'PDF generado exitosamente');
            }
        }
    } catch (err) {
        console.error('Error generando factura:', err);
        showAlert('error', 'Error al Generar Factura', 'No se pudo generar la factura: ' + err.message);
    }
}

/* =====================================================
   MÓDULO DE RESERVA
   ===================================================== */
document.getElementById('close-reserva-modal').addEventListener('click', () => {
    document.getElementById('reserva-modal').classList.remove('active');
    pendingEstadoChange = null;
});

document.getElementById('reserva-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!pendingEstadoChange) return;

    const datosReserva = {
        nom_cliente: document.getElementById('reserva-cliente').value.trim(),
        ci_cliente: document.getElementById('reserva-ci').value.trim(),
        cel_cliente: document.getElementById('reserva-celular').value.trim(),
        monto_reserva: parseFloat(document.getElementById('reserva-monto').value) || 0,
        vendedor: currentUsername
    };

    if (!datosReserva.nom_cliente || !datosReserva.ci_cliente || !datosReserva.cel_cliente || datosReserva.monto_reserva <= 0) {
        showAlert('warning', 'Campos Incompletos', 'Por favor complete todos los campos de la reserva, incluyendo el monto.');
        return;
    }

    const confirmar = await showConfirm(
        'Confirmar Reserva',
        `¿Está seguro de registrar la reserva para <strong>${datosReserva.nom_cliente}</strong> con un monto de <strong>Bs ${datosReserva.monto_reserva.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</strong>?`,
        'Sí, Reservar', 'No, Revisar'
    );
    if (!confirmar) return;

    const savedChange = { ...pendingEstadoChange };
    document.getElementById('reserva-modal').classList.remove('active');
    await guardarEstadoConDatos(savedChange.featureId, 'RESERVADO', datosReserva, savedChange.urb);
    document.getElementById('reserva-form').reset();
    pendingEstadoChange = null;

    // ── Auto-abrir factura de adelanto ────────────────────────────
    const loteProps = savedChange.loteProps || {};
    abrirFacturaDesdeReserva(savedChange.featureId, loteProps, datosReserva);
});

/* =====================================================
   ABRIR FACTURA DE RESERVA DIRECTAMENTE DESDE MAPA
   ===================================================== */
function abrirFacturaDesdeReserva(gid, loteProps, datosReserva) {
    const montoReserva = datosReserva.monto_reserva || 0;
    const mzText = loteProps.manzano ? `Mz ${loteProps.manzano} ` : '';
    const loteDesc = `${mzText}Lote ${loteProps.lote || '?'}`;

    // Datos del cliente (de lo que se acaba de ingresar)
    document.getElementById('res-fac-nombre').textContent = datosReserva.nom_cliente || '—';
    document.getElementById('res-fac-ci').textContent = datosReserva.ci_cliente || '—';
    document.getElementById('res-fac-cel').textContent = datosReserva.cel_cliente || '—';
    document.getElementById('res-fac-lote').textContent = loteDesc;
    document.getElementById('res-fac-monto-display').textContent = `Bs ${montoReserva.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`;
    document.getElementById('res-fac-literal').textContent = numeroALiteral(montoReserva) + ' BOLIVIANOS';

    // Campos editables de la factura
    document.getElementById('res-fact-cliente-ci').value = datosReserva.ci_cliente || '';
    document.getElementById('res-fact-cliente-nombre').value = datosReserva.nom_cliente || '';
    document.getElementById('res-fact-monto').value = montoReserva.toFixed(2);
    document.getElementById('res-fact-descuento').value = '0';
    document.getElementById('res-fact-descripcion').value = `Adelanto/Reserva — ${loteDesc} — ${datosReserva.nom_cliente || ''}`;

    const nroAuto = getNextReciboNumero('RES');
    document.getElementById('res-fact-numero').value = nroAuto;
    const arr32 = new Uint8Array(32);
    crypto.getRandomValues(arr32);
    const chars32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const cuf = Array.from(arr32).map(b => chars32[b % chars32.length]).join('');
    document.getElementById('res-fact-cuf').value = cuf;

    // Guardar referencia para el PDF (usa el gid de la reserva)
    loteReservadoSeleccionado = {
        gid,
        nom_cliente: datosReserva.nom_cliente,
        ci_cliente: datosReserva.ci_cliente,
        cel_cliente: datosReserva.cel_cliente,
        monto_reserva: montoReserva,
        lote: loteProps.lote,
        manzano: loteProps.manzano
    };

    actualizarTotalFacturaReserva();
    document.getElementById('factura-reserva-modal').classList.add('active');
}


document.getElementById('confirm-disponible-si').addEventListener('click', async () => {
    document.getElementById('confirm-disponible-modal').classList.remove('active');
    if (!pendingEstadoChange) return;
    await guardarEstadoSinDatos(pendingEstadoChange.featureId, 'DISPONIBLE', pendingEstadoChange.urb);
    pendingEstadoChange = null;
});

document.getElementById('confirm-disponible-no').addEventListener('click', () => {
    document.getElementById('confirm-disponible-modal').classList.remove('active');
    pendingEstadoChange = null;
});

/* =====================================================
   DASHBOARD
   ===================================================== */
document.getElementById('dashboard-btn').addEventListener('click', async () => {
    if (!isUserLoggedIn) { showToast('warning', 'Debe iniciar sesión'); return; }
    document.getElementById('dashboard-modal').classList.add('active');
    await cargarDashboard();
});

document.getElementById('close-dashboard-modal').addEventListener('click', () => {
    document.getElementById('dashboard-modal').classList.remove('active');
});

async function cargarDashboard() {
    const contenido = document.getElementById('dashboard-content');
    contenido.innerHTML = '<div style="text-align:center; padding:50px; color:#64748b;"><i class="fas fa-spinner fa-spin" style="font-size:30px;"></i><br><br>Cargando datos...</div>';

    try {
        // ── Cargar TODOS los lotes con paginación (Supabase limita a 1000 por defecto) ──
        let allLotes = [];
        let pageSize = 1000;
        let offset = 0;
        while (true) {
            const { data, error } = await supabaseClient
                .from('lotes')
                .select('urb, estado, monto_bs, tipo_venta, monto_reserva', { count: 'exact' })
                .range(offset, offset + pageSize - 1);
            if (error) throw error;
            if (!data || data.length === 0) break;
            allLotes = allLotes.concat(data);
            if (data.length < pageSize) break;
            offset += pageSize;
        }

        // ── Cargar cobros ──
        const { data: cobros } = await supabaseClient.from('cobros').select('monto, urb, lote_gid');
        const totalCobradoCobros = (cobros || []).reduce((s, c) => s + parseFloat(c.monto || 0), 0);

        // ── Montos de reserva de lotes VENDIDOS (reservaron primero, luego vendidos) ──
        const totalReservaDeVendidos = allLotes
            .filter(l => l.estado === 'VENDIDO' && l.monto_reserva && parseFloat(l.monto_reserva) > 0)
            .reduce((s, l) => s + parseFloat(l.monto_reserva || 0), 0);

        // ── Adelantos de lotes RESERVADOS (dinero ingresado, lote aún reservado) ──
        const totalAdelantosReservados = allLotes
            .filter(l => l.estado === 'RESERVADO' && l.monto_reserva && parseFloat(l.monto_reserva) > 0)
            .reduce((s, l) => s + parseFloat(l.monto_reserva || 0), 0);

        // ── Ingresos por categoría ──
        // Lotes VENDIDOS: cuotas cobradas (tabla cobros) + montos de reserva que pasaron a venta
        const ingresosLotesVendidos = totalCobradoCobros + totalReservaDeVendidos;
        // Lotes RESERVADOS: solo el adelanto (sin cuotas porque aún no están vendidos)
        const ingresosLotesReservados = totalAdelantosReservados;
        // TOTAL GENERAL de todos los ingresos económicos
        const totalCobrado = ingresosLotesVendidos + ingresosLotesReservados;

        // ── Métricas globales ──
        const totalLotes = allLotes.length;
        const vendidos = allLotes.filter(l => l.estado === 'VENDIDO').length;
        const reservados = allLotes.filter(l => l.estado === 'RESERVADO').length;
        const disponibles = allLotes.filter(l => l.estado === 'DISPONIBLE').length;
        const otrosEstado = totalLotes - vendidos - reservados - disponibles;
        // Monto total comprometido = vendidos + reservados
        const totalVentaBs = allLotes
            .filter(l => l.estado === 'VENDIDO' || l.estado === 'RESERVADO')
            .reduce((s, l) => s + parseFloat(l.monto_bs || 0), 0);
        const porCobrar = Math.max(0, totalVentaBs - totalCobrado);
        const pctVendido = totalLotes > 0 ? parseFloat(((vendidos / totalLotes) * 100).toFixed(1)) : 0;

        // ── Por urbanización ──
        const porUrb = {};
        allLotes.forEach(l => {
            const k = l.urb;
            const n = URB_NOMBRES[k] || `URB ${k}`;
            if (!porUrb[n]) porUrb[n] = { total: 0, disponible: 0, vendido: 0, reservado: 0, montoTotal: 0 };
            porUrb[n].total++;
            if (l.estado === 'DISPONIBLE') porUrb[n].disponible++;
            if (l.estado === 'VENDIDO') { porUrb[n].vendido++; porUrb[n].montoTotal += parseFloat(l.monto_bs || 0); }
            if (l.estado === 'RESERVADO') porUrb[n].reservado++;
        });
        const urbEntries = Object.entries(porUrb).sort((a, b) => b[1].total - a[1].total);

        // ── Cobros + Adelantos por URB ──
        const cobradoPorUrb = {};
        // Sumar cuotas cobradas (tabla cobros)
        (cobros || []).forEach(c => {
            const n = URB_NOMBRES[c.urb] || `URB ${c.urb}`;
            cobradoPorUrb[n] = (cobradoPorUrb[n] || 0) + parseFloat(c.monto || 0);
        });
        // Sumar TODOS los montos de reserva (tanto de vendidos como de reservados = son ingresos reales)
        allLotes.filter(l => l.monto_reserva && parseFloat(l.monto_reserva) > 0).forEach(l => {
            const n = URB_NOMBRES[l.urb] || `URB ${l.urb}`;
            cobradoPorUrb[n] = (cobradoPorUrb[n] || 0) + parseFloat(l.monto_reserva || 0);
        });

        // ── RENDER HTML ──
        const fmtBs = (n) => `Bs ${n.toLocaleString('es-BO', { maximumFractionDigits: 0 })}`;

        let html = `
        <!-- KPIS -->
        <div style="display:grid; grid-template-columns:repeat(6,1fr); gap:12px; margin-bottom:18px;">
            ${kpiCard('fas fa-map', '#1e3a8a', '#dbeafe', totalLotes, 'Total Lotes')}
            ${kpiCard('fas fa-check-circle', '#166534', '#dcfce7', disponibles, 'Disponibles')}
            ${kpiCard('fas fa-home', '#991b1b', '#fee2e2', vendidos, 'Vendidos')}
            ${kpiCard('fas fa-clock', '#92400e', '#fef3c7', reservados, 'Reservados')}
            ${kpiCard('fas fa-coins', '#065f46', '#d1fae5', fmtBs(totalCobrado), 'Total Ingresos')}
            ${kpiCard('fas fa-hourglass-half', '#7c2d12', '#ffedd5', fmtBs(porCobrar), 'Por Cobrar')}
        </div>

        <!-- DESGLOSE DE INGRESOS -->
        <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7); border:2px solid #10b981; border-radius:14px; padding:18px 22px; margin-bottom:20px; box-shadow:0 2px 12px rgba(16,185,129,0.12);">
            <h4 style="margin:0 0 14px; color:#065f46; font-size:14px; display:flex; align-items:center; gap:8px;">
                <i class="fas fa-calculator" style="color:#10b981;"></i> Desglose de Ingresos Económicos
            </h4>
            <div style="display:grid; grid-template-columns:1fr 2px 1fr 2px 1fr; gap:0; align-items:stretch;">
                <div style="padding:10px 18px;">
                    <div style="font-size:11px; font-weight:700; color:#047857; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; display:flex; align-items:center; gap:5px;">
                        <span style="width:10px; height:10px; background:#ef4444; border-radius:50%; display:inline-block;"></span>
                        Ingresos de Lotes VENDIDOS
                    </div>
                    <div style="font-size:12px; color:#374151; margin-bottom:3px;">
                        <i class="fas fa-receipt" style="color:#6b7280; width:16px;"></i>
                        Cuotas cobradas: <strong style="color:#059669;">Bs ${totalCobradoCobros.toLocaleString('es-BO',{maximumFractionDigits:0})}</strong>
                    </div>
                    <div style="font-size:12px; color:#374151; margin-bottom:10px;">
                        <i class="fas fa-bookmark" style="color:#6b7280; width:16px;"></i>
                        Reservas confirmadas (→venta): <strong style="color:#059669;">Bs ${totalReservaDeVendidos.toLocaleString('es-BO',{maximumFractionDigits:0})}</strong>
                    </div>
                    <div style="background:#fff; border:2px solid #10b981; border-radius:9px; padding:8px 12px; text-align:center;">
                        <div style="font-size:10px; font-weight:700; color:#047857; text-transform:uppercase; margin-bottom:2px;">Subtotal Lotes Vendidos</div>
                        <div style="font-size:22px; font-weight:800; color:#059669;">Bs ${ingresosLotesVendidos.toLocaleString('es-BO',{maximumFractionDigits:0})}</div>
                    </div>
                </div>
                <div style="background:#d1fae5;"></div>
                <div style="padding:10px 18px;">
                    <div style="font-size:11px; font-weight:700; color:#92400e; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; display:flex; align-items:center; gap:5px;">
                        <span style="width:10px; height:10px; background:#f59e0b; border-radius:50%; display:inline-block;"></span>
                        Adelantos Lotes RESERVADOS
                    </div>
                    <div style="font-size:12px; color:#374151; margin-bottom:3px;">
                        <i class="fas fa-bookmark" style="color:#d97706; width:16px;"></i>
                        Lotes con adelanto: <strong style="color:#d97706;">${allLotes.filter(l=>l.estado==='RESERVADO'&&l.monto_reserva&&parseFloat(l.monto_reserva)>0).length} lotes</strong>
                    </div>
                    <div style="font-size:12px; color:#64748b; margin-bottom:10px; font-style:italic;">
                        <i class="fas fa-info-circle" style="width:16px;"></i> Montos ingresados al reservar
                    </div>
                    <div style="background:#fff; border:2px solid #f59e0b; border-radius:9px; padding:8px 12px; text-align:center;">
                        <div style="font-size:10px; font-weight:700; color:#92400e; text-transform:uppercase; margin-bottom:2px;">Subtotal Lotes Reservados</div>
                        <div style="font-size:22px; font-weight:800; color:#d97706;">Bs ${ingresosLotesReservados.toLocaleString('es-BO',{maximumFractionDigits:0})}</div>
                    </div>
                </div>
                <div style="background:#d1fae5;"></div>
                <div style="padding:10px 18px; display:flex; flex-direction:column; justify-content:center;">
                    <div style="font-size:11px; font-weight:700; color:#1e3a5f; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px; text-align:center;">
                        <i class="fas fa-equals" style="color:#1e3a5f;"></i> TOTAL GENERAL DE INGRESOS
                    </div>
                    <div style="background:linear-gradient(135deg,#1e3a8a,#1e40af); border-radius:12px; padding:14px; text-align:center; box-shadow:0 4px 14px rgba(30,58,138,0.25);">
                        <div style="font-size:10px; font-weight:700; color:#bfdbfe; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Todos los Ingresos</div>
                        <div style="font-size:26px; font-weight:900; color:#ffffff;">Bs ${totalCobrado.toLocaleString('es-BO',{maximumFractionDigits:0})}</div>
                        <div style="font-size:10px; color:#93c5fd; margin-top:3px;">Cuotas + Reservas Vendidos + Adelantos</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- GRÁFICOS fila 1 -->
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-bottom:24px;">

            <!-- Donut: estado global -->
            <div style="background:#fff; border-radius:12px; padding:18px; box-shadow:0 2px 12px rgba(0,0,0,0.07);">
                <h4 style="margin:0 0 12px; color:#1e3a5f; font-size:13px; text-align:center;">
                    <i class="fas fa-chart-pie"></i> Estado de Lotes
                </h4>
                <canvas id="chart-estado" height="200"></canvas>
                <div style="display:flex; justify-content:center; gap:12px; margin-top:10px; font-size:11px; flex-wrap:wrap;">
                    <span><span style="display:inline-block;width:10px;height:10px;background:#22c55e;border-radius:50%;margin-right:4px;"></span>Disponible ${disponibles}</span>
                    <span><span style="display:inline-block;width:10px;height:10px;background:#ef4444;border-radius:50%;margin-right:4px;"></span>Vendido ${vendidos}</span>
                    <span><span style="display:inline-block;width:10px;height:10px;background:#f59e0b;border-radius:50%;margin-right:4px;"></span>Reservado ${reservados}</span>
                    ${otrosEstado > 0 ? `<span><span style="display:inline-block;width:10px;height:10px;background:#94a3b8;border-radius:50%;margin-right:4px;"></span>Otros ${otrosEstado}</span>` : ''}
                </div>
            </div>

            <!-- Donut: cobros vs pendiente -->
            <div style="background:#fff; border-radius:12px; padding:18px; box-shadow:0 2px 12px rgba(0,0,0,0.07);">
                <h4 style="margin:0 0 12px; color:#1e3a5f; font-size:13px; text-align:center;">
                    <i class="fas fa-dollar-sign"></i> Cobrado vs Pendiente
                </h4>
                <canvas id="chart-cobros" height="200"></canvas>
                <div style="display:flex; justify-content:center; gap:12px; margin-top:10px; font-size:11px; flex-wrap:wrap;">
                    <span><span style="display:inline-block;width:10px;height:10px;background:#10b981;border-radius:50%;margin-right:4px;"></span>${fmtBs(totalCobrado)}</span>
                    <span><span style="display:inline-block;width:10px;height:10px;background:#f97316;border-radius:50%;margin-right:4px;"></span>${fmtBs(porCobrar)}</span>
                </div>
            </div>

            <!-- Gauge: % vendido global -->
            <div style="background:#fff; border-radius:12px; padding:18px; box-shadow:0 2px 12px rgba(0,0,0,0.07); display:flex; flex-direction:column; align-items:center;">
                <h4 style="margin:0 0 12px; color:#1e3a5f; font-size:13px; text-align:center;">
                    <i class="fas fa-tachometer-alt"></i> Avance de Ventas
                </h4>
                <canvas id="chart-gauge" height="180"></canvas>
                <div style="font-size:28px; font-weight:800; color:#1e3a5f; margin-top:4px;">${pctVendido}%</div>
                <div style="font-size:11px; color:#64748b;">de lotes vendidos</div>
            </div>
        </div>

        <!-- GRÁFICOS fila 2 -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px;">

            <!-- Barras apiladas por URB -->
            <div style="background:#fff; border-radius:12px; padding:18px; box-shadow:0 2px 12px rgba(0,0,0,0.07);">
                <h4 style="margin:0 0 12px; color:#1e3a5f; font-size:13px;">
                    <i class="fas fa-city"></i> Lotes por Urbanización
                </h4>
                <canvas id="chart-urb-barras" height="200"></canvas>
            </div>

            <!-- Barras: monto cobrado por URB -->
            <div style="background:#fff; border-radius:12px; padding:18px; box-shadow:0 2px 12px rgba(0,0,0,0.07);">
                <h4 style="margin:0 0 12px; color:#1e3a5f; font-size:13px;">
                    <i class="fas fa-money-bill-wave"></i> Monto Cobrado por Urbanización (Bs)
                </h4>
                <canvas id="chart-urb-montos" height="200"></canvas>
            </div>
        </div>

        <!-- TABLA POR URBANIZACIÓN -->
        <div style="background:#fff; border-radius:12px; padding:18px; box-shadow:0 2px 12px rgba(0,0,0,0.07);">
        <h4 style="margin:0 0 14px; color:#1e3a5f;"><i class="fas fa-table"></i> Detalle por Urbanización</h4>
        <table class="reporte-table">
            <thead><tr>
                <th>Urbanización</th><th>Total</th>
                <th style="color:#22c55e;">Disponibles</th>
                <th style="color:#ef4444;">Vendidos</th>
                <th style="color:#f59e0b;">Reservados</th>
                <th>Monto Total (Bs)</th>
                <th>Cobrado (Bs)</th>
                <th>% Vendido</th>
            </tr></thead>
            <tbody>`;

        urbEntries.forEach(([nombre, d]) => {
            const pct = d.total > 0 ? Math.round(d.vendido / d.total * 100) : 0;
            const cob = cobradoPorUrb[nombre] || 0;
            const barColor = pct >= 75 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444';
            html += `<tr>
                <td><strong>${nombre}</strong></td>
                <td style="font-weight:700; font-size:15px;">${d.total}</td>
                <td style="color:#22c55e; font-weight:600;">${d.disponible}</td>
                <td style="color:#ef4444; font-weight:600;">${d.vendido}</td>
                <td style="color:#f59e0b; font-weight:600;">${d.reservado}</td>
                <td>Bs ${d.montoTotal.toLocaleString('es-BO', { maximumFractionDigits: 0 })}</td>
                <td style="color:#10b981; font-weight:600;">Bs ${cob.toLocaleString('es-BO', { maximumFractionDigits: 0 })}</td>
                <td>
                    <div style="position:relative; background:#f1f5f9; border-radius:20px; height:18px; overflow:hidden; min-width:80px;">
                        <div style="background:${barColor}; width:${pct}%; height:100%; border-radius:20px; transition:width 0.8s ease;"></div>
                        <span style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:10px; font-weight:700; color:#1e293b;">${pct}%</span>
                    </div>
                </td>
            </tr>`;
        });
        html += `</tbody></table></div>`;

        contenido.innerHTML = html;

        // ── Destruir charts anteriores si existen para evitar acumulación en memoria ──
        if (window._dashCharts) {
            Object.values(window._dashCharts).forEach(c => { try { c.destroy(); } catch(e) {} });
        }
        window._dashCharts = {};

        // ── Renderizar gráficos con Chart.js ──
        setTimeout(() => {
            // 1. Donut estado
            const ctxEstado = document.getElementById('chart-estado');
            if (ctxEstado) {
                const colores = ['#22c55e', '#ef4444', '#f59e0b', '#94a3b8'];
                const datos = [disponibles, vendidos, reservados, otrosEstado].filter((_, i) => [disponibles, vendidos, reservados, otrosEstado][i] > 0);
                const etiquetas = ['Disponible', 'Vendido', 'Reservado', 'Otros'].filter((_, i) => [disponibles, vendidos, reservados, otrosEstado][i] > 0);
                const colsFilt = colores.filter((_, i) => [disponibles, vendidos, reservados, otrosEstado][i] > 0);
                new Chart(ctxEstado, {
                    type: 'doughnut',
                    data: { labels: etiquetas, datasets: [{ data: datos, backgroundColor: colsFilt, borderWidth: 2, borderColor: '#fff', hoverBorderWidth: 3 }] },
                    options: { responsive: true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.raw} (${((ctx.raw / totalLotes) * 100).toFixed(1)}%)` } } } },
                });
            }

            // 2. Donut cobros
            const ctxCobros = document.getElementById('chart-cobros');
            if (ctxCobros && (totalCobrado + porCobrar) > 0) {
                new Chart(ctxCobros, {
                    type: 'doughnut',
                    data: { labels: ['Cobrado', 'Pendiente'], datasets: [{ data: [totalCobrado, porCobrar], backgroundColor: ['#10b981', '#f97316'], borderWidth: 2, borderColor: '#fff', hoverBorderWidth: 3 }] },
                    options: { responsive: true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `${ctx.label}: Bs ${ctx.raw.toLocaleString('es-BO', { maximumFractionDigits: 0 })}` } } } },
                });
            }

            // 3. Gauge (doughnut semicircle)
            const ctxGauge = document.getElementById('chart-gauge');
            if (ctxGauge) {
                const pctN = parseFloat(pctVendido);
                new Chart(ctxGauge, {
                    type: 'doughnut',
                    data: { datasets: [{ data: [pctN, 100 - pctN], backgroundColor: ['#1e3a5f', '#e2e8f0'], borderWidth: 0, circumference: 180, rotation: 270 }] },
                    options: { responsive: true, cutout: '75%', plugins: { legend: { display: false }, tooltip: { enabled: false } } },
                });
            }

            // 4. Barras apiladas por URB
            const ctxBarras = document.getElementById('chart-urb-barras');
            if (ctxBarras && urbEntries.length > 0) {
                const labels = urbEntries.map(([n]) => n.length > 14 ? n.substring(0, 14) + '…' : n);
                new Chart(ctxBarras, {
                    type: 'bar',
                    data: {
                        labels,
                        datasets: [
                            { label: 'Disponible', data: urbEntries.map(([, d]) => d.disponible), backgroundColor: '#22c55e', borderRadius: 3 },
                            { label: 'Vendido', data: urbEntries.map(([, d]) => d.vendido), backgroundColor: '#ef4444', borderRadius: 3 },
                            { label: 'Reservado', data: urbEntries.map(([, d]) => d.reservado), backgroundColor: '#f59e0b', borderRadius: 3 },
                        ]
                    },
                    options: {
                        responsive: true, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
                        plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } }, tooltip: { mode: 'index' } }
                    }
                });
            }

            // 5. Barras monto cobrado por URB
            const ctxMontos = document.getElementById('chart-urb-montos');
            if (ctxMontos && urbEntries.length > 0) {
                const labels = urbEntries.map(([n]) => n.length > 14 ? n.substring(0, 14) + '…' : n);
                new Chart(ctxMontos, {
                    type: 'bar',
                    data: {
                        labels,
                        datasets: [
                            { label: 'Monto Cobrado', data: urbEntries.map(([n]) => cobradoPorUrb[n] || 0), backgroundColor: '#10b981', borderRadius: 3 },
                            { label: 'Monto Total', data: urbEntries.map(([, d]) => d.montoTotal), backgroundColor: '#93c5fd', borderRadius: 3 },
                        ]
                    },
                    options: {
                        responsive: true, scales: { y: { beginAtZero: true, ticks: { callback: v => 'Bs ' + v.toLocaleString('es-BO', { maximumFractionDigits: 0 }) } } },
                        plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } }, tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: Bs ${ctx.raw.toLocaleString('es-BO', { maximumFractionDigits: 0 })}` } } }
                    }
                });
            }
        }, 100);

    } catch (err) {
        contenido.innerHTML = `<div style="color:#ef4444; text-align:center; padding:40px;"><i class="fas fa-exclamation-triangle" style="font-size:40px;"></i><br><br><strong>Error al cargar dashboard:</strong><br>${err.message}</div>`;
        console.error('Dashboard error:', err);
    }
}

function kpiCard(icon, textColor, bgColor, value, label) {
    return `<div style="background:${bgColor}; border-radius:12px; padding:16px 12px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <div style="font-size:22px; color:${textColor}; margin-bottom:6px;"><i class="${icon}"></i></div>
        <div style="font-size:${typeof value === 'string' && value.length > 12 ? '13' : '20'}px; font-weight:800; color:${textColor}; line-height:1.2;">${value}</div>
        <div style="font-size:11px; color:#64748b; margin-top:4px; font-weight:600;">${label}</div>
    </div>`;
}

document.getElementById('dashboard-pdf-btn').addEventListener('click', async () => {
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('l', 'mm', 'a4'); // landscape
        const pw = pdf.internal.pageSize.getWidth();
        let y = 15;

        pdf.setFillColor(7, 1, 114);
        pdf.rect(0, 0, pw, 25, 'F');
        pdf.setTextColor(255, 255, 255); pdf.setFontSize(16); pdf.setFont(undefined, 'bold');
        pdf.text(APP_CONFIG.nombre_empresa + ' — DASHBOARD GENERAL', pw / 2, 16, { align: 'center' });
        y = 32;

        pdf.setTextColor(50, 50, 50); pdf.setFontSize(10); pdf.setFont(undefined, 'normal');
        pdf.text(`Generado: ${new Date().toLocaleDateString('es-BO')} ${new Date().toLocaleTimeString('es-BO')} | Usuario: ${currentUsername}`, pw / 2, y, { align: 'center' });
        y += 10;

        const tabla = document.querySelector('#dashboard-content .reporte-table');
        if (tabla) {
            const rows = tabla.querySelectorAll('tr');
            const headers = [...rows[0].querySelectorAll('th')].map(th => th.textContent);
            const colW = [65, 18, 22, 20, 22, 32, 30, 20];

            pdf.setFillColor(7, 1, 114);
            pdf.rect(15, y, pw - 30, 8, 'F');
            pdf.setTextColor(255, 255, 255); pdf.setFontSize(9); pdf.setFont(undefined, 'bold');
            let x = 17;
            headers.forEach((h, i) => { pdf.text(h, x, y + 5.5); x += colW[i]; });
            y += 10;

            rows.forEach((row, ri) => {
                if (ri === 0) return;
                const cells = [...row.querySelectorAll('td')].map(td => td.textContent.trim());
                if (ri % 2 === 0) { pdf.setFillColor(245, 248, 255); pdf.rect(15, y - 1, pw - 30, 8, 'F'); }
                pdf.setTextColor(50, 50, 50); pdf.setFont(undefined, 'normal'); pdf.setFontSize(9);
                x = 17;
                cells.forEach((c, i) => { if (i < 7) { pdf.text(String(c).substring(0, 35), x, y + 4); x += colW[i]; } });
                y += 8;
                if (y > 185) { pdf.addPage(); y = 15; }
            });
        }

        pdf.setTextColor(120, 120, 120); pdf.setFontSize(8);
        pdf.text(APP_CONFIG.pie_pagina, pw / 2, pdf.internal.pageSize.getHeight() - 5, { align: 'center' });
        pdf.save(`Dashboard_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) { showAlert('error', 'Error al Generar PDF', e.message); }
});

/* =====================================================
   MÓDULO DE REPORTES
   ===================================================== */
document.getElementById('reportes-btn').addEventListener('click', () => {
    if (!isUserLoggedIn) { showToast('warning', 'Debe iniciar sesión'); return; }
    // Poblar filtro de urbanizaciones
    const sel = document.getElementById('reporte-urb-filtro');
    sel.innerHTML = '<option value="">Todas</option>';
    Object.entries(URB_NOMBRES).forEach(([k, v]) => {
        const o = document.createElement('option'); o.value = k; o.textContent = v; sel.appendChild(o);
    });
    // Fechas por defecto: último mes
    const hoy = new Date();
    const hace30 = new Date(hoy); hace30.setDate(hace30.getDate() - 30);
    document.getElementById('reporte-fecha-desde').value = hace30.toISOString().split('T')[0];
    document.getElementById('reporte-fecha-hasta').value = hoy.toISOString().split('T')[0];
    document.getElementById('reportes-modal').classList.add('active');
});

document.getElementById('close-reportes-modal').addEventListener('click', () => {
    document.getElementById('reportes-modal').classList.remove('active');
});

// Tabs
document.querySelectorAll('.reporte-tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.reporte-tab-btn').forEach(b => {
            b.classList.remove('active');
            b.style.background = '#e2e8f0'; b.style.color = '#64748b';
        });
        this.classList.add('active');
        this.style.background = ''; this.style.color = '';
        document.getElementById('reporte-contenido').innerHTML = '<p style="text-align:center; color:#64748b; padding:20px;">Presione <strong>Filtrar</strong> para ver el reporte</p>';
    });
});

document.getElementById('reporte-buscar-btn').addEventListener('click', async () => {
    const activeTab = document.querySelector('.reporte-tab-btn.active')?.dataset.tab || 'ventas';
    const desde = document.getElementById('reporte-fecha-desde').value;
    const hasta = document.getElementById('reporte-fecha-hasta').value;
    const urb = document.getElementById('reporte-urb-filtro').value;

    const contenido = document.getElementById('reporte-contenido');
    contenido.innerHTML = '<p style="text-align:center; padding:20px;"><i class="fas fa-spinner fa-spin"></i> Cargando...</p>';

    try {
        if (activeTab === 'ventas') {
            const vendedorFiltro = document.getElementById('filtro-vendedor-individual')?.value || '';
            await mostrarReporteVentas(contenido, desde, hasta, urb, vendedorFiltro);
        } else if (activeTab === 'clientes') {
            await mostrarReporteClientes(contenido, desde, hasta, urb);
        } else if (activeTab === 'pagos') {
            await mostrarReportePagosCliente(contenido, desde, hasta, urb);
        }
    } catch (e) {
        contenido.innerHTML = `<p style="color:#ef4444; padding:20px;">Error: ${e.message}</p>`;
    }
});

async function mostrarReporteVentas(contenido, desde, hasta, urb, vendedorFiltro) {
    let query = supabaseClient.from('lotes').select('gid, vendedor, nom_cliente, ci_cliente, cel_cliente, lote, manzano, precio_vent, monto_bs, tipo_venta, estado, urb, nro_cuotas, monto_reserva')
        .eq('estado', 'VENDIDO');
    if (urb) query = query.eq('urb', urb);
    if (vendedorFiltro) query = query.eq('vendedor', vendedorFiltro);

    const { data, error } = await query;
    if (error) throw error;

    // Cobros por lote para este reporte
    const gids = (data || []).map(l => l.gid).filter(Boolean);
    let cobrosVentas = [];
    if (gids.length > 0) {
        const { data: cv } = await supabaseClient.from('cobros')
            .select('lote_gid, monto, nro_factura, nro_cuota, fecha_cobro, usuario')
            .in('lote_gid', gids);
        cobrosVentas = cv || [];
    }
    const cobradoPorLote = {};
    const facturasPorLote = {};
    cobrosVentas.forEach(c => {
        cobradoPorLote[c.lote_gid] = (cobradoPorLote[c.lote_gid] || 0) + parseFloat(c.monto || 0);
        if (c.nro_factura) {
            if (!facturasPorLote[c.lote_gid]) facturasPorLote[c.lote_gid] = [];
            facturasPorLote[c.lote_gid].push(c.nro_factura);
        }
    });
    // ── INCLUIR monto_reserva en el total cobrado por lote (adelanto que pasó a venta) ──
    (data || []).forEach(l => {
        if (l.monto_reserva && parseFloat(l.monto_reserva) > 0) {
            cobradoPorLote[l.gid] = (cobradoPorLote[l.gid] || 0) + parseFloat(l.monto_reserva);
        }
    });

    // Ranking por vendedor
    const porVendedor = {};
    (data || []).forEach(l => {
        const v = l.vendedor || 'Sin vendedor';
        if (!porVendedor[v]) porVendedor[v] = { ventas: 0, monto: 0, cobrado: 0, lotes: [] };
        porVendedor[v].ventas++;
        porVendedor[v].monto += parseFloat(l.monto_bs || 0);
        porVendedor[v].cobrado += cobradoPorLote[l.gid] || 0;
        porVendedor[v].lotes.push(l);
    });

    const ranking = Object.entries(porVendedor).sort((a, b) => b[1].ventas - a[1].ventas);

    // Selector de vendedor — auto-aplica al cambiar (sin necesidad de botón Aplicar)
    const todosVendedores = [...new Set((data || []).map(l => l.vendedor || 'Sin vendedor'))].sort();
    let selectorHtml = `<div style="margin-bottom:15px; display:flex; gap:10px; align-items:center; flex-wrap:wrap; padding:12px 14px; background:#f0f9ff; border:1px solid #bae6fd; border-radius:10px;">
        <i class="fas fa-user-tie" style="color:#0284c7; font-size:16px;"></i>
        <label style="font-weight:700; font-size:13px; color:#0369a1;">Filtrar por vendedor:</label>
        <select id="filtro-vendedor-individual" onchange="aplicarFiltroVendedor()"
            style="padding:8px 14px; border:2px solid #bae6fd; border-radius:8px; font-size:13px; background:white; color:#0369a1; font-weight:600; flex:1; min-width:180px; cursor:pointer;">
            <option value="">— Todos los vendedores —</option>
            ${todosVendedores.map(v => `<option value="${v}" ${v === vendedorFiltro ? 'selected' : ''}>${v}</option>`).join('')}
        </select>
        <button onclick="generarPDFVendedorIndividual()" class="popup-btn" style="margin:0; padding:8px 16px; font-size:13px; background:#dc2626; color:#fff; width:auto;">
            <i class="fas fa-file-pdf"></i> PDF Vendedor
        </button>
    </div>`;

    let html = selectorHtml;

    if (!vendedorFiltro) {
        // REPORTE GENERAL
        html += `<h4 style="margin-bottom:15px; color:var(--primary-color);"><i class="fas fa-trophy" style="color:#f59e0b;"></i> Ranking General de Ventas (${(data || []).length} ventas)</h4>
        <table class="reporte-table"><thead><tr><th>#</th><th>Vendedor</th><th>N° Ventas</th><th>Monto Total (Bs)</th><th>Total Cobrado</th><th>Por Cobrar</th><th>Contado</th><th>Crédito</th></tr></thead><tbody>`;

        ranking.forEach(([vendedor, d], i) => {
            const contado = d.lotes.filter(l => l.tipo_venta === 'CONTADO').length;
            const credito = d.lotes.filter(l => l.tipo_venta === 'CREDITO').length;
            const porCobrar = Math.max(0, d.monto - d.cobrado);
            const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
            html += `<tr>
                <td><span class="rank-badge ${rankClass}">${i + 1}</span></td>
                <td><strong>${vendedor}</strong></td>
                <td style="font-size:18px; font-weight:700; color:var(--primary-color);">${d.ventas}</td>
                <td style="color:#1e3a8a; font-weight:600;">Bs ${d.monto.toLocaleString('es-BO', { maximumFractionDigits: 0 })}</td>
                <td style="color:#059669; font-weight:600;">Bs ${d.cobrado.toLocaleString('es-BO', { maximumFractionDigits: 0 })}</td>
                <td style="color:#dc2626; font-weight:600;">Bs ${porCobrar.toLocaleString('es-BO', { maximumFractionDigits: 0 })}</td>
                <td>${contado}</td><td>${credito}</td>
            </tr>`;
        });
        html += '</tbody></table>';
        html += `<h4 style="margin:20px 0 10px; color:var(--primary-color);"><i class="fas fa-list-alt"></i> Detalle General de Ventas</h4>
        <table class="reporte-table"><thead><tr>
            <th>Urbanización</th><th>Manzano</th><th>Lote</th><th>Cliente</th><th>CI</th>
            <th>Precio ($us)</th><th>Monto (Bs)</th><th>Cobrado</th><th>Tipo</th><th>N° Factura(s)</th><th>Vendedor</th>
        </tr></thead><tbody>`;
        (data || []).forEach(l => {
            const cob = cobradoPorLote[l.gid] || 0;
            const facts = (facturasPorLote[l.gid] || []).join(', ') || '—';
            html += `<tr>
                <td>${URB_NOMBRES[l.urb] || l.urb}</td>
                <td>${l.manzano || '-'}</td><td>${l.lote || '-'}</td>
                <td>${l.nom_cliente || '-'}</td><td>${l.ci_cliente || '-'}</td>
                <td>$us ${parseFloat(l.precio_vent || 0).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                <td>Bs ${parseFloat(l.monto_bs || 0).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                <td style="color:#059669; font-weight:600;">Bs ${cob.toLocaleString('es-BO', {maximumFractionDigits:0})}</td>
                <td><span style="background:${l.tipo_venta === 'CONTADO' ? '#dcfce7' : '#dbeafe'}; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">${l.tipo_venta || '-'}</span></td>
                <td style="font-size:11px; color:#64748b;">${facts}</td>
                <td>${l.vendedor || '-'}</td>
            </tr>`;
        });
        html += '</tbody></table>';
    } else {
        // REPORTE INDIVIDUAL DEL VENDEDOR
        const dv = porVendedor[vendedorFiltro] || { ventas: 0, monto: 0, cobrado: 0, lotes: [] };
        const porCobrar = Math.max(0, dv.monto - dv.cobrado);
        html += `<div style="background:linear-gradient(135deg,#1e3a8a,#1e40af); color:white; border-radius:12px; padding:18px 24px; margin-bottom:18px; display:flex; gap:30px; align-items:center; flex-wrap:wrap;">
            <div><i class="fas fa-user-tie" style="font-size:36px; opacity:0.8;"></i></div>
            <div>
                <div style="font-size:20px; font-weight:800;">${vendedorFiltro}</div>
                <div style="font-size:12px; opacity:0.8; margin-top:4px;">Reporte Individual de Ventas</div>
            </div>
            <div style="margin-left:auto; display:flex; gap:20px; flex-wrap:wrap;">
                <div style="text-align:center;"><div style="font-size:28px; font-weight:800;">${dv.ventas}</div><div style="font-size:11px; opacity:0.8;">Ventas</div></div>
                <div style="text-align:center;"><div style="font-size:16px; font-weight:700;">Bs ${dv.monto.toLocaleString('es-BO',{maximumFractionDigits:0})}</div><div style="font-size:11px; opacity:0.8;">Monto Total</div></div>
                <div style="text-align:center;"><div style="font-size:16px; font-weight:700; color:#86efac;">Bs ${dv.cobrado.toLocaleString('es-BO',{maximumFractionDigits:0})}</div><div style="font-size:11px; opacity:0.8;">Cobrado</div></div>
                <div style="text-align:center;"><div style="font-size:16px; font-weight:700; color:#fca5a5;">Bs ${porCobrar.toLocaleString('es-BO',{maximumFractionDigits:0})}</div><div style="font-size:11px; opacity:0.8;">Por Cobrar</div></div>
            </div>
        </div>`;

        html += `<h4 style="margin-bottom:12px; color:var(--primary-color);"><i class="fas fa-list-alt"></i> Detalle de Ventas — ${vendedorFiltro}</h4>
        <table class="reporte-table"><thead><tr>
            <th>Urb.</th><th>Manzano</th><th>Lote</th><th>Cliente</th><th>CI</th><th>Celular</th>
            <th>Precio ($us)</th><th>Monto (Bs)</th><th>Cobrado</th><th>Saldo</th>
            <th>Tipo</th><th>Cuotas</th><th>N° Factura(s)</th>
        </tr></thead><tbody>`;
        dv.lotes.forEach(l => {
            const cob = cobradoPorLote[l.gid] || 0;
            const saldo = Math.max(0, parseFloat(l.monto_bs || 0) - cob);
            const facts = (facturasPorLote[l.gid] || []).join(', ') || '—';
            html += `<tr>
                <td>${URB_NOMBRES[l.urb] || l.urb}</td>
                <td>${l.manzano || '-'}</td><td>${l.lote || '-'}</td>
                <td><strong>${l.nom_cliente || '-'}</strong></td>
                <td>${l.ci_cliente || '-'}</td><td>${l.cel_cliente || '-'}</td>
                <td>$us ${parseFloat(l.precio_vent || 0).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                <td>Bs ${parseFloat(l.monto_bs || 0).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</td>
                <td style="color:#059669; font-weight:600;">Bs ${cob.toLocaleString('es-BO',{maximumFractionDigits:0})}</td>
                <td style="color:${saldo > 0 ? '#dc2626' : '#059669'}; font-weight:600;">Bs ${saldo.toLocaleString('es-BO',{maximumFractionDigits:0})}</td>
                <td><span style="background:${l.tipo_venta === 'CONTADO' ? '#dcfce7' : '#dbeafe'}; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">${l.tipo_venta || '-'}</span></td>
                <td>${l.nro_cuotas || '—'}</td>
                <td style="font-size:11px; color:#64748b;">${facts}</td>
            </tr>`;
        });
        html += '</tbody></table>';
    }

    contenido.innerHTML = html;
    window._datosReporteVentas = { data, cobradoPorLote, facturasPorLote, porVendedor, vendedorFiltro };
}

function aplicarFiltroVendedor() {
    const sel = document.getElementById('filtro-vendedor-individual');
    const vendedor = sel ? sel.value : '';
    const contenido = document.getElementById('reporte-contenido');
    const desde = document.getElementById('reporte-fecha-desde').value;
    const hasta = document.getElementById('reporte-fecha-hasta').value;
    const urb = document.getElementById('reporte-urb-filtro').value;
    contenido.innerHTML = '<p style="text-align:center; padding:20px;"><i class="fas fa-spinner fa-spin"></i> Cargando...</p>';
    mostrarReporteVentas(contenido, desde, hasta, urb, vendedor).catch(e => {
        contenido.innerHTML = `<p style="color:#ef4444;">Error: ${e.message}</p>`;
    });
}
window.aplicarFiltroVendedor = aplicarFiltroVendedor;

async function generarPDFVendedorIndividual() {
    const datos = window._datosReporteVentas;
    if (!datos) { showAlert('warning', 'Sin datos', 'Primero aplique el filtro de vendedor.'); return; }
    const vendedor = datos.vendedorFiltro || 'TODOS';
    const dv = datos.porVendedor[vendedor] || { ventas: 0, monto: 0, cobrado: 0, lotes: datos.data || [] };
    const lotes = vendedor === 'TODOS' ? (datos.data || []) : dv.lotes;

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    let y = 0;

    pdf.setFillColor(30, 58, 138); pdf.rect(0, 0, pw, 30, 'F');
    pdf.setTextColor(255,255,255); pdf.setFontSize(14); pdf.setFont('helvetica','bold');
    pdf.text(APP_CONFIG.nombre_empresa + ' — REPORTE DE VENTAS POR VENDEDOR', pw/2, 12, {align:'center'});
    pdf.setFontSize(10); pdf.setFont('helvetica','normal');
    pdf.text(`Vendedor: ${vendedor}`, pw/2, 20, {align:'center'});
    pdf.setFontSize(8);
    pdf.text(`Generado: ${new Date().toLocaleDateString('es-BO')} | Usuario: ${currentUsername}`, pw/2, 27, {align:'center'});
    y = 36;

    if (vendedor !== 'TODOS') {
        const porCobrar = Math.max(0, dv.monto - dv.cobrado);
        pdf.setFillColor(239,246,255); pdf.rect(15, y, pw-30, 16, 'F');
        pdf.setDrawColor(30,58,138); pdf.setLineWidth(0.5); pdf.rect(15, y, pw-30, 16);
        pdf.setTextColor(30,58,138); pdf.setFontSize(9); pdf.setFont('helvetica','bold');
        pdf.text(`Total Ventas: ${dv.ventas}`, 20, y+6);
        pdf.text(`Monto Total: Bs ${dv.monto.toLocaleString('es-BO',{maximumFractionDigits:0})}`, 70, y+6);
        pdf.text(`Total Cobrado: Bs ${dv.cobrado.toLocaleString('es-BO',{maximumFractionDigits:0})}`, 155, y+6);
        pdf.text(`Por Cobrar: Bs ${porCobrar.toLocaleString('es-BO',{maximumFractionDigits:0})}`, 225, y+6);
        pdf.text(`Contado: ${dv.lotes.filter(l=>l.tipo_venta==='CONTADO').length}  |  Crédito: ${dv.lotes.filter(l=>l.tipo_venta==='CREDITO').length}`, 20, y+13);
        y += 22;
    }

    const headers = ['Urb.','Mz','Lote','Cliente','CI','Precio($us)','Monto(Bs)','Cobrado','Saldo','Tipo','N° Factura'];
    const colW = [30,15,15,45,22,28,28,28,28,18,35];
    pdf.setFillColor(30,58,138); pdf.rect(15, y, pw-30, 8, 'F');
    pdf.setTextColor(255,255,255); pdf.setFontSize(7.5); pdf.setFont('helvetica','bold');
    let x = 17;
    headers.forEach((h,i) => { pdf.text(h, x, y+5.5); x += colW[i]; });
    y += 10;

    lotes.forEach((l, ri) => {
        if (y > ph - 18) { pdf.addPage(); y = 15; }
        const cob = datos.cobradoPorLote[l.gid] || 0;
        const saldo = Math.max(0, parseFloat(l.monto_bs||0) - cob);
        const facts = (datos.facturasPorLote[l.gid] || []).join(', ') || '—';
        if (ri % 2 === 0) { pdf.setFillColor(245,248,255); pdf.rect(15, y-1, pw-30, 7, 'F'); }
        pdf.setTextColor(50,50,50); pdf.setFontSize(7); pdf.setFont('helvetica','normal');
        x = 17;
        const cells = [
            (URB_NOMBRES[l.urb]||l.urb).substring(0,12),
            l.manzano||'-', l.lote||'-',
            (l.nom_cliente||'-').substring(0,20),
            l.ci_cliente||'-',
            '$us '+parseFloat(l.precio_vent||0).toFixed(0),
            'Bs '+parseFloat(l.monto_bs||0).toFixed(0),
            'Bs '+cob.toFixed(0),
            'Bs '+saldo.toFixed(0),
            l.tipo_venta||'-',
            facts.substring(0,18)
        ];
        cells.forEach((c,i) => { pdf.text(String(c), x, y+4); x += colW[i]; });
        y += 7;
    });

    pdf.setTextColor(120,120,120); pdf.setFontSize(7);
    pdf.text(APP_CONFIG.pie_pagina, pw/2, ph-5, {align:'center'});
    pdf.save(`Reporte_Vendedor_${vendedor.replace(/\s+/g,'_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}
window.generarPDFVendedorIndividual = generarPDFVendedorIndividual;

async function mostrarReporteClientes(contenido, desde, hasta, urb) {
    let query = supabaseClient.from('lotes').select('gid, nom_cliente, cel_cliente, ci_cliente, lote, manzano, precio_vent, monto_bs, tipo_venta, estado, urb, monto_reserva, vendedor')
        .in('estado', ['VENDIDO', 'RESERVADO']);
    if (urb) query = query.eq('urb', urb);

    const { data: lotes, error } = await query;
    if (error) throw error;

    // Cobros por lote
    const { data: cobros } = await supabaseClient.from('cobros').select('lote_gid, monto, fecha_cobro, nro_cuota');
    const cobradoPorLote = {};
    (cobros || []).forEach(c => { cobradoPorLote[c.lote_gid] = (cobradoPorLote[c.lote_gid] || 0) + parseFloat(c.monto || 0); });

    let totalGlobalCobrado = 0;
    let totalGlobalAdelantos = 0;

    let html = `<h4 style="margin-bottom:15px; color:var(--primary-color);">👥 Reporte de Clientes (${(lotes || []).length} registros)</h4>
    <table class="reporte-table"><thead><tr>
        <th>Cliente</th><th>CI</th><th>Celular</th><th>Urb.</th><th>Mz / Lote</th>
        <th>Estado</th><th>Tipo Venta</th><th>Precio (Bs)</th>
        <th>Adelanto/Reserva</th><th>Cobrado (cuotas)</th><th>Total Ingresado</th><th>Pendiente</th><th>Vendedor</th>
    </tr></thead><tbody>`;

    (lotes || []).forEach(l => {
        const montoBs = parseFloat(l.monto_bs || 0);
        const cobrado = cobradoPorLote[l.gid] || 0;
        const adelanto = parseFloat(l.monto_reserva || 0);
        // El total ingresado incluye tanto cuotas como el adelanto/reserva (independiente del estado actual)
        const totalIngresado = cobrado + adelanto;
        const pendiente = Math.max(0, montoBs - totalIngresado);
        totalGlobalCobrado += cobrado;
        totalGlobalAdelantos += adelanto;
        const tipoBg = l.tipo_venta === 'CONTADO' ? '#dcfce7' : '#dbeafe';
        const tipoTxt = l.tipo_venta === 'CONTADO' ? '#166534' : '#1e40af';
        html += `<tr>
            <td><strong>${l.nom_cliente || '-'}</strong></td>
            <td>${l.ci_cliente || '-'}</td>
            <td>${l.cel_cliente || '-'}</td>
            <td>${URB_NOMBRES[l.urb] || l.urb}</td>
            <td>Mz${l.manzano || '?'} Lt${l.lote || '?'}</td>
            <td><span style="background:${l.estado === 'VENDIDO' ? '#fee2e2' : '#fef9c3'}; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">${l.estado}</span></td>
            <td><span style="background:${tipoBg}; color:${tipoTxt}; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">${l.tipo_venta || '-'}</span></td>
            <td>Bs ${montoBs.toLocaleString('es-BO', { maximumFractionDigits: 0 })}</td>
            <td style="color:${adelanto > 0 ? '#d97706' : '#94a3b8'}; font-weight:600;">Bs ${adelanto.toLocaleString('es-BO', { maximumFractionDigits: 0 })}</td>
            <td style="color:#059669; font-weight:600;">Bs ${cobrado.toLocaleString('es-BO', { maximumFractionDigits: 0 })}</td>
            <td style="color:#065f46; font-weight:700;">Bs ${totalIngresado.toLocaleString('es-BO', { maximumFractionDigits: 0 })}</td>
            <td style="color:${pendiente > 0 ? '#dc2626' : '#059669'}; font-weight:600;">Bs ${pendiente.toLocaleString('es-BO', { maximumFractionDigits: 0 })}</td>
            <td>${l.vendedor || '-'}</td>
        </tr>`;
    });
    html += `</tbody></table>
    <div style="margin-top:12px; padding:12px 16px; background:#f0fdf4; border-left:4px solid #10b981; border-radius:8px; font-size:13px; display:flex; gap:30px; flex-wrap:wrap;">
        <span><strong>Total Cobrado (Cuotas):</strong> Bs ${totalGlobalCobrado.toLocaleString('es-BO', {maximumFractionDigits:0})}</span>
        <span><strong>Total Adelantos/Reservas:</strong> Bs ${totalGlobalAdelantos.toLocaleString('es-BO', {maximumFractionDigits:0})}</span>
        <span style="color:#059669; font-weight:700;"><strong>TOTAL INGRESADO:</strong> Bs ${(totalGlobalCobrado + totalGlobalAdelantos).toLocaleString('es-BO', {maximumFractionDigits:0})}</span>
    </div>`;
    contenido.innerHTML = html;
}


document.getElementById('reporte-pdf-btn').addEventListener('click', async () => {
    const activeTab = document.querySelector('.reporte-tab-btn.active')?.dataset.tab || 'ventas';
    if (activeTab === 'pagos') {
        showAlert('info', 'Usa los botones del módulo', 'Para el reporte de Pagos por Cliente usa los botones <strong>PDF — Todos los Clientes</strong> o <strong>PDF por Lote</strong> dentro del módulo.');
        return;
    }
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pw = pdf.internal.pageSize.getWidth();
        let y = 15;

        pdf.setFillColor(7, 1, 114); pdf.rect(0, 0, pw, 25, 'F');
        pdf.setTextColor(255, 255, 255); pdf.setFontSize(15); pdf.setFont(undefined, 'bold');
        const activeTab = document.querySelector('.reporte-tab-btn.active')?.textContent?.trim() || 'Reporte';
        pdf.text(APP_CONFIG.nombre_empresa + ' — ' + activeTab.toUpperCase(), pw / 2, 16, { align: 'center' });
        y = 32;
        pdf.setTextColor(80, 80, 80); pdf.setFontSize(9); pdf.setFont(undefined, 'normal');
        pdf.text(`Generado: ${new Date().toLocaleDateString('es-BO')} | Usuario: ${currentUsername}`, pw / 2, y, { align: 'center' });
        y += 8;

        const tabla = document.querySelector('#reporte-contenido .reporte-table:last-of-type');
        if (tabla) {
            const rows = tabla.querySelectorAll('tr');
            const headers = [...rows[0].querySelectorAll('th')].map(th => th.textContent.trim());
            const numCols = headers.length;
            const colW = Array(numCols).fill((pw - 32) / numCols);

            pdf.setFillColor(7, 1, 114); pdf.rect(15, y, pw - 30, 8, 'F');
            pdf.setTextColor(255, 255, 255); pdf.setFontSize(8); pdf.setFont(undefined, 'bold');
            let x = 17; headers.forEach((h, i) => { pdf.text(h.substring(0, 20), x, y + 5.5); x += colW[i]; });
            y += 10;

            [...rows].slice(1).forEach((row, ri) => {
                const cells = [...row.querySelectorAll('td')].map(td => td.textContent.trim());
                if (ri % 2 === 0) { pdf.setFillColor(245, 248, 255); pdf.rect(15, y - 1, pw - 30, 7, 'F'); }
                pdf.setTextColor(50, 50, 50); pdf.setFont(undefined, 'normal'); pdf.setFontSize(7.5);
                x = 17; cells.forEach((c, i) => { if (i < numCols) { pdf.text(String(c).substring(0, 25), x, y + 4); x += colW[i]; } });
                y += 7;
                if (y > 190) { pdf.addPage(); y = 15; }
            });
        } else {
            pdf.text('No hay datos para exportar', pw / 2, 60, { align: 'center' });
        }

        pdf.setTextColor(150, 150, 150); pdf.setFontSize(7);
        pdf.text(APP_CONFIG.pie_pagina, pw / 2, pdf.internal.pageSize.getHeight() - 5, { align: 'center' });
        pdf.save(`Reporte_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) { showAlert('error', 'Error al Generar PDF', e.message); }
});

/* =====================================================
   REPORTE DE PAGOS POR CLIENTE
   ===================================================== */
async function mostrarReportePagosCliente(contenido, desde, hasta, urb, clienteFiltroKey) {
    contenido.innerHTML = '<p style="text-align:center; padding:20px;"><i class="fas fa-spinner fa-spin"></i> Cargando...</p>';

    // ── Cargar lotes con cliente ──
    let query = supabaseClient.from('lotes')
        .select('gid, nom_cliente, ci_cliente, cel_cliente, lote, manzano, precio_vent, monto_bs, tipo_venta, estado, urb, monto_reserva, vendedor, nro_cuotas')
        .in('estado', ['VENDIDO', 'RESERVADO'])
        .not('nom_cliente', 'is', null);
    if (urb) query = query.eq('urb', urb);
    const { data: lotes, error: lotesErr } = await query;
    if (lotesErr) throw lotesErr;

    // ── Cargar cobros ──
    const { data: cobros } = await supabaseClient.from('cobros')
        .select('lote_gid, monto, fecha_cobro, nro_cuota, nro_factura, usuario');
    const cobrosPorLote = {};
    (cobros || []).forEach(c => {
        if (!cobrosPorLote[c.lote_gid]) cobrosPorLote[c.lote_gid] = [];
        cobrosPorLote[c.lote_gid].push(c);
    });

    // ── Agrupar clientes (por CI o nombre) ──
    const clientesMap = {};
    (lotes || []).forEach(l => {
        const key = (l.ci_cliente || l.nom_cliente || 'SIN_CI').toUpperCase().trim();
        if (!clientesMap[key]) clientesMap[key] = { nombre: l.nom_cliente, ci: l.ci_cliente, cel: l.cel_cliente, lotes: [] };
        clientesMap[key].lotes.push(l);
    });
    const clientesOrdenados = Object.entries(clientesMap)
        .sort((a, b) => (a[1].nombre || '').localeCompare(b[1].nombre || ''));

    // Guardar datos globales para PDFs
    window._datosReportePagos = { clientesMap, cobrosPorLote };

    // ════════════════════════════════════════
    // BLOQUE SUPERIOR: Filtro general (por URB) + PDF todos
    // ════════════════════════════════════════
    let html = `
    <!-- BARRA SUPERIOR: info general + PDF todos -->
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px; padding:10px 14px; background:linear-gradient(135deg,#1e3a8a,#1e40af); border-radius:10px;">
        <span style="color:white; font-size:13px; font-weight:700;">
            <i class="fas fa-users"></i> ${clientesOrdenados.length} clientes
            ${urb ? ' — ' + (URB_NOMBRES[urb] || urb) : ' — Todas las urbanizaciones'}
        </span>
        <button onclick="generarPDFPagosClienteTodos()" class="popup-btn" style="margin:0; padding:7px 14px; background:#dc2626; font-size:12px; white-space:nowrap;">
            <i class="fas fa-file-pdf"></i> PDF Todos los Clientes
        </button>
    </div>

    <!-- FILTRO INDIVIDUAL -->
    <div style="margin-bottom:12px; padding:10px 14px; background:#f5f3ff; border:1px solid #ede9fe; border-radius:10px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
        <span style="font-size:12px; font-weight:700; color:#6d28d9; white-space:nowrap;"><i class="fas fa-user-circle"></i> Por cliente:</span>
        <select id="pagos-cliente-select" style="padding:7px 10px; border:1px solid #ede9fe; border-radius:7px; font-size:13px; flex:1; min-width:180px; background:white;">
            <option value="">— Seleccionar cliente —</option>
            ${clientesOrdenados.map(([k, c]) => `<option value="${k}" ${k === clienteFiltroKey ? 'selected' : ''}>${c.nombre || k}${c.lotes.length > 1 ? ' (' + c.lotes.length + ' lotes)' : ''}</option>`).join('')}
        </select>
        <button onclick="filtrarClientePagos()" class="popup-btn" style="margin:0; padding:7px 14px; font-size:12px; background:#7c3aed; white-space:nowrap;">
            <i class="fas fa-search"></i> Ver Extracto
        </button>
        <button onclick="generarPDFPagosCliente()" class="popup-btn" style="margin:0; padding:7px 14px; font-size:12px; background:#5b21b6; white-space:nowrap;">
            <i class="fas fa-file-pdf"></i> PDF por Lote
        </button>
        ${clienteFiltroKey ? `<button onclick="limpiarFiltroClientePagos()" class="popup-btn" style="margin:0; padding:7px 12px; font-size:12px; background:#64748b; white-space:nowrap;"><i class="fas fa-times"></i> Ver Todos</button>` : ''}
    </div>`;

    // ── Determinar qué clientes mostrar ──
    const clientesAMostrar = clienteFiltroKey
        ? clientesOrdenados.filter(([k]) => k === clienteFiltroKey)
        : clientesOrdenados;

    if (clienteFiltroKey && clientesAMostrar.length === 0) {
        html += `<p style="color:#ef4444; padding:20px; text-align:center;">No se encontró el cliente seleccionado.</p>`;
        contenido.innerHTML = html;
        return;
    }

    html += `<h4 style="margin-bottom:12px; color:var(--primary-color);">
        🧾 ${clienteFiltroKey ? 'Extracto del cliente seleccionado' : `Extracto de Pagos — ${clientesAMostrar.length} clientes`}
    </h4>`;

    clientesAMostrar.forEach(([key, cliente]) => {
        const tieneMultiples = cliente.lotes.length > 1;
        let totalGlobalCliente = 0;

        html += `<div style="margin-bottom:20px; border:${tieneMultiples ? '2px solid #7c3aed' : '1px solid #e2e8f0'}; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <div style="padding:12px 16px; background:${tieneMultiples ? 'linear-gradient(135deg,#7c3aed,#5b21b6)' : 'linear-gradient(135deg,#1e3a8a,#1e40af)'}; color:white; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                <div>
                    <strong style="font-size:15px;"><i class="fas fa-user"></i> ${cliente.nombre || '-'}</strong>
                    ${tieneMultiples ? '<span style="background:rgba(255,255,255,0.25); padding:2px 10px; border-radius:20px; font-size:11px; margin-left:8px;"><i class="fas fa-layer-group"></i> ' + cliente.lotes.length + ' LOTES</span>' : ''}
                </div>
                <div style="font-size:12px; opacity:0.9;">
                    <i class="fas fa-id-card"></i> CI: ${cliente.ci || '-'} &nbsp;|&nbsp;
                    <i class="fas fa-phone"></i> ${cliente.cel || '-'}
                </div>
            </div>`;

        cliente.lotes.forEach(l => {
            const cobrosList = (cobrosPorLote[l.gid] || []).sort((a, b) => new Date(a.fecha_cobro) - new Date(b.fecha_cobro));
            const montoBs = parseFloat(l.monto_bs || 0);
            const adelanto = parseFloat(l.monto_reserva || 0);
            const totalCuotas = cobrosList.reduce((s, c) => s + parseFloat(c.monto || 0), 0);
            const totalIngresado = totalCuotas + adelanto;
            const saldo = Math.max(0, montoBs - totalIngresado);
            totalGlobalCliente += totalIngresado;

            html += `<div style="padding:14px 16px; background:#fafbff; border-bottom:1px solid #f1f5f9;">
                <div style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:10px; padding:10px 14px; background:#eff6ff; border-radius:8px; border-left:4px solid #3b82f6; font-size:13px;">
                    <span><strong>URB:</strong> ${URB_NOMBRES[l.urb] || l.urb}</span>
                    <span><strong>Manzano:</strong> ${l.manzano || '-'}</span>
                    <span><strong>Lote:</strong> ${l.lote || '-'}</span>
                    <span><strong>Estado:</strong> <span style="color:${l.estado==='VENDIDO'?'#dc2626':'#d97706'}; font-weight:700;">${l.estado}</span></span>
                    <span><strong>Tipo:</strong> <span style="color:${l.tipo_venta==='CONTADO'?'#059669':'#7c3aed'};">${l.tipo_venta || '-'}</span></span>
                    <span><strong>Precio Total:</strong> Bs ${montoBs.toLocaleString('es-BO', {maximumFractionDigits:0})}</span>
                    ${adelanto > 0 ? `<span><strong>Adelanto:</strong> <span style="color:#d97706; font-weight:700;">Bs ${adelanto.toLocaleString('es-BO',{maximumFractionDigits:0})}</span></span>` : ''}
                    <span><strong>Total Pagado:</strong> <span style="color:#059669; font-weight:700;">Bs ${totalIngresado.toLocaleString('es-BO',{maximumFractionDigits:0})}</span></span>
                    <span><strong>Saldo:</strong> <span style="color:${saldo>0?'#dc2626':'#059669'}; font-weight:700;">Bs ${saldo.toLocaleString('es-BO',{maximumFractionDigits:0})}</span></span>
                </div>`;

            if (adelanto > 0) {
                html += `<div style="margin-bottom:8px; padding:8px 12px; background:#fef9c3; border-radius:8px; border-left:4px solid #f59e0b; font-size:12px;">
                    <i class="fas fa-bookmark" style="color:#d97706;"></i> <strong>Adelanto/Reserva:</strong>
                    Bs ${adelanto.toLocaleString('es-BO',{minimumFractionDigits:2})}
                    <span style="color:#92400e; margin-left:8px;">(Monto inicial abonado al reservar el lote)</span>
                </div>`;
            }

            if (cobrosList.length > 0) {
                html += `<table class="reporte-table" style="margin-bottom:0; font-size:12px;"><thead><tr>
                    <th>N° Cuota</th><th>Fecha</th><th>Monto (Bs)</th><th>N° Factura</th><th>Registrado por</th>
                </tr></thead><tbody>`;
                cobrosList.forEach(c => {
                    const fecha = c.fecha_cobro ? new Date(c.fecha_cobro).toLocaleDateString('es-BO') : '-';
                    html += `<tr>
                        <td style="font-weight:700; color:#7c3aed;">Cuota ${c.nro_cuota || '-'}</td>
                        <td>${fecha}</td>
                        <td style="color:#059669; font-weight:600;">Bs ${parseFloat(c.monto||0).toLocaleString('es-BO',{minimumFractionDigits:2})}</td>
                        <td style="font-size:11px; color:#64748b;">${c.nro_factura || '—'}</td>
                        <td style="font-size:11px; color:#64748b;">${c.usuario || '-'}</td>
                    </tr>`;
                });
                html += `<tr style="background:#f0fdf4; font-weight:700;">
                    <td colspan="2" style="text-align:right; color:#059669;">TOTAL CUOTAS:</td>
                    <td style="color:#059669; font-weight:800;">Bs ${totalCuotas.toLocaleString('es-BO',{minimumFractionDigits:2})}</td>
                    <td colspan="2"></td>
                </tr></tbody></table>`;
            } else {
                html += `<p style="color:#94a3b8; font-size:12px; text-align:center; padding:10px;"><i class="fas fa-info-circle"></i> Sin cobros de cuotas registrados</p>`;
            }
            html += '</div>';
        });

        // Resumen total del cliente si tiene múltiples lotes
        if (tieneMultiples) {
            html += `<div style="padding:10px 16px; background:#f5f3ff; border-top:2px solid #ede9fe; text-align:right; font-size:13px; font-weight:700; color:#6d28d9;">
                <i class="fas fa-calculator"></i> TOTAL INGRESADO (todos sus lotes): Bs ${totalGlobalCliente.toLocaleString('es-BO',{minimumFractionDigits:2})}
            </div>`;
        }

        html += '</div>';
    });

    contenido.innerHTML = html;
}

function filtrarClientePagos() {
    const sel = document.getElementById('pagos-cliente-select');
    const key = sel ? sel.value : '';
    const contenido = document.getElementById('reporte-contenido');
    const desde = document.getElementById('reporte-fecha-desde').value;
    const hasta = document.getElementById('reporte-fecha-hasta').value;
    const urb = document.getElementById('reporte-urb-filtro').value;
    mostrarReportePagosCliente(contenido, desde, hasta, urb, key).catch(e => {
        contenido.innerHTML = `<p style="color:#ef4444; padding:20px;">Error: ${e.message}</p>`;
    });
}
window.filtrarClientePagos = filtrarClientePagos;

function limpiarFiltroClientePagos() {
    const contenido = document.getElementById('reporte-contenido');
    const desde = document.getElementById('reporte-fecha-desde').value;
    const hasta = document.getElementById('reporte-fecha-hasta').value;
    const urb = document.getElementById('reporte-urb-filtro').value;
    mostrarReportePagosCliente(contenido, desde, hasta, urb, '').catch(e => {
        contenido.innerHTML = `<p style="color:#ef4444; padding:20px;">Error: ${e.message}</p>`;
    });
}
window.limpiarFiltroClientePagos = limpiarFiltroClientePagos;
async function generarPDFPagosCliente() {
    const sel = document.getElementById('pagos-cliente-select');
    const key = sel ? sel.value : '';
    if (!key || !window._datosReportePagos) {
        showAlert('warning', 'Seleccione un cliente', 'Por favor seleccione un cliente en el desplegable antes de generar el PDF.');
        return;
    }
    const datos = window._datosReportePagos;
    const cliente = datos.clientesMap[key];
    if (!cliente) { showAlert('error', 'Error', 'Cliente no encontrado.'); return; }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const mg = 14;
    let esPrimeraPagina = true;

    for (const l of cliente.lotes) {
        if (!esPrimeraPagina) pdf.addPage();
        esPrimeraPagina = false;
        let y = 0;

        // Header
        pdf.setFillColor(30,58,138); pdf.rect(0,0,pw,32,'F');
        pdf.setTextColor(255,255,255); pdf.setFontSize(13); pdf.setFont('helvetica','bold');
        pdf.text(APP_CONFIG.nombre_empresa, pw/2, 10, {align:'center'});
        pdf.setFontSize(10); pdf.text('EXTRACTO DE PAGOS DEL CLIENTE', pw/2, 18, {align:'center'});
        pdf.setFontSize(8); pdf.setFont('helvetica','normal');
        pdf.text(`Generado: ${new Date().toLocaleDateString('es-BO')} | Usuario: ${currentUsername}`, pw/2, 26, {align:'center'});
        y = 38;

        // Datos cliente
        pdf.setFillColor(239,246,255); pdf.rect(mg,y,pw-mg*2,22,'F');
        pdf.setDrawColor(30,58,138); pdf.setLineWidth(0.4); pdf.rect(mg,y,pw-mg*2,22);
        pdf.setTextColor(30,58,138); pdf.setFontSize(9); pdf.setFont('helvetica','bold');
        pdf.text('DATOS DEL CLIENTE', mg+3, y+6);
        pdf.setFont('helvetica','normal'); pdf.setTextColor(50,50,50); pdf.setFontSize(8.5);
        pdf.text(`Nombre: ${cliente.nombre || '-'}`, mg+3, y+14);
        pdf.text(`CI: ${cliente.ci || '-'}`, mg+3, y+20);
        pdf.text(`Celular: ${cliente.cel || '-'}`, pw/2, y+14);
        if (cliente.lotes.length > 1) {
            pdf.setTextColor(124,58,237); pdf.setFont('helvetica','bold');
            pdf.text(`Cliente con ${cliente.lotes.length} lotes — Página ${cliente.lotes.indexOf(l)+1} de ${cliente.lotes.length}`, pw/2, y+20);
        }
        y += 28;

        // Datos del lote
        const montoBs = parseFloat(l.monto_bs || 0);
        const adelanto = parseFloat(l.monto_reserva || 0);
        const cobrosList = (datos.cobrosPorLote[l.gid] || []).sort((a,b) => new Date(a.fecha_cobro)-new Date(b.fecha_cobro));
        const totalCuotas = cobrosList.reduce((s,c) => s+parseFloat(c.monto||0), 0);
        const totalIngresado = totalCuotas + adelanto;
        const saldo = Math.max(0, montoBs - totalIngresado);

        pdf.setFillColor(254,243,199); pdf.rect(mg,y,pw-mg*2,26,'F');
        pdf.setDrawColor(217,119,6); pdf.setLineWidth(0.4); pdf.rect(mg,y,pw-mg*2,26);
        pdf.setTextColor(120,53,15); pdf.setFontSize(8); pdf.setFont('helvetica','bold');
        pdf.text('DETALLE DEL LOTE', mg+3, y+6);
        pdf.setFont('helvetica','normal'); pdf.setTextColor(50,50,50); pdf.setFontSize(8);
        pdf.text(`Urbanización: ${URB_NOMBRES[l.urb]||l.urb}`, mg+3, y+13);
        pdf.text(`Manzano: ${l.manzano||'-'}  |  Lote: ${l.lote||'-'}`, mg+3, y+19);
        pdf.text(`Estado: ${l.estado}  |  Tipo: ${l.tipo_venta||'-'}  |  Precio Total: Bs ${montoBs.toLocaleString('es-BO',{maximumFractionDigits:0})}`, mg+3, y+25);
        pdf.text(`Vendedor: ${l.vendedor||'-'}  |  Cuotas pactadas: ${l.nro_cuotas||'-'}`, pw/2+5, y+13);
        y += 32;

        // Resumen financiero
        pdf.setFillColor(240,253,244); pdf.rect(mg,y,pw-mg*2,20,'F');
        pdf.setDrawColor(16,185,129); pdf.setLineWidth(0.4); pdf.rect(mg,y,pw-mg*2,20);
        pdf.setTextColor(5,150,105); pdf.setFontSize(8); pdf.setFont('helvetica','bold');
        pdf.text('RESUMEN FINANCIERO', mg+3, y+6);
        const col1=mg+3, col2=mg+45, col3=pw/2+5, col4=pw/2+45;
        pdf.setTextColor(50,50,50); pdf.setFont('helvetica','normal');
        pdf.text('Adelanto/Reserva:', col1, y+13);
        pdf.setTextColor(217,119,6); pdf.setFont('helvetica','bold');
        pdf.text(`Bs ${adelanto.toLocaleString('es-BO',{minimumFractionDigits:2})}`, col2, y+13);
        pdf.setTextColor(50,50,50); pdf.setFont('helvetica','normal');
        pdf.text('Total Cuotas pagadas:', col3, y+13);
        pdf.setTextColor(5,150,105); pdf.setFont('helvetica','bold');
        pdf.text(`Bs ${totalCuotas.toLocaleString('es-BO',{minimumFractionDigits:2})}`, col4, y+13);
        y += 26;

        // Totales
        pdf.setFillColor(30,58,138); pdf.rect(mg,y,pw-mg*2,14,'F');
        pdf.setTextColor(255,255,255); pdf.setFontSize(9); pdf.setFont('helvetica','bold');
        pdf.text(`TOTAL INGRESADO: Bs ${totalIngresado.toLocaleString('es-BO',{minimumFractionDigits:2})}`, mg+5, y+6);
        pdf.text(`SALDO PENDIENTE: Bs ${saldo.toLocaleString('es-BO',{minimumFractionDigits:2})}`, mg+5, y+12);
        y += 20;

        // Tabla de cobros
        if (cobrosList.length > 0) {
            pdf.setTextColor(30,58,138); pdf.setFontSize(9); pdf.setFont('helvetica','bold');
            pdf.text('DETALLE DE PAGOS', mg, y); y += 4;
            pdf.setDrawColor(30,58,138); pdf.setLineWidth(0.4); pdf.line(mg,y,pw-mg,y); y += 3;

            const hCols = ['N° Cuota','Fecha de Pago','Monto (Bs)','N° Factura','Registrado por'];
            const hW = [28,38,38,50,pw-mg*2-154];
            pdf.setFillColor(30,58,138); pdf.rect(mg,y,pw-mg*2,8,'F');
            pdf.setTextColor(255,255,255); pdf.setFontSize(8); pdf.setFont('helvetica','bold');
            let hx = mg+2;
            hCols.forEach((h,i) => { pdf.text(h, hx, y+5.5); hx += hW[i]; });
            y += 10;

            cobrosList.forEach((c, ri) => {
                if (y > ph-20) { pdf.addPage(); y=15; }
                if (ri%2===0) { pdf.setFillColor(245,248,255); pdf.rect(mg,y-1,pw-mg*2,8,'F'); }
                pdf.setTextColor(50,50,50); pdf.setFontSize(8); pdf.setFont('helvetica','normal');
                let cx = mg+2;
                const fecha = c.fecha_cobro ? new Date(c.fecha_cobro).toLocaleDateString('es-BO') : '-';
                [
                    `Cuota ${c.nro_cuota||'-'}`, fecha,
                    `Bs ${parseFloat(c.monto||0).toLocaleString('es-BO',{minimumFractionDigits:2})}`,
                    c.nro_factura||'—', c.usuario||'-'
                ].forEach((cell,i) => { pdf.text(String(cell), cx, y+5); cx += hW[i]; });
                y += 8;
            });

            // Fila total
            pdf.setFillColor(240,253,244); pdf.rect(mg,y-1,pw-mg*2,9,'F');
            pdf.setTextColor(5,150,105); pdf.setFontSize(9); pdf.setFont('helvetica','bold');
            pdf.text(`TOTAL CUOTAS COBRADAS: Bs ${totalCuotas.toLocaleString('es-BO',{minimumFractionDigits:2})}`, mg+3, y+5.5);
        } else {
            pdf.setTextColor(150,150,150); pdf.setFontSize(9);
            pdf.text('Sin cobros de cuotas registrados para este lote.', mg+3, y+6);
        }

        // Footer
        pdf.setFillColor(30,58,138); pdf.rect(0,ph-10,pw,10,'F');
        pdf.setTextColor(255,255,255); pdf.setFontSize(7); pdf.setFont('helvetica','normal');
        pdf.text(APP_CONFIG.pie_pagina + '  |  Documento confidencial — Uso interno', pw/2, ph-4, {align:'center'});
    }

    pdf.save(`Pagos_${(cliente.nombre||'cliente').replace(/\s+/g,'_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}
window.generarPDFPagosCliente = generarPDFPagosCliente;

async function generarPDFPagosClienteTodos() {
    if (!window._datosReportePagos) { showAlert('warning', 'Sin datos', 'Primero cargue el reporte.'); return; }
    const datos = window._datosReportePagos;
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const mg = 10;
    let y = 0;

    const addHeader = () => {
        pdf.setFillColor(30,58,138); pdf.rect(0,0,pw,22,'F');
        pdf.setTextColor(255,255,255); pdf.setFontSize(13); pdf.setFont('helvetica','bold');
        pdf.text(APP_CONFIG.nombre_empresa + ' — EXTRACTO GENERAL DE PAGOS POR CLIENTE', pw/2, 10, {align:'center'});
        pdf.setFontSize(8); pdf.setFont('helvetica','normal');
        pdf.text(`Generado: ${new Date().toLocaleDateString('es-BO')} | Usuario: ${currentUsername}`, pw/2, 18, {align:'center'});
        y = 28;
    };
    addHeader();

    const headers = ['Cliente','CI','Celular','Urb.','Mz','Lote','Estado','Tipo','Monto(Bs)','Adelanto','Cobrado','Saldo'];
    const colW = [38,22,22,25,12,12,18,16,25,22,22,22];
    const drawTableHeader = () => {
        pdf.setFillColor(30,58,138); pdf.rect(mg,y,pw-mg*2,7,'F');
        pdf.setTextColor(255,255,255); pdf.setFontSize(6.5); pdf.setFont('helvetica','bold');
        let x = mg+1;
        headers.forEach((h,i) => { pdf.text(h, x, y+5); x += colW[i]; });
        y += 8;
    };
    drawTableHeader();

    let ri = 0;
    Object.entries(datos.clientesMap).sort((a,b)=>(a[1].nombre||'').localeCompare(b[1].nombre||'')).forEach(([key, cliente]) => {
        cliente.lotes.forEach(l => {
            if (y > ph - 15) { pdf.addPage(); addHeader(); drawTableHeader(); }
            const montoBs = parseFloat(l.monto_bs || 0);
            const adelanto = parseFloat(l.monto_reserva || 0);
            const totalCuotas = (datos.cobrosPorLote[l.gid] || []).reduce((s,c) => s+parseFloat(c.monto||0), 0);
            // Incluir adelanto sin importar el estado (VENDIDO o RESERVADO ambos son ingresos)
            const totalIngresado = totalCuotas + adelanto;
            const saldo = Math.max(0, montoBs - totalIngresado);
            if (ri%2===0) { pdf.setFillColor(245,248,255); pdf.rect(mg,y-1,pw-mg*2,7,'F'); }
            pdf.setTextColor(50,50,50); pdf.setFontSize(6.5); pdf.setFont('helvetica','normal');
            let x = mg+1;
            const cells = [
                (cliente.nombre||'-').substring(0,18),
                (cliente.ci||'-').substring(0,12),
                (cliente.cel||'-').substring(0,12),
                (URB_NOMBRES[l.urb]||l.urb).substring(0,12),
                l.manzano||'-', l.lote||'-',
                l.estado, l.tipo_venta||'-',
                'Bs '+montoBs.toLocaleString('es-BO',{maximumFractionDigits:0}),
                'Bs '+adelanto.toLocaleString('es-BO',{maximumFractionDigits:0}),
                'Bs '+totalIngresado.toLocaleString('es-BO',{maximumFractionDigits:0}),
                'Bs '+saldo.toLocaleString('es-BO',{maximumFractionDigits:0})
            ];
            cells.forEach((c,i) => { pdf.text(String(c), x, y+5); x += colW[i]; });
            y += 7; ri++;
        });
    });

    pdf.setFillColor(30,58,138); pdf.rect(0,ph-10,pw,10,'F');
    pdf.setTextColor(255,255,255); pdf.setFontSize(7);
    pdf.text(APP_CONFIG.pie_pagina, pw/2, ph-4, {align:'center'});
    pdf.save(`Pagos_Todos_Clientes_${new Date().toISOString().split('T')[0]}.pdf`);
}
window.generarPDFPagosClienteTodos = generarPDFPagosClienteTodos;

/* =====================================================
   WHATSAPP BUTTON
   ===================================================== */
document.getElementById('whatsapp-btn').addEventListener('click', () => {
    const numero = APP_CONFIG.whatsapp || '5911234567';
    const mensaje = encodeURIComponent('Hola! Estoy interesado en información sobre sus lotes en ' + APP_CONFIG.nombre_empresa + '.');
    window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
});

/* =====================================================
   NUEVAS FUNCIONALIDADES
   ===================================================== */

/* --- TABS MÓDULO COBROS --- */
// Tab cobros simplificado (solo tab vendidos)
function switchCobroTab(tab) {
    // Mantenido por compatibilidad
}
window.switchCobroTab = switchCobroTab;

/* --- LOTES RESERVADOS: Factura se genera directo al reservar desde mapa --- */
let loteReservadoSeleccionado = null;

document.getElementById('close-factura-reserva-modal').addEventListener('click', () => {
    document.getElementById('factura-reserva-modal').classList.remove('active');
});

// Omitir factura de reserva → mostrar badge SIN FACTURA en historial
document.getElementById('omitir-factura-reserva-btn').addEventListener('click', async () => {
    const confirmar = await showConfirm(
        'Omitir Factura',
        '¿Desea continuar <strong>sin generar factura</strong> para esta reserva?<br><small style="color:#64748b;">El lote quedará como RESERVADO pero sin comprobante.</small>',
        'Sí, Omitir', 'No, Volver'
    );
    if (!confirmar) return;
    document.getElementById('factura-reserva-modal').classList.remove('active');
    showToast('info', 'Reserva registrada — SIN FACTURA');
});

['res-fact-monto', 'res-fact-descuento'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', actualizarTotalFacturaReserva);
});

function actualizarTotalFacturaReserva() {
    const monto = parseFloat(document.getElementById('res-fact-monto').value) || 0;
    const descuento = parseFloat(document.getElementById('res-fact-descuento').value) || 0;
    const total = Math.max(0, monto - descuento);
    document.getElementById('res-fact-total-display').textContent = `Bs ${total.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`;
    document.getElementById('res-fact-literal-display').textContent = numeroALiteral(total) + ' BOLIVIANOS';
}

document.getElementById('generar-factura-reserva-btn').addEventListener('click', async () => {
    const confirmar = await showConfirm(
        'Confirmar Factura de Adelanto',
        '¿Está seguro de generar la factura del monto de adelanto/reserva?<br><small style="color:#64748b;">Esta acción generará un PDF de la factura.</small>',
        'Sí, Generar', 'No, Cancelar'
    );
    if (!confirmar) return;
    const btn = document.getElementById('generar-factura-reserva-btn');
    setBtnLoading(btn, true);
    await generarPDFFacturaReserva();
    setBtnLoading(btn, false);
});

async function generarPDFFacturaReserva() {
    const nitEmpresa = document.getElementById('res-fact-nit-empresa').value.trim();
    const razonSocial = document.getElementById('res-fact-razon-social').value.trim();
    const direccion = document.getElementById('res-fact-direccion').value.trim();
    const municipio = document.getElementById('res-fact-municipio').value.trim();
    const telefono = document.getElementById('res-fact-telefono').value.trim();
    const sucursal = document.getElementById('res-fact-sucursal').value.trim();
    const nroFactura = document.getElementById('res-fact-numero').value.trim();
    const tipoFactura = document.getElementById('res-fact-tipo').value;
    const cuf = document.getElementById('res-fact-cuf').value;
    const clienteCI = document.getElementById('res-fact-cliente-ci').value.trim();
    const clienteNombre = document.getElementById('res-fact-cliente-nombre').value.trim();
    const descripcion = document.getElementById('res-fact-descripcion').value.trim();
    const montoUnit = parseFloat(document.getElementById('res-fact-monto').value) || 0;
    const descuento = parseFloat(document.getElementById('res-fact-descuento').value) || 0;
    const total = Math.max(0, montoUnit - descuento);

    if (!nitEmpresa || !nroFactura || !clienteCI || !clienteNombre) {
        showAlert('warning', 'Campos Incompletos', 'Complete todos los campos obligatorios de la factura.');
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pw = pdf.internal.pageSize.getWidth();
        const ph = pdf.internal.pageSize.getHeight();
        const mg = 14; const cw = pw - mg * 2;
        let y = 0;

        const setFont = (size, style = 'normal', color = [50, 50, 50]) => {
            pdf.setFontSize(size); pdf.setFont('helvetica', style); pdf.setTextColor(...color);
        };
        const fillRect = (x, ry, w, h, r, g, b) => {
            pdf.setFillColor(r, g, b); pdf.rect(x, ry, w, h, 'F');
        };

        // Header - color naranja/dorado para reservas
        fillRect(0, 0, pw, 38, 217, 119, 6);
        setFont(16, 'bold', [255, 255, 255]);
        pdf.text(razonSocial, pw / 2, 11, { align: 'center' });
        setFont(9, 'normal', [255, 240, 200]);
        pdf.text(`NIT: ${nitEmpresa}`, pw / 2, 18, { align: 'center' });
        pdf.text(`${direccion} — ${municipio}  |  Tel: ${telefono}  |  Sucursal: ${sucursal}`, pw / 2, 24, { align: 'center' });

        // Badge tipo
        fillRect(pw - mg - 38, 2, 36, 10, 250, 204, 21);
        setFont(8, 'bold', [30, 30, 30]);
        pdf.text(`${tipoFactura} N° ${nroFactura}`, pw - mg - 20, 8.5, { align: 'center' });

        // Badge ADELANTO
        fillRect(mg, 2, 28, 10, 255, 150, 0);
        setFont(7, 'bold', [255, 255, 255]);
        pdf.text('ADELANTO', mg + 14, 8.5, { align: 'center' });
        y = 44;

        // Fecha/CUF
        const ahora = new Date();
        fillRect(mg, y, cw, 11, 255, 251, 235);
        pdf.setDrawColor(217, 119, 6); pdf.setLineWidth(0.3); pdf.rect(mg, y, cw, 11);
        setFont(8, 'normal', [120, 75, 0]);
        pdf.text(`Fecha emisión: ${ahora.toLocaleDateString('es-BO')}`, mg + 3, y + 4.5);
        pdf.text(`Hora: ${ahora.toLocaleTimeString('es-BO')}`, mg + 55, y + 4.5);
        setFont(7, 'normal', [150, 100, 0]);
        pdf.text(`CUF: ${cuf}`, mg + 3, y + 9);
        y += 16;

        // Datos cliente
        setFont(8, 'bold', [217, 119, 6]); pdf.text('DATOS DEL CLIENTE', mg, y); y += 3;
        pdf.setDrawColor(217, 119, 6); pdf.setLineWidth(0.4); pdf.line(mg, y, mg + cw, y); y += 4;
        fillRect(mg, y, cw, 14, 255, 253, 235);
        pdf.setDrawColor(254, 215, 170); pdf.setLineWidth(0.3); pdf.rect(mg, y, cw, 14);
        setFont(8, 'bold', [120, 80, 0]); pdf.text('NIT / CI:', mg + 3, y + 5);
        setFont(9, 'normal', [30, 30, 30]); pdf.text(clienteCI, mg + 22, y + 5);
        setFont(8, 'bold', [120, 80, 0]); pdf.text('Nombre:', mg + 3, y + 11);
        setFont(9, 'bold', [30, 30, 30]); pdf.text(clienteNombre, mg + 22, y + 11);
        y += 19;

        // Tabla
        setFont(8, 'bold', [217, 119, 6]); pdf.text('DETALLE', mg, y); y += 3;
        pdf.setDrawColor(217, 119, 6); pdf.setLineWidth(0.4); pdf.line(mg, y, mg + cw, y); y += 2;

        // Anchos de columna recalculados — igual que en generarPDFFactura
        const RES_COL_W = { desc: 82, cant: 16, precio: 30, dcto: 28 };
        const rc1 = mg + 2;
        const rc2 = rc1 + RES_COL_W.desc;
        const rc3 = rc2 + RES_COL_W.cant;
        const rc4 = rc3 + RES_COL_W.precio;
        const rc5 = mg + cw - 1;

        fillRect(mg, y, cw, 8, 217, 119, 6);
        setFont(8, 'bold', [255, 255, 255]);
        pdf.text('DESCRIPCIÓN', rc1, y + 5.5);
        pdf.text('CANT.', rc2 + RES_COL_W.cant / 2, y + 5.5, { align: 'center' });
        pdf.text('MONTO', rc3, y + 5.5);
        pdf.text('DESCUENTO', rc4, y + 5.5);
        pdf.text('TOTAL', rc5, y + 5.5, { align: 'right' });
        y += 10;

        // Fila dinámica
        const resDescLines = pdf.splitTextToSize(descripcion, RES_COL_W.desc - 4);
        const resRowH = Math.max(10, resDescLines.length * 5 + 4);
        fillRect(mg, y, cw, resRowH, 255, 253, 235);
        pdf.setDrawColor(254, 215, 170); pdf.setLineWidth(0.2); pdf.rect(mg, y, cw, resRowH);
        setFont(8, 'normal', [30, 30, 30]);
        resDescLines.forEach((line, i) => { pdf.text(line, rc1, y + 4 + i * 5); });
        const resCellY = y + resRowH / 2 + 1.5;
        pdf.text('1', rc2 + RES_COL_W.cant / 2, resCellY, { align: 'center' });
        pdf.text(`Bs ${montoUnit.toFixed(2)}`, rc3, resCellY);
        pdf.text(`Bs ${descuento.toFixed(2)}`, rc4, resCellY);
        setFont(9, 'bold', [217, 119, 6]); pdf.text(`Bs ${montoUnit.toFixed(2)}`, rc5, resCellY, { align: 'right' });
        y += resRowH + 2;
        pdf.setDrawColor(200, 180, 140); pdf.setLineWidth(0.3); pdf.line(mg, y, mg + cw, y); y += 3;

        // Total box
        const bx = mg + cw - 80, bw = 80;
        if (descuento > 0) {
            fillRect(bx, y, bw, 7, 252, 252, 252);
            setFont(8, 'normal', [80, 80, 80]); pdf.text('Subtotal:', bx + 3, y + 5);
            setFont(8, 'normal', [30, 30, 30]); pdf.text(`Bs ${montoUnit.toFixed(2)}`, bx + bw - 2, y + 5, { align: 'right' });
            y += 8;
            fillRect(bx, y, bw, 7, 255, 248, 240);
            setFont(8, 'normal', [180, 60, 0]); pdf.text('Descuento:', bx + 3, y + 5);
            pdf.text(`- Bs ${descuento.toFixed(2)}`, bx + bw - 2, y + 5, { align: 'right' });
            y += 9;
        }
        fillRect(bx, y, bw, 12, 217, 119, 6);
        setFont(11, 'bold', [255, 255, 255]);
        pdf.text('TOTAL:', bx + 3, y + 8);
        pdf.text(`Bs ${total.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`, bx + bw - 2, y + 8, { align: 'right' });
        y += 16;

        setFont(8, 'italic', [100, 60, 0]);
        pdf.text(`Son: ${numeroALiteral(total)} BOLIVIANOS`, mg, y); y += 12;

        // QR
        try {
            const qrData = `FAC:${nroFactura}|CUF:${cuf}|NIT:${nitEmpresa}|TOTAL:${total.toFixed(2)}|CLI:${clienteNombre}|TIPO:ADELANTO`;
            const qrCanvas = document.createElement('canvas');
            await QRCode.toCanvas(qrCanvas, qrData, { width: 100, margin: 1 });
            pdf.addImage(qrCanvas.toDataURL('image/png'), 'PNG', mg, y, 28, 28);
            setFont(7, 'normal', [100, 100, 100]);
            pdf.text('Escanea para verificar', mg + 14, y + 31, { align: 'center' });
        } catch (qrErr) { /* QR opcional */ }

        // Firma
        const firmaX = mg + 70;
        pdf.setDrawColor(217, 119, 6); pdf.setLineWidth(0.6);
        pdf.line(firmaX, y + 22, firmaX + 70, y + 22);
        setFont(8, 'normal', [80, 80, 80]);
        pdf.text('Firma y Sello Autorizado', firmaX + 35, y + 27, { align: 'center' });
        setFont(7, 'normal', [120, 120, 120]);
        pdf.text(razonSocial, firmaX + 35, y + 32, { align: 'center' });

        // Footer
        fillRect(0, ph - 12, pw, 12, 217, 119, 6);
        setFont(7, 'normal', [255, 240, 200]);
        pdf.text(APP_CONFIG.pie_pagina + '  |  Este documento es válido como comprobante de adelanto/reserva', pw / 2, ph - 5, { align: 'center' });

        const nombrePDF = `Adelanto_${nroFactura}_${clienteNombre.replace(/\s+/g, '_')}.pdf`;
        pdf.save(nombrePDF);

        // Guardar en Supabase
        try {
            await supabaseClient.from('facturas').insert([{
                nro_factura: nroFactura,
                tipo_factura: 'ADELANTO-' + tipoFactura,
                cuf: cuf,
                nit_empresa: nitEmpresa,
                razon_social_empresa: razonSocial,
                nit_ci_cliente: clienteCI,
                nombre_cliente: clienteNombre,
                descripcion: descripcion,
                cantidad: 1,
                precio_unitario: montoUnit,
                descuento: descuento,
                total: total,
                fecha_emision: new Date().toISOString(),
                usuario_emisor: currentUsername,
                lote_gid: loteReservadoSeleccionado?.gid || null
            }]);
            showAlert('success', '¡Factura de Adelanto Generada!', `La factura <strong>${nroFactura}</strong> de adelanto/reserva fue generada exitosamente.`).then(() => {
                document.getElementById('factura-reserva-modal').classList.remove('active');
            });
        } catch (dbErr) {
            // El PDF se generó correctamente pero falló el guardado en BD
            console.error('Error guardando factura de reserva en Supabase:', dbErr);
            showToast('error', 'PDF generado, pero no se pudo guardar en la base de datos.');
        }
    } catch (err) {
        showAlert('error', 'Error al Generar', 'No se pudo generar la factura de adelanto: ' + err.message);
    }
}

console.log('🗺️ Geoportal v2.0 inicializado');
console.log('✨ Funcionalidades activas:');
console.log('   ✅ Visualización 3D con relieve del terreno');
console.log('   ✅ Sistema de autenticación');
console.log('   ✅ Estados: DISPONIBLE→RESERVADO (con datos de reserva)');
console.log('   ✅ Estados: DISPONIBLE/RESERVADO→VENDIDO (con formulario completo + cuotas + CI)');
console.log('   ✅ Estados: Confirmación para volver a DISPONIBLE');
console.log('   ✅ Módulo de cobros — solo lotes VENDIDOS, ordenados por Mz/Lote');
console.log('   ✅ Descuento automático de monto reserva en primera cuota');
console.log('   ✅ Módulo de Facturación con QR y PDF');
console.log('   ✅ Dashboard con estadísticas y PDF');
console.log('   ✅ Módulo de Reportes: ventas por vendedor + clientes + PDF');
console.log('   ✅ Botón WhatsApp');
console.log('   ✅ Exportación a Excel');
console.log('   ✅ Persistencia de estado del mapa');
/* =====================================================
   LOADING OVERLAY — desactivado
   El overlay fue removido del HTML. Este objeto se
   mantiene como no-op para no romper las llamadas
   existentes en el código de carga de capas.
   ===================================================== */
const LoadingManager = {
    pasos: [], paso_actual: 0,
    set()      { /* no-op */ },
    siguiente(){ /* no-op */ },
    ocultar()  { /* no-op */ }
};

// Sin overlay activo — nada que ocultar al cargar el mapa

/* =====================================================
   LEYENDA FILTRABLE — Hacer clic filtra el mapa
   ===================================================== */
function inicializarLeyendaFiltrable() {
    const items = document.querySelectorAll('.sidebar-legend .legend-item');
    const filtrosActivos = new Set(['DISPONIBLE', 'RESERVADO', 'VENDIDO']);

    // Sincronizar colores de la leyenda desde COLOR_PALETTE (fuente única de verdad)
    const colorMap = {
        'DISPONIBLE': COLOR_PALETTE.lotes.disponible,
        'RESERVADO':  COLOR_PALETTE.lotes.reservado,
        'VENDIDO':    COLOR_PALETTE.lotes.vendido
    };

    items.forEach(item => {
        const estadoSpan = item.querySelector('span:last-child');
        if (!estadoSpan) return;
        const estado = estadoSpan.textContent.trim();

        // Actualizar color del círculo desde COLOR_PALETTE
        const colorDot = item.querySelector('.legend-color');
        if (colorDot && colorMap[estado]) {
            colorDot.style.background = colorMap[estado];
        }

        item.setAttribute('data-estado', estado);
        item.setAttribute('title', `Clic para filtrar: ${estado}`);

        // Agregar contador
        const countBadge = document.createElement('span');
        countBadge.className = 'legend-count';
        countBadge.id = `legend-count-${estado}`;
        item.appendChild(countBadge);

        item.addEventListener('click', () => {
            if (filtrosActivos.has(estado)) {
                filtrosActivos.delete(estado);
                item.classList.add('filtro-inactivo');
            } else {
                filtrosActivos.add(estado);
                item.classList.remove('filtro-inactivo');
            }
            aplicarFiltroLeyenda(filtrosActivos);
        });
    });
    // Los contadores se actualizan en map.on('load') tras cargar todos los datos
}

function aplicarFiltroLeyenda(filtrosActivos) {
    Object.keys(urbData).forEach(urb => {
        const fillLayerId = `lotes-${urb}-fill`;
        const lineLayerId = `lotes-${urb}-line`;
        if (!map.getLayer(fillLayerId)) return;

        if (filtrosActivos.size === 3 || filtrosActivos.size === 0) {
            // Todos activos o todos inactivos — mostrar todo
            map.setFilter(fillLayerId, null);
            map.setFilter(lineLayerId, null);
        } else {
            const estadosArray = Array.from(filtrosActivos);
            const filterExpr = ['in', ['get', 'estado'], ['literal', estadosArray]];
            map.setFilter(fillLayerId, filterExpr);
            map.setFilter(lineLayerId, filterExpr);
        }
    });
}

function actualizarContadoresLeyenda() {
    const conteos = { DISPONIBLE: 0, RESERVADO: 0, VENDIDO: 0 };
    Object.values(urbData).forEach(urb => {
        (urb.lotes || []).forEach(f => {
            const est = f.properties.estado;
            if (est in conteos) conteos[est]++;
        });
    });
    Object.entries(conteos).forEach(([estado, n]) => {
        const el = document.getElementById(`legend-count-${estado}`);
        if (el) el.textContent = n > 0 ? `(${n})` : '';
    });
}

// Inicializar leyenda filtrable y campos de factura al cargar
document.addEventListener('DOMContentLoaded', () => {
    inicializarLeyendaFiltrable();
    inicializarCamposFactura();
});

/* =====================================================
   HAMBURGER MENU — Header en móvil
   ===================================================== */
const headerMenuToggle = document.getElementById('header-menu-toggle');
const headerActions = document.getElementById('header-actions');

if (headerMenuToggle && headerActions) {
    headerMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        headerActions.classList.toggle('open');
        const icon = headerMenuToggle.querySelector('i');
        if (icon) {
            icon.className = headerActions.classList.contains('open')
                ? 'fas fa-times'
                : 'fas fa-bars';
        }
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!headerActions.contains(e.target) && !headerMenuToggle.contains(e.target)) {
            headerActions.classList.remove('open');
            const icon = headerMenuToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
    });

    // Cerrar al hacer clic en un botón del menú
    headerActions.querySelectorAll('.header-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            headerActions.classList.remove('open');
            const icon = headerMenuToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        });
    });
}

