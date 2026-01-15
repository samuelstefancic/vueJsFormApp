# Angular Implementation Specification

> 💻 **Author:** Amelia (Developer Agent)
> **Target:** Angular 15 with Standalone Components
> **Scope:** Full form-builder module with all 14 field types

---

## Module Structure

```
src/app/
├── form-builder/
│   ├── form-builder.module.ts          # Feature module (lazy-loaded)
│   ├── form-builder-routing.module.ts  # Route definitions
│   │
│   ├── models/
│   │   ├── field.model.ts              # Field type definitions
│   │   ├── form-schema.model.ts        # Schema structure
│   │   └── submission.model.ts         # Submission data
│   │
│   ├── services/
│   │   ├── field-factory.service.ts    # Field creation logic
│   │   ├── form-builder.service.ts     # State management
│   │   ├── form-api.service.ts         # HTTP client for backend
│   │   ├── validation.service.ts       # Form validation
│   │   └── local-storage.service.ts    # Optional offline support
│   │
│   ├── components/
│   │   ├── builder/
│   │   │   ├── builder-page/           # Main builder container
│   │   │   ├── field-palette/          # Left sidebar - field types
│   │   │   ├── form-canvas/            # Center - field list
│   │   │   ├── field-item/             # Individual field card
│   │   │   ├── properties-panel/       # Right sidebar - config
│   │   │   └── option-editor/          # For select/radio/multiselect
│   │   │
│   │   ├── preview/
│   │   │   ├── preview-page/           # Preview container
│   │   │   └── form-renderer/          # Renders form for filling
│   │   │
│   │   ├── submissions/
│   │   │   └── submissions-page/       # View submissions
│   │   │
│   │   └── shared/
│   │       ├── base-input/
│   │       ├── base-textarea/
│   │       ├── base-select/
│   │       ├── base-checkbox/
│   │       ├── base-button/
│   │       ├── base-modal/
│   │       └── icon-button/
│   │
│   └── i18n/
│       ├── en.json
│       └── fr.json
```

---

## Type Definitions

### `models/field.model.ts`

```typescript
/**
 * All 14 supported field types
 */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'url'
  | 'select'
  | 'radio'
  | 'multiselect'
  | 'checkbox'
  | 'date'
  | 'time'
  | 'rating'
  | 'slider';

/**
 * Option for select, radio, multiselect fields
 */
export interface FieldOption {
  value: string;
  label: string;
}

/**
 * Complete field definition
 */
export interface Field {
  // Required for all fields
  id: string;
  type: FieldType;
  name: string;
  label: string;
  required: boolean;

  // Optional - text-based fields
  placeholder?: string;
  defaultValue?: string | number | boolean | string[];

  // Optional - select/radio/multiselect
  options?: FieldOption[];

  // Optional - number/slider
  min?: number | null;
  max?: number | null;
  step?: number;

  // Optional - rating
  maxRating?: number;

  // Optional - text validation
  minLength?: number;
  maxLength?: number;
}

/**
 * Field type metadata for palette display
 */
export interface FieldTypeInfo {
  type: FieldType;
  label: string;
  icon: string;
  description: string;
  category: 'text' | 'numeric' | 'selection' | 'datetime';
}

/**
 * All field types with metadata
 */
export const FIELD_TYPES: FieldTypeInfo[] = [
  // Text Inputs
  { type: 'text', label: 'Text', icon: 'T', description: 'Single line text', category: 'text' },
  { type: 'textarea', label: 'Textarea', icon: '¶', description: 'Multi-line text', category: 'text' },
  { type: 'email', label: 'Email', icon: '@', description: 'Email address', category: 'text' },
  { type: 'phone', label: 'Phone', icon: '📞', description: 'Phone number', category: 'text' },
  { type: 'url', label: 'URL', icon: '🔗', description: 'Web link', category: 'text' },

  // Numeric
  { type: 'number', label: 'Number', icon: '#', description: 'Numeric value', category: 'numeric' },
  { type: 'slider', label: 'Slider', icon: '⟷', description: 'Range slider', category: 'numeric' },
  { type: 'rating', label: 'Rating', icon: '⭐', description: 'Star rating', category: 'numeric' },

  // Selection
  { type: 'select', label: 'Dropdown', icon: '▼', description: 'Dropdown list', category: 'selection' },
  { type: 'radio', label: 'Radio', icon: '◉', description: 'Single choice', category: 'selection' },
  { type: 'multiselect', label: 'Multi-select', icon: '☑', description: 'Multiple choices', category: 'selection' },
  { type: 'checkbox', label: 'Checkbox', icon: '✓', description: 'Yes/No toggle', category: 'selection' },

  // Date/Time
  { type: 'date', label: 'Date', icon: '📅', description: 'Date picker', category: 'datetime' },
  { type: 'time', label: 'Time', icon: '🕐', description: 'Time picker', category: 'datetime' },
];
```

