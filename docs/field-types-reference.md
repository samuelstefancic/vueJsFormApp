# Field Types Reference

> 🎨 **Author:** Sally (UX Designer Agent)
> **Scope:** Complete specification for all 14 field types
> **Purpose:** UI/UX guidelines, properties, and visual specifications

---

## Field Type Overview

| # | Type | Category | Icon | Description |
|---|------|----------|------|-------------|
| 1 | `text` | Text Inputs | T | Single line text input |
| 2 | `textarea` | Text Inputs | ¶ | Multi-line text area |
| 3 | `email` | Text Inputs | @ | Email address input |
| 4 | `phone` | Text Inputs | 📞 | Phone number input |
| 5 | `url` | Text Inputs | 🔗 | Web URL input |
| 6 | `number` | Numeric | # | Numeric value input |
| 7 | `slider` | Numeric | ⟷ | Range slider with thumb |
| 8 | `rating` | Numeric | ⭐ | Star rating selector |
| 9 | `select` | Selection | ▼ | Dropdown single select |
| 10 | `radio` | Selection | ◉ | Radio button group |
| 11 | `multiselect` | Selection | ☑ | Multiple checkbox selection |
| 12 | `checkbox` | Selection | ✓ | Single boolean toggle |
| 13 | `date` | Date/Time | 📅 | Date picker |
| 14 | `time` | Date/Time | 🕐 | Time picker |

---

## Category: Text Inputs

### 1. Text (`text`)

**Purpose:** Capture short, single-line text input.

**Schema Properties:**
```json
{
  "id": "f_xxx",
  "type": "text",
  "name": "field_name",
  "label": "Field Label",
  "required": false,
  "placeholder": "Hint text",
  "defaultValue": "",
  "minLength": null,
  "maxLength": null
}
```

**UI Specifications:**

| Property | Value |
|----------|-------|
| Height | 40px |
| Padding | 0 12px |
| Border Radius | 8px |
| Font Size | 14px (0.875rem) |

**Visual States:**
```
┌─────────────────────────────────────────┐
│ Default                                  │
│ ┌─────────────────────────────────────┐ │
│ │ Placeholder text                    │ │  Border: #e5e5e5
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Focused                                  │
│ ┌─────────────────────────────────────┐ │
│ │ User input|                         │ │  Border: #3b82f6
│ └─────────────────────────────────────┘ │  Ring: 0 0 0 3px rgba(59,130,246,0.2)
├─────────────────────────────────────────┤
│ Error                                    │
│ ┌─────────────────────────────────────┐ │
│ │ Invalid input                       │ │  Border: #ef4444
│ └─────────────────────────────────────┘ │
│ ⚠ Error message here                    │  Color: #ef4444
└─────────────────────────────────────────┘
```

**Validation Rules:**
- Required: Value must not be empty/whitespace
- minLength: String length >= value
- maxLength: String length <= value

---

### 2. Textarea (`textarea`)

**Purpose:** Capture long, multi-line text content.

**Schema Properties:**
```json
{
  "id": "f_xxx",
  "type": "textarea",
  "name": "field_name",
  "label": "Field Label",
  "required": false,
  "placeholder": "Enter your message...",
  "defaultValue": "",
  "minLength": null,
  "maxLength": null
}
```

**UI Specifications:**

| Property | Value |
|----------|-------|
| Min Height | 100px |
| Padding | 10px 12px |
| Resize | vertical only |
| Font Size | 14px |

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│ Field Label                              │
│ ┌─────────────────────────────────────┐ │
│ │ Multi-line content                  │ │
│ │ continues here                      │ │
│ │                                     │ │
│ │                                ═══  │ │ ← Resize handle
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

### 3. Email (`email`)

**Purpose:** Capture and validate email addresses.

**Schema Properties:**
```json
{
  "id": "f_xxx",
  "type": "email",
  "name": "email",
  "label": "Email Address",
  "required": false,
  "placeholder": "example@domain.com",
  "defaultValue": ""
}
```

**Validation Rules:**
- Required: Value must not be empty
- Format: Must match `^[^\s@]+@[^\s@]+\.[^\s@]+$`

**Error Messages:**
- Missing: "Ce champ est requis"
- Invalid: "Email invalide"

---

### 4. Phone (`phone`)

**Purpose:** Capture phone numbers in various formats.

**Schema Properties:**
```json
{
  "id": "f_xxx",
  "type": "phone",
  "name": "phone",
  "label": "Phone Number",
  "required": false,
  "placeholder": "+33 6 00 00 00 00",
  "defaultValue": ""
}
```

**Accepted Formats:**
- `+33 6 12 34 56 78`
- `06 12 34 56 78`
- `0612345678`
- `+1 (555) 123-4567`

**Validation Rules:**
- Format: `^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$`
- Minimum digits: 6 (after removing non-digits)

---

### 5. URL (`url`)

**Purpose:** Capture web addresses.

