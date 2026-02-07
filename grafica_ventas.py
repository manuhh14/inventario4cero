import requests
import matplotlib

# 🛑 Solución para entornos Linux/WSL: Usa el backend 'Agg' para guardar sin ventana
matplotlib.use('Agg') 
import matplotlib.pyplot as plt

# =======================================================
# CONFIGURACIÓN
# =======================================================
anio = 2026
url = f"http://localhost:3000/api/estadisticas/ventas-mensuales/{anio}" 

# =======================================================
# OBTENER DATOS Y GRAFICAR
# =======================================================
try:
    # 1. Llamada a la API
    response = requests.get(url).json()

    # 2. Manejo de errores de la API
    if not response.get("success"):
        print(f"Error en la API: {response.get('message', 'Error desconocido')}")
        exit()
        
    datos = response["data"]

    # 🛑 NUEVA LÍNEA DE DIAGNÓSTICO: Imprime los datos que recibió
    print(f"DEBUG: Datos recibidos para graficar: {datos}") 
    
    # Si no hay datos, salir
    if not datos:
        print(f"No se encontraron datos de ventas para el año {anio}.")
        exit()

    # 4. Preparar datos
    meses = [int(item["mes"]) for item in datos]
    ventas = [float(item["total_vendido"]) for item in datos]

    # 5. Graficar
    plt.figure(figsize=(10,5))
    plt.bar(meses, ventas, color='#4CAF50') 

    plt.title(f"Ventas por Mes ({anio})")
    plt.xlabel("Mes")
    plt.ylabel("Total Vendido ($)")

    # Etiquetas X (meses)
    plt.xticks(meses, [f'Mes {m}' for m in meses]) 
    plt.grid(axis='y', linestyle='--')
    plt.tight_layout()

    # 6. Guardar la imagen
    plt.savefig('reporte_ventas_mensuales.png') 
    
    print(f"\n✅ ¡Éxito! Gráfica generada como 'reporte_ventas_mensuales.png'.")

# =======================================================
# MANEJO DE EXCEPCIONES (Al mismo nivel que 'try')
# =======================================================
except requests.exceptions.ConnectionError:
    print("\n🛑 Error de Conexión: Asegúrate de que tu servidor Node.js esté corriendo en http://localhost:3000.")
except Exception as e:
    print(f"\n❌ Ocurrió un error inesperado al procesar los datos o graficar: {e}")