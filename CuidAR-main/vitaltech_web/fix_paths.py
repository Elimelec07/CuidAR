#!/usr/bin/env python3
"""
Script para corregir las rutas absolutas a rutas relativas en archivos HTML
"""

import os
import re

# Directorio de archivos HTML
html_dir = "HTML"

# Patrones a reemplazar
replacements = {
    'href="/CSS/': 'href="../CSS/',
    'src="/CSS/': 'src="../CSS/',
    'href="/JS/': 'href="../JS/',
    'src="/JS/': 'src="../JS/',
    'src="/img/': 'src="../img/',
    'href="/img/': 'href="../img/',
    "href='/CSS/": "href='../CSS/",
    "src='/CSS/": "src='../CSS/",
    "href='/JS/": "href='../JS/",
    "src='/JS/": "src='../JS/",
    "src='/img/": "src='../img/",
    "href='/img/": "href='../img/",
    "href='/HTML/": "href='",
    'href="/HTML/': 'href="',
    "onclick=\"window.location.href='/HTML/": "onclick=\"window.location.href='",
    'onclick="window.location.href="/HTML/': 'onclick="window.location.href="',
}

def fix_file(filepath):
    """Corrige las rutas en un archivo HTML"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Aplicar reemplazos
        for old, new in replacements.items():
            content = content.replace(old, new)
        
        # Solo escribir si hay cambios
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Corregido: {os.path.basename(filepath)}")
            return True
        else:
            print(f"⚪ Sin cambios: {os.path.basename(filepath)}")
            return False
            
    except Exception as e:
        print(f"❌ Error en {os.path.basename(filepath)}: {str(e)}")
        return False

def main():
    """Función principal"""
    print("🔧 Corrigiendo rutas en archivos HTML...\n")
    
    if not os.path.exists(html_dir):
        print(f"❌ No se encontró el directorio {html_dir}")
        return
    
    fixed_count = 0
    total_count = 0
    
    # Procesar todos los archivos HTML
    for filename in os.listdir(html_dir):
        if filename.endswith('.html'):
            filepath = os.path.join(html_dir, filename)
            total_count += 1
            if fix_file(filepath):
                fixed_count += 1
    
    print(f"\n✅ Proceso completado!")
    print(f"📊 Archivos procesados: {total_count}")
    print(f"🔧 Archivos corregidos: {fixed_count}")

if __name__ == "__main__":
    main()
