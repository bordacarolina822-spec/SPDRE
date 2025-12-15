let currentStep = 1;
let selectedResource = null;
let patientValidated = false;
let tempId = null;

function cambiarPaso(step) {
    // Ocultar paso actual
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.progress-step').forEach(s => {
        s.classList.remove('active');
        if (parseInt(s.dataset.step) < step) {
            s.classList.add('completed');
        } else {
            s.classList.remove('completed');
        }
    });

    // Mostrar nuevo paso
    currentStep = step;
    document.getElementById('step' + step).classList.add('active');
    document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');

    // Si es el paso 3, llenar el resumen
    if (step === 3) {
        llenarResumen();
    }

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validarPaciente() {
    // Simular validación con HSI sin validar campos
    const loadingAlert = document.createElement('div');
    loadingAlert.className = 'alert alert-info';
    loadingAlert.innerHTML = '<span>⏳</span><div><strong>Consultando HSI...</strong></div>';
    
    const form = document.querySelector('#step1');
    form.insertBefore(loadingAlert, form.querySelector('.button-group'));

    setTimeout(() => {
        loadingAlert.remove();
        
        // Simular falla de HSI (30% de probabilidad para demo)
        const hsiSuccess = Math.random() > 0.3;
        
        if (hsiSuccess) {
            patientValidated = true;
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success';
            successAlert.innerHTML = '<span>✓</span><div><strong>Paciente validado exitosamente con HSI</strong></div>';
            form.insertBefore(successAlert, form.querySelector('.button-group'));
            
            setTimeout(() => {
                cambiarPaso(2);
            }, 1500);
        } else {
            // Activar Protocolo de Paciente Temporal
            patientValidated = false;
            tempId = 'TEMP_' + Date.now();
            
            const warningAlert = document.createElement('div');
            warningAlert.className = 'alert alert-warning';
            warningAlert.innerHTML = `
                <span>⚠️</span>
                <div>
                    <strong>No se pudo conectar con HSI</strong>
                    <p>Se activará el Protocolo de Paciente Temporal para continuar con la atención de emergencia.</p>
                </div>
            `;
            form.insertBefore(warningAlert, form.querySelector('.button-group'));
            
            setTimeout(() => {
                document.getElementById('tempIdAlert').style.display = 'flex';
                document.getElementById('tempIdDisplay').textContent = 'ID: ' + tempId;
                cambiarPaso(2);
            }, 1500);
        }
    }, 2000);
}