**Schema Properties:**
```json
{
  "id": "f_xxx",
  "type": "url",
  "name": "website",
  "label": "Website",
  "required": false,
  "placeholder": "https://example.com",
  "defaultValue": ""
}
```

**Validation Rules:**
- Format: `^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$`

---

## Category: Numeric

### 6. Number (`number`)

**Purpose:** Capture numeric values with optional range constraints.

**Schema Properties:**
```json
{
  "id": "f_xxx",
  "type": "number",
  "name": "quantity",
  "label": "Quantity",
  "required": false,
  "placeholder": "",
  "defaultValue": null,
  "min": null,
  "max": null
}
```

**UI Specifications:**
- Input type: `number`
- Hide browser spinners (custom CSS)
- Show increment/decrement buttons on hover (optional)

**Validation Rules:**
- Required: Value must be present and numeric
- min: Value >= min
- max: Value <= max
- isNumber: Must be valid number

**Error Messages:**
- Invalid: "Nombre invalide"
- Below min: "Minimum: {min}"
- Above max: "Maximum: {max}"

---

### 7. Slider (`slider`)

**Purpose:** Select a value within a range using a draggable thumb.

**Schema Properties:**
```json
{
  "id": "f_xxx",
  "type": "slider",
  "name": "priority",
  "label": "Priority Level",
  "required": false,
  "min": 0,
  "max": 100,
  "step": 1,
  "defaultValue": 50
}
```

**UI Specifications:**

| Property | Value |
|----------|-------|
| Track Height | 6px |
| Thumb Size | 20px diameter |
| Thumb Color | #3b82f6 (accent) |
| Track Color | #e5e5e5 |

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│ Priority Level                           │
│                                          │
│ ────────────●──────────────  [50]        │
│             ↑                            │
│          Draggable thumb                 │
│                                          │
│ 0                              100       │
└─────────────────────────────────────────┘
```

**Interactions:**
- Drag thumb to change value
- Click track to jump to position
- Show current value in badge
- Display min/max labels below

---

### 8. Rating (`rating`)

**Purpose:** Capture star-based ratings.

**Schema Properties:**
```json
{
  "id": "f_xxx",
  "type": "rating",
  "name": "satisfaction",
  "label": "How satisfied are you?",
  "required": false,
  "maxRating": 5,
  "defaultValue": 0
}
```

**UI Specifications:**

| Property | Value |
|----------|-------|
| Star Size | 24px |
| Star Gap | 4px |
| Active Color | #f59e0b (amber) |
| Inactive Color | #e5e5e5 |

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│ How satisfied are you?                   │
│                                          │
│ ★ ★ ★ ☆ ☆                               │
│ ↑ ↑ ↑                                   │
│ Filled (selected)                        │
└─────────────────────────────────────────┘
```

**Interactions:**
- Hover: Preview rating with highlight
- Click: Set rating
- Hover effect: Scale 1.1

**Validation Rules:**
- Required: Value must be >= 1
- Range: Value between 1 and maxRating

---

## Category: Selection

### 9. Select (`select`)

**Purpose:** Choose one option from a dropdown list.

**Schema Properties:**
```json
{
  "id": "f_xxx",
  "type": "select",
  "name": "country",
  "label": "Country",
  "required": false,
  "options": [
    { "value": "fr", "label": "France" },
    { "value": "us", "label": "United States" },
    { "value": "uk", "label": "United Kingdom" }
  ],
  "defaultValue": ""
}
```

**UI Specifications:**

| Property | Value |
|----------|-------|
| Height | 40px |
| Dropdown Icon | ▼ (chevron down) |
| Max Dropdown Height | 300px |

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│ Country                                  │
│ ┌───────────────────────────────────▼─┐ │
│ │ -- Select --                        │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ Expanded:                                │
│ ┌─────────────────────────────────────┐ │
│ │ France                          ✓   │ │ ← Selected
│ ├─────────────────────────────────────┤ │
│ │ United States                       │ │
│ ├─────────────────────────────────────┤ │
│ │ United Kingdom                      │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Validation Rules:**
- Required: A value must be selected
- validOption: Value must exist in options array

---

### 10. Radio (`radio`)

**Purpose:** Choose one option from visible buttons.

**Schema Properties:**
```json
{
  "id": "f_xxx",
  "type": "radio",
  "name": "payment_method",
  "label": "Payment Method",
  "required": false,
  "options": [
    { "value": "card", "label": "Credit Card" },
    { "value": "paypal", "label": "PayPal" },
    { "value": "bank", "label": "Bank Transfer" }
  ],
  "defaultValue": ""
}
```

**UI Specifications:**

