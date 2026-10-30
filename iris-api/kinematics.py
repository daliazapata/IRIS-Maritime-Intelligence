import math
import datetime


# ==================================================
# FUNCIONES DE CÁLCULO
# ==================================================

def segundos_a_horas(tiempo):
    """
    Convierte segundos a horas.
    """
    return tiempo / 3600


def velocidad(distancia, tiempo):
    """
    Calcula velocidad en km/h.
    """
    if tiempo <= 0:
        return 0

    return distancia / segundos_a_horas(tiempo)


def nudos(velocidad_kmh):
    """
    Convierte km/h a nudos.
    """
    return velocidad_kmh / 1.852


def distancia_haversine(
    latitud_a,
    longitud_a,
    latitud_b,
    longitud_b
):
    """
    Calcula la distancia entre dos coordenadas
    geográficas usando la fórmula de Haversine.
    """

    latitud_a_rad = math.radians(latitud_a)
    longitud_a_rad = math.radians(longitud_a)

    latitud_b_rad = math.radians(latitud_b)
    longitud_b_rad = math.radians(longitud_b)

    delta_latitud = latitud_b_rad - latitud_a_rad
    delta_longitud = longitud_b_rad - longitud_a_rad

    radio = 6371  # km

    a = (
        math.sin(delta_latitud / 2) ** 2
        + math.cos(latitud_a_rad)
        * math.cos(latitud_b_rad)
        * math.sin(delta_longitud / 2) ** 2
    )

    raiz_a = math.sqrt(a)
    raiz_1_a = math.sqrt(1 - a)

    angulo = 2 * math.atan2(
        raiz_a,
        raiz_1_a
    )

    return radio * angulo


# ==================================================
# REGLAS DE DETECCIÓN
# ==================================================

def detectar_anomalia_velocidad(
    velocidad_calculada,
    velocidad_ais,
    tolerancia
):
    """
    Compara la velocidad calculada con la velocidad AIS.
    """

    diferencia = abs(
        velocidad_calculada - velocidad_ais
    )

    if diferencia > tolerancia:
        return True, diferencia

    return False, diferencia


def detectar_movimiento_imposible(
    velocidad_requerida,
    velocidad_maxima
):
    """
    Detecta si la velocidad requerida supera
    la velocidad máxima configurada.
    """

    return velocidad_requerida > velocidad_maxima


def detectar_mmsi_sospechoso(
    mmsi,
    lista_sospechosos
):
    """
    Comprueba si el MMSI pertenece a una lista
    de identificadores considerados sospechosos.
    """

    return mmsi in lista_sospechosos


def detectar_going_dark(
    segundos,
    intervalo_maximo
):
    """
    Detecta un intervalo de transmisión superior
    al máximo esperado.

    En este MVP representa una señal sospechosa,
    no una confirmación de apagado intencional del AIS.
    """

    return segundos > intervalo_maximo


# ==================================================
# GENERACIÓN DE INFORME
# ==================================================

def generar_informe_ia(resultado):
    """
    Genera un informe local basado en el resultado IRIS.

    Actualmente es una simulación de la capa de IA.
    """

    if resultado["riesgo"] == "ALTO":

        informe = (
            f"La embarcación con MMSI "
            f"{resultado['mmsi']} presenta "
            f"un nivel de riesgo ALTO con un score de "
            f"{resultado['score']}. "
        )

        if resultado["señales"]:
            informe += (
                "Se detectaron las siguientes señales: "
            )

            informe += (
                ", ".join(resultado["señales"])
                + ". "
            )

        informe += (
            "Se recomienda investigación "
            "por parte del operador."
        )

    elif resultado["riesgo"] == "MEDIO":

        informe = (
            f"La embarcación con MMSI "
            f"{resultado['mmsi']} presenta "
            f"un nivel de riesgo MEDIO con un score de "
            f"{resultado['score']}. "
            "Se recomienda revisar las señales detectadas."
        )

    else:

        informe = (
            f"La embarcación con MMSI "
            f"{resultado['mmsi']} presenta "
            f"un nivel de riesgo BAJO con un score de "
            f"{resultado['score']}. "
            "No se detectaron señales relevantes."
        )

    return informe


# ==================================================
# DATOS DE CONFIGURACIÓN
# ==================================================

hora_a = datetime.datetime(
    2026, 9, 3, 10, 0, 0
)

hora_b = datetime.datetime(
    2026, 9, 3, 10, 30, 0
)


latitud_a = -12.05
longitud_a = -77.30

latitud_b = -12.06
longitud_b = -77.32


velocidad_ais_a = 1.68
velocidad_ais_b = 1.68


# MMSI considerados sospechosos
lista_sospechosos = [
    "123456789"
]


# Parámetros del motor
tolerancia_velocidad = 5
intervalo_maximo = 3600
velocidad_maxima = 30


# ==================================================
# ESCENARIO NORMAL
# ==================================================

