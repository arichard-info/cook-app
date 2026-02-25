/**
 * Prompt fragment: scalable quantity convention
 *
 * Explains to the LLM how to encode quantities so the app can
 * scale them dynamically when the user adjusts the serving count.
 *
 * Compose this fragment into any prompt that involves recipe generation or editing.
 */
export const quantityConventionFragment = `
CONVENTION - Quantités scalables :

Chaque recette doit déclarer si elle est scalable via le champ "scalable" dans ses métadonnées.

QUAND mettre scalable: true (défaut implicite) :
- Soupes, risottos, pâtes, viandes, poissons, salades, légumes...
- Tout ce qui se sert en portions individuelles et dont les quantités se divisent naturellement

QUAND mettre scalable: false :
- Recettes "entières" : tarte, gâteau, pain, pizza, confiture, brioche...
- Quand diviser les quantités n'aurait pas de sens pratique pour l'utilisateur

---

RÈGLE pour scalable: true — wrapper les quantités :

Toute quantité numérique dans les ingrédients ET dans les étapes doit être enveloppée dans un span HTML :

  <span data-qty="{valeur}" data-unit="{unité}">{texte affiché}</span>

- data-qty : valeur numérique pure, décimale avec point (ex: 300, 1.5, 0.5)
- data-unit : unité choisie parmi la liste ci-dessous
- texte affiché : forme humaine naturelle (ex: "300g", "1,5L", "2 œufs")

Unités acceptées :
  Masse   → g, kg
  Volume  → ml, L, cl, dl, tsp (cuillère à café), tbsp (cuillère à soupe)
  Comptage → count  (œufs, oignons, gousses, pommes de terre, tranches...)

NE PAS wrapper :
- Les quantités vagues ou non-numériques : "sel", "poivre", "quelques feuilles de basilic", "un filet d'huile"
- Les temps de cuisson : "5 min", "1h"
- Les températures : "180°C"

Exemples corrects :
  ✓ "<span data-qty=\\"300\\" data-unit=\\"g\\">300g</span> de riz arborio"
  ✓ "<span data-qty=\\"1\\" data-unit=\\"L\\">1L</span> de bouillon de légumes"
  ✓ "<span data-qty=\\"2\\" data-unit=\\"count\\">2 œufs</span>"
  ✓ "<span data-qty=\\"0.5\\" data-unit=\\"count\\">½ oignon</span>"
  ✓ "Faire réduire avec <span data-qty=\\"100\\" data-unit=\\"ml\\">100ml</span> de vin blanc"
  ✗ "sel et poivre" → laisser tel quel, sans span
  ✗ "quelques feuilles de basilic" → laisser tel quel, sans span
  ✗ "cuire 10 min" → laisser tel quel, sans span
`