| Property | Value |
|----------|-------|
| Radio Size | 20px diameter |
| Radio Border | 2px solid |
| Inner Dot | 10px (when selected) |
| Label Gap | 8px |
| Option Gap | 12px |

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│ Payment Method                           │
│                                          │
│ ◉ Credit Card      ← Selected (filled)   │
│ ○ PayPal           ← Unselected (empty)  │
│ ○ Bank Transfer                          │
└─────────────────────────────────────────┘
```

---

### 11. Multiselect (`multiselect`)

**Purpose:** Choose multiple options from a list.

**Schema Properties:**
```json
{
  "id": "f_xxx",
  "type": "multiselect",
  "name": "interests",
  "label": "Select your interests",
  "required": false,
  "options": [
    { "value": "tech", "label": "Technology" },
    { "value": "sports", "label": "Sports" },
    { "value": "music", "label": "Music" },
    { "value": "travel", "label": "Travel" }
  ],
  "defaultValue": []
}
```

**UI Specifications:**

| Property | Value |
|----------|-------|
| Checkbox Size | 20px |
| Checkbox Radius | 4px |
| Checkmark | White on accent |
| Option Padding | 8px 12px |
| Option Hover BG | #f5f5f5 |

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│ Select your interests                    │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ ☑ Technology                        │ │ ← Checked
│ │ ☐ Sports                            │ │ ← Unchecked
│ │ ☑ Music                             │ │ ← Checked
│ │ ☐ Travel                            │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Validation Rules:**
- Required: At least one option must be selected
- validOptions: All selected values must exist in options

---

### 12. Checkbox (`checkbox`)

**Purpose:** Toggle a boolean value (yes/no, agree/disagree).

**Schema Properties:**
```json
{
  "id": "f_xxx",
  "type": "checkbox",
  "name": "agree_terms",
  "label": "I agree to the terms and conditions",
  "required": false,
  "defaultValue": false
}
```

**UI Specifications:**
- Checkbox appears BEFORE label (left side)
- Clickable area includes full label
- Required checkbox must be checked to pass validation

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│                                          │
│ ☑ I agree to the terms and conditions * │
│ ↑                                    ↑   │
│ Checkbox                          Required marker
└─────────────────────────────────────────┘
```

**Validation Rules:**
- Required: Value must be `true`

---

## Category: Date/Time

### 13. Date (`date`)

**Purpose:** Select a calendar date.

**Schema Properties:**
```json
{
  "id": "f_xxx",
  "type": "date",
  "name": "birth_date",
  "label": "Date of Birth",
  "required": false,
  "placeholder": "dd/mm/yyyy",
  "defaultValue": ""
}
```

**UI Specifications:**
- Use native `<input type="date">` for browser date picker
- Format display: Locale-aware (dd/mm/yyyy for French)
- Calendar icon on the right

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│ Date of Birth                            │
│ ┌───────────────────────────────────📅┐ │
│ │ 15/01/1990                          │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Validation Rules:**
- Required: A date must be selected
- validDate: Must be a parseable date

---

### 14. Time (`time`)

**Purpose:** Select a time value.

**Schema Properties:**
```json
{
  "id": "f_xxx",
  "type": "time",
  "name": "appointment_time",
  "label": "Preferred Time",
  "required": false,
  "placeholder": "HH:MM",
  "defaultValue": ""
}
```

**UI Specifications:**
- Use native `<input type="time">`
- 24-hour format (HH:MM)
- Clock icon on the right

**Validation Rules:**
- Required: A time must be entered
- Format: Must match `^([01]?[0-9]|2[0-3]):[0-5][0-9]$`

---

## Design System Variables

```css
/* Colors */
--color-accent: #3b82f6;        /* Primary blue */
--color-accent-hover: #2563eb;  /* Darker blue */
--color-accent-light: #eff6ff;  /* Light blue bg */
--color-danger: #ef4444;        /* Error red */
--color-warning: #f59e0b;       /* Rating amber */
--color-text: #1a1a1a;          /* Primary text */
--color-text-muted: #6b7280;    /* Secondary text */
--color-text-light: #9ca3af;    /* Placeholder */
--color-border: #e5e5e5;        /* Default border */
--color-border-hover: #d1d5db;  /* Hover border */
--color-border-focus: #3b82f6;  /* Focus border */
--color-bg: #ffffff;            /* Background */
--color-bg-hover: #f9fafb;      /* Hover background */

/* Spacing */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 12px;
--space-lg: 16px;
--space-xl: 24px;

/* Border Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);

/* Focus Ring */
--ring: 0 0 0 3px rgba(59,130,246,0.2);

/* Transitions */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
```

---

## Accessibility Guidelines

| Guideline | Implementation |
|-----------|----------------|
| **Labels** | All fields MUST have visible labels |
| **Focus** | Visible focus ring on all interactive elements |
| **Keyboard** | Tab navigation, Enter/Space to activate |
| **ARIA** | `aria-required`, `aria-invalid`, `aria-describedby` |
| **Color** | Don't rely on color alone for errors |
| **Touch** | Minimum 44x44px touch targets |

---

*Document generated by Sally (UX Designer Agent) for complete field type specifications.*
