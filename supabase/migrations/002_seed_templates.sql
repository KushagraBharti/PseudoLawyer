-- Seed data: Freelance Services Agreement Template
-- Run this after the schema migration

INSERT INTO public.templates (name, description, category, content) VALUES (
  'Freelance Services Agreement',
  'A professional agreement between a client and freelancer for services rendered. Perfect for consulting, design, development, or other professional work.',
  'services',
  '{
    "title": "Freelance Services Agreement",
    "sections": [
      {
        "id": "parties",
        "title": "Parties",
        "description": "Information about the parties entering this agreement",
        "fields": [
          {"id": "client_name", "label": "Client Name", "type": "text", "placeholder": "Full name or company name", "required": true},
          {"id": "freelancer_name", "label": "Freelancer Name", "type": "text", "placeholder": "Your full name", "required": true}
        ]
      },
      {
        "id": "services",
        "title": "Services",
        "description": "Description of the work to be performed",
        "fields": [
          {"id": "service_description", "label": "Service Description", "type": "textarea", "placeholder": "Describe the services to be provided...", "required": true},
          {"id": "deliverables", "label": "Deliverables", "type": "textarea", "placeholder": "List specific deliverables...", "required": true}
        ]
      },
      {
        "id": "timeline",
        "title": "Timeline",
        "description": "Project timeline and deadlines",
        "fields": [
          {"id": "start_date", "label": "Start Date", "type": "date", "required": true},
          {"id": "end_date", "label": "End Date", "type": "date", "required": true},
          {"id": "milestones", "label": "Key Milestones", "type": "textarea", "placeholder": "List major milestones..."}
        ]
      },
      {
        "id": "compensation",
        "title": "Compensation",
        "description": "Payment terms and amounts",
        "fields": [
          {"id": "payment_amount", "label": "Total Payment Amount", "type": "text", "placeholder": "$0.00", "required": true},
          {"id": "payment_schedule", "label": "Payment Schedule", "type": "select", "options": ["Upon completion", "50% upfront, 50% on completion", "Monthly", "Milestone-based"], "required": true},
          {"id": "payment_method", "label": "Payment Method", "type": "select", "options": ["Bank Transfer", "PayPal", "Check", "Other"]}
        ]
      },
      {
        "id": "terms",
        "title": "Additional Terms",
        "description": "Other important terms",
        "fields": [
          {"id": "revisions", "label": "Number of Revisions Included", "type": "number", "placeholder": "2", "defaultValue": "2"},
          {"id": "ip_ownership", "label": "Intellectual Property Ownership", "type": "select", "options": ["Client owns all work product", "Freelancer retains rights, grants license", "Shared ownership"], "required": true},
          {"id": "confidentiality", "label": "Confidentiality Required", "type": "select", "options": ["Yes", "No"], "defaultValue": "Yes"},
          {"id": "termination_notice", "label": "Termination Notice Period", "type": "select", "options": ["7 days", "14 days", "30 days"], "defaultValue": "14 days"}
        ]
      }
    ],
    "defaultTerms": {
      "revisions": "2",
      "confidentiality": "Yes",
      "termination_notice": "14 days"
    }
  }'::jsonb
);

-- Add a second template: Non-Disclosure Agreement
INSERT INTO public.templates (name, description, category, content) VALUES (
  'Non-Disclosure Agreement (NDA)',
  'A mutual confidentiality agreement to protect sensitive information shared between parties.',
  'confidentiality',
  '{
    "title": "Non-Disclosure Agreement",
    "sections": [
      {
        "id": "parties",
        "title": "Parties",
        "description": "Information about the parties entering this agreement",
        "fields": [
          {"id": "party_a_name", "label": "Disclosing Party Name", "type": "text", "placeholder": "Name of party sharing information", "required": true},
          {"id": "party_b_name", "label": "Receiving Party Name", "type": "text", "placeholder": "Name of party receiving information", "required": true}
        ]
      },
      {
        "id": "confidential_info",
        "title": "Confidential Information",
        "description": "Define what information is protected",
        "fields": [
          {"id": "info_description", "label": "Description of Confidential Information", "type": "textarea", "placeholder": "Describe the types of information covered...", "required": true},
          {"id": "exclusions", "label": "Exclusions", "type": "textarea", "placeholder": "Information NOT considered confidential..."}
        ]
      },
      {
        "id": "obligations",
        "title": "Obligations",
        "description": "Duties of the receiving party",
        "fields": [
          {"id": "permitted_use", "label": "Permitted Use", "type": "textarea", "placeholder": "How the receiving party may use the information...", "required": true},
          {"id": "protection_standard", "label": "Protection Standard", "type": "select", "options": ["Reasonable care", "Same as own confidential info", "Industry standard security"], "required": true}
        ]
      },
      {
        "id": "duration",
        "title": "Term & Duration",
        "description": "How long the agreement lasts",
        "fields": [
          {"id": "effective_date", "label": "Effective Date", "type": "date", "required": true},
          {"id": "duration", "label": "Confidentiality Period", "type": "select", "options": ["1 year", "2 years", "3 years", "5 years", "Indefinite"], "required": true}
        ]
      }
    ],
    "defaultTerms": {
      "protection_standard": "Reasonable care",
      "duration": "2 years"
    }
  }'::jsonb
);