registro_a = {
    "hora": hora_a,
    "latitud": latitud_a,
    "longitud": longitud_a,
    "velocidad": velocidad_ais_a,
    "mmsi": "111111111"
}


registro_b = {
    "hora": hora_b,
    "latitud": latitud_b,
    "longitud": longitud_b,
    "velocidad": velocidad_ais_b,
    "mmsi": "111111111"
}


hora_c = datetime.datetime(
    2026, 9, 3, 11, 0, 0
)


registro_c = {
    "hora": hora_c,
    "latitud": -12.07,
    "longitud": -77.34,
    "velocidad": 1.68,
    "mmsi": "111111111"
}


escenario_normal = [
    registro_a,
    registro_b,
    registro_c
]


# ==================================================
# ESCENARIO SOSPECHOSO
# ==================================================

registro_c_sospechoso = {
    "hora": datetime.datetime(
        2026, 9, 3, 13, 0, 0
    ),
    "latitud": -12.50,
    "longitud": -78.50,
    "velocidad": 1.68,
    "mmsi": "123456789"
}


escenario_sospechoso = [
    registro_a,
    registro_b,
    registro_c_sospechoso
]

# ==================================================
# MOTOR IRIS
# ==================================================

def analizar_escenario(registros_ais):
    """
    Analiza una secuencia de registros AIS
    y devuelve el resultado consolidado de IRIS.
    """

    if not registros_ais:
        return {
            "mmsi": None,
            "riesgo": "BAJO",
            "score": 0,
            "señales": []
        }

    score_total = 0
    señales_total = []

    for i in range(len(registros_ais) - 1):

        registro_actual = registros_ais[i]
        registro_siguiente = registros_ais[i + 1]

        # ------------------------------------------
        # DISTANCIA
        # ------------------------------------------

        distancia_km = distancia_haversine(
            registro_actual["latitud"],
            registro_actual["longitud"],
            registro_siguiente["latitud"],
            registro_siguiente["longitud"]
        )

        # ------------------------------------------
        # TIEMPO
        # ------------------------------------------

        tiempo_transcurrido = (
            registro_siguiente["hora"]
            - registro_actual["hora"]
        )

        segundos = tiempo_transcurrido.total_seconds()

        # ------------------------------------------
        # GOING DARK
        # ------------------------------------------

        going_dark = detectar_going_dark(
            segundos,
            intervalo_maximo
        )

        # ------------------------------------------
        # VELOCIDAD REQUERIDA
        # ------------------------------------------

        velocidad_calculada = velocidad(
            distancia_km,
            segundos
        )

        velocidad_calculada_nudos = nudos(
            velocidad_calculada
        )

        # ------------------------------------------
        # VELOCIDAD AIS
        # ------------------------------------------

        velocidad_ais = (
            registro_siguiente["velocidad"]
        )

        # ------------------------------------------
        # MMSI
        # ------------------------------------------

        mmsi = registro_siguiente["mmsi"]

        mmsi_sospechoso = (
            detectar_mmsi_sospechoso(
                mmsi,
                lista_sospechosos
            )
        )

        # ------------------------------------------
        # MOVIMIENTO IMPOSIBLE
        # ------------------------------------------

        movimiento_imposible = (
            detectar_movimiento_imposible(
                velocidad_calculada_nudos,
                velocidad_maxima
            )
        )

        # ------------------------------------------
        # ANOMALÍA DE VELOCIDAD
        # ------------------------------------------

        anomalia_velocidad, diferencia_absoluta = (
            detectar_anomalia_velocidad(
                velocidad_calculada_nudos,
                velocidad_ais,
                tolerancia_velocidad
            )
        )

        # ------------------------------------------
        # SCORE IRIS
        # ------------------------------------------

        if anomalia_velocidad:
            score_total += 30

            señales_total.append(
                "Anomalía cinemática"
            )

        if movimiento_imposible:
            score_total += 40

            señales_total.append(
                "Movimiento físicamente imposible"
            )

        if mmsi_sospechoso:
            score_total += 20

            señales_total.append(
                "MMSI sospechoso"
            )

        if going_dark:
            score_total += 20

            señales_total.append(
                "Going dark"
            )

    # ----------------------------------------------
    # LIMITAR SCORE
    # ----------------------------------------------

    score_total = min(
        score_total,
        100
    )

    # ----------------------------------------------
    # ELIMINAR SEÑALES REPETIDAS
    # ----------------------------------------------

    señales_total = list(
        dict.fromkeys(señales_total)
    )

    # ----------------------------------------------
    # DETERMINAR RIESGO
    # ----------------------------------------------

    if score_total >= 70:
        riesgo = "ALTO"

    elif score_total >= 30:
        riesgo = "MEDIO"

    else:
        riesgo = "BAJO"

    # ----------------------------------------------
    # RESULTADO FINAL
    # ----------------------------------------------

    resultado_iris = {
        "mmsi": registros_ais[-1]["mmsi"],
        "riesgo": riesgo,
        "score": score_total,
        "señales": señales_total
    }

    return resultado_iris