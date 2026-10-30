# IRIS

## Maritime Intelligence & Risk Identification System

IRIS es un prototipo de sistema de inteligencia marítima diseñado para identificar comportamientos potencialmente anómalos o sospechosos de embarcaciones a partir de información estructurada de navegación.

El sistema combina análisis cinemático y reglas explícitas de evaluación de riesgo para generar una valoración consolidada que puede apoyar la labor de un operador.

El MVP utiliza escenarios sintéticos y controlados para demostrar el funcionamiento del sistema. La integración con datos AIS reales constituye una etapa futura.

---

## Objetivo

Desarrollar un prototipo capaz de analizar el comportamiento registrado de una embarcación y detectar señales de riesgo, transformando datos de navegación en información estructurada para apoyar la toma de decisiones.

IRIS busca demostrar cómo la automatización y el análisis de datos pueden apoyar la identificación de comportamientos marítimos anómalos y la priorización de casos para una revisión posterior.

---

## ¿Qué analiza IRIS?

El prototipo evalúa diferentes señales relacionadas con la identidad y el comportamiento registrado de una embarcación, entre ellas:

- Anomalías cinemáticas.
- Identificación de MMSI sospechoso.
- Comportamiento de Going dark.
- Nivel de riesgo consolidado.
- Risk Score de 0 a 100.

Estas señales se utilizan como indicadores de riesgo y no constituyen por sí mismas una prueba de actividad ilícita.

---

## ¿Cómo funciona?

El flujo principal de IRIS es:


Datos de navegación
        ↓
Análisis cinemático
        ↓
Detección de señales
        ↓
Evaluación de riesgo
        ↓
IRIS Risk Score
        ↓
Nivel de riesgo
        ↓
Resultado para el operador


El motor cinemático analiza los registros de navegación y calcula variables como distancia, intervalo temporal y velocidad.

Posteriormente, IRIS aplica reglas explícitas para identificar señales de anomalía y consolida los resultados en un Risk Score heurístico de 0 a 100, junto con un nivel de riesgo.

---

## Arquitectura

IRIS está compuesto por una interfaz web, una API de análisis y un motor cinemático que procesa las señales para generar una evaluación de riesgo.


┌─────────────────────────────┐
│          Frontend           │
│      Next.js + React        │
│       + Tailwind CSS        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        Backend API          │
│           FastAPI           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      Motor cinemático       │
│   Análisis de movimiento    │
│        y señales            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Evaluación IRIS       │
│     Score + nivel de riesgo │
└─────────────────────────────┘


### Flujo de análisis

1. El usuario selecciona un escenario desde la interfaz web.
2. El frontend envía la solicitud a la API de IRIS.
3. FastAPI procesa la solicitud y ejecuta el motor cinemático.
4. El motor analiza las señales y detecta posibles anomalías.
5. IRIS calcula un Risk Score y asigna un nivel de riesgo.
6. Los resultados son mostrados al operador mediante la interfaz web.

---

## Tecnologías utilizadas

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Leaflet

### Backend

- Python
- FastAPI
- Uvicorn

### Desarrollo

- Git
- GitHub
- Visual Studio Code

---

## Escenarios de prueba

El prototipo incluye dos escenarios sintéticos y controlados para demostrar el funcionamiento del sistema.

### 🟢 Escenario normal

Resultado:

- Nivel de riesgo: BAJO
- Score: 0/100
- No se detectaron señales de riesgo relevantes.

### 🔴 Escenario sospechoso

Resultado:

- Nivel de riesgo: ALTO
- Score: 70/100

Se detectaron:

- Anomalía cinemática.
- MMSI sospechoso.
- Going dark.

IRIS genera además un resultado estructurado para el operador indicando que se recomienda una investigación o validación posterior.

El escenario es sintético y no representa un incidente marítimo real.

---

## Resultado obtenido

El prototipo demuestra que es posible transformar registros de navegación en una evaluación de riesgo automatizada y explicable.

En el escenario sospechoso, IRIS identifica múltiples señales y las consolida en un score de 70/100, clasificando el escenario como de riesgo ALTO.

El Risk Score utilizado en el MVP corresponde a una configuración heurística inicial y deberá ser calibrado y validado mediante datos reales antes de una eventual utilización operacional.

---

## Inteligencia artificial generativa

