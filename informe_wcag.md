# Informe de Auditoría y Corrección de Accesibilidad (WCAG 2.2)

**Módulo:** Perfil e Historial Médico del Paciente
**Fecha:** Abril 2026

---

## 1. Introducción

El presente informe detalla la auditoría de accesibilidad realizada sobre las vistas de carga de datos médicos del sistema. Dado que la aplicación será utilizada tanto por personal de salud en situaciones de urgencia como por pacientes con diversas necesidades (movilidad reducida, neurodiversidad, etc.), es imperativo garantizar una experiencia de usuario sin barreras.

Se adoptaron los estándares **WCAG 2.2 (Nivel AA)** para asegurar la máxima compatibilidad y accesibilidad.

## 2. Metodología de Evaluación

Para la detección de oportunidades de mejora se utilizó un enfoque mixto:

1. **Auditoría Estática Automática:** Escaneo del código fuente (`.ejs`) utilizando la herramienta _axe Accessibility Linter_ integrada en el entorno de desarrollo.
2. **Auditoría Manual y Navegabilidad:** Pruebas empíricas de navegación usando exclusivamente el teclado (teclas `Tab`, `Enter`, `Espacio`) y lectores de pantalla básicos.

## 3. Hallazgos y Plan de Acción (Correcciones Implementadas)

### 3.1. Imágenes e Íconos Decorativos (Criterio 1.1.1 - Non-text Content)

- **Problema detectado:** Al agregar íconos personalizados (`.png`) en los encabezados de los acordeones (Ej: sección "Cuidado Personal" e "Historial Médico"), las etiquetas `<img>` carecían de descripciones alternativas, lo que genera confusión en lectores de pantalla.
- **Solución técnica:** Se agregó el atributo `alt` descriptivo a cada imagen (ej: `alt="Ícono de estetoscopio y corazón"`). En caso de ser puramente decorativos, se dejó `alt=""` para que el lector de pantalla los ignore correctamente en lugar de leer el nombre del archivo.

### 3.2. Tamaño del Área de Interacción (Criterio 2.5.8 - Target Size Minimum - Nuevo en 2.2)

- **Problema detectado:** Los _checkboxes_ nativos para las opciones "El paciente tiene epilepsia" y "¿Tiene otro tipo de crisis?" resultaban difíciles de clickear en dispositivos móviles debido a su tamaño por defecto.
- **Solución técnica:** Se reestructuró el HTML envolviendo el `<input type="checkbox">` y su `<label>` dentro de un mismo contenedor clickeable con clases de Tailwind (`flex items-center p-4 cursor-pointer`). Esto amplía el área de interacción a más de los 24x24 píxeles mínimos exigidos por la normativa.

### 3.3. Foco Visible en Formularios (Criterio 2.4.11 - Focus Not Obscured - Nuevo en 2.2)

- **Problema detectado:** Al navegar exclusivamente con teclado por los extensos formularios de "Emociones y Preferencias", no quedaba claro en qué campo de texto (`textarea`) se encontraba el usuario.
- **Solución técnica:** Se implementaron clases de pseudo-estados en Tailwind (`focus:ring-4 focus:ring-violet-50 focus:border-violet-400`) para generar un contorno visual fuerte y contrastante alrededor de los _inputs_ y _textareas_ activos, garantizando que el foco nunca quede oculto ni difuminado.

### 3.4. Relación Lógica de Formularios (Criterio 1.3.1 - Info and Relationships)

- **Problema detectado:** El botón principal para desplegar los acordeones (`<button class="accordion-trigger">`) no informaba a las tecnologías de asistencia si el contenido debajo estaba expandido o colapsado.
- **Solución técnica:** Se agregó el atributo dinámico `aria-expanded="false"` (o `true` vía JavaScript) a los botones desencadenadores para transmitir el estado de la interfaz correctamente.

## 4. Conclusión

La implementación de las directrices WCAG 2.2 en las vistas del historial médico no solo cumple con estándares internacionales de calidad de software, sino que impacta directamente en la seguridad y eficiencia del sistema. Al optimizar la carga cognitiva y facilitar la navegación por teclado, se asegura que la información vital del paciente pueda ser cargada y consultada bajo cualquier circunstancia y por cualquier usuario, independientemente de sus capacidades físicas o tecnológicas.