function selectResource(element, resourceType) {
    // Remover selección previa
    document.querySelectorAll('.resource-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Seleccionar nuevo recurso
    element.classList.add('selected');
    selectedResource = {
        type: resourceType,
        name: element.querySelector('.resource-name').textContent
    };
}

// REEMPLAZA tu función llenarResumen() con esta versión mejorada:
function llenarResumen() {
    // Datos del paciente (con valores por defecto si están vacíos)
    document.getElementById('summaryDni').textContent = 
        document.getElementById('dni').value || 'No especificado';
    
    document.getElementById('summaryNombre').textContent = 
        (document.getElementById('nombres').value + ' ' + document.getElementById('apellidos').value).trim() || 'No especificado';
    
    document.getElementById('summaryEdad').textContent = 
        document.getElementById('edad').value ? document.getElementById('edad').value + ' años' : 'No especificada';
    
    // Estado de validación
    if (patientValidated) {
        document.getElementById('summaryValidacion').innerHTML = 
            '<span style="color: var(--success-color);">✓ Validado con HSI</span>';
    } else if (tempId) {
        document.getElementById('summaryValidacion').innerHTML = 
            `<span style="color: var(--warning-color);">⚠️ ID Temporal: ${tempId}</span>`;
    } else {
        document.getElementById('summaryValidacion').innerHTML = 
            '<span style="color: var(--text-muted);">No validado</span>';
    }

    // Datos de la emergencia
    const prior = document.querySelector('input[name="prioridad"]:checked');
    const priorTexts = {
        'critico': '🔴 Crítico',
        'urgente': '🟠 Urgente',
        'programado': '🟡 Programado'
    };
    document.getElementById('summaryPrioridad').textContent = 
        prior ? priorTexts[prior.value] : 'No especificada';
    
    document.getElementById('summaryDiagnostico').textContent = 
        document.getElementById('diagnosticoPresuntivo').value || 'No especificado';
    
    document.getElementById('summaryRecurso').textContent = 
        selectedResource ? selectedResource.name : 'No seleccionado';
    
    document.getElementById('summaryMotivo').textContent = 
        document.getElementById('motivoConsulta').value || 'No especificado';
    
    // NUEVO: Agregar CAPS de origen
    const capsOrigen = document.getElementById('capsOrigen').value;
    const capsOrigenElement = document.createElement('div');
    capsOrigenElement.className = 'summary-item';
    capsOrigenElement.innerHTML = `
        <span class="summary-label">CAPS de Origen:</span>
        <span class="summary-value">${obtenerNombreCAPS(capsOrigen)}</span>
    `;
    
    // NUEVO: Agregar Hospital destino
    const hospitalDestino = document.getElementById('hospitalDestino').value;
    const hospitalDestinoElement = document.createElement('div');
    hospitalDestinoElement.className = 'summary-item';
    hospitalDestinoElement.innerHTML = `
        <span class="summary-label">Hospital Destino:</span>
        <span class="summary-value">${obtenerNombreHospital(hospitalDestino)}</span>
    `;
    
    // Insertar estos nuevos elementos en el resumen
    const summarySection = document.querySelectorAll('.summary-section')[0];
    summarySection.appendChild(capsOrigenElement);
    
    const emergencySummary = document.querySelectorAll('.summary-section')[1];
    emergencySummary.appendChild(hospitalDestinoElement);
}

// REEMPLAZA tu función enviarSolicitud() con esta versión:
function enviarSolicitud() {
    // Ocultar el formulario
    document.getElementById('step3').classList.remove('active');
    
    // Mostrar pantalla de carga
    document.getElementById('loadingScreen').classList.add('active');

    // Simular envío al servidor
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.remove('active');
        
        // Mostrar pantalla de éxito
        document.getElementById('successScreen').classList.add('active');
        
        // Llenar datos de confirmación
        const solicitudIdGen = 'SPDR-' + Date.now();
        document.getElementById('solicitudId').textContent = solicitudIdGen;
        
        const now = new Date();
        document.getElementById('horaEnvio').textContent = 
            now.toLocaleTimeString('es-AR') + ' - ' + now.toLocaleDateString('es-AR');
        
        // MODIFICADO: Usar hospital seleccionado o asignar óptimo
        let hospitalFinal = document.getElementById('hospitalDestino').value;
        if (!hospitalFinal) {
            hospitalFinal = seleccionarHospitalOptimo();
        }
        
        // CAMBIO AQUÍ: usar hospitalDestinoFinal en lugar de hospitalDestino
        document.getElementById('hospitalDestinoFinal').textContent = obtenerNombreHospital(hospitalFinal);

        // Actualizar barra de progreso
        document.querySelectorAll('.progress-step').forEach(s => {
            s.classList.add('completed');
            s.classList.remove('active');
        });
    }, 3000);
}
// REEMPLAZA tu función nuevaSolicitud() con esta versión:
function nuevaSolicitud() {
    // Resetear formulario
    document.getElementById('dni').value = '';
    document.getElementById('nombres').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('edad').value = '';
    document.getElementById('genero').value = '';
    document.getElementById('capsOrigen').value = ''; // NUEVO
    document.getElementById('hospitalDestino').value = ''; // NUEVO
    document.getElementById('motivoConsulta').value = '';
    document.getElementById('diagnosticoPresuntivo').value = '';
    document.getElementById('observaciones').value = '';
    
    // Limpiar selección de radio buttons
    document.querySelectorAll('input[name="prioridad"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Limpiar selección de recursos
    document.querySelectorAll('.resource-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Resetear variables
    currentStep = 1;
    selectedResource = null;
    patientValidated = false;
    tempId = null;
    
    // Ocultar alerta de ID temporal
    document.getElementById('tempIdAlert').style.display = 'none';
    
    // Volver al paso 1
    document.getElementById('successScreen').classList.remove('active');
    cambiarPaso(1);
}

// ============================================
// NUEVAS FUNCIONES PARA CAPS Y HOSPITALES
// ============================================

// Mapeo de nombres legibles
const capsNombres = {
    'caps_eva_peron': 'CAPS Eva Perón',
    'caps_virgen_cerros': 'CAPS Virgen de los Cerros',
    'caps_san_vicente': 'CAPS San Vicente de Paul',
    'caps_cochangasta': 'CAPS Cochangasta',
    'caps_sanagasta': 'CAPS Sanagasta',
    'caps_los_talas': 'CAPS Los Talas',
    'caps_castro_barros': 'CAPS Castro Barros',
    'caps_la_cruz': 'CAPS La Cruz',
    'caps_breakman': 'CAPS Breakman',
    'caps_el_brete': 'CAPS El Brete'
};

const hospitalNombres = {
    'hospital_vera_barros': 'Hospital Provincial Dr. Enrique Vera Barros',
    'hospital_madre_nino': 'Hospital de la Madre y el Niño',
    'hospital_perrando': 'Hospital Perrando',
    'hospital_san_juan': 'Hospital San Juan de Dios',
    'hospital_angel_padilla': 'Hospital Dr. Ángel C. Padilla'
};

// Función para obtener nombre legible del CAPS
function obtenerNombreCAPS(codigo) {
    return capsNombres[codigo] || 'CAPS no especificado';
}

// Función para obtener nombre legible del Hospital
function obtenerNombreHospital(codigo) {
    if (!codigo) return 'Sistema seleccionará automáticamente';
    return hospitalNombres[codigo] || 'Hospital no especificado';
}

// Función para seleccionar hospital óptimo automáticamente
function seleccionarHospitalOptimo() {
    const hospitalesDisponibles = Object.keys(hospitalNombres);
    const hospitalAleatorio = hospitalesDisponibles[Math.floor(Math.random() * hospitalesDisponibles.length)];
    return hospitalAleatorio;
}