### `models/form-schema.model.ts`

```typescript
import { Field } from './field.model';

/**
 * Complete form schema - matches Vue version exactly
 */
export interface FormSchema {
  version: number;
  title: string;
  fields: Field[];
}

/**
 * Form with metadata (from API)
 */
export interface Form {
  id: string;
  title: string;
  schema: FormSchema;
  createdAt: Date;
  updatedAt: Date;
  ownerId?: string;
}

/**
 * Form summary for list views
 */
export interface FormSummary {
  id: string;
  title: string;
  fieldCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create form request
 */
export interface FormCreate {
  title: string;
  schema: FormSchema;
}

/**
 * Update form request
 */
export interface FormUpdate {
  title?: string;
  schema?: FormSchema;
}
```

### `models/submission.model.ts`

```typescript
/**
 * Form submission
 */
export interface Submission {
  id: string;
  formId: string;
  formTitle: string;
  data: Record<string, any>;
  submittedAt: Date;
}

/**
 * Submit form request
 */
export interface SubmitRequest {
  data: Record<string, any>;
}
```

---

## Services

### `services/field-factory.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { Field, FieldType } from '../models/field.model';

@Injectable({ providedIn: 'root' })
export class FieldFactoryService {
  private counter = 0;

  /**
   * Default properties for each field type
   */
  private readonly fieldDefaults: Record<FieldType, Partial<Field>> = {
    text: {
      label: 'Text Field',
      placeholder: '',
      defaultValue: '',
    },
    textarea: {
      label: 'Text Area',
      placeholder: '',
      defaultValue: '',
    },
    number: {
      label: 'Number',
      placeholder: '',
      defaultValue: null,
      min: null,
      max: null,
    },
    email: {
      label: 'Email',
      placeholder: 'example@domain.com',
      defaultValue: '',
    },
    phone: {
      label: 'Phone',
      placeholder: '+33 6 00 00 00 00',
      defaultValue: '',
    },
    url: {
      label: 'URL',
      placeholder: 'https://',
      defaultValue: '',
    },
    select: {
      label: 'Dropdown',
      options: [],
      defaultValue: '',
    },
    radio: {
      label: 'Radio Buttons',
      options: [],
      defaultValue: '',
    },
    multiselect: {
      label: 'Multi-select',
      options: [],
      defaultValue: [],
    },
    checkbox: {
      label: 'Checkbox',
      defaultValue: false,
    },
    date: {
      label: 'Date',
      placeholder: 'dd/mm/yyyy',
      defaultValue: '',
    },
    time: {
      label: 'Time',
      placeholder: 'HH:MM',
      defaultValue: '',
    },
    rating: {
      label: 'Rating',
      maxRating: 5,
      defaultValue: 0,
    },
    slider: {
      label: 'Slider',
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 50,
    },
  };

  /**
   * Generate unique field ID
   */
  generateId(): string {
    this.counter++;
    return `f_${Date.now()}_${this.counter}`;
  }

