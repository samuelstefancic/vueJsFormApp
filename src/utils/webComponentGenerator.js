export function generateWebComponent(schema, options = {}) {
  const {
    emailTo = '',
    emailSubject = 'Nouvelle soumission de formulaire',
    componentName = 'dynamic-form'
  } = options

  const schemaJson = JSON.stringify(schema)

  return `/**
 * Web Component: ${schema.title}
 * Généré par Dynamic Form Builder
 * Usage: <${componentName}></${componentName}>
 */
(function() {
  const SCHEMA = ${schemaJson};

  const STYLES = \`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 16px;
      color: #1a1a1a;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .form-container {
      max-width: 560px;
      margin: 0 auto;
      padding: 24px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .form-title {
      font-size: 1.5rem;
      font-weight: 400;
      margin-bottom: 24px;
      color: #1a1a1a;
    }
    .form-field {
      margin-bottom: 20px;
    }
    .field-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 6px;
      color: #1a1a1a;
    }
    .field-label .required {
      color: #ef4444;
      margin-left: 2px;
    }
    .field-input,
    .field-textarea,
    .field-select {
      width: 100%;
      padding: 10px 12px;
      font-size: 1rem;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      background: #fff;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .field-input:focus,
    .field-textarea:focus,
    .field-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
    }
    .field-input.error,
    .field-textarea.error,
    .field-select.error {
      border-color: #ef4444;
    }
    .field-textarea {
      min-height: 100px;
      resize: vertical;
    }
    .field-checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .field-checkbox {
      width: 18px;
      height: 18px;
      accent-color: #3b82f6;
    }
    .field-error {
      font-size: 0.75rem;
      color: #ef4444;
      margin-top: 4px;
    }
    .form-submit {
      width: 100%;
      padding: 12px 24px;
      font-size: 1rem;
      font-weight: 500;
      color: #fff;
      background: #3b82f6;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.15s;
    }
    .form-submit:hover {
      background: #2563eb;
    }
    .form-submit:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
    .success-message {
      padding: 16px;
      background: #ecfdf5;
      border: 1px solid #10b981;
      border-radius: 8px;
      color: #065f46;
      text-align: center;
    }
  \`;

  class DynamicForm extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.values = {};
      this.errors = {};
      this.submitted = false;
    }

    connectedCallback() {
      this.initializeValues();
      this.render();
    }

    initializeValues() {
      SCHEMA.fields.forEach(field => {
        if (field.defaultValue !== undefined && field.defaultValue !== '') {
          this.values[field.id] = field.defaultValue;
        } else if (field.type === 'checkbox') {
          this.values[field.id] = false;
        } else {
          this.values[field.id] = '';
        }
      });
    }

    validate() {
      this.errors = {};
      SCHEMA.fields.forEach(field => {
        const value = this.values[field.id];

        if (field.required) {
          if (field.type === 'checkbox' && !value) {
            this.errors[field.id] = 'Ce champ est requis';
          } else if (field.type !== 'checkbox' && (value === '' || value === null || value === undefined)) {
            this.errors[field.id] = 'Ce champ est requis';
          }
        }

        if (field.type === 'number' && value !== '' && value !== null) {
          const num = Number(value);
          if (isNaN(num)) {
            this.errors[field.id] = 'Nombre invalide';
          } else {
            if (field.min !== undefined && num < field.min) {
              this.errors[field.id] = 'Minimum: ' + field.min;
            }
            if (field.max !== undefined && num > field.max) {
              this.errors[field.id] = 'Maximum: ' + field.max;
            }
          }
        }

        if (field.type === 'select' && field.required && value) {
          const validOptions = (field.options || []).map(o => o.value);
          if (!validOptions.includes(value)) {
            this.errors[field.id] = 'Option invalide';
          }
        }
      });

      return Object.keys(this.errors).length === 0;
    }

    handleSubmit(e) {
      e.preventDefault();

      if (!this.validate()) {
        this.render();
        return;
      }

      const formData = {};
      SCHEMA.fields.forEach(field => {
        formData[field.name] = this.values[field.id];
      });

      // Build email body
      let emailBody = 'Formulaire: ' + SCHEMA.title + '\\n\\n';
      SCHEMA.fields.forEach(field => {
        const value = this.values[field.id];
        const displayValue = field.type === 'checkbox' ? (value ? 'Oui' : 'Non') : value;
        emailBody += field.label + ': ' + displayValue + '\\n';
      });

      const mailtoLink = 'mailto:${emailTo}?subject=' +
        encodeURIComponent('${emailSubject}') +
        '&body=' + encodeURIComponent(emailBody);

      window.location.href = mailtoLink;

      this.submitted = true;
      this.render();
    }

    handleInput(fieldId, value) {
      this.values[fieldId] = value;
      if (this.errors[fieldId]) {
        delete this.errors[fieldId];
        this.render();
      }
    }

    renderField(field) {
      const value = this.values[field.id];
      const error = this.errors[field.id];
      const errorClass = error ? 'error' : '';

      let inputHtml = '';

      switch (field.type) {
        case 'text':
          inputHtml = \`<input type="text" class="field-input \${errorClass}"
            id="\${field.id}" value="\${value || ''}"
            placeholder="\${field.placeholder || ''}">\`;
          break;

        case 'textarea':
          inputHtml = \`<textarea class="field-textarea \${errorClass}"
            id="\${field.id}" placeholder="\${field.placeholder || ''}">\${value || ''}</textarea>\`;
          break;

        case 'number':
          inputHtml = \`<input type="number" class="field-input \${errorClass}"
            id="\${field.id}" value="\${value || ''}"
            \${field.min !== undefined ? 'min="' + field.min + '"' : ''}
            \${field.max !== undefined ? 'max="' + field.max + '"' : ''}>\`;
          break;

        case 'select':
          const options = (field.options || []).map(opt =>
            \`<option value="\${opt.value}" \${value === opt.value ? 'selected' : ''}>\${opt.label}</option>\`
          ).join('');
          inputHtml = \`<select class="field-select \${errorClass}" id="\${field.id}">
            <option value="">-- Sélectionner --</option>
            \${options}
          </select>\`;
          break;

        case 'checkbox':
          inputHtml = \`<div class="field-checkbox-wrapper">
            <input type="checkbox" class="field-checkbox" id="\${field.id}" \${value ? 'checked' : ''}>
            <label for="\${field.id}">\${field.label}</label>
          </div>\`;
          break;

        case 'date':
          inputHtml = \`<input type="date" class="field-input \${errorClass}"
            id="\${field.id}" value="\${value || ''}">\`;
          break;
      }

      const labelHtml = field.type !== 'checkbox' ?
        \`<label class="field-label" for="\${field.id}">
          \${field.label}\${field.required ? '<span class="required">*</span>' : ''}
        </label>\` : '';

      const errorHtml = error ? \`<div class="field-error">\${error}</div>\` : '';

      return \`<div class="form-field">\${labelHtml}\${inputHtml}\${errorHtml}</div>\`;
    }

    render() {
      if (this.submitted) {
        this.shadowRoot.innerHTML = \`
          <style>\${STYLES}</style>
          <div class="form-container">
            <div class="success-message">
              Merci ! Votre client email va s'ouvrir avec les données du formulaire.
            </div>
          </div>
        \`;
        return;
      }

      const fieldsHtml = SCHEMA.fields.map(f => this.renderField(f)).join('');

      this.shadowRoot.innerHTML = \`
        <style>\${STYLES}</style>
        <div class="form-container">
          <h2 class="form-title">\${SCHEMA.title}</h2>
          <form id="dynamic-form">
            \${fieldsHtml}
            <button type="submit" class="form-submit">Envoyer</button>
          </form>
        </div>
      \`;

      // Attach event listeners
      const form = this.shadowRoot.getElementById('dynamic-form');
      form.addEventListener('submit', (e) => this.handleSubmit(e));

      SCHEMA.fields.forEach(field => {
        const el = this.shadowRoot.getElementById(field.id);
        if (el) {
          const eventType = field.type === 'checkbox' ? 'change' : 'input';
          el.addEventListener(eventType, (e) => {
            const value = field.type === 'checkbox' ? e.target.checked : e.target.value;
            this.handleInput(field.id, value);
          });
        }
      });
    }
  }

  customElements.define('${componentName}', DynamicForm);
})();
`
}

export function generateEmbedCode(componentName = 'dynamic-form', scriptUrl = '') {
  return `<!-- Inclure le script du Web Component -->
<script src="${scriptUrl || componentName + '.js'}"></script>

<!-- Utiliser le formulaire -->
<${componentName}></${componentName}>`
}
