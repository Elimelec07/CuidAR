#!/usr/bin/env python3
"""
Script para corregir todas las rutas en el proyecto VitalTech
Asume que index.html está en la raíz del proyecto
"""

import os
import re
import glob

def fix_html_files():
    """Corrige rutas en archivos HTML dentro de la carpeta HTML/"""
    html_files = glob.glob("HTML/*.html")
    
    for file_path in html_files:
        print(f"Procesando: {file_path}")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Corregir rutas de CSS, JS e imágenes (agregar ../ si no está presente)
            content = re.sub(r'href="(?!\.\./)(?!https?://)(?!#)([^"]*\.css)"', r'href="../\1"', content)
            content = re.sub(r'src="(?!\.\./)(?!https?://)(?!#)([^"]*\.js)"', r'src="../\1"', content)
            content = re.sub(r'src="(?!\.\./)(?!https?://)(?!#)(img/[^"]*)"', r'src="../\1"', content)
            content = re.sub(r'href="(?!\.\./)(?!https?://)(?!#)(img/[^"]*)"', r'href="../\1"', content)
            
            # Corregir enlaces a index.html (debe ir a la raíz)
            content = re.sub(r'href="(?!\.\./)index\.html"', r'href="../index.html"', content)
            content = re.sub(r"href='(?!\.\./)index\.html'", r"href='../index.html'", content)
            
            # Corregir window.location.href en JavaScript embebido
            content = re.sub(r"window\.location\.href\s*=\s*['\"](?!\.\./)(?!https?://)index\.html['\"]", 
                           r"window.location.href = '../index.html'", content)
            
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ Actualizado: {file_path}")
            else:
                print(f"ℹ️  Sin cambios: {file_path}")
                
        except Exception as e:
            print(f"❌ Error procesando {file_path}: {e}")

def fix_js_files():
    """Corrige rutas en archivos JavaScript"""
    js_files = glob.glob("JS/*.js")
    
    for file_path in js_files:
        print(f"Procesando: {file_path}")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Corregir navegación a index.html desde archivos JS (usado desde HTML/)
            content = re.sub(r"window\.location\.href\s*=\s*['\"](?!\.\./)(?!https?://)index\.html['\"]", 
                           r"window.location.href = '../index.html'", content)
            
            # Corregir navegación desde index.html hacia páginas HTML
            # Esta es más complicada porque el mismo JS se usa desde diferentes contextos
            # Por ahora dejamos las rutas relativas simples para páginas HTML internas
            
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ Actualizado: {file_path}")
            else:
                print(f"ℹ️  Sin cambios: {file_path}")
                
        except Exception as e:
            print(f"❌ Error procesando {file_path}: {e}")

def fix_index_html():
    """Corrige rutas en index.html (en la raíz)"""
    file_path = "index.html"
    
    if not os.path.exists(file_path):
        print(f"❌ No se encontró {file_path}")
        return
    
    print(f"Procesando: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Eliminar ../ de las rutas ya que index.html está en la raíz
        content = re.sub(r'href="\.\./([^"]*)"', r'href="\1"', content)
        content = re.sub(r'src="\.\./([^"]*)"', r'src="\1"', content)
        
        # Asegurar que los enlaces a páginas HTML apunten a HTML/
        content = re.sub(r'href="(?!HTML/)(?!https?://)(?!#)([^"]*\.html)"', r'href="HTML/\1"', content)
        content = re.sub(r"href='(?!HTML/)(?!https?://)(?!#)([^']*\.html)'", r"href='HTML/\1'", content)
        
        # Corregir action del formulario
        content = re.sub(r'action="(?!HTML/)([^"]*\.html)"', r'action="HTML/\1"', content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Actualizado: {file_path}")
        else:
            print(f"ℹ️  Sin cambios: {file_path}")
            
    except Exception as e:
        print(f"❌ Error procesando {file_path}: {e}")

def main():
    print("🔧 Iniciando corrección de rutas...")
    print("=" * 50)
    
    print("\n📁 Corrigiendo archivos HTML en carpeta HTML/...")
    fix_html_files()
    
    print("\n📄 Corrigiendo index.html en la raíz...")
    fix_index_html()
    
    print("\n📜 Corrigiendo archivos JavaScript...")
    fix_js_files()
    
    print("\n✅ ¡Corrección de rutas completada!")
    print("=" * 50)

if __name__ == "__main__":
    main()