  /**
   * Create a new field with defaults for the given type
   */
  createField(type: FieldType): Field {
    const defaults = this.fieldDefaults[type];
    const id = this.generateId();

    return {
      id,
      type,
      name: this.generateName(type),
      label: defaults.label || type,
      required: false,
      ...defaults,
    } as Field;
  }

  /**
   * Generate a unique field name based on type
   */
  private generateName(type: FieldType): string {
    return `${type}_${Date.now()}`;
  }

  /**
   * Clone a field with new ID
   */
  cloneField(field: Field): Field {
    return {
      ...JSON.parse(JSON.stringify(field)),
      id: this.generateId(),
      name: `${field.name}_copy`,
      label: `${field.label} (copy)`,
    };
  }
}
```

### `services/form-builder.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged } from 'rxjs';
import { Field, FieldType } from '../models/field.model';
import { FormSchema } from '../models/form-schema.model';
import { FieldFactoryService } from './field-factory.service';

@Injectable({ providedIn: 'root' })
export class FormBuilderService {
  // Initial schema state
  private readonly initialSchema: FormSchema = {
    version: 1,
    title: 'New Form',
    fields: [],
  };

  // State subjects
  private schemaSubject = new BehaviorSubject<FormSchema>(this.getInitialSchema());
  private selectedFieldIdSubject = new BehaviorSubject<string | null>(null);
  private isDirtySubject = new BehaviorSubject<boolean>(false);

  // Public observables
  schema$ = this.schemaSubject.asObservable();
  selectedFieldId$ = this.selectedFieldIdSubject.asObservable();
  isDirty$ = this.isDirtySubject.asObservable();

  // Derived observables
  selectedField$: Observable<Field | null>;
  fieldCount$: Observable<number>;
  hasFields$: Observable<boolean>;

  constructor(private fieldFactory: FieldFactoryService) {
    // Set up derived observables
    this.selectedField$ = new Observable((subscriber) => {
      this.schema$.subscribe((schema) => {
        const selectedId = this.selectedFieldIdSubject.getValue();
        const field = schema.fields.find((f) => f.id === selectedId) || null;
        subscriber.next(field);
      });
    });

    this.fieldCount$ = new Observable((subscriber) => {
      this.schema$.subscribe((schema) => {
        subscriber.next(schema.fields.length);
      });
    });

    this.hasFields$ = new Observable((subscriber) => {
      this.schema$.subscribe((schema) => {
        subscriber.next(schema.fields.length > 0);
      });
    });
  }

  // ============ GETTERS ============

  get schema(): FormSchema {
    return this.schemaSubject.getValue();
  }

  get selectedFieldId(): string | null {
    return this.selectedFieldIdSubject.getValue();
  }

  get selectedField(): Field | null {
    const id = this.selectedFieldId;
    return this.schema.fields.find((f) => f.id === id) || null;
  }

  get fieldNames(): string[] {
    return this.schema.fields.map((f) => f.name);
  }

  // ============ ACTIONS ============

  /**
   * Add a new field of the specified type
   */
  addField(type: FieldType): void {
    const newField = this.fieldFactory.createField(type);
    const currentSchema = this.schema;

    this.updateSchema({
      ...currentSchema,
      fields: [...currentSchema.fields, newField],
    });

    this.selectField(newField.id);
    this.markDirty();
  }

  /**
   * Remove a field by ID
   */
  removeField(id: string): void {
    const currentSchema = this.schema;
    const index = currentSchema.fields.findIndex((f) => f.id === id);

    if (index === -1) return;

    const newFields = currentSchema.fields.filter((f) => f.id !== id);

    this.updateSchema({
      ...currentSchema,
      fields: newFields,
    });

    // Select next field or clear selection
    if (this.selectedFieldId === id) {
      const nextField = newFields[index] || newFields[index - 1] || null;
      this.selectField(nextField?.id || null);
    }

    this.markDirty();
  }

