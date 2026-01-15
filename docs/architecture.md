# FormsApp - Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FormsApp (Vue 3 SPA)                        │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────────┐    │
│  │ BuilderView │   │ PreviewView │   │    SubmissionsView     │    │
│  │   (Form     │   │   (Form     │   │    (View/Manage        │    │
│  │   Design)   │   │   Fill)     │   │     Responses)         │    │
│  └──────┬──────┘   └──────┬──────┘   └───────────┬─────────────┘    │
│         │                 │                      │                  │
│  ┌──────┴─────────────────┴──────────────────────┴──────┐           │
│  │                    Vue Router                         │           │
│  │    /builder  |  /preview/:id  |  /submissions        │           │
│  └──────────────────────────┬───────────────────────────┘           │
│                             │                                       │
│  ┌──────────────────────────┴───────────────────────────┐           │
│  │                    Pinia Stores                       │           │
│  │  ┌──────────────────┐    ┌───────────────────────┐   │           │
│  │  │ formBuilderStore │    │    templatesStore     │   │           │
│  │  │ - schema         │    │ - templates[]         │   │           │
│  │  │ - selectedField  │    │ - selectedCategory    │   │           │
│  │  │ - CRUD actions   │    │ - filteredTemplates   │   │           │
│  │  └──────────────────┘    └───────────────────────┘   │           │
│  └──────────────────────────┬───────────────────────────┘           │
│                             │                                       │
│  ┌──────────────────────────┴───────────────────────────┐           │
│  │                    Composables                        │           │
│  │  useFormSchema | useLocalStorage | useId             │           │
│  └──────────────────────────┬───────────────────────────┘           │
│                             │                                       │
│  ┌──────────────────────────┴───────────────────────────┐           │
│  │                     Utilities                         │           │
│  │  validation.js | slugify.js | webComponentGenerator  │           │
│  └──────────────────────────┬───────────────────────────┘           │
│                             │                                       │
│  ┌──────────────────────────┴───────────────────────────┐           │
│  │                   localStorage                        │           │
│  │        Key: vue-forms-builder-data                    │           │
│  └──────────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### BuilderView Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│                            Header                                    │
│  [Logo] [Title Input] [Templates] [Saved Forms] [Import] [Export]   │
├────────────┬──────────────────────────────────┬─────────────────────┤
│            │                                  │                     │
│  Field     │          Form Canvas             │   Properties        │
│  Palette   │                                  │   Panel             │
│  (220px)   │       ┌─────────────────┐       │   (320px)           │
│            │       │  Field Item 1   │       │                     │
│  [Text]    │       └─────────────────┘       │   [Label]           │
│  [Email]   │       ┌─────────────────┐       │   [Name]            │
│  [Number]  │       │  Field Item 2   │       │   [Required]        │
│  [Select]  │       └─────────────────┘       │   [Placeholder]     │
│  [...]     │       ┌─────────────────┐       │   [Options]         │
│            │       │  Field Item 3   │       │   [...]             │
│            │       └─────────────────┘       │                     │
│            │                                  │                     │
└────────────┴──────────────────────────────────┴─────────────────────┘
```

### Component Hierarchy

```
App.vue
├── RouterView
│   ├── BuilderView.vue
│   │   ├── FieldPalette.vue         # Left sidebar - field type buttons
│   │   ├── FormCanvas.vue           # Center - field list
│   │   │   └── FieldItem.vue        # Individual field card
│   │   │       └── BaseModal.vue    # Delete confirmation
│   │   ├── FieldPropertiesPanel.vue # Right sidebar - field settings
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseCheckbox.vue
│   │   │   └── OptionEditor.vue     # For select/radio/multiselect
│   │   ├── TemplateGallery.vue      # Modal - template selection
│   │   └── SavedFormsPanel.vue      # Slide-out panel
│   │
│   ├── PreviewView.vue
│   │   └── FormRenderer.vue         # Renders form for filling
│   │       ├── BaseInput.vue
│   │       ├── BaseTextarea.vue
│   │       ├── BaseSelect.vue
│   │       └── BaseCheckbox.vue
│   │
│   └── SubmissionsView.vue          # Submissions management
```

## Data Flow

### Form Building Flow

```
User Click → FieldPalette → store.addField(type)
                                    ↓
                            Generate ID & Props
                                    ↓
                            Update schema.fields
                                    ↓
                            Auto-select new field
                                    ↓
                            FormCanvas re-renders
                                    ↓
                            FieldItem appears
