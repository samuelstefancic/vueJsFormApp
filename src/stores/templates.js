import { defineStore } from 'pinia'

const templates = [
  {
    id: 'contact-form',
    name: 'Formulaire de contact',
    description: 'Formulaire simple pour recueillir les coordonnees et messages des visiteurs',
    category: 'general',
    thumbnail: '📬',
    fields: [
      {
        id: 'tpl_contact_1',
        type: 'text',
        name: 'nom',
        label: 'Nom complet',
        required: true,
        placeholder: 'Votre nom',
        defaultValue: ''
      },
      {
        id: 'tpl_contact_2',
        type: 'text',
        name: 'email',
        label: 'Adresse email',
        required: true,
        placeholder: 'votre@email.com',
        defaultValue: ''
      },
      {
        id: 'tpl_contact_3',
        type: 'textarea',
        name: 'message',
        label: 'Message',
        required: true,
        placeholder: 'Votre message...',
        defaultValue: ''
      }
    ]
  },
  {
    id: 'customer-survey',
    name: 'Enquete de satisfaction',
    description: 'Recueillez les retours de vos clients avec une note et des commentaires',
    category: 'feedback',
    thumbnail: '⭐',
    fields: [
      {
        id: 'tpl_survey_1',
        type: 'select',
        name: 'note',
        label: 'Note globale',
        required: true,
        options: [
          { value: '5', label: '5 - Excellent' },
          { value: '4', label: '4 - Tres bien' },
          { value: '3', label: '3 - Bien' },
          { value: '2', label: '2 - Moyen' },
          { value: '1', label: '1 - Mauvais' }
        ],
        defaultValue: ''
      },
      {
        id: 'tpl_survey_2',
        type: 'textarea',
        name: 'commentaires',
        label: 'Commentaires',
        required: false,
        placeholder: 'Partagez votre experience...',
        defaultValue: ''
      },
      {
        id: 'tpl_survey_3',
        type: 'checkbox',
        name: 'recommandation',
        label: 'Je recommande ce produit/service',
        required: false,
        defaultValue: false
      }
    ]
  },
  {
    id: 'event-registration',
    name: 'Inscription evenement',
    description: 'Formulaire d\'inscription pour conferences, ateliers ou reunions',
    category: 'registration',
    thumbnail: '📅',
    fields: [
      {
        id: 'tpl_event_1',
        type: 'text',
        name: 'nom',
        label: 'Nom complet',
        required: true,
        placeholder: 'Votre nom',
        defaultValue: ''
      },
      {
        id: 'tpl_event_2',
        type: 'text',
        name: 'email',
        label: 'Adresse email',
        required: true,
        placeholder: 'votre@email.com',
        defaultValue: ''
      },
      {
        id: 'tpl_event_3',
        type: 'date',
        name: 'date_evenement',
        label: 'Date de l\'evenement',
        required: true,
        placeholder: 'jj/mm/aaaa',
        defaultValue: ''
      },
      {
        id: 'tpl_event_4',
        type: 'number',
        name: 'nombre_participants',
        label: 'Nombre de participants',
        required: true,
        placeholder: '1',
        min: 1,
        max: 10,
        defaultValue: 1
      }
    ]
  },
  {
    id: 'job-application',
    name: 'Candidature emploi',
    description: 'Formulaire de candidature avec lettre de motivation',
    category: 'registration',
    thumbnail: '💼',
    fields: [
      {
        id: 'tpl_job_1',
        type: 'text',
        name: 'nom',
        label: 'Nom complet',
        required: true,
        placeholder: 'Votre nom',
        defaultValue: ''
      },
      {
        id: 'tpl_job_2',
        type: 'text',
        name: 'email',
        label: 'Adresse email',
        required: true,
        placeholder: 'votre@email.com',
        defaultValue: ''
      },
      {
        id: 'tpl_job_3',
        type: 'text',
        name: 'cv_url',
        label: 'Lien vers votre CV',
        required: true,
        placeholder: 'https://...',
        defaultValue: ''
      },
      {
        id: 'tpl_job_4',
        type: 'textarea',
        name: 'lettre_motivation',
        label: 'Lettre de motivation',
        required: true,
        placeholder: 'Expliquez votre motivation pour ce poste...',
        defaultValue: ''
      }
    ]
  },
  {
    id: 'newsletter-signup',
    name: 'Inscription newsletter',
    description: 'Formulaire simple pour collecter les abonnes a votre newsletter',
    category: 'general',
    thumbnail: '📧',
    fields: [
      {
        id: 'tpl_news_1',
        type: 'text',
        name: 'email',
        label: 'Adresse email',
        required: true,
        placeholder: 'votre@email.com',
        defaultValue: ''
      },
      {
        id: 'tpl_news_2',
        type: 'text',
        name: 'prenom',
        label: 'Prenom',
        required: false,
        placeholder: 'Votre prenom',
        defaultValue: ''
      },
      {
        id: 'tpl_news_3',
        type: 'checkbox',
        name: 'actualites',
        label: 'Actualites et annonces',
        required: false,
        defaultValue: true
      },
      {
        id: 'tpl_news_4',
        type: 'checkbox',
        name: 'promotions',
        label: 'Offres et promotions',
        required: false,
        defaultValue: false
      },
      {
        id: 'tpl_news_5',
        type: 'checkbox',
        name: 'conseils',
        label: 'Conseils et astuces',
        required: false,
        defaultValue: false
      }
    ]
  }
]

const categories = [
  { id: 'all', label: 'Tous' },
  { id: 'general', label: 'General' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'registration', label: 'Inscription' }
]

export const useTemplatesStore = defineStore('templates', {
  state: () => ({
    templates,
    categories,
    selectedCategory: 'all'
  }),

  getters: {
    filteredTemplates(state) {
      if (state.selectedCategory === 'all') {
        return state.templates
      }
      return state.templates.filter(t => t.category === state.selectedCategory)
    },

    getTemplateById(state) {
      return (id) => state.templates.find(t => t.id === id)
    }
  },

  actions: {
    setCategory(categoryId) {
      this.selectedCategory = categoryId
    }
  }
})