  /**
   * Duplicate a field
   */
  duplicateField(id: string): void {
    const field = this.schema.fields.find((f) => f.id === id);
    if (!field) return;

    const clonedField = this.fieldFactory.cloneField(field);
    const index = this.schema.fields.findIndex((f) => f.id === id);

    const newFields = [...this.schema.fields];
    newFields.splice(index + 1, 0, clonedField);

    this.updateSchema({
      ...this.schema,
      fields: newFields,
    });

    this.selectField(clonedField.id);
    this.markDirty();
  }

  /**
   * Update field properties
   */
  updateField(id: string, updates: Partial<Field>): void {
    const newFields = this.schema.fields.map((field) =>
      field.id === id ? { ...field, ...updates } : field
    );

    this.updateSchema({
      ...this.schema,
      fields: newFields,
    });

    this.markDirty();
  }

  /**
   * Select a field by ID
   */
  selectField(id: string | null): void {
    this.selectedFieldIdSubject.next(id);
  }

  /**
   * Move field up or down
   */
  moveField(id: string, direction: 'up' | 'down'): void {
    const index = this.schema.fields.findIndex((f) => f.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= this.schema.fields.length) return;

    const newFields = [...this.schema.fields];
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];

    this.updateSchema({
      ...this.schema,
      fields: newFields,
    });

    this.markDirty();
  }

  /**
   * Update form title
   */
  updateTitle(title: string): void {
    this.updateSchema({
      ...this.schema,
      title,
    });
    this.markDirty();
  }

  /**
   * Import schema from JSON
   */
  importSchema(json: string): boolean {
    try {
      const parsed = JSON.parse(json);

      // Validate required fields
      if (!parsed.version || !parsed.title || !Array.isArray(parsed.fields)) {
        return false;
      }

      this.updateSchema(parsed);
      this.selectField(null);
      this.markDirty();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Export schema to JSON
   */
  exportSchema(): string {
    return JSON.stringify(this.schema, null, 2);
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    this.updateSchema(this.getInitialSchema());
    this.selectField(null);
    this.isDirtySubject.next(false);
  }

  /**
   * Load schema (e.g., from API)
   */
  loadSchema(schema: FormSchema): void {
    this.updateSchema(schema);
    this.selectField(null);
    this.isDirtySubject.next(false);
  }

  // ============ PRIVATE HELPERS ============

  private getInitialSchema(): FormSchema {
    return JSON.parse(JSON.stringify(this.initialSchema));
  }

  private updateSchema(schema: FormSchema): void {
    this.schemaSubject.next(schema);
  }

  private markDirty(): void {
    this.isDirtySubject.next(true);
  }

  markClean(): void {
    this.isDirtySubject.next(false);
  }
}
```

### `services/form-api.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Form, FormCreate, FormSummary, FormUpdate } from '../models/form-schema.model';
import { Submission, SubmitRequest } from '../models/submission.model';

@Injectable({ providedIn: 'root' })
export class FormApiService {
  private readonly baseUrl = `${environment.apiUrl}/api/forms`;

  constructor(private http: HttpClient) {}

  // ============ FORMS ============

  /**
   * Get all forms for current user
   */
  getForms(): Observable<FormSummary[]> {
    return this.http.get<FormSummary[]>(this.baseUrl);
  }

