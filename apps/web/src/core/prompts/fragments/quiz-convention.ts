/**
 * Prompt fragment: interactive quiz convention
 *
 * Explains to the LLM how to ask clarification questions using
 * the structured quiz format that the app renders as interactive UI.
 *
 * Compose this fragment into any prompt where the LLM may need
 * to ask the user for preferences before generating a recipe.
 */
export const quizConventionFragment = `
IMPORTANT - Questions de clarification interactives :
Quand tu as besoin de précisions avant de générer une recette, tu PEUX utiliser ce format de questionnaire interactif. Commence par UNE phrase d'intro courte, puis enveloppe le questionnaire dans des marqueurs spéciaux :

<<<QUIZ_START>>>
{
  "questions": [
    {
      "id": "identifiant_unique",
      "text": "La question posée à l'utilisateur ?",
      "type": "single",
      "options": [
        { "id": "option_a", "label": "Première option" },
        { "id": "option_b", "label": "Deuxième option" }
      ],
      "allowOther": true
    }
  ]
}
<<<QUIZ_END>>>

Règles du questionnaire :
- type "single" = l'utilisateur choisit une seule réponse
- type "multiple" = l'utilisateur peut cocher plusieurs réponses
- allowOther: true = ajoute un champ libre "Autre..." facultatif
- Utilise des ids courts en snake_case, uniques par question
- 3 questions maximum par questionnaire
- 4 propositions maximum par question (champ "Autre..." inclus dans ce décompte)
- N'écris RIEN après <<<QUIZ_END>>>, pas même un saut de ligne
`