```

### Form Saving Flow

```
Ctrl+S / Save Button → useLocalStorage.saveForm()
                                    ↓
                        Get schema from store
                                    ↓
                        Generate/use form ID
                                    ↓
                        Update localStorage
                                    ↓
                        Update savedForms list
                                    ↓
                        Show success toast
```

### Validation Flow

```
Form Submit → validate(values, schema)
                        ↓
              For each field in schema.fields:
                        ↓
              validateField(value, field)
                        ↓
              Check required, type-specific rules
                        ↓
              Return errors object { fieldId: [errors] }
```

## State Management

### formBuilderStore

```javascript
// State
{
  schema: {
    version: 1,
    title: 'Nouveau formulaire',
    fields: []
  },
  selectedFieldId: null
}

// Getters
- selectedField      → Current selected field object
- fieldCount         → Number of fields
- hasFields          → Boolean
- fieldNames         → Array of field names

// Actions
- addField(type)     → Add new field
- removeField(id)    → Delete field
- duplicateField(id) → Clone field
- updateField(id, updates) → Modify field properties
- selectField(id)    → Set selection
- moveField(id, direction) → Reorder
- updateTitle(title) → Change form title
- importSchema(json) → Load from JSON
- exportSchema()     → Convert to JSON
- reset()            → Clear form
```

### templatesStore

```javascript
// State
{
  selectedCategory: 'all'
}

// Getters
- templates          → All template definitions
- categories         → Available categories
- filteredTemplates  → Templates filtered by category
```

## Form Schema Specification

### Complete Schema Example

```json
{
  "version": 1,
  "title": "Contact Form",
  "fields": [
    {
      "id": "f_1704067200000_1",
      "type": "text",
      "name": "full_name",
      "label": "Full Name",
      "required": true,
      "placeholder": "Enter your name",
      "defaultValue": ""
    },
    {
      "id": "f_1704067200000_2",
      "type": "email",
      "name": "email",
      "label": "Email Address",
      "required": true,
      "placeholder": "you@example.com",
      "defaultValue": ""
    },
    {
      "id": "f_1704067200000_3",
      "type": "select",
      "name": "department",
      "label": "Department",
      "required": false,
      "options": [
        { "value": "sales", "label": "Sales" },
        { "value": "support", "label": "Support" },
        { "value": "other", "label": "Other" }
      ],
      "defaultValue": ""
    },
    {
      "id": "f_1704067200000_4",
      "type": "rating",
      "name": "satisfaction",
      "label": "How satisfied are you?",
      "required": false,
      "maxRating": 5,
      "defaultValue": 0
    },
    {
      "id": "f_1704067200000_5",
      "type": "slider",
      "name": "priority",
      "label": "Priority Level",
      "required": false,
      "min": 1,
      "max": 10,
      "step": 1,
      "defaultValue": 5
    }
  ]
}
```

## Validation Rules

| Field Type | Validations |
|------------|-------------|
| text | required, minLength, maxLength |
| textarea | required, minLength, maxLength |
| number | required, min, max, isNumber |
| email | required, email format regex |
| phone | required, phone format regex |
| url | required, URL format regex |
| date | required, valid date |
| time | required, HH:MM format |
| select | required, value in options |
| radio | required, value in options |
| checkbox | required (must be true) |
| rating | required, 1 to maxRating |
| slider | required, within min/max |
| multiselect | required (at least one), values in options |

## Web Component Export

The `webComponentGenerator.js` creates standalone Web Components:

```javascript
generateWebComponent(schema, {
  emailTo: 'recipient@example.com',
  emailSubject: 'New Form Submission',
  componentName: 'my-form'
})
```

**Generated Component Features:**
- Shadow DOM encapsulation
- Self-contained styles
- Form validation
- Mailto link submission
- No external dependencies

## Performance Considerations

1. **Reactivity Optimization**
   - Uses `storeToRefs()` for reactive store access
   - Computed properties for derived state
   - Deep watch only where necessary

2. **Rendering**
   - `v-if` for conditional components
   - `TransitionGroup` for smooth animations
   - Key-based list rendering

3. **Storage**
   - Debounced auto-save (2000ms)
   - JSON.stringify/parse for deep cloning

## Security Considerations

1. **Client-Side Only** - No server-side validation
2. **No Sanitization** - User input displayed as-is
3. **localStorage** - Data accessible to any same-origin script
4. **Web Component Export** - Generated code is trusted

**For Production Integration:**
- Add server-side validation
- Sanitize HTML in labels/values
- Implement authentication
- Add CSRF protection