  /**
   * Get single form with full schema
   */
  getForm(id: string): Observable<Form> {
    return this.http.get<Form>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create new form
   */
  createForm(form: FormCreate): Observable<Form> {
    return this.http.post<Form>(this.baseUrl, form);
  }

  /**
   * Update existing form
   */
  updateForm(id: string, updates: FormUpdate): Observable<Form> {
    return this.http.put<Form>(`${this.baseUrl}/${id}`, updates);
  }

  /**
   * Delete form
   */
  deleteForm(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ============ SUBMISSIONS ============

  /**
   * Submit form response
   */
  submitForm(formId: string, data: SubmitRequest): Observable<Submission> {
    return this.http.post<Submission>(`${this.baseUrl}/${formId}/submit`, data);
  }

  /**
   * Get submissions for a form
   */
  getSubmissions(formId: string): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${this.baseUrl}/${formId}/submissions`);
  }

  /**
   * Delete submission
   */
  deleteSubmission(formId: string, submissionId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${formId}/submissions/${submissionId}`);
  }
}
```

---

## Component Specifications

### FieldPalette Component

```typescript
// field-palette.component.ts
@Component({
  selector: 'app-field-palette',
  templateUrl: './field-palette.component.html',
  styleUrls: ['./field-palette.component.scss'],
})
export class FieldPaletteComponent {
  fieldTypes = FIELD_TYPES;

  // Group by category for display
  fieldsByCategory = {
    text: this.fieldTypes.filter((f) => f.category === 'text'),
    numeric: this.fieldTypes.filter((f) => f.category === 'numeric'),
    selection: this.fieldTypes.filter((f) => f.category === 'selection'),
    datetime: this.fieldTypes.filter((f) => f.category === 'datetime'),
  };

  constructor(private formBuilder: FormBuilderService) {}

  addField(type: FieldType): void {
    this.formBuilder.addField(type);
  }
}
```

### FormCanvas Component

```typescript
// form-canvas.component.ts
@Component({
  selector: 'app-form-canvas',
  templateUrl: './form-canvas.component.html',
  styleUrls: ['./form-canvas.component.scss'],
})
export class FormCanvasComponent {
  schema$ = this.formBuilder.schema$;
  selectedFieldId$ = this.formBuilder.selectedFieldId$;

  constructor(private formBuilder: FormBuilderService) {}

  isSelected(fieldId: string): Observable<boolean> {
    return this.selectedFieldId$.pipe(map((id) => id === fieldId));
  }

  trackByFieldId(index: number, field: Field): string {
    return field.id;
  }
}
```

### PropertiesPanel Component

```typescript
// properties-panel.component.ts
@Component({
  selector: 'app-properties-panel',
  templateUrl: './properties-panel.component.html',
  styleUrls: ['./properties-panel.component.scss'],
})
export class PropertiesPanelComponent {
  selectedField$ = this.formBuilder.selectedField$;

  constructor(private formBuilder: FormBuilderService) {}

  updateField(updates: Partial<Field>): void {
    const field = this.formBuilder.selectedField;
    if (field) {
      this.formBuilder.updateField(field.id, updates);
    }
  }

  // Check if field type needs specific config sections
  needsOptions(type: FieldType): boolean {
    return ['select', 'radio', 'multiselect'].includes(type);
  }

  needsMinMax(type: FieldType): boolean {
    return ['number', 'slider'].includes(type);
  }

  needsRatingConfig(type: FieldType): boolean {
    return type === 'rating';
  }

  needsSliderConfig(type: FieldType): boolean {
    return type === 'slider';
  }
}
```

### FormRenderer Component

```typescript
// form-renderer.component.ts
@Component({
  selector: 'app-form-renderer',
  templateUrl: './form-renderer.component.html',
  styleUrls: ['./form-renderer.component.scss'],
})
export class FormRendererComponent implements OnInit {
  @Input() schema!: FormSchema;
  @Input() readonly = false;
  @Output() formSubmit = new EventEmitter<Record<string, any>>();

  values: Record<string, any> = {};
  errors: Record<string, string[]> = {};

  constructor(private validation: ValidationService) {}

  ngOnInit(): void {
    this.initializeValues();
  }

  private initializeValues(): void {
    this.schema.fields.forEach((field) => {
      this.values[field.id] = field.defaultValue ?? this.getDefaultForType(field.type);
    });
  }

  private getDefaultForType(type: FieldType): any {
    switch (type) {
      case 'checkbox':
        return false;
      case 'multiselect':
        return [];
      case 'number':
      case 'slider':
      case 'rating':
        return null;
      default:
        return '';
    }
  }

