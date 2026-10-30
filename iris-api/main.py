

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware





# --------------------------------------------------
# IMPORTAR MOTOR IRIS
# --------------------------------------------------

from kinematics import (
    analizar_escenario,
    escenario_normal,
    escenario_sospechoso
)


# --------------------------------------------------
# API
# --------------------------------------------------

app = FastAPI(title="IRIS API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# RUTA PRINCIPAL
# --------------------------------------------------

@app.get("/")
def inicio():
    return {
        "mensaje": "IRIS API funcionando"
    }


# --------------------------------------------------
# ANALIZAR ESCENARIO
# --------------------------------------------------

@app.get("/analizar/{escenario}")
def analizar(escenario: str):

    if escenario == "normal":
        registros = escenario_normal

    elif escenario == "sospechoso":
        registros = escenario_sospechoso

    else:
        return {
            "error": "Escenario no válido",
            "opciones": [
                "normal",
                "sospechoso"
            ]
        }

    resultado = analizar_escenario(registros)

    return resultado