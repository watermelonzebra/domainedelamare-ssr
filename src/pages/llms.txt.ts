import type { APIRoute } from 'astro';

const baseUrl = import.meta.env.SITE;

export const GET: APIRoute = async () => {
    const llms = `# Domaine de la Mare | maisons modernes et économes | Arnèke

> Domaine de la Mare vend des maisons à Arneke, en France, de manière simple et efficace.

## À propos
- **Description** : Domaine de la Mare est un projet immobilier résidentiel haut de gamme axé sur la construction de logements neufs de grande qualité. Ce projet met l'accent sur l'architecture moderne et le mode de vie durable, et propose actuellement des maisons individuelles (telles que des modèles de 94 m² à 105 m²) situées sur de vastes terrains privés. Il vise à intégrer des logements confortables et contemporains dans un cadre naturel et paisible.
- **Argument clé de vente** : Nous proposons des logements « axés sur la performance » qui allient responsabilité écologique et élégance architecturale. En privilégiant une haute performance énergétique et les normes de construction les plus récentes, nos logements offrent des économies significatives à long terme et une empreinte environnementale réduite, sans pour autant sacrifier l'esthétique moderne ni le confort intérieur.
- **Public cible** : Le programme immobilier s'adresse aux familles en quête d'un équilibre entre nature et confort moderne, aux primo-accédants recherchant la sécurité des garanties sur les constructions neuves, ainsi qu'aux investisseurs soucieux de l'environnement et intéressés par des biens immobiliers à forte valeur ajoutée et à haute efficacité énergétique.

## Key pages
- [Home](${baseUrl}/)
`

    return new Response(llms,{
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        }
    })
}