  updateValue(fieldId: string, value: any): void {
    this.values[fieldId] = value;
    // Clear error on change
    if (this.errors[fieldId]) {
      delete this.errors[fieldId];
    }
  }

  submit(): void {
    this.errors = this.validation.validate(this.values, this.schema);

    if (Object.keys(this.errors).length === 0) {
      this.formSubmit.emit(this.values);
    }
  }
}
```

---

## Module Definition

### `form-builder.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FormBuilderRoutingModule } from './form-builder-routing.module';

// Pages
import { BuilderPageComponent } from './components/builder/builder-page/builder-page.component';
import { PreviewPageComponent } from './components/preview/preview-page/preview-page.component';
import { SubmissionsPageComponent } from './components/submissions/submissions-page/submissions-page.component';

// Builder components
import { FieldPaletteComponent } from './components/builder/field-palette/field-palette.component';
import { FormCanvasComponent } from './components/builder/form-canvas/form-canvas.component';
import { FieldItemComponent } from './components/builder/field-item/field-item.component';
import { PropertiesPanelComponent } from './components/builder/properties-panel/properties-panel.component';
import { OptionEditorComponent } from './components/builder/option-editor/option-editor.component';

// Form components
import { FormRendererComponent } from './components/preview/form-renderer/form-renderer.component';

// Shared components
import { BaseInputComponent } from './components/shared/base-input/base-input.component';
import { BaseTextareaComponent } from './components/shared/base-textarea/base-textarea.component';
import { BaseSelectComponent } from './components/shared/base-select/base-select.component';
import { BaseCheckboxComponent } from './components/shared/base-checkbox/base-checkbox.component';
import { BaseButtonComponent } from './components/shared/base-button/base-button.component';
import { BaseModalComponent } from './components/shared/base-modal/base-modal.component';
import { IconButtonComponent } from './components/shared/icon-button/icon-button.component';

@NgModule({
  declarations: [
    // Pages
    BuilderPageComponent,
    PreviewPageComponent,
    SubmissionsPageComponent,
    // Builder
    FieldPaletteComponent,
    FormCanvasComponent,
    FieldItemComponent,
    PropertiesPanelComponent,
    OptionEditorComponent,
    // Form
    FormRendererComponent,
    // Shared
    BaseInputComponent,
    BaseTextareaComponent,
    BaseSelectComponent,
    BaseCheckboxComponent,
    BaseButtonComponent,
    BaseModalComponent,
    IconButtonComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormBuilderRoutingModule,
  ],
  exports: [
    FormRendererComponent, // Export for use in other modules
  ],
})
export class FormBuilderModule {}
```

### `form-builder-routing.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BuilderPageComponent } from './components/builder/builder-page/builder-page.component';
import { PreviewPageComponent } from './components/preview/preview-page/preview-page.component';
import { SubmissionsPageComponent } from './components/submissions/submissions-page/submissions-page.component';

const routes: Routes = [
  {
    path: '',
    component: BuilderPageComponent,
  },
  {
    path: 'preview/:id',
    component: PreviewPageComponent,
  },
  {
    path: 'preview',
    component: PreviewPageComponent,
  },
  {
    path: 'submissions',
    component: SubmissionsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormBuilderRoutingModule {}
```

---

## Lazy Loading Setup

In your main `app-routing.module.ts`:

```typescript
const routes: Routes = [
  // ... other routes
  {
    path: 'forms',
    loadChildren: () =>
      import('./form-builder/form-builder.module').then((m) => m.FormBuilderModule),
  },
];
```

---

## Environment Configuration

### `environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
};
```

### `environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourapp.com',
};
```

---

## HTTP Interceptor for Auth

```typescript
// auth.interceptor.ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
```

---

*Document generated by Amelia (Developer Agent) for Angular 15 implementation.*
