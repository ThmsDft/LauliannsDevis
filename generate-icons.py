#!/usr/bin/env python3
"""
Script pour générer les icônes PWA à partir du logo SVG
Nécessite: pip install cairosvg pillow
"""

try:
    import cairosvg
    from PIL import Image
    import io
except ImportError:
    print("Installation des dépendances nécessaires...")
    print("Exécutez: pip install cairosvg pillow")
    exit(1)

def generate_icon(svg_file, output_file, size):
    """Génère une icône PNG à partir d'un fichier SVG"""
    # Convertir SVG en PNG avec la taille spécifiée
    png_data = cairosvg.svg2png(
        url=svg_file,
        output_width=size,
        output_height=size
    )
    
    # Ouvrir l'image PNG
    img = Image.open(io.BytesIO(png_data))
    
    # Créer un fond blanc
    background = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    
    # Calculer la position pour centrer l'image
    # On réduit légèrement l'image pour avoir une marge
    margin = int(size * 0.1)
    new_size = size - (2 * margin)
    
    # Redimensionner l'image du logo
    img.thumbnail((new_size, new_size), Image.Resampling.LANCZOS)
    
    # Calculer la position de centrage
    x = (size - img.width) // 2
    y = (size - img.height) // 2
    
    # Coller l'image sur le fond
    background.paste(img, (x, y), img if img.mode == 'RGBA' else None)
    
    # Sauvegarder
    background.save(output_file, 'PNG')
    print(f"✓ Icône générée: {output_file} ({size}x{size})")

if __name__ == "__main__":
    svg_file = "logo.svg"
    
    # Créer d'abord un fichier SVG simple avec juste le logo
    svg_content = '''<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1374.8 410.3">
    <g fill="#ff1493">
        <!-- Copiez ici le contenu du path du logo depuis index.html -->
    </g>
</svg>'''
    
    print("ATTENTION: Vous devez d'abord créer un fichier 'logo.svg'")
    print("Copiez le contenu SVG du logo depuis index.html")
    print("\nOu utilisez un outil en ligne comme:")
    print("- https://realfavicongenerator.net/")
    print("- https://www.favicon-generator.org/")
    print("\nPour générer les icônes, placez votre logo.svg dans ce dossier")
    print("puis exécutez ce script.")
    
    # Générer les icônes si le fichier SVG existe
    import os
    if os.path.exists(svg_file):
        generate_icon(svg_file, "icon-192.png", 192)
        generate_icon(svg_file, "icon-512.png", 512)
        print("\n✓ Toutes les icônes ont été générées avec succès!")
    else:
        print(f"\n✗ Fichier {svg_file} non trouvé")

