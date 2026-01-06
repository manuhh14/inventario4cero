import requests
import matplotlib
# Configuración esencial para entornos sin GUI (como tu Linux/WSL)
matplotlib.use('Agg') 
import matplotlib.pyplot as plt

# =======================================================
# CONFIGURACIÓN
# =======================================================
# 🛑 ATENCIÓN: Define el mes y año que quieres analizar
mes = 11  
anio = 2025
# Nueva URL para la clasificación ABC
url = f"http://localhost:3000/api/estadisticas/ventas-abc/{mes}/{anio}" 

try:
    # 1. Llamada a la API
    response = requests.get(url).json()

    if not response.get("success"):
        print(f"Error en la API: {response.get('message', 'Error desconocido')}")
        exit()
        
    datos = response["data"]
    
    if not datos:
        print(f"No se encontraron datos de ventas ABC para el Mes {mes} del año {anio}.")
        exit()

    # 🛑 2. AGRUPAR VENTAS POR CATEGORÍA ABC
    # Necesitamos saber el total vendido por cada categoría (A, B, C)
    ventas_por_categoria = {}
    for item in datos:
        cat = item['categoria_abc']
        # El valor total vendido es una string, lo convertimos a float
        valor = float(item['total_vendido']) 
        
        if cat not in ventas_por_categoria:
            ventas_por_categoria[cat] = 0
        ventas_por_categoria[cat] += valor
        
    # 3. Preparar datos para la gráfica de pastel
    # Usamos sorted para asegurar que A, B, C aparezcan en orden
    categorias = sorted(ventas_por_categoria.keys()) 
    valores = [ventas_por_categoria[cat] for cat in categorias]
    
    # Colores convencionales para ABC
    colores = ['#FF6384', '#FFCE56', '#36A2EB'] # Rojo (A), Amarillo (B), Azul (C)
    
    # 4. Graficar (Gráfico de Pastel - Pie Chart) 
    plt.figure(figsize=(8, 8))
    plt.pie(
        valores, 
        labels=categorias, 
        colors=colores,
        autopct='%1.1f%%', # Muestra el porcentaje en cada segmento
        startangle=90,     # Inicia desde arriba
        wedgeprops={'edgecolor': 'black'} # Dibuja un borde
    )
    plt.title(f"Distribución de Contribución de Ventas (ABC) - Mes {mes}/{anio}")
    
    # 5. Guardar la imagen
    plt.savefig('reporte_ventas_abc.png') 
    
    print(f"\n✅ ¡Éxito! Reporte ABC generado como 'reporte_ventas_abc.png'.")

except requests.exceptions.ConnectionError:
    print("\n🛑 Error de Conexión: Asegúrate de que tu servidor Node.js esté corriendo en http://localhost:3000.")
except Exception as e:
    print(f"\n❌ Ocurrió un error inesperado al procesar los datos o graficar: {e}")