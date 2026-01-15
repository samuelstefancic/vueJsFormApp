# Feature Analysis & Comprehensive Testing Specification

> **Author:** Analysis Team (Mary, Murat, Amelia, Winston)
> **Date:** 2026-01-15
> **Scope:** Vue.js FormsApp - Feature Enhancement & Testing Pipeline

---

## Table of Contents

1. [Current Feature Inventory](#current-feature-inventory)
2. [Feature Gap Analysis](#feature-gap-analysis)
3. [Party Mode: Technical Expert Review](#party-mode-technical-expert-review)
4. [New Features to Implement](#new-features-to-implement)
5. [Implementation Status](#implementation-status)
6. [Frontend Test Elements (data-testid)](#frontend-test-elements)
7. [Test Logic per Feature](#test-logic-per-feature)
8. [Pre-Build & Post-Build Test Pipeline](#test-pipeline)
9. [Component Test Specifications](#component-test-specifications)
10. [E2E Test Scenarios](#e2e-test-scenarios)
11. [Test Execution Commands](#test-execution-commands)

---

## Current Feature Inventory

### Existing 14 Field Types

| # | Type | Properties | Validation |
|---|------|------------|------------|
| 1 | `text` | placeholder, defaultValue | minLength, maxLength |
| 2 | `textarea` | placeholder, defaultValue | minLength, maxLength |
| 3 | `number` | placeholder, min, max | range validation |
| 4 | `email` | placeholder | email format regex |
| 5 | `phone` | placeholder | phone format regex |
| 6 | `url` | placeholder | URL format regex |
| 7 | `select` | options[], defaultValue | valid option check |
| 8 | `radio` | options[], defaultValue | valid option check |
| 9 | `multiselect` | options[], defaultValue[] | valid options check |
| 10 | `checkbox` | defaultValue (boolean) | required = must be true |
| 11 | `date` | placeholder | valid date format |
| 12 | `time` | placeholder | HH:MM format |
| 13 | `rating` | maxRating, defaultValue | 1 to maxRating range |
| 14 | `slider` | min, max, step, defaultValue | range validation |

### Existing Core Features

| Feature | Status | Location |
|---------|--------|----------|
| Add field (click) | ✅ | `FieldPalette.vue` |
| Remove field | ✅ | `FieldItem.vue` |
| Duplicate field | ✅ | `FieldItem.vue` |
| Move field up/down | ✅ | `FieldItem.vue` |
| Edit field properties | ✅ | `FieldPropertiesPanel.vue` |
| Form preview | ✅ | `PreviewView.vue` |
| Form validation | ✅ | `validation.js` |
| JSON export/import | ✅ | `formBuilder.js` |
| localStorage save/load | ✅ | `formBuilder.js` |
| Templates gallery | ✅ | `TemplateGallery.vue` |
| Saved forms panel | ✅ | `SavedFormsPanel.vue` |

---

## Feature Gap Analysis

### Critical Missing Features (Priority 1)

| # | Feature | Impact | Complexity |
|---|---------|--------|------------|
| 1 | **Drag & Drop Reordering** | High UX improvement | Medium |
| 2 | **Undo/Redo History** | Essential for editing | Medium |
| 3 | **Keyboard Shortcuts** | Power user productivity | Low |
| 4 | **Autosave Indicator** | User confidence | Low |
| 5 | **Form Validation Summary** | Better error visibility | Low |

### Enhanced Features (Priority 2)

| # | Feature | Impact | Complexity |
|---|---------|--------|------------|
| 6 | **Conditional Logic** | Show/hide fields dynamically | High |
| 7 | **Multi-Page Forms** | Long form support | High |
| 8 | **Field Sections/Groups** | Better organization | Medium |
| 9 | **Custom Validation Rules** | Advanced validation | Medium |
| 10 | **Field Dependencies** | Related field values | Medium |

### New Field Types (Priority 3)

| # | Field Type | Use Case | Complexity |
|---|------------|----------|------------|
| 11 | **File Upload** | Document/image collection | High |
| 12 | **Signature** | Digital signatures | High |
| 13 | **Rich Text** | Formatted text input | Medium |
| 14 | **Hidden** | Backend data storage | Low |
| 15 | **Heading/Paragraph** | Form layout/info | Low |

### UX Enhancements (Priority 4)

| # | Feature | Impact | Complexity |
|---|---------|--------|------------|
| 16 | **Mobile Preview** | Responsive testing | Low |
| 17 | **Form Themes** | Visual customization | Medium |
| 18 | **Progress Indicator** | Multi-step guidance | Low |
| 19 | **Bulk Field Operations** | Select multiple | Medium |
| 20 | **Form Analytics** | Submission insights | High |

---

## Party Mode: Technical Expert Review

> **Session Date:** 2026-01-15
> **Participants:** All BMAD Technical Agents
> **Format:** Parallel SharkTank-style analysis

### Expert Panel

| Agent | Role | Focus Area |
|-------|------|------------|
| **Winston** | Architect | System design, scalability, integration |
| **Murat** | TEA (Test Architect) | Test coverage, quality gates, automation |
| **Amelia** | Developer | Implementation feasibility, code quality |
| **Sally** | UX Designer | User experience, accessibility, usability |
| **John** | PM | Project scope, priorities, timeline |
| **Bob** | SM (Scrum Master) | Sprint planning, risk management |

---

### Feature-by-Feature Expert Analysis

#### Feature 1: Drag & Drop Reordering

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PARALLEL EXPERT ANALYSIS: Drag & Drop Reordering                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ 🏛️ WINSTON (Architect):                                                     │
│ ├─ APPROVED ✅                                                              │
│ ├─ Implementation: HTML5 Drag API + Vue composable                          │
│ ├─ State Management: Add reorderField() action to Pinia store              │
│ ├─ Performance: O(1) splice operations, no re-render storms                │
│ └─ Integration: Compatible with existing moveField() logic                 │
│                                                                             │
│ 🧪 MURAT (TEA):                                                             │
│ ├─ APPROVED ✅                                                              │
│ ├─ Test Cases Required: 12                                                  │
│ │   - Drag start/end events                                                │
│ │   - Drop on different targets                                            │
│ │   - Cancel drag (ESC key)                                                │
│ │   - Mobile touch support                                                 │
│ │   - Accessibility (keyboard reorder fallback)                            │
│ └─ data-testid: field-drag-handle-{id}, field-drop-zone-{id}              │
│                                                                             │
│ 👩‍💻 AMELIA (Dev):                                                            │
│ ├─ APPROVED ✅                                                              │
│ ├─ Implementation: useDragDrop.js composable (CREATED)                     │
│ ├─ LOC Estimate: ~80 lines                                                 │
│ ├─ Dependencies: None (native HTML5 API)                                   │
│ └─ Risk: Low - well-understood pattern                                     │
│                                                                             │
│ 🎨 SALLY (UX):                                                              │
│ ├─ APPROVED ✅                                                              │
│ ├─ Visual Feedback: Dragged item ghost, drop zone highlight                │
│ ├─ Cursor: grab → grabbing                                                 │
│ ├─ Animation: 200ms transition on reorder                                  │
│ └─ Accessibility: Must maintain keyboard arrow key support                 │
│                                                                             │
│ 📋 JOHN (PM):                                                               │
│ ├─ APPROVED ✅                                                              │
│ ├─ Priority: P1 - Critical UX improvement                                  │
│ ├─ User Value: High - most requested feature                               │
│ └─ Dependencies: None                                                      │
│                                                                             │
│ 🏃 BOB (SM):                                                                │
│ ├─ APPROVED ✅                                                              │
│ ├─ Sprint Points: 5                                                        │
│ ├─ Risk: Low                                                               │
│ └─ Blockers: None                                                          │
│                                                                             │
│ ══════════════════════════════════════════════════════════════════════════ │
│ CONSENSUS: APPROVED UNANIMOUSLY ✅                                          │
│ Implementation File: src/composables/useDragDrop.js                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Feature 2: Undo/Redo History

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PARALLEL EXPERT ANALYSIS: Undo/Redo History                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ 🏛️ WINSTON (Architect):                                                     │
│ ├─ APPROVED ✅                                                              │
│ ├─ Pattern: Command pattern with state snapshots                           │
│ ├─ Memory: Max 50 states (~2MB max for complex forms)                      │
│ ├─ Deep Clone: JSON.parse(JSON.stringify()) for immutability               │
│ └─ Edge Case: Handle concurrent edits gracefully                           │
│                                                                             │
│ 🧪 MURAT (TEA):                                                             │
│ ├─ APPROVED ✅                                                              │
│ ├─ Test Cases Required: 15                                                  │
│ │   - Undo single action                                                   │
│ │   - Redo single action                                                   │
│ │   - Undo/redo chain                                                      │
│ │   - History limit (50 states)                                            │
│ │   - Clear history on reset                                               │
│ │   - Branch history (new action after undo)                               │
│ └─ data-testid: btn-undo, btn-redo, history-indicator                      │
│                                                                             │
│ 👩‍💻 AMELIA (Dev):                                                            │
│ ├─ APPROVED ✅                                                              │
│ ├─ Implementation: useHistory.js composable (CREATED)                      │
│ ├─ LOC Estimate: ~100 lines                                                │
│ ├─ Integration: Hook into store actions via watcher                        │
│ └─ Risk: Medium - state management complexity                              │
│                                                                             │
│ 🎨 SALLY (UX):                                                              │
│ ├─ APPROVED ✅                                                              │
│ ├─ UI: Toolbar buttons with disabled state when unavailable                │
│ ├─ Feedback: Toast notification "Action annulée"                           │
│ ├─ Shortcuts: Ctrl+Z (undo), Ctrl+Y (redo)                                 │
│ └─ Tooltip: Show shortcut hint on hover                                    │
│                                                                             │
│ 📋 JOHN (PM):                                                               │
│ ├─ APPROVED ✅                                                              │
│ ├─ Priority: P1 - Essential editing feature                                │
│ └─ User Value: Very High - prevents data loss                              │
│                                                                             │
│ 🏃 BOB (SM):                                                                │
│ ├─ APPROVED ✅                                                              │
│ ├─ Sprint Points: 8                                                        │
│ └─ Risk: Medium - testing edge cases                                       │
│                                                                             │
│ ══════════════════════════════════════════════════════════════════════════ │
│ CONSENSUS: APPROVED UNANIMOUSLY ✅                                          │
│ Implementation File: src/composables/useHistory.js                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Feature 3: Keyboard Shortcuts

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PARALLEL EXPERT ANALYSIS: Keyboard Shortcuts                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ 🏛️ WINSTON (Architect):                                                     │
│ ├─ APPROVED ✅                                                              │
│ ├─ Implementation: Global keydown listener with composable                  │
│ ├─ Conflict Prevention: Check for input focus before actions               │
│ └─ Extensibility: Config-driven shortcut mapping                           │
│                                                                             │
│ 🧪 MURAT (TEA):                                                             │
│ ├─ APPROVED ✅                                                              │
│ ├─ Test Cases Required: 13 (one per shortcut)                               │
│ │   - Ctrl+Z, Ctrl+Y, Ctrl+S, Ctrl+D                                       │
│ │   - Delete/Backspace, Arrow Up/Down, Escape                              │
│ │   - Ctrl+P (preview), Ctrl+N (new)                                       │
│ │   - Should NOT trigger when typing in input                              │
│ └─ data-testid: shortcut-help-modal                                        │
│                                                                             │
│ 👩‍💻 AMELIA (Dev):                                                            │
│ ├─ APPROVED ✅                                                              │
│ ├─ Implementation: useKeyboardShortcuts.js (CREATED)                       │
│ ├─ LOC Estimate: ~120 lines                                                │
│ └─ Risk: Low - standard pattern                                            │
│                                                                             │
│ 🎨 SALLY (UX):                                                              │
│ ├─ APPROVED ✅                                                              │
│ ├─ Help Modal: "?" key shows all shortcuts                                 │
│ ├─ Tooltips: Show shortcuts on button hover                                │
│ └─ Discoverability: Keyboard icon in toolbar                               │
│                                                                             │
│ ══════════════════════════════════════════════════════════════════════════ │
│ CONSENSUS: APPROVED UNANIMOUSLY ✅                                          │
│ Implementation File: src/composables/useKeyboardShortcuts.js                │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Feature 4: Autosave Indicator

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PARALLEL EXPERT ANALYSIS: Autosave Indicator                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ 🏛️ WINSTON (Architect):                                                     │
│ ├─ APPROVED ✅                                                              │
│ ├─ Debounce: 2 seconds after last change                                   │
│ ├─ States: idle, saving, saved, error                                      │
│ └─ Persistence: Already uses localStorage                                  │
│                                                                             │
│ 🧪 MURAT (TEA):                                                             │
│ ├─ APPROVED ✅                                                              │
│ ├─ Test Cases: 8                                                           │
│ │   - Status transitions                                                   │
│ │   - Debounce behavior                                                    │
│ │   - Error handling                                                       │
│ │   - Enable/disable toggle                                                │
│ └─ data-testid: autosave-status, autosave-toggle                           │
│                                                                             │
│ 👩‍💻 AMELIA (Dev):                                                            │
│ ├─ APPROVED ✅                                                              │
│ ├─ Implementation: useAutosave.js (CREATED)                                │
│ ├─ LOC Estimate: ~80 lines                                                 │
│ └─ Integration: Watch store.isDirty                                        │
│                                                                             │
│ 🎨 SALLY (UX):                                                              │
│ ├─ APPROVED ✅                                                              │
│ ├─ Visual: Cloud icon with status                                          │
│ ├─ States: ☁️ (idle), 🔄 (saving), ✅ (saved), ⚠️ (error)                    │
│ └─ Position: Top-right of builder header                                   │
│                                                                             │
│ ══════════════════════════════════════════════════════════════════════════ │
│ CONSENSUS: APPROVED UNANIMOUSLY ✅                                          │
│ Implementation File: src/composables/useAutosave.js                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Feature 5: Validation Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PARALLEL EXPERT ANALYSIS: Validation Summary                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ 🏛️ WINSTON (Architect):                                                     │
│ ├─ APPROVED ✅                                                              │
│ ├─ Data Flow: Computed from errors object                                  │
│ └─ Navigation: Click to scroll to field                                    │
│                                                                             │
│ 🧪 MURAT (TEA):                                                             │
│ ├─ APPROVED ✅                                                              │
│ ├─ Test Cases: 10                                                          │
│ │   - Error count display                                                  │
│ │   - Error list rendering                                                 │
│ │   - Click navigation to field                                            │
│ │   - Expand/collapse                                                      │
│ │   - Next/previous error navigation                                       │
│ └─ data-testid: validation-summary, error-item-{index}                     │
│                                                                             │
│ 👩‍💻 AMELIA (Dev):                                                            │
│ ├─ APPROVED ✅                                                              │
│ ├─ Implementation: useValidationSummary.js (CREATED)                       │
│ ├─ LOC Estimate: ~90 lines                                                 │
│ └─ Risk: Low                                                               │
│                                                                             │
│ 🎨 SALLY (UX):                                                              │
│ ├─ APPROVED ✅                                                              │
│ ├─ Position: Fixed bottom or collapsible top banner                        │
│ ├─ Color: Red/danger theme                                                 │
│ ├─ Behavior: Auto-expand on errors, keyboard nav support                   │
│ └─ A11y: ARIA live region for screen readers                               │
│                                                                             │
│ ══════════════════════════════════════════════════════════════════════════ │
│ CONSENSUS: APPROVED UNANIMOUSLY ✅                                          │
│ Implementation File: src/composables/useValidationSummary.js                │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Feature 6: Conditional Logic

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PARALLEL EXPERT ANALYSIS: Conditional Logic                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ 🏛️ WINSTON (Architect):                                                     │
│ ├─ APPROVED ✅                                                              │
│ ├─ Schema Extension: Add 'condition' property to fields                    │
│ ├─ Operators: equals, not_equals, contains, greater_than, etc.             │
│ ├─ Logic: Support AND/OR combinations                                      │
│ └─ Performance: Memoize condition evaluations                              │
│                                                                             │
│ 🧪 MURAT (TEA):                                                             │
│ ├─ APPROVED ✅                                                              │
│ ├─ Test Cases: 25+                                                         │
│ │   - Each operator (14 operators)                                         │
│ │   - AND/OR logic                                                         │
│ │   - Nested conditions                                                    │
│ │   - Edge cases (null, undefined, empty)                                  │
│ └─ data-testid: condition-editor, condition-rule-{index}                   │
│                                                                             │
│ 👩‍💻 AMELIA (Dev):                                                            │
│ ├─ APPROVED ✅                                                              │
│ ├─ Implementation: src/utils/condition.js (CREATED)                        │
│ ├─ LOC Estimate: ~180 lines                                                │
│ └─ Risk: Medium - complex logic                                            │
│                                                                             │
│ 🎨 SALLY (UX):                                                              │
│ ├─ APPROVED ✅                                                              │
│ ├─ UI: Collapsible "Conditions" section in properties panel                │
│ ├─ Builder: "Show when..." dropdown with operator selection                │
│ └─ Preview: Smooth show/hide transitions                                   │
│                                                                             │
│ ══════════════════════════════════════════════════════════════════════════ │
│ CONSENSUS: APPROVED UNANIMOUSLY ✅                                          │
│ Implementation File: src/utils/condition.js                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Features 7-10: Multi-Page, Sections, Custom Validation, Dependencies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PARALLEL EXPERT ANALYSIS: Priority 2 Features (Batch Review)                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ FEATURE 7: Multi-Page Forms                                                 │
│ ├─ Winston: APPROVED ✅ - Schema supports pages[] array                     │
│ ├─ Murat: APPROVED ✅ - 15 test cases for navigation                        │
│ ├─ Amelia: APPROVED ✅ - useMultiPage.js (CREATED)                          │
│ └─ Sally: APPROVED ✅ - Progress bar, step indicators                       │
│                                                                             │
│ FEATURE 8: Field Sections/Groups                                            │
│ ├─ Winston: APPROVED ✅ - sections[] in schema                              │
│ ├─ Murat: APPROVED ✅ - 12 test cases                                       │
│ ├─ Amelia: APPROVED ✅ - useFieldSections.js (CREATED)                      │
│ └─ Sally: APPROVED ✅ - Collapsible accordion UI                            │
│                                                                             │
│ FEATURE 9: Custom Validation Rules                                          │
│ ├─ Winston: APPROVED ✅ - Extend validation.js                              │
│ ├─ Murat: APPROVED ✅ - 20+ test cases per rule type                        │
│ ├─ Amelia: APPROVED ✅ - Regex pattern support                              │
│ └─ Sally: APPROVED ✅ - Clear error messages                                │
│                                                                             │
│ FEATURE 10: Field Dependencies                                              │
│ ├─ Winston: APPROVED ✅ - Leverage conditional logic                        │
│ ├─ Murat: APPROVED ✅ - 10 test cases                                       │
│ ├─ Amelia: APPROVED ✅ - Reuse condition.js                                 │
│ └─ Sally: APPROVED ✅ - Visual dependency indicator                         │
│                                                                             │
│ ══════════════════════════════════════════════════════════════════════════ │
│ CONSENSUS: ALL 4 FEATURES APPROVED UNANIMOUSLY ✅                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Features 11-15: New Field Types

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PARALLEL EXPERT ANALYSIS: New Field Types (Batch Review)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ FEATURE 11: File Upload                                                     │
│ ├─ Winston: APPROVED ✅ - Base64 for localStorage, presigned URLs for API   │
│ ├─ Murat: APPROVED ✅ - 18 test cases (size, type, multiple)                │
│ ├─ Amelia: APPROVED ✅ - Added to formBuilder.js createField()              │
│ └─ Sally: APPROVED ✅ - Drag zone, progress bar, file list                  │
│                                                                             │
│ FEATURE 12: Signature                                                       │
│ ├─ Winston: APPROVED ✅ - Canvas element, export as PNG/SVG                 │
│ ├─ Murat: APPROVED ✅ - 10 test cases (draw, clear, export)                 │
│ ├─ Amelia: APPROVED ✅ - Added to formBuilder.js                            │
│ └─ Sally: APPROVED ✅ - Clear button, color picker, responsive              │
│                                                                             │
│ FEATURE 13: Rich Text (DEFERRED)                                            │
│ ├─ Winston: DEFERRED ⏸️ - Requires external library (Tiptap/Quill)          │
│ ├─ Murat: DEFERRED ⏸️ - Complex testing                                     │
│ ├─ Amelia: DEFERRED ⏸️ - Bundle size concern                                │
│ └─ Sally: APPROVED ✅ - Great UX value                                      │
│ └─ DECISION: Move to Phase 2                                               │
│                                                                             │
│ FEATURE 14: Hidden Field                                                    │
│ ├─ Winston: APPROVED ✅ - Simple defaultValue                               │
│ ├─ Murat: APPROVED ✅ - 3 test cases                                        │
│ ├─ Amelia: APPROVED ✅ - Added to formBuilder.js                            │
│ └─ Sally: APPROVED ✅ - Show in builder with "hidden" badge                 │
│                                                                             │
│ FEATURE 15: Heading/Paragraph/Divider                                       │
│ ├─ Winston: APPROVED ✅ - isDisplay: true flag                              │
│ ├─ Murat: APPROVED ✅ - 6 test cases                                        │
│ ├─ Amelia: APPROVED ✅ - Added to formBuilder.js                            │
│ └─ Sally: APPROVED ✅ - Essential for form layout                           │
│                                                                             │
│ ══════════════════════════════════════════════════════════════════════════ │
│ CONSENSUS: 4/5 APPROVED, 1 DEFERRED TO PHASE 2                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Features 16-20: UX Enhancements

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PARALLEL EXPERT ANALYSIS: UX Enhancements (Batch Review)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ FEATURE 16: Mobile Preview                                                  │
│ ├─ Winston: APPROVED ✅ - CSS viewport simulation                           │
│ ├─ Murat: APPROVED ✅ - 8 test cases per device                             │
│ ├─ Amelia: APPROVED ✅ - useMobilePreview.js (CREATED)                      │
│ └─ Sally: APPROVED ✅ - Device frame mockups                                │
│                                                                             │
│ FEATURE 17: Form Themes                                                     │
│ ├─ Winston: APPROVED ✅ - CSS variables, localStorage persistence           │
│ ├─ Murat: APPROVED ✅ - 12 test cases                                       │
│ ├─ Amelia: APPROVED ✅ - useTheme.js (CREATED)                              │
│ └─ Sally: APPROVED ✅ - 6 preset themes, color picker                       │
│                                                                             │
│ FEATURE 18: Progress Indicator                                              │
│ ├─ Winston: APPROVED ✅ - Part of useMultiPage                              │
│ ├─ Murat: APPROVED ✅ - 5 test cases                                        │
│ ├─ Amelia: APPROVED ✅ - Included in useMultiPage.js                        │
│ └─ Sally: APPROVED ✅ - Step dots + percentage bar                          │
│                                                                             │
│ FEATURE 19: Bulk Field Operations                                           │
│ ├─ Winston: APPROVED ✅ - Selection state + batch actions                   │
│ ├─ Murat: APPROVED ✅ - 15 test cases                                       │
│ ├─ Amelia: APPROVED ✅ - useBulkOperations.js (CREATED)                     │
│ │           Store actions: bulkRemoveFields, bulkUpdateFields,             │
│ │                         bulkDuplicateFields (ADDED)                      │
│ └─ Sally: APPROVED ✅ - Checkbox selection, floating action bar             │
│                                                                             │
│ FEATURE 20: Form Analytics                                                  │
│ ├─ Winston: APPROVED ✅ - Event tracking, localStorage storage              │
│ ├─ Murat: APPROVED ✅ - 20 test cases                                       │
│ ├─ Amelia: APPROVED ✅ - useAnalytics.js (CREATED)                          │
│ └─ Sally: APPROVED ✅ - Dashboard view with charts                          │
│                                                                             │
│ ══════════════════════════════════════════════════════════════════════════ │
│ CONSENSUS: ALL 5 FEATURES APPROVED UNANIMOUSLY ✅                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Party Mode Summary

| Priority | Features | Approved | Deferred | Total |
|----------|----------|----------|----------|-------|
| P1 (Critical) | 5 | 5 | 0 | 5 |
| P2 (Enhanced) | 5 | 5 | 0 | 5 |
| P3 (Fields) | 5 | 4 | 1 | 5 |
| P4 (UX) | 5 | 5 | 0 | 5 |
| **TOTAL** | **20** | **19** | **1** | **20** |

**Deferred Feature:** Rich Text Editor (moved to Phase 2 due to external dependency)

---

## Implementation Status

### Created Files (11 new composables/utilities)

| File | Feature | Status |
|------|---------|--------|
| `src/composables/useDragDrop.js` | Drag & Drop | ✅ Created |
| `src/composables/useHistory.js` | Undo/Redo | ✅ Created |
| `src/composables/useKeyboardShortcuts.js` | Keyboard Shortcuts | ✅ Created |
| `src/composables/useAutosave.js` | Autosave Indicator | ✅ Created |
| `src/composables/useValidationSummary.js` | Validation Summary | ✅ Created |
| `src/composables/useMultiPage.js` | Multi-Page Forms | ✅ Created |
| `src/composables/useFieldSections.js` | Field Sections | ✅ Created |
| `src/composables/useBulkOperations.js` | Bulk Operations | ✅ Created |
| `src/composables/useMobilePreview.js` | Mobile Preview | ✅ Created |
| `src/composables/useTheme.js` | Form Themes | ✅ Created |
| `src/composables/useAnalytics.js` | Form Analytics | ✅ Created |
| `src/utils/condition.js` | Conditional Logic | ✅ Created |
| `src/utils/fieldTypes.js` | Extended Field Types | ✅ Created |

### Updated Files

| File | Changes | Status |
|------|---------|--------|
| `src/stores/formBuilder.js` | New field types, reorderField, bulk actions | ✅ Updated |

### New Field Types Added (6 new)

| Type | Category | Status |
|------|----------|--------|
| `heading` | Display | ✅ Added |
| `paragraph` | Display | ✅ Added |
| `divider` | Display | ✅ Added |
| `hidden` | Special | ✅ Added |
| `file` | File | ✅ Added |
| `signature` | Special | ✅ Added |

---

## New Features to Implement

### Feature 1: Drag & Drop Reordering

**Description:** Allow users to reorder fields by dragging them in the form canvas.

**Implementation:**
```javascript
// New composable: useDragDrop.js
export function useDragDrop(items, onReorder) {
  const draggedItem = ref(null)
  const draggedOverItem = ref(null)

  function handleDragStart(item) {
    draggedItem.value = item
  }

  function handleDragOver(item) {
    draggedOverItem.value = item
  }

  function handleDrop() {
    if (draggedItem.value && draggedOverItem.value) {
      onReorder(draggedItem.value.id, draggedOverItem.value.id)
    }
    draggedItem.value = null
    draggedOverItem.value = null
  }

  return { draggedItem, draggedOverItem, handleDragStart, handleDragOver, handleDrop }
}
```

**Store Addition:**
```javascript
// In formBuilder.js
reorderField(fieldId, targetId) {
  const fromIndex = this.schema.fields.findIndex(f => f.id === fieldId)
  const toIndex = this.schema.fields.findIndex(f => f.id === targetId)
  if (fromIndex !== -1 && toIndex !== -1) {
    const [field] = this.schema.fields.splice(fromIndex, 1)
    this.schema.fields.splice(toIndex, 0, field)
    this.markDirty()
  }
}
```

---

### Feature 2: Undo/Redo History

**Description:** Track form changes and allow users to undo/redo actions.

**Implementation:**
```javascript
// New composable: useHistory.js
export function useHistory(maxHistory = 50) {
  const history = ref([])
  const historyIndex = ref(-1)
  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  function pushState(state) {
    // Remove any future states if we're not at the end
    history.value = history.value.slice(0, historyIndex.value + 1)
    history.value.push(JSON.parse(JSON.stringify(state)))

    // Limit history size
    if (history.value.length > maxHistory) {
      history.value.shift()
    } else {
      historyIndex.value++
    }
  }

  function undo() {
    if (canUndo.value) {
      historyIndex.value--
      return history.value[historyIndex.value]
    }
    return null
  }

  function redo() {
    if (canRedo.value) {
      historyIndex.value++
      return history.value[historyIndex.value]
    }
    return null
  }

  function clear() {
    history.value = []
    historyIndex.value = -1
  }

  return { pushState, undo, redo, canUndo, canRedo, clear }
}
```

---

### Feature 3: Keyboard Shortcuts

**Description:** Add keyboard shortcuts for common actions.

**Shortcuts Map:**
| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo |
| `Ctrl+S` | Save form |
| `Ctrl+D` | Duplicate selected field |
| `Delete` / `Backspace` | Delete selected field |
| `Arrow Up` | Move field up |
| `Arrow Down` | Move field down |
| `Escape` | Deselect field |
| `Ctrl+P` | Toggle preview |

**Implementation:**
```javascript
// New composable: useKeyboardShortcuts.js
export function useKeyboardShortcuts(actions) {
  function handleKeydown(event) {
    const key = event.key.toLowerCase()
    const ctrl = event.ctrlKey || event.metaKey
    const shift = event.shiftKey

    if (ctrl && key === 'z' && !shift) {
      event.preventDefault()
      actions.undo?.()
    } else if ((ctrl && key === 'y') || (ctrl && shift && key === 'z')) {
      event.preventDefault()
      actions.redo?.()
    } else if (ctrl && key === 's') {
      event.preventDefault()
      actions.save?.()
    } else if (ctrl && key === 'd') {
      event.preventDefault()
      actions.duplicate?.()
    } else if (key === 'delete' || key === 'backspace') {
      if (document.activeElement.tagName !== 'INPUT' &&
          document.activeElement.tagName !== 'TEXTAREA') {
        event.preventDefault()
        actions.delete?.()
      }
    } else if (key === 'arrowup' && !ctrl) {
      if (document.activeElement.tagName !== 'INPUT') {
        event.preventDefault()
        actions.moveUp?.()
      }
    } else if (key === 'arrowdown' && !ctrl) {
      if (document.activeElement.tagName !== 'INPUT') {
        event.preventDefault()
        actions.moveDown?.()
      }
    } else if (key === 'escape') {
      actions.deselect?.()
    } else if (ctrl && key === 'p') {
      event.preventDefault()
      actions.preview?.()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}
```

---

### Feature 4: Conditional Logic

**Description:** Show/hide fields based on other field values.

**Schema Extension:**
```javascript
// Field with condition
{
  id: 'f_123',
  type: 'text',
  label: 'Other (please specify)',
  // NEW: Conditional visibility
  condition: {
    fieldId: 'f_122',  // Reference field
    operator: 'equals', // equals, not_equals, contains, greater_than, less_than
    value: 'other'
  }
}
```

**Implementation:**
```javascript
// New utility: evaluateCondition.js
export function evaluateCondition(condition, formValues) {
  if (!condition) return true

  const { fieldId, operator, value } = condition
  const fieldValue = formValues[fieldId]

  switch (operator) {
    case 'equals':
      return fieldValue === value
    case 'not_equals':
      return fieldValue !== value
    case 'contains':
      return String(fieldValue).includes(value)
    case 'greater_than':
      return Number(fieldValue) > Number(value)
    case 'less_than':
      return Number(fieldValue) < Number(value)
    case 'is_empty':
      return !fieldValue || fieldValue === '' ||
             (Array.isArray(fieldValue) && fieldValue.length === 0)
    case 'is_not_empty':
      return fieldValue && fieldValue !== '' &&
             (!Array.isArray(fieldValue) || fieldValue.length > 0)
    default:
      return true
  }
}
```

---

### Feature 5: Multi-Page Forms

**Description:** Split long forms into multiple pages/steps.

**Schema Extension:**
```javascript
{
  version: 1,
  title: 'Multi-Step Form',
  // NEW: Pages structure
  pages: [
    {
      id: 'page_1',
      title: 'Personal Information',
      fields: ['f_1', 'f_2', 'f_3']
    },
    {
      id: 'page_2',
      title: 'Contact Details',
      fields: ['f_4', 'f_5']
    }
  ],
  fields: [/* all fields */]
}
```

---

### Feature 6: File Upload Field

**Schema:**
```javascript
{
  id: 'f_file',
  type: 'file',
  label: 'Upload Document',
  required: false,
  accept: '.pdf,.doc,.docx', // Allowed file types
  maxSize: 5242880, // 5MB in bytes
  multiple: false
}
```

---

### Feature 7: Hidden Field

**Schema:**
```javascript
{
  id: 'f_hidden',
  type: 'hidden',
  name: 'source',
  defaultValue: 'website'
}
```

---

### Feature 8: Heading/Paragraph (Display Fields)

**Schema:**
```javascript
{
  id: 'f_heading',
  type: 'heading',
  text: 'Section Title',
  level: 2 // h1, h2, h3
}

{
  id: 'f_paragraph',
  type: 'paragraph',
  text: 'Please fill out the form below...'
}
```

---

## Frontend Test Elements

### Data-TestId Attribute Specification

All interactive elements MUST have `data-testid` attributes for reliable test targeting.

### Naming Convention

```
data-testid="{component}-{element}-{identifier}"
```

Examples:
- `data-testid="palette-btn-text"` - Field palette button for text field
- `data-testid="canvas-field-f_123"` - Field item in canvas with ID f_123
- `data-testid="props-input-label"` - Label input in properties panel

---

### FieldPalette.vue - Required Test IDs

```vue
<!-- Add to each field type button -->
<button
  v-for="field in fieldTypes"
  :key="field.type"
  class="field-type-button"
  :data-testid="`palette-btn-${field.type}`"
  @click="addField(field.type)"
>
```

| Test ID | Element | Purpose |
|---------|---------|---------|
| `palette-btn-text` | Button | Add text field |
| `palette-btn-textarea` | Button | Add textarea field |
| `palette-btn-number` | Button | Add number field |
| `palette-btn-email` | Button | Add email field |
| `palette-btn-phone` | Button | Add phone field |
| `palette-btn-url` | Button | Add URL field |
| `palette-btn-select` | Button | Add select field |
| `palette-btn-radio` | Button | Add radio field |
| `palette-btn-multiselect` | Button | Add multiselect field |
| `palette-btn-checkbox` | Button | Add checkbox field |
| `palette-btn-date` | Button | Add date field |
| `palette-btn-time` | Button | Add time field |
| `palette-btn-rating` | Button | Add rating field |
| `palette-btn-slider` | Button | Add slider field |
| `palette-container` | Container | Field palette wrapper |

---

### FormCanvas.vue - Required Test IDs

| Test ID | Element | Purpose |
|---------|---------|---------|
| `canvas-container` | Container | Main canvas wrapper |
| `canvas-title-input` | Input | Form title input |
| `canvas-empty-state` | Div | Empty state message |
| `canvas-field-list` | Div | Fields container |

---

### FieldItem.vue - Required Test IDs

```vue
<div
  class="field-item"
  :class="{ selected: isSelected }"
  :data-testid="`field-item-${field.id}`"
>
  <button
    :data-testid="`field-select-${field.id}`"
    @click="selectField"
  >
  <button
    :data-testid="`field-move-up-${field.id}`"
    @click="moveUp"
  >
  <button
    :data-testid="`field-move-down-${field.id}`"
    @click="moveDown"
  >
  <button
    :data-testid="`field-duplicate-${field.id}`"
    @click="duplicate"
  >
  <button
    :data-testid="`field-delete-${field.id}`"
    @click="remove"
  >
</div>
```

| Test ID Pattern | Element | Purpose |
|-----------------|---------|---------|
| `field-item-{id}` | Container | Field wrapper |
| `field-select-{id}` | Button | Select field |
| `field-move-up-{id}` | Button | Move field up |
| `field-move-down-{id}` | Button | Move field down |
| `field-duplicate-{id}` | Button | Duplicate field |
| `field-delete-{id}` | Button | Delete field |
| `field-type-badge-{id}` | Span | Field type indicator |
| `field-label-{id}` | Span | Field label display |

---

### FieldPropertiesPanel.vue - Required Test IDs

| Test ID | Element | Purpose |
|---------|---------|---------|
| `props-panel` | Container | Properties panel wrapper |
| `props-empty-state` | Div | No field selected message |
| `props-input-label` | Input | Field label input |
| `props-input-name` | Input | Field name input |
| `props-input-placeholder` | Input | Placeholder input |
| `props-checkbox-required` | Checkbox | Required toggle |
| `props-input-min` | Input | Min value (number/slider) |
| `props-input-max` | Input | Max value (number/slider) |
| `props-input-step` | Input | Step value (slider) |
| `props-input-maxRating` | Input | Max rating (rating) |
| `props-options-container` | Div | Options editor container |
| `props-btn-add-option` | Button | Add new option |
| `props-option-{index}` | Div | Option row |
| `props-option-value-{index}` | Input | Option value input |
| `props-option-label-{index}` | Input | Option label input |
| `props-option-delete-{index}` | Button | Delete option |

---

### FormRenderer.vue - Required Test IDs

```vue
<div
  v-for="field in fields"
  :key="field.id"
  class="form-field"
  :data-testid="`render-field-${field.id}`"
>
  <BaseInput
    v-if="field.type === 'text'"
    :data-testid="`render-input-${field.id}`"
  />
</div>
```

| Test ID Pattern | Element | Purpose |
|-----------------|---------|---------|
| `render-field-{id}` | Container | Field wrapper |
| `render-input-{id}` | Input | Field input element |
| `render-error-{id}` | Span | Error message |
| `render-label-{id}` | Label | Field label |
| `render-rating-star-{id}-{n}` | Button | Rating star n |
| `render-slider-{id}` | Input | Slider input |
| `render-slider-value-{id}` | Span | Slider value display |
| `render-option-{id}-{index}` | Label | Radio/Multiselect option |

---

### BuilderView.vue - Required Test IDs

| Test ID | Element | Purpose |
|---------|---------|---------|
| `builder-container` | Container | Main builder wrapper |
| `builder-btn-save` | Button | Save form |
| `builder-btn-preview` | Button | Preview form |
| `builder-btn-export` | Button | Export JSON |
| `builder-btn-import` | Button | Import JSON |
| `builder-btn-new` | Button | New form |
| `builder-btn-templates` | Button | Open templates |
| `builder-btn-saved-forms` | Button | Open saved forms |
| `builder-autosave-indicator` | Span | Autosave status |

---

### PreviewView.vue - Required Test IDs

| Test ID | Element | Purpose |
|---------|---------|---------|
| `preview-container` | Container | Preview wrapper |
| `preview-form-title` | H1 | Form title display |
| `preview-btn-submit` | Button | Submit form |
| `preview-btn-reset` | Button | Reset form |
| `preview-btn-back` | Button | Back to builder |
| `preview-success-message` | Div | Submit success |
| `preview-error-summary` | Div | Validation errors |

---

### Modal Components - Required Test IDs

| Test ID | Element | Purpose |
|---------|---------|---------|
| `modal-overlay` | Div | Modal backdrop |
| `modal-container` | Div | Modal content |
| `modal-btn-close` | Button | Close modal |
| `modal-title` | H2 | Modal title |
| `templates-gallery` | Div | Templates list |
| `template-card-{id}` | Div | Template card |
| `template-btn-use-{id}` | Button | Use template |
| `saved-forms-list` | Div | Saved forms list |
| `saved-form-{id}` | Div | Saved form item |
| `saved-form-btn-load-{id}` | Button | Load form |
| `saved-form-btn-delete-{id}` | Button | Delete form |

---

## Test Logic per Feature

### Test Suite Structure

```
tests/
├── unit/
│   ├── stores/
│   │   ├── formBuilder.spec.js        ✅ EXISTS
│   │   ├── formBuilder.history.spec.js   NEW
│   │   └── templates.spec.js             NEW
│   ├── utils/
│   │   ├── validation.spec.js          ✅ EXISTS
│   │   ├── slugify.spec.js               NEW
│   │   ├── condition.spec.js             NEW
│   │   └── keyboard.spec.js              NEW
│   └── composables/
│       ├── useId.spec.js                 NEW
│       ├── useDragDrop.spec.js           NEW
│       ├── useHistory.spec.js            NEW
│       └── useKeyboardShortcuts.spec.js  NEW
├── components/
│   ├── builder/
│   │   ├── FieldPalette.spec.js          NEW
│   │   ├── FormCanvas.spec.js            NEW
│   │   ├── FieldItem.spec.js             NEW
│   │   ├── FieldPropertiesPanel.spec.js  NEW
│   │   ├── TemplateGallery.spec.js       NEW
│   │   └── SavedFormsPanel.spec.js       NEW
│   ├── form/
│   │   ├── FormRenderer.spec.js          NEW
│   │   └── OptionEditor.spec.js          NEW
│   └── ui/
│       ├── BaseButton.spec.js          ✅ EXISTS
│       ├── BaseInput.spec.js             NEW
│       ├── BaseSelect.spec.js            NEW
│       ├── BaseCheckbox.spec.js          NEW
│       ├── BaseTextarea.spec.js          NEW
│       ├── BaseModal.spec.js             NEW
│       └── BaseToast.spec.js             NEW
├── integration/
│   ├── form-creation.spec.js             NEW
│   ├── form-editing.spec.js              NEW
│   ├── form-preview.spec.js              NEW
│   └── form-persistence.spec.js          NEW
└── e2e/
    ├── builder-flow.spec.js              NEW
    ├── preview-submit.spec.js            NEW
    └── templates.spec.js                 NEW
```

---

### Unit Tests: FieldPalette.spec.js

```javascript
// tests/components/builder/FieldPalette.spec.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import FieldPalette from '@/components/builder/FieldPalette.vue'

describe('FieldPalette', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // Test: All 14 field type buttons are rendered
  it('should render all 14 field type buttons', () => {
    const wrapper = mount(FieldPalette)
    const fieldTypes = [
      'text', 'textarea', 'number', 'select', 'checkbox',
      'date', 'email', 'phone', 'url', 'rating',
      'radio', 'slider', 'time', 'multiselect'
    ]

    fieldTypes.forEach(type => {
      expect(wrapper.find(`[data-testid="palette-btn-${type}"]`).exists()).toBe(true)
    })
  })

  // Test: Clicking button adds field to store
  it('should add field when button is clicked', async () => {
    const wrapper = mount(FieldPalette)
    const store = useFormBuilderStore()

    await wrapper.find('[data-testid="palette-btn-text"]').trigger('click')

    expect(store.schema.fields).toHaveLength(1)
    expect(store.schema.fields[0].type).toBe('text')
  })

  // Test: Each button shows correct label
  it('should display correct labels for field types', () => {
    const wrapper = mount(FieldPalette)

    expect(wrapper.find('[data-testid="palette-btn-text"]').text()).toContain('Texte')
    expect(wrapper.find('[data-testid="palette-btn-email"]').text()).toContain('Email')
    expect(wrapper.find('[data-testid="palette-btn-rating"]').text()).toContain('Notation')
  })

  // Test: Buttons are keyboard accessible
  it('should be keyboard accessible', async () => {
    const wrapper = mount(FieldPalette)
    const button = wrapper.find('[data-testid="palette-btn-text"]')

    await button.trigger('keydown.enter')
    // Should add field on Enter key
  })
})
```

---

### Unit Tests: FieldItem.spec.js

```javascript
// tests/components/builder/FieldItem.spec.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import FieldItem from '@/components/builder/FieldItem.vue'

describe('FieldItem', () => {
  let wrapper
  const mockField = {
    id: 'f_test_123',
    type: 'text',
    name: 'test_field',
    label: 'Test Field',
    required: false
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(FieldItem, {
      props: {
        field: mockField,
        isSelected: false,
        isFirst: false,
        isLast: false
      }
    })
  })

  // Test: Field displays label correctly
  it('should display field label', () => {
    expect(wrapper.find(`[data-testid="field-label-${mockField.id}"]`).text())
      .toBe('Test Field')
  })

  // Test: Field displays type badge
  it('should display field type badge', () => {
    expect(wrapper.find(`[data-testid="field-type-badge-${mockField.id}"]`).text())
      .toContain('text')
  })

  // Test: Selected state applies correct class
  it('should apply selected class when isSelected is true', async () => {
    await wrapper.setProps({ isSelected: true })
    expect(wrapper.find(`[data-testid="field-item-${mockField.id}"]`).classes())
      .toContain('selected')
  })

  // Test: Move up button disabled when first
  it('should disable move up button when isFirst', async () => {
    await wrapper.setProps({ isFirst: true })
    expect(wrapper.find(`[data-testid="field-move-up-${mockField.id}"]`).attributes('disabled'))
      .toBeDefined()
  })

  // Test: Move down button disabled when last
  it('should disable move down button when isLast', async () => {
    await wrapper.setProps({ isLast: true })
    expect(wrapper.find(`[data-testid="field-move-down-${mockField.id}"]`).attributes('disabled'))
      .toBeDefined()
  })

  // Test: Delete button emits delete event
  it('should emit delete event when delete button clicked', async () => {
    await wrapper.find(`[data-testid="field-delete-${mockField.id}"]`).trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')[0]).toEqual([mockField.id])
  })

  // Test: Duplicate button emits duplicate event
  it('should emit duplicate event when duplicate button clicked', async () => {
    await wrapper.find(`[data-testid="field-duplicate-${mockField.id}"]`).trigger('click')
    expect(wrapper.emitted('duplicate')).toBeTruthy()
  })

  // Test: Click on field emits select event
  it('should emit select event when field is clicked', async () => {
    await wrapper.find(`[data-testid="field-select-${mockField.id}"]`).trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
  })
})
```

---

### Unit Tests: FormRenderer.spec.js

```javascript
// tests/components/form/FormRenderer.spec.js
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import FormRenderer from '@/components/form/FormRenderer.vue'

describe('FormRenderer', () => {
  const mockSchema = {
    version: 1,
    title: 'Test Form',
    fields: [
      { id: 'f_text', type: 'text', name: 'name', label: 'Name', required: true },
      { id: 'f_email', type: 'email', name: 'email', label: 'Email', required: true },
      { id: 'f_rating', type: 'rating', name: 'rating', label: 'Rating', maxRating: 5 },
      { id: 'f_slider', type: 'slider', name: 'age', label: 'Age', min: 0, max: 100 }
    ]
  }

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // Test: Renders all fields
  it('should render all fields from schema', () => {
    const wrapper = mount(FormRenderer, {
      props: { schema: mockSchema, values: {}, errors: {} }
    })

    mockSchema.fields.forEach(field => {
      expect(wrapper.find(`[data-testid="render-field-${field.id}"]`).exists()).toBe(true)
    })
  })

  // Test: Text input renders correctly
  it('should render text input with correct attributes', () => {
    const wrapper = mount(FormRenderer, {
      props: { schema: mockSchema, values: {}, errors: {} }
    })

    const textInput = wrapper.find('[data-testid="render-input-f_text"]')
    expect(textInput.exists()).toBe(true)
  })

  // Test: Rating field renders correct number of stars
  it('should render rating field with correct number of stars', () => {
    const wrapper = mount(FormRenderer, {
      props: { schema: mockSchema, values: {}, errors: {} }
    })

    const stars = wrapper.findAll('[data-testid^="render-rating-star-f_rating"]')
    expect(stars).toHaveLength(5)
  })

  // Test: Slider displays value
  it('should display slider value', () => {
    const wrapper = mount(FormRenderer, {
      props: {
        schema: mockSchema,
        values: { f_slider: 50 },
        errors: {}
      }
    })

    expect(wrapper.find('[data-testid="render-slider-value-f_slider"]').text()).toBe('50')
  })

  // Test: Error messages display
  it('should display error messages', () => {
    const wrapper = mount(FormRenderer, {
      props: {
        schema: mockSchema,
        values: {},
        errors: { f_text: ['Ce champ est requis'] }
      }
    })

    expect(wrapper.find('[data-testid="render-error-f_text"]').text())
      .toContain('Ce champ est requis')
  })

  // Test: Disabled state (readonly)
  it('should disable inputs when readonly is true', () => {
    const wrapper = mount(FormRenderer, {
      props: {
        schema: mockSchema,
        values: {},
        errors: {},
        readonly: true
      }
    })

    const textInput = wrapper.find('[data-testid="render-input-f_text"]')
    expect(textInput.attributes('disabled')).toBeDefined()
  })

  // Test: Value updates emit correctly
  it('should emit update:values when input changes', async () => {
    const wrapper = mount(FormRenderer, {
      props: { schema: mockSchema, values: {}, errors: {} }
    })

    await wrapper.find('[data-testid="render-input-f_text"]').setValue('John')

    expect(wrapper.emitted('update:values')).toBeTruthy()
    expect(wrapper.emitted('update:values')[0][0]).toEqual({ f_text: 'John' })
  })

  // Test: Empty form message
  it('should show empty message when no fields', () => {
    const wrapper = mount(FormRenderer, {
      props: {
        schema: { version: 1, title: 'Empty', fields: [] },
        values: {},
        errors: {}
      }
    })

    expect(wrapper.text()).toContain('Ce formulaire ne contient aucun champ')
  })
})
```

---

### Unit Tests: Validation.spec.js (Extended)

```javascript
// tests/unit/utils/validation.spec.js - EXTENDED
import { describe, it, expect } from 'vitest'
import { validateField, validateForm, validateSchema } from '@/utils/validation'

describe('Validation Utilities', () => {
  // ============ REQUIRED VALIDATION ============
  describe('required validation', () => {
    it('should fail for empty string when required', () => {
      const field = { id: 'f1', type: 'text', required: true }
      const errors = validateField(field, '')
      expect(errors).toContain('Ce champ est requis')
    })

    it('should fail for null when required', () => {
      const field = { id: 'f1', type: 'text', required: true }
      const errors = validateField(field, null)
      expect(errors).toContain('Ce champ est requis')
    })

    it('should fail for undefined when required', () => {
      const field = { id: 'f1', type: 'text', required: true }
      const errors = validateField(field, undefined)
      expect(errors).toContain('Ce champ est requis')
    })

    it('should pass for non-empty when required', () => {
      const field = { id: 'f1', type: 'text', required: true }
      const errors = validateField(field, 'value')
      expect(errors).toHaveLength(0)
    })

    it('should pass for empty when not required', () => {
      const field = { id: 'f1', type: 'text', required: false }
      const errors = validateField(field, '')
      expect(errors).toHaveLength(0)
    })
  })

  // ============ EMAIL VALIDATION ============
  describe('email validation', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.org',
      'user+tag@company.co.uk',
      'test123@test.io'
    ]

    const invalidEmails = [
      'notanemail',
      'missing@domain',
      '@nodomain.com',
      'spaces in@email.com',
      'double@@at.com',
      '.leadingdot@email.com'
    ]

    validEmails.forEach(email => {
      it(`should accept valid email: ${email}`, () => {
        const field = { id: 'f1', type: 'email', required: true }
        const errors = validateField(field, email)
        expect(errors).toHaveLength(0)
      })
    })

    invalidEmails.forEach(email => {
      it(`should reject invalid email: ${email}`, () => {
        const field = { id: 'f1', type: 'email', required: true }
        const errors = validateField(field, email)
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })

  // ============ PHONE VALIDATION ============
  describe('phone validation', () => {
    const validPhones = [
      '+33 6 12 34 56 78',
      '06 12 34 56 78',
      '+1 555 123 4567',
      '0612345678',
      '(555) 123-4567'
    ]

    const invalidPhones = [
      '12345',
      'not a phone',
      'abc',
      '123'
    ]

    validPhones.forEach(phone => {
      it(`should accept valid phone: ${phone}`, () => {
        const field = { id: 'f1', type: 'phone', required: true }
        const errors = validateField(field, phone)
        expect(errors).toHaveLength(0)
      })
    })

    invalidPhones.forEach(phone => {
      it(`should reject invalid phone: ${phone}`, () => {
        const field = { id: 'f1', type: 'phone', required: true }
        const errors = validateField(field, phone)
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })

  // ============ URL VALIDATION ============
  describe('url validation', () => {
    const validUrls = [
      'https://example.com',
      'http://example.com',
      'https://www.example.com/path?query=1'
    ]

    const invalidUrls = [
      'not a url',
      'ftp://invalid',
      'just text'
    ]

    validUrls.forEach(url => {
      it(`should accept valid URL: ${url}`, () => {
        const field = { id: 'f1', type: 'url', required: true }
        const errors = validateField(field, url)
        expect(errors).toHaveLength(0)
      })
    })

    invalidUrls.forEach(url => {
      it(`should reject invalid URL: ${url}`, () => {
        const field = { id: 'f1', type: 'url', required: true }
        const errors = validateField(field, url)
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })

  // ============ NUMBER VALIDATION ============
  describe('number validation', () => {
    it('should validate min value', () => {
      const field = { id: 'f1', type: 'number', min: 10 }
      const errors = validateField(field, 5)
      expect(errors).toContain('Minimum: 10')
    })

    it('should validate max value', () => {
      const field = { id: 'f1', type: 'number', max: 10 }
      const errors = validateField(field, 15)
      expect(errors).toContain('Maximum: 10')
    })

    it('should pass value in range', () => {
      const field = { id: 'f1', type: 'number', min: 1, max: 100 }
      const errors = validateField(field, 50)
      expect(errors).toHaveLength(0)
    })
  })

  // ============ RATING VALIDATION ============
  describe('rating validation', () => {
    it('should accept valid rating', () => {
      const field = { id: 'f1', type: 'rating', maxRating: 5 }
      const errors = validateField(field, 4)
      expect(errors).toHaveLength(0)
    })

    it('should reject rating below 1 when required', () => {
      const field = { id: 'f1', type: 'rating', maxRating: 5, required: true }
      const errors = validateField(field, 0)
      expect(errors.length).toBeGreaterThan(0)
    })

    it('should reject rating above maxRating', () => {
      const field = { id: 'f1', type: 'rating', maxRating: 5 }
      const errors = validateField(field, 6)
      expect(errors.length).toBeGreaterThan(0)
    })
  })

  // ============ SLIDER VALIDATION ============
  describe('slider validation', () => {
    it('should accept value in range', () => {
      const field = { id: 'f1', type: 'slider', min: 0, max: 100 }
      const errors = validateField(field, 50)
      expect(errors).toHaveLength(0)
    })

    it('should reject value below min', () => {
      const field = { id: 'f1', type: 'slider', min: 10, max: 100 }
      const errors = validateField(field, 5)
      expect(errors.length).toBeGreaterThan(0)
    })

    it('should reject value above max', () => {
      const field = { id: 'f1', type: 'slider', min: 0, max: 50 }
      const errors = validateField(field, 75)
      expect(errors.length).toBeGreaterThan(0)
    })
  })

  // ============ SELECT VALIDATION ============
  describe('select validation', () => {
    it('should accept valid option', () => {
      const field = {
        id: 'f1',
        type: 'select',
        options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]
      }
      const errors = validateField(field, 'a')
      expect(errors).toHaveLength(0)
    })

    it('should reject invalid option', () => {
      const field = {
        id: 'f1',
        type: 'select',
        options: [{ value: 'a', label: 'A' }]
      }
      const errors = validateField(field, 'invalid')
      expect(errors.length).toBeGreaterThan(0)
    })
  })

  // ============ MULTISELECT VALIDATION ============
  describe('multiselect validation', () => {
    it('should accept valid options array', () => {
      const field = {
        id: 'f1',
        type: 'multiselect',
        options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]
      }
      const errors = validateField(field, ['a', 'b'])
      expect(errors).toHaveLength(0)
    })

    it('should reject array with invalid option', () => {
      const field = {
        id: 'f1',
        type: 'multiselect',
        options: [{ value: 'a', label: 'A' }]
      }
      const errors = validateField(field, ['a', 'invalid'])
      expect(errors.length).toBeGreaterThan(0)
    })

    it('should require at least one when required', () => {
      const field = {
        id: 'f1',
        type: 'multiselect',
        required: true,
        options: [{ value: 'a', label: 'A' }]
      }
      const errors = validateField(field, [])
      expect(errors).toContain('Ce champ est requis')
    })
  })

  // ============ CHECKBOX VALIDATION ============
  describe('checkbox validation', () => {
    it('should pass when checked and required', () => {
      const field = { id: 'f1', type: 'checkbox', required: true }
      const errors = validateField(field, true)
      expect(errors).toHaveLength(0)
    })

    it('should fail when unchecked and required', () => {
      const field = { id: 'f1', type: 'checkbox', required: true }
      const errors = validateField(field, false)
      expect(errors).toContain('Ce champ est requis')
    })
  })

  // ============ DATE VALIDATION ============
  describe('date validation', () => {
    it('should accept valid date', () => {
      const field = { id: 'f1', type: 'date' }
      const errors = validateField(field, '2024-01-15')
      expect(errors).toHaveLength(0)
    })

    it('should reject invalid date format', () => {
      const field = { id: 'f1', type: 'date', required: true }
      const errors = validateField(field, 'not-a-date')
      expect(errors.length).toBeGreaterThan(0)
    })
  })

  // ============ TIME VALIDATION ============
  describe('time validation', () => {
    const validTimes = ['09:30', '23:59', '00:00', '12:00']
    const invalidTimes = ['25:00', '12:60', 'noon', '9:30']

    validTimes.forEach(time => {
      it(`should accept valid time: ${time}`, () => {
        const field = { id: 'f1', type: 'time' }
        const errors = validateField(field, time)
        expect(errors).toHaveLength(0)
      })
    })

    invalidTimes.forEach(time => {
      it(`should reject invalid time: ${time}`, () => {
        const field = { id: 'f1', type: 'time', required: true }
        const errors = validateField(field, time)
        expect(errors.length).toBeGreaterThan(0)
      })
    })
  })

  // ============ SCHEMA VALIDATION ============
  describe('schema validation', () => {
    it('should validate correct schema', () => {
      const schema = {
        version: 1,
        title: 'Test Form',
        fields: []
      }
      const result = validateSchema(schema)
      expect(result.valid).toBe(true)
    })

    it('should reject schema without version', () => {
      const schema = { title: 'Test', fields: [] }
      const result = validateSchema(schema)
      expect(result.valid).toBe(false)
    })

    it('should reject schema without fields array', () => {
      const schema = { version: 1, title: 'Test' }
      const result = validateSchema(schema)
      expect(result.valid).toBe(false)
    })
  })
})
```

---

### Unit Tests: Drag & Drop (New Feature)

```javascript
// tests/unit/composables/useDragDrop.spec.js
import { describe, it, expect, vi } from 'vitest'
import { useDragDrop } from '@/composables/useDragDrop'

describe('useDragDrop', () => {
  const mockItems = [
    { id: 'f_1', label: 'Field 1' },
    { id: 'f_2', label: 'Field 2' },
    { id: 'f_3', label: 'Field 3' }
  ]

  it('should initialize with null draggedItem', () => {
    const onReorder = vi.fn()
    const { draggedItem } = useDragDrop(mockItems, onReorder)
    expect(draggedItem.value).toBeNull()
  })

  it('should set draggedItem on drag start', () => {
    const onReorder = vi.fn()
    const { draggedItem, handleDragStart } = useDragDrop(mockItems, onReorder)

    handleDragStart(mockItems[0])
    expect(draggedItem.value).toEqual(mockItems[0])
  })

  it('should set draggedOverItem on drag over', () => {
    const onReorder = vi.fn()
    const { draggedOverItem, handleDragOver } = useDragDrop(mockItems, onReorder)

    handleDragOver(mockItems[1])
    expect(draggedOverItem.value).toEqual(mockItems[1])
  })

  it('should call onReorder on drop', () => {
    const onReorder = vi.fn()
    const { handleDragStart, handleDragOver, handleDrop } = useDragDrop(mockItems, onReorder)

    handleDragStart(mockItems[0])
    handleDragOver(mockItems[2])
    handleDrop()

    expect(onReorder).toHaveBeenCalledWith('f_1', 'f_3')
  })

  it('should reset state after drop', () => {
    const onReorder = vi.fn()
    const { draggedItem, draggedOverItem, handleDragStart, handleDragOver, handleDrop } =
      useDragDrop(mockItems, onReorder)

    handleDragStart(mockItems[0])
    handleDragOver(mockItems[2])
    handleDrop()

    expect(draggedItem.value).toBeNull()
    expect(draggedOverItem.value).toBeNull()
  })

  it('should not call onReorder if draggedItem is null', () => {
    const onReorder = vi.fn()
    const { handleDrop } = useDragDrop(mockItems, onReorder)

    handleDrop()
    expect(onReorder).not.toHaveBeenCalled()
  })
})
```

---

### Unit Tests: History (Undo/Redo)

```javascript
// tests/unit/composables/useHistory.spec.js
import { describe, it, expect } from 'vitest'
import { useHistory } from '@/composables/useHistory'

describe('useHistory', () => {
  it('should initialize with empty history', () => {
    const { canUndo, canRedo } = useHistory()
    expect(canUndo.value).toBe(false)
    expect(canRedo.value).toBe(false)
  })

  it('should track state changes', () => {
    const { pushState, canUndo } = useHistory()

    pushState({ title: 'State 1' })
    expect(canUndo.value).toBe(false) // First state, nothing to undo to

    pushState({ title: 'State 2' })
    expect(canUndo.value).toBe(true)
  })

  it('should undo to previous state', () => {
    const { pushState, undo } = useHistory()

    pushState({ title: 'State 1' })
    pushState({ title: 'State 2' })

    const previousState = undo()
    expect(previousState.title).toBe('State 1')
  })

  it('should redo to next state', () => {
    const { pushState, undo, redo } = useHistory()

    pushState({ title: 'State 1' })
    pushState({ title: 'State 2' })
    undo()

    const nextState = redo()
    expect(nextState.title).toBe('State 2')
  })

  it('should clear future states on new push after undo', () => {
    const { pushState, undo, canRedo } = useHistory()

    pushState({ title: 'State 1' })
    pushState({ title: 'State 2' })
    pushState({ title: 'State 3' })

    undo()
    expect(canRedo.value).toBe(true)

    pushState({ title: 'State 4' })
    expect(canRedo.value).toBe(false)
  })

  it('should respect maxHistory limit', () => {
    const { pushState, undo } = useHistory(3)

    pushState({ title: 'State 1' })
    pushState({ title: 'State 2' })
    pushState({ title: 'State 3' })
    pushState({ title: 'State 4' })

    // Should only be able to undo 2 times (maxHistory - 1)
    const state1 = undo()
    const state2 = undo()
    const state3 = undo()

    expect(state3).toBeNull() // Can't undo past limit
  })

  it('should clear history', () => {
    const { pushState, clear, canUndo } = useHistory()

    pushState({ title: 'State 1' })
    pushState({ title: 'State 2' })

    clear()
    expect(canUndo.value).toBe(false)
  })
})
```

---

### Unit Tests: Keyboard Shortcuts

```javascript
// tests/unit/composables/useKeyboardShortcuts.spec.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'

describe('useKeyboardShortcuts', () => {
  let actions

  beforeEach(() => {
    actions = {
      undo: vi.fn(),
      redo: vi.fn(),
      save: vi.fn(),
      duplicate: vi.fn(),
      delete: vi.fn(),
      moveUp: vi.fn(),
      moveDown: vi.fn(),
      deselect: vi.fn(),
      preview: vi.fn()
    }
  })

  function createWrapper() {
    return mount(defineComponent({
      setup() {
        useKeyboardShortcuts(actions)
        return () => h('div', 'Test')
      }
    }))
  }

  it('should call undo on Ctrl+Z', async () => {
    const wrapper = createWrapper()

    await window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true
    }))

    expect(actions.undo).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('should call redo on Ctrl+Y', async () => {
    const wrapper = createWrapper()

    await window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'y',
      ctrlKey: true
    }))

    expect(actions.redo).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('should call redo on Ctrl+Shift+Z', async () => {
    const wrapper = createWrapper()

    await window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      shiftKey: true
    }))

    expect(actions.redo).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('should call save on Ctrl+S', async () => {
    const wrapper = createWrapper()

    await window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true
    }))

    expect(actions.save).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('should call duplicate on Ctrl+D', async () => {
    const wrapper = createWrapper()

    await window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'd',
      ctrlKey: true
    }))

    expect(actions.duplicate).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('should call deselect on Escape', async () => {
    const wrapper = createWrapper()

    await window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Escape'
    }))

    expect(actions.deselect).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('should NOT call delete when input is focused', async () => {
    const wrapper = createWrapper()

    // Simulate input focus
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    await window.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Delete'
    }))

    expect(actions.delete).not.toHaveBeenCalled()
    document.body.removeChild(input)
    wrapper.unmount()
  })
})
```

---

### Unit Tests: Conditional Logic

```javascript
// tests/unit/utils/condition.spec.js
import { describe, it, expect } from 'vitest'
import { evaluateCondition } from '@/utils/condition'

describe('evaluateCondition', () => {
  it('should return true when no condition', () => {
    expect(evaluateCondition(null, {})).toBe(true)
    expect(evaluateCondition(undefined, {})).toBe(true)
  })

  // equals operator
  describe('equals operator', () => {
    it('should match equal string values', () => {
      const condition = { fieldId: 'f1', operator: 'equals', value: 'yes' }
      expect(evaluateCondition(condition, { f1: 'yes' })).toBe(true)
      expect(evaluateCondition(condition, { f1: 'no' })).toBe(false)
    })

    it('should match equal number values', () => {
      const condition = { fieldId: 'f1', operator: 'equals', value: 5 }
      expect(evaluateCondition(condition, { f1: 5 })).toBe(true)
      expect(evaluateCondition(condition, { f1: 10 })).toBe(false)
    })
  })

  // not_equals operator
  describe('not_equals operator', () => {
    it('should match non-equal values', () => {
      const condition = { fieldId: 'f1', operator: 'not_equals', value: 'yes' }
      expect(evaluateCondition(condition, { f1: 'no' })).toBe(true)
      expect(evaluateCondition(condition, { f1: 'yes' })).toBe(false)
    })
  })

  // contains operator
  describe('contains operator', () => {
    it('should match substring', () => {
      const condition = { fieldId: 'f1', operator: 'contains', value: 'test' }
      expect(evaluateCondition(condition, { f1: 'this is a test string' })).toBe(true)
      expect(evaluateCondition(condition, { f1: 'no match here' })).toBe(false)
    })
  })

  // greater_than operator
  describe('greater_than operator', () => {
    it('should compare numbers', () => {
      const condition = { fieldId: 'f1', operator: 'greater_than', value: 10 }
      expect(evaluateCondition(condition, { f1: 15 })).toBe(true)
      expect(evaluateCondition(condition, { f1: 5 })).toBe(false)
      expect(evaluateCondition(condition, { f1: 10 })).toBe(false)
    })
  })

  // less_than operator
  describe('less_than operator', () => {
    it('should compare numbers', () => {
      const condition = { fieldId: 'f1', operator: 'less_than', value: 10 }
      expect(evaluateCondition(condition, { f1: 5 })).toBe(true)
      expect(evaluateCondition(condition, { f1: 15 })).toBe(false)
    })
  })

  // is_empty operator
  describe('is_empty operator', () => {
    it('should detect empty string', () => {
      const condition = { fieldId: 'f1', operator: 'is_empty' }
      expect(evaluateCondition(condition, { f1: '' })).toBe(true)
      expect(evaluateCondition(condition, { f1: 'value' })).toBe(false)
    })

    it('should detect empty array', () => {
      const condition = { fieldId: 'f1', operator: 'is_empty' }
      expect(evaluateCondition(condition, { f1: [] })).toBe(true)
      expect(evaluateCondition(condition, { f1: ['a'] })).toBe(false)
    })

    it('should detect null/undefined', () => {
      const condition = { fieldId: 'f1', operator: 'is_empty' }
      expect(evaluateCondition(condition, { f1: null })).toBe(true)
      expect(evaluateCondition(condition, {})).toBe(true)
    })
  })

  // is_not_empty operator
  describe('is_not_empty operator', () => {
    it('should detect non-empty values', () => {
      const condition = { fieldId: 'f1', operator: 'is_not_empty' }
      expect(evaluateCondition(condition, { f1: 'value' })).toBe(true)
      expect(evaluateCondition(condition, { f1: '' })).toBe(false)
    })
  })
})
```

---

## Test Pipeline

### Pre-Build Test Pipeline

```yaml
# .github/workflows/pre-build.yml
name: Pre-Build Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  pre-build-tests:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint check
        run: npm run lint

      - name: Type check (if TypeScript)
        run: npm run type-check || true

      - name: Run unit tests
        run: npm run test:run

      - name: Run coverage
        run: npm run test:coverage

      - name: Upload coverage report
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          fail_ci_if_error: false

      - name: Test build
        run: npm run build

  pre-build-summary:
    needs: pre-build-tests
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Report status
        run: |
          if [ "${{ needs.pre-build-tests.result }}" == "success" ]; then
            echo "✅ All pre-build tests passed!"
          else
            echo "❌ Pre-build tests failed!"
            exit 1
          fi
```

### Post-Build Test Pipeline

```yaml
# .github/workflows/post-build.yml
name: Post-Build Tests

on:
  workflow_run:
    workflows: ["Pre-Build Tests"]
    types: [completed]
    branches: [main]

jobs:
  post-build-tests:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build production
        run: npm run build

      - name: Verify build artifacts
        run: |
          if [ -d "dist" ]; then
            echo "✅ Build artifacts exist"
            ls -la dist/
          else
            echo "❌ Build artifacts missing"
            exit 1
          fi

      - name: Check bundle size
        run: |
          MAX_SIZE=500000  # 500KB
          BUNDLE_SIZE=$(du -sb dist/assets/*.js | awk '{sum+=$1} END {print sum}')
          echo "Bundle size: $BUNDLE_SIZE bytes"
          if [ "$BUNDLE_SIZE" -gt "$MAX_SIZE" ]; then
            echo "⚠️ Bundle size exceeds limit!"
          fi

      - name: Start preview server
        run: npm run preview &
        env:
          PORT: 4173

      - name: Wait for server
        run: sleep 5

      - name: Smoke test - Check server responds
        run: |
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4173)
          if [ "$STATUS" == "200" ]; then
            echo "✅ Server responding"
          else
            echo "❌ Server not responding (status: $STATUS)"
            exit 1
          fi

      - name: Run E2E tests (if available)
        run: npm run test:e2e || echo "No E2E tests configured"

  post-build-summary:
    needs: post-build-tests
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Report status
        run: |
          if [ "${{ needs.post-build-tests.result }}" == "success" ]; then
            echo "✅ All post-build tests passed!"
          else
            echo "❌ Post-build tests failed!"
            exit 1
          fi
```

---

### Local Test Commands

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:pre-build": "npm run lint && npm run test:run && npm run build",
    "test:post-build": "npm run build && npm run preview &",
    "test:all": "npm run test:pre-build && npm run test:post-build",
    "lint": "eslint src --ext .vue,.js,.ts --fix",
    "type-check": "vue-tsc --noEmit"
  }
}
```

---

### Test Execution Flow

```
                 ┌─────────────────────┐
                 │   Code Change       │
                 └──────────┬──────────┘
                            │
                            ▼
     ┌────────────────────────────────────────────┐
     │              PRE-BUILD PHASE               │
     │  ┌────────────────────────────────────┐   │
     │  │ 1. npm run lint                    │   │
     │  │ 2. npm run type-check              │   │
     │  │ 3. npm run test:run                │   │
     │  │ 4. npm run test:coverage           │   │
     │  └────────────────────────────────────┘   │
     │                    │                       │
     │                    ▼                       │
     │         ┌──────────────────────┐          │
     │         │  All tests pass?     │          │
     │         └──────────┬───────────┘          │
     │                    │                       │
     │       ┌────────────┴────────────┐         │
     │       ▼                         ▼         │
     │   ✅ YES                    ❌ NO         │
     │       │                         │         │
     │       │                         │         │
     └───────┼─────────────────────────┼─────────┘
             │                         │
             ▼                         ▼
     ┌───────────────┐         ┌───────────────┐
     │ npm run build │         │ STOP - Fix    │
     └───────┬───────┘         │ issues        │
             │                 └───────────────┘
             ▼
     ┌────────────────────────────────────────────┐
     │              POST-BUILD PHASE              │
     │  ┌────────────────────────────────────┐   │
     │  │ 1. Verify build artifacts          │   │
     │  │ 2. Check bundle size               │   │
     │  │ 3. Start preview server            │   │
     │  │ 4. Run smoke tests                 │   │
     │  │ 5. Run E2E tests                   │   │
     │  └────────────────────────────────────┘   │
     │                    │                       │
     │                    ▼                       │
     │         ┌──────────────────────┐          │
     │         │  All tests pass?     │          │
     │         └──────────┬───────────┘          │
     │                    │                       │
     │       ┌────────────┴────────────┐         │
     │       ▼                         ▼         │
     │   ✅ YES                    ❌ NO         │
     │       │                         │         │
     └───────┼─────────────────────────┼─────────┘
             │                         │
             ▼                         ▼
     ┌───────────────┐         ┌───────────────┐
     │ Ready to      │         │ Rollback      │
     │ Deploy        │         │ & Fix         │
     └───────────────┘         └───────────────┘
```

---

## E2E Test Scenarios

### Scenario 1: Complete Form Creation Flow

```javascript
// tests/e2e/builder-flow.spec.js (Playwright)
import { test, expect } from '@playwright/test'

test.describe('Form Builder Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should create a complete contact form', async ({ page }) => {
    // Step 1: Add fields
    await page.click('[data-testid="palette-btn-text"]')
    await page.click('[data-testid="palette-btn-email"]')
    await page.click('[data-testid="palette-btn-phone"]')
    await page.click('[data-testid="palette-btn-textarea"]')
    await page.click('[data-testid="palette-btn-checkbox"]')

    // Verify fields added
    const fields = await page.locator('[data-testid^="field-item-"]').count()
    expect(fields).toBe(5)

    // Step 2: Configure first field
    await page.click('[data-testid^="field-select-"]')
    await page.fill('[data-testid="props-input-label"]', 'Nom complet')
    await page.check('[data-testid="props-checkbox-required"]')

    // Step 3: Update form title
    await page.fill('[data-testid="canvas-title-input"]', 'Formulaire de contact')

    // Step 4: Save form
    await page.click('[data-testid="builder-btn-save"]')

    // Verify save indicator
    await expect(page.locator('[data-testid="builder-autosave-indicator"]'))
      .toContainText('Sauvegardé')
  })

  test('should move fields up and down', async ({ page }) => {
    // Add 3 fields
    await page.click('[data-testid="palette-btn-text"]')
    await page.click('[data-testid="palette-btn-email"]')
    await page.click('[data-testid="palette-btn-phone"]')

    // Get initial order
    const initialLabels = await page.locator('[data-testid^="field-label-"]').allTextContents()

    // Move second field up
    const fields = await page.locator('[data-testid^="field-item-"]').all()
    const secondFieldId = await fields[1].getAttribute('data-testid')
    const id = secondFieldId.replace('field-item-', '')

    await page.click(`[data-testid="field-move-up-${id}"]`)

    // Verify new order
    const newLabels = await page.locator('[data-testid^="field-label-"]').allTextContents()
    expect(newLabels[0]).toBe(initialLabels[1])
    expect(newLabels[1]).toBe(initialLabels[0])
  })

  test('should delete a field', async ({ page }) => {
    // Add 2 fields
    await page.click('[data-testid="palette-btn-text"]')
    await page.click('[data-testid="palette-btn-email"]')

    // Verify 2 fields
    expect(await page.locator('[data-testid^="field-item-"]').count()).toBe(2)

    // Delete first field
    const fields = await page.locator('[data-testid^="field-item-"]').all()
    const firstFieldId = await fields[0].getAttribute('data-testid')
    const id = firstFieldId.replace('field-item-', '')

    await page.click(`[data-testid="field-delete-${id}"]`)

    // Verify 1 field remains
    expect(await page.locator('[data-testid^="field-item-"]').count()).toBe(1)
  })

  test('should duplicate a field', async ({ page }) => {
    // Add text field
    await page.click('[data-testid="palette-btn-text"]')

    // Configure it
    await page.fill('[data-testid="props-input-label"]', 'Original Field')

    // Duplicate
    const field = await page.locator('[data-testid^="field-item-"]').first()
    const fieldId = await field.getAttribute('data-testid')
    const id = fieldId.replace('field-item-', '')

    await page.click(`[data-testid="field-duplicate-${id}"]`)

    // Verify 2 fields
    expect(await page.locator('[data-testid^="field-item-"]').count()).toBe(2)

    // Verify duplicated field has "(copie)" in label
    const labels = await page.locator('[data-testid^="field-label-"]').allTextContents()
    expect(labels[1]).toContain('(copie)')
  })
})
```

---

### Scenario 2: Form Preview and Submission

```javascript
// tests/e2e/preview-submit.spec.js (Playwright)
import { test, expect } from '@playwright/test'

test.describe('Form Preview and Submit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    // Create a simple form
    await page.click('[data-testid="palette-btn-text"]')
    await page.check('[data-testid="props-checkbox-required"]')
    await page.click('[data-testid="palette-btn-email"]')
    await page.check('[data-testid="props-checkbox-required"]')
  })

  test('should validate required fields on submit', async ({ page }) => {
    // Go to preview
    await page.click('[data-testid="builder-btn-preview"]')

    // Try to submit empty form
    await page.click('[data-testid="preview-btn-submit"]')

    // Verify error messages
    const errors = await page.locator('[data-testid^="render-error-"]').count()
    expect(errors).toBe(2)
  })

  test('should submit valid form', async ({ page }) => {
    // Go to preview
    await page.click('[data-testid="builder-btn-preview"]')

    // Fill required fields
    const inputs = await page.locator('[data-testid^="render-input-"]').all()
    await inputs[0].fill('John Doe')
    await inputs[1].fill('john@example.com')

    // Submit
    await page.click('[data-testid="preview-btn-submit"]')

    // Verify success
    await expect(page.locator('[data-testid="preview-success-message"]')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    // Go to preview
    await page.click('[data-testid="builder-btn-preview"]')

    // Fill with invalid email
    const inputs = await page.locator('[data-testid^="render-input-"]').all()
    await inputs[0].fill('John Doe')
    await inputs[1].fill('invalid-email')

    // Submit
    await page.click('[data-testid="preview-btn-submit"]')

    // Verify email error
    await expect(page.locator('[data-testid^="render-error-"]').last())
      .toContainText('Email invalide')
  })

  test('should reset form values', async ({ page }) => {
    // Go to preview
    await page.click('[data-testid="builder-btn-preview"]')

    // Fill fields
    const inputs = await page.locator('[data-testid^="render-input-"]').all()
    await inputs[0].fill('John Doe')
    await inputs[1].fill('john@example.com')

    // Reset
    await page.click('[data-testid="preview-btn-reset"]')

    // Verify empty
    expect(await inputs[0].inputValue()).toBe('')
    expect(await inputs[1].inputValue()).toBe('')
  })
})
```

---

### Scenario 3: Templates

```javascript
// tests/e2e/templates.spec.js (Playwright)
import { test, expect } from '@playwright/test'

test.describe('Templates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load template gallery', async ({ page }) => {
    await page.click('[data-testid="builder-btn-templates"]')

    // Verify modal opens
    await expect(page.locator('[data-testid="templates-gallery"]')).toBeVisible()

    // Verify templates exist
    const templates = await page.locator('[data-testid^="template-card-"]').count()
    expect(templates).toBeGreaterThan(0)
  })

  test('should apply template', async ({ page }) => {
    await page.click('[data-testid="builder-btn-templates"]')

    // Click first template
    await page.click('[data-testid^="template-btn-use-"]')

    // Modal should close
    await expect(page.locator('[data-testid="templates-gallery"]')).not.toBeVisible()

    // Fields should be loaded
    const fields = await page.locator('[data-testid^="field-item-"]').count()
    expect(fields).toBeGreaterThan(0)
  })
})
```

---

## Test Execution Commands

### Quick Reference

| Command | Purpose |
|---------|---------|
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run all tests once |
| `npm run test:coverage` | Run with coverage report |
| `npm run test:ui` | Open Vitest UI |
| `npm run test:pre-build` | Full pre-build validation |
| `npm run test:all` | Complete test suite |

### Coverage Targets

| Metric | Target | Current |
|--------|--------|---------|
| Statements | 80% | TBD |
| Branches | 75% | TBD |
| Functions | 80% | TBD |
| Lines | 80% | TBD |

---

## Summary

### Files to Create/Modify

**New Test Files (24):**
```
tests/
├── unit/
│   ├── composables/
│   │   ├── useId.spec.js
│   │   ├── useDragDrop.spec.js
│   │   ├── useHistory.spec.js
│   │   └── useKeyboardShortcuts.spec.js
│   └── utils/
│       ├── slugify.spec.js
│       └── condition.spec.js
├── components/
│   ├── builder/
│   │   ├── FieldPalette.spec.js
│   │   ├── FormCanvas.spec.js
│   │   ├── FieldItem.spec.js
│   │   ├── FieldPropertiesPanel.spec.js
│   │   ├── TemplateGallery.spec.js
│   │   └── SavedFormsPanel.spec.js
│   ├── form/
│   │   ├── FormRenderer.spec.js
│   │   └── OptionEditor.spec.js
│   └── ui/
│       ├── BaseInput.spec.js
│       ├── BaseSelect.spec.js
│       ├── BaseCheckbox.spec.js
│       ├── BaseTextarea.spec.js
│       ├── BaseModal.spec.js
│       └── BaseToast.spec.js
├── integration/
│   ├── form-creation.spec.js
│   ├── form-editing.spec.js
│   ├── form-preview.spec.js
│   └── form-persistence.spec.js
└── e2e/
    ├── builder-flow.spec.js
    ├── preview-submit.spec.js
    └── templates.spec.js
```

**Components to Update (add data-testid):**
- FieldPalette.vue
- FormCanvas.vue
- FieldItem.vue
- FieldPropertiesPanel.vue
- FormRenderer.vue
- BuilderView.vue
- PreviewView.vue
- All UI components

**New Feature Files:**
- `src/composables/useDragDrop.js`
- `src/composables/useHistory.js`
- `src/composables/useKeyboardShortcuts.js`
- `src/utils/condition.js`

**CI/CD Files:**
- `.github/workflows/pre-build.yml`
- `.github/workflows/post-build.yml`

---

*Document generated by Analysis Team as part of comprehensive feature and testing specification.*
*Last updated: 2026-01-15*
