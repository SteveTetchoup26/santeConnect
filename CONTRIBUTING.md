# Guide de Contribution — SanteConnect

Merci de contribuer à **SanteConnect** ! Ce guide décrit les règles et conventions à respecter pour maintenir un historique Git clair et une collaboration efficace.

---

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Workflow de contribution](#workflow-de-contribution)
3. [Convention de nommage des commits](#convention-de-nommage-des-commits)
4. [Convention de nommage des branches](#convention-de-nommage-des-branches)
5. [Pull Requests](#pull-requests)
6. [Tests](#tests)

---

## Prérequis

- Node.js >= 18.x
- Docker & Docker Compose
- Git configuré avec votre nom et email

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"
```

---

## Workflow de contribution

1. **Forker** le dépôt ou créer une branche depuis `main`
2. **Développer** votre fonctionnalité ou correction
3. **Tester** localement avant de pousser
4. **Ouvrir une Pull Request** vers `main`
5. Attendre la **revue d'au moins un pair** et la **réussite des CI checks**
6. **Merger** uniquement après validation

> ⚠️ La branche `main` est protégée. Tout push direct est interdit.

---

## Convention de nommage des commits

Ce projet suit la spécification **[Conventional Commits](https://www.conventionalcommits.org/fr/)**.

### Format

```
<type>(<scope>): <description courte>

[corps optionnel]

[footer optionnel]
```

### Types acceptés

| Type       | Usage                                                              |
|------------|--------------------------------------------------------------------|
| `feature`     | Nouvelle fonctionnalité                                            |
| `fix`      | Correction de bug                                                  |
| `docs`     | Modification de la documentation uniquement                        |
| `style`    | Formatage, espaces, virgules (pas de changement de logique)        |
| `refactor` | Refactoring du code sans ajout de fonctionnalité ni correction     |
| `test`     | Ajout ou modification de tests                                     |
| `chore`    | Tâches de maintenance (dépendances, config, CI…)                   |
| `perf`     | Amélioration des performances                                      |
| `ci`       | Changements liés aux pipelines CI/CD                               |
| `revert`   | Annulation d'un commit précédent                                   |

### Exemples

```bash
# ✅ Bons commits
feature(auth): ajouter l'authentification JWT
fix(api): corriger la validation du champ email
docs(readme): mettre à jour les instructions d'installation
test(user): ajouter les tests unitaires du service utilisateur
ci(docker): intégrer le scan Trivy dans le pipeline
chore(deps): mettre à jour express vers 4.19.2

# ❌ Mauvais commits (à éviter)
git commit -m "fix"
git commit -m "modifications diverses"
git commit -m "wip"
git commit -m "ajout de trucs"
```

### Scopes suggérés

| Scope     | Description                        |
|-----------|------------------------------------|
| `auth`    | Authentification & autorisation    |
| `api`     | Routes et contrôleurs API          |
| `db`      | Base de données & migrations       |
| `docker`  | Dockerfile & docker-compose        |
| `ci`      | GitHub Actions & pipelines         |
| `tests`   | Fichiers de tests                  |
| `config`  | Configuration de l'application     |

### Breaking Changes

Pour signaler un changement incompatible avec les versions précédentes, ajoutez `!` après le type ou un footer `BREAKING CHANGE:` :

```bash
feat(api)!: supprimer l'endpoint /v1/users deprecated

BREAKING CHANGE: L'endpoint /v1/users a été supprimé. Utiliser /v2/users à la place.
```

---

## Convention de nommage des branches

```
<type>/<description-courte-en-kebab-case>
```

### Exemples

```bash
feature/authentification-jwt
fix/validation-email
docs/guide-contribution
ci/scan-vulnerabilites-trivy
refactor/service-utilisateur
```

---

## Pull Requests

- **Titre** : suivre le format Conventional Commits (ex: `feat(auth): ajouter login OAuth2`)
- **Description** : expliquer le contexte, les changements effectués et comment tester
- **Taille** : favoriser les PRs petites et ciblées (< 400 lignes modifiées si possible)
- **Reviewers** : assigner au moins un pair pour la revue
- **Labels** : utiliser les labels (`bug`, `enhancement`, `documentation`, etc.)

### Template de PR

```markdown
## Description
Brève description des changements apportés.

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Refactoring
- [ ] Documentation
- [ ] CI/CD

## Comment tester
Étapes pour reproduire ou tester les changements.

## Checklist
- [ ] Mon code respecte les conventions du projet
- [ ] J'ai ajouté/mis à jour les tests nécessaires
- [ ] Les tests passent localement (`npm test`)
- [ ] J'ai mis à jour la documentation si nécessaire
```

---

## Tests

Avant tout push, assurez-vous que les tests passent :

```bash
# Lancer tous les tests
npm test

# Lancer les tests avec couverture
npm run test:coverage
```

> Le pipeline CI vérifiera automatiquement les tests, la qualité du code (SonarQube) et la sécurité des images Docker (Trivy). Toute PR avec des tests échoués sera bloquée.

---

*Pour toute question, ouvrez une [issue](../../issues) sur le dépôt.*
