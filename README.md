# Lab 7 — Formulaires réactifs et validation

Démarrer Spring Boot avec Java 17 et Maven depuis `backend/` avec `mvn spring-boot:run`. Puis ouvrir un terminal dans `frontend/`.

Avec Node.js 22 (22.12 ou plus récent sur cette version majeure), exécuter `npm install`, puis `npm start`. Ouvrir http://localhost:4200.

## Formulaire et validation

`FormGroup<StudentForm>` décrit les contrôles nommés de la fiche. `FormArray<FormControl<string>>` gère une collection de formations de taille variable. Le typage permet de repérer un champ mal nommé ou une valeur incompatible pendant la compilation.

Le DTO Spring valide les valeurs reçues et renvoie HTTP 400 pour une requête invalide. Le navigateur affiche les erreurs de saisie au niveau des champs. Une suggestion de formations pourrait être ajoutée avec `MatAutocomplete`, un filtrage du catalogue et une liste d’options accessibles au clavier.

## Scénarios manuels

1. Créer une fiche, ajouter deux formations et enregistrer. La liste doit afficher la nouvelle fiche.
2. Ouvrir Modifier, changer la note et enregistrer. La nouvelle valeur doit rester présente en rouvrant la fiche.
3. Envoyer une adresse e-mail invalide ou une note supérieure à 20. La validation doit empêcher l’envoi.
4. Modifier des champs puis réinitialiser. En modification, les données chargées doivent être restaurées.
