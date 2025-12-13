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
}

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
        
        // Simular selección de hospital óptimo
        const hospitales = [
            'Hospital Provincial Dr. Enrique Vera Barros',
            'Hospital de la Madre y el Niño',
            'Hospital Perrando'
        ];
        const hospitalSeleccionado = hospitales[Math.floor(Math.random() * hospitales.length)];
        document.getElementById('hospitalDestino').textContent = hospitalSeleccionado;

        // Actualizar barra de progreso
        document.querySelectorAll('.progress-step').forEach(s => {
            s.classList.add('completed');
            s.classList.remove('active');
        });
    }, 3000);
}

function nuevaSolicitud() {
    // Resetear formulario
    document.getElementById('dni').value = '';
    document.getElementById('nombres').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('edad').value = '';
    document.getElementById('genero').value = '';
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