El MVP contempla una simulación de la interacción con inteligencia artificial generativa para demostrar cómo los resultados técnicos podrían transformarse en un reporte orientado al operador.

La detección principal permanece basada en cálculos y reglas deterministas.

La integración con una API o modelo generativo real constituye una etapa posterior de desarrollo.

---

## Estructura principal


IRIS/
├── DOCUMENTO_FINAL.pdf
├── PRESENTACION_FINAL.pdf
├── IRIS_EL_GUARDIAN_DEL_MAR_VIDEO_FINAL.mp4
├── README.md
├── LICENSE
├── .gitignore
│
├── iris-api/
│   ├── main.py
│   ├── kinematics.py
│   └── requirements.txt
│
└── iris-web/
    ├── app/
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    │
    ├── components/
    │   └── MapaIRIS.tsx
    │
    ├── public/
    │   ├── file.svg
    │   ├── globe.svg
    │   ├── imagen_web.jpg
    │   ├── next.svg
    │   ├── vercel.svg
    │   └── window.svg
    │
    ├── package.json
    ├── package-lock.json
    ├── next.config.ts
    ├── postcss.config.mjs
    ├── eslint.config.mjs
    ├── tsconfig.json
    └── next-env.d.ts


---

## Requisitos previos

Para ejecutar el MVP localmente se requiere:

- Python 3.x
- Node.js y npm
- Git (opcional, si se clona el repositorio)

---

## Instalación y ejecución

IRIS utiliza un backend desarrollado en Python/FastAPI y un frontend desarrollado con Next.js.

Para ejecutar el MVP localmente se recomienda utilizar dos terminales.

### 1. Backend — API de IRIS

Abrir una terminal y dirigirse a la carpeta del backend:


cd iris-api


Instalar las dependencias:


pip install -r requirements.txt


Iniciar la API:


uvicorn main:app --reload


La API quedará disponible en:


http://127.0.0.1:8000


### 2. Frontend — interfaz web

Abrir una segunda terminal y dirigirse a la carpeta del frontend:


cd iris-web


Instalar las dependencias:


npm install


Una vez finalizada la instalación, iniciar el servidor de desarrollo:


npm run dev


La aplicación estará disponible normalmente en:


http://localhost:3000


> Importante: el backend debe permanecer ejecutándose en la primera terminal mientras se utiliza la interfaz web.

---

## Alcance del prototipo

IRIS es un MVP desarrollado con fines demostrativos y académicos, orientado a la identificación de anomalías y señales de riesgo marítimo.

Los escenarios utilizados actualmente son sintéticos y controlados, por lo que no representan incidentes marítimos reales ni un sistema operativo de vigilancia marítima.

El sistema no determina que una embarcación esté cometiendo una actividad ilegal. Los resultados representan inconsistencias o señales que pueden justificar una posterior investigación o validación operativa.

El resultado generado por IRIS debe considerarse como apoyo a la evaluación y priorización, y no como una decisión definitiva sobre una embarcación o actividad.

Una eventual confirmación de una anomalía o actividad ilícita requeriría contrastar los resultados con otras fuentes de información y con los procedimientos de investigación correspondientes.

Actualmente, el MVP no integra directamente fuentes institucionales ni sistemas AIS reales.

---

## Trabajo futuro

Como prototipo, IRIS puede evolucionar incorporando:

- Integración con datos AIS reales.
- Monitoreo continuo de embarcaciones.
- Alertas automáticas.
- Mayor cantidad de reglas de detección.
- Integración con fuentes de inteligencia marítima.
- Historial y seguimiento de incidentes.
- Modelos de análisis predictivo.
- Integración con sistemas institucionales de monitoreo y respuesta.
- Validación experimental con datos reales.

---

## Documentación del proyecto

En este repositorio se incluyen:

- DOCUMENTO_FINAL.pdf — Documento completo del proyecto.
- PRESENTACION_FINAL.pdf — Presentación utilizada para la exposición.
- IRIS_EL_GUARDIAN_DEL_MAR_VIDEO_FINAL.mp4 — Video demostrativo y pitch del proyecto.

---

## Proyecto

IRIS — Maritime Intelligence & Risk Identification System

Proyecto final — WomenCISO4 / MenCISO Gen 1

El Guardián del Mar
