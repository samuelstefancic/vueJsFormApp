# FormsApp - Project Context

> Critical rules and patterns for AI agents and developers working on this project.

## Project Identity

| Attribute | Value |
|-----------|-------|
| **Project Name** | FormsApp (Dynamic Form Builder) |
| **Type** | Vue.js 3 Single-Page Application |
| **Language** | JavaScript (ES Modules) |
| **Primary Purpose** | Visual form builder with preview, validation, and export capabilities |
| **Target Users** | Non-technical users creating forms without coding |

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Vue 3 | ^3.4.15 |
| State Management | Pinia | ^2.1.7 |
| Routing | Vue Router | ^4.2.5 |
| Build Tool | Vite | ^5.0.11 |
| Testing | Vitest + Vue Test Utils | ^1.2.0 |
| Styling | CSS Variables (Design System) | - |

## Critical Patterns - MUST FOLLOW

### 1. Composition API with `<script setup>`
All components use Vue 3 Composition API with `<script setup>` syntax:
```vue
<script setup>
import { ref, computed } from 'vue'
// Component logic here
</script>
```

### 2. Pinia Stores for State
- `formBuilder.js` - Main form schema state
- `templates.js` - Pre-built form templates
- Use `storeToRefs()` for reactive store access

### 3. Form Schema Structure
```json
{
  "version": 1,
  "title": "Form Title",
  "fields": [
    {
      "id": "f_1234567890_1",
      "type": "text|textarea|number|select|checkbox|date|time|email|phone|url|rating|radio|slider|multiselect",
      "name": "field_name",
      "label": "Field Label",
      "required": false,
      "placeholder": "",
      "defaultValue": "",
      "options": [] // for select/radio/multiselect
    }
  ]
}
```

### 4. Supported Field Types (14 total)
| Type | Description | Special Properties |
|------|-------------|-------------------|
| text | Single line text | placeholder |
| textarea | Multi-line text | placeholder |
| number | Numeric input | min, max |
| select | Dropdown list | options[] |
| checkbox | Boolean toggle | defaultValue (boolean) |
| date | Date picker | - |
| time | Time picker | - |
| email | Email input | placeholder |
| phone | Phone number | placeholder |
| url | URL input | placeholder |
| rating | Star rating | maxRating (default: 5) |
| radio | Radio buttons | options[] |
| slider | Range slider | min, max, step, defaultValue |
| multiselect | Multiple checkboxes | options[] |

### 5. Component Naming Conventions
- **Views:** `*View.vue` (BuilderView, PreviewView, SubmissionsView)
- **UI Components:** `Base*.vue` (BaseButton, BaseInput, BaseModal)
- **Feature Components:** Descriptive names (FieldPalette, FormCanvas)

### 6. CSS Design System
Uses CSS custom properties (variables) defined in `src/assets/main.css`:
```css
--color-accent: #3b82f6;
--color-bg: #ffffff;
--space-sm: 8px;
--radius-md: 8px;
--transition-fast: 150ms ease;
```

### 7. ID Generation
Field IDs follow pattern: `f_{timestamp}_{counter}`
```javascript
function generateId() {
  counter++
  return `f_${Date.now()}_${counter}`
}
```

### 8. Validation System
- Schema-based validation in `src/utils/validation.js`
- Per-field validation with error messages in French
- Validation types: required, number range, email/phone/url format

## Data Persistence

| Storage | Key | Purpose |
|---------|-----|---------|
| localStorage | `vue-forms-builder-data` | Forms and submissions |

**Data Structure:**
```json
{
  "forms": {
    "formId": {
      "id": "formId",
      "title": "Form Title",
      "schema": { /* form schema */ },
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    }
  },
  "submissions": {
    "submissionId": {
      "id": "submissionId",
      "formId": "formId",
      "formTitle": "Form Title",
      "data": { /* field values */ },
      "submittedAt": 1234567890
    }
  }
}
```

## File Structure

```
formsApp/
├── src/
│   ├── main.js                 # App entry point
│   ├── App.vue                 # Root component
│   ├── router/index.js         # Route definitions
│   ├── stores/
│   │   ├── formBuilder.js      # Form state management
│   │   └── templates.js        # Template definitions
│   ├── composables/
│   │   ├── useFormSchema.js    # Form schema utilities
│   │   ├── useId.js            # ID generation
│   │   └── useLocalStorage.js  # Persistence layer
│   ├── utils/
│   │   ├── validation.js       # Form validation
│   │   ├── slugify.js          # Name generation
│   │   └── webComponentGenerator.js # Export feature
│   ├── views/
│   │   ├── BuilderView.vue     # Main builder interface
│   │   ├── PreviewView.vue     # Form preview/fill
│   │   └── SubmissionsView.vue # Submission viewer
│   ├── components/
│   │   ├── builder/            # Builder-specific components
│   │   ├── form/               # Form rendering components
│   │   └── ui/                 # Reusable UI components
│   └── assets/
│       └── main.css            # Global styles & design tokens
├── tests/unit/                 # Unit tests
└── public/                     # Static assets
```

## Key Business Logic Locations

| Logic | File | Line |
|-------|------|------|
| Add field | `src/stores/formBuilder.js` | ~50-100 |
| Validate form | `src/utils/validation.js` | 1-70 |
| Save to localStorage | `src/composables/useLocalStorage.js` | 67-89 |
| Generate Web Component | `src/utils/webComponentGenerator.js` | 1-342 |
| Schema import/export | `src/stores/formBuilder.js` | ~150-200 |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+S | Save form |
| Ctrl+D | Duplicate selected field |
| Delete | Remove selected field |
| Arrow Up/Down | Navigate fields |
| Tab | Move between panels |

## Testing Conventions

- **Framework:** Vitest + Vue Test Utils
- **Test Location:** `tests/unit/`
- **Mocking:** `happy-dom` for DOM simulation
- **Run Tests:** `npm test`

## Constraints

1. **No Backend** - All data stored client-side in localStorage
2. **No Authentication** - Single-user local application
3. **French UI** - All labels and messages in French
4. **No Real-time Sync** - No multi-device support
5. **Browser Dependency** - Requires modern browser with localStorage

## Integration Points for Backend

When integrating with Angular + Spring Boot:

1. **Replace localStorage** with API calls
2. **Add authentication** (JWT recommended)
3. **Create database schema** for forms/submissions
4. **Implement form sharing** via URLs
5. **Add real-time collaboration** (optional)

See `docs/architecture.md` and `docs/integration-analysis.md` for detailed migration guidance.
