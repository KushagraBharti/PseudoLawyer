// Database types for PseudoLawyer
// These match the Supabase schema

export interface Profile {
    id: string;
    full_name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface Template {
    id: string;
    name: string;
    description: string | null;
    category: string;
    content: TemplateContent;
    created_at: string;
}

export interface TemplateContent {
    title: string;
    sections: TemplateSection[];
    defaultTerms: Record<string, string>;
}

export interface TemplateSection {
    id: string;
    title: string;
    description: string;
    fields: TemplateField[];
}

export interface TemplateField {
    id: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'textarea';
    placeholder?: string;
    options?: string[];
    required: boolean;
    defaultValue?: string;
}

export interface Negotiation {
    id: string;
    template_id: string | null;
    title: string;
    status: 'active' | 'completed' | 'cancelled';
    contract_data: ContractData;
    created_by: string;
    created_at: string;
    updated_at: string;
    // Joined data
    template?: Template;
    participants?: Participant[];
    messages?: Message[];
}

export interface ContractData {
    templateName: string;
    agreedTerms: Record<string, string>;
    disputedTerms: Record<string, { partyA: string; partyB: string }>;
    sections: Record<string, Record<string, string>>;
}

export interface Participant {
    id: string;
    negotiation_id: string;
    user_id: string | null;
    email: string;
    role: 'initiator' | 'party';
    status: 'pending' | 'joined' | 'agreed';
    joined_at: string | null;
    agreed_at: string | null;
    // Joined data
    profile?: Profile;
}

export interface Message {
    id: string;
    negotiation_id: string;
    sender_id: string | null;
    sender_type: 'user' | 'ai';
    content: string;
    metadata: MessageMetadata;
    created_at: string;
    // Joined data
    sender?: Profile;
}

export interface MessageMetadata {
    suggestion?: boolean;
    termReference?: string;
    agreedTerm?: { key: string; value: string };
}

export interface Contract {
    id: string;
    negotiation_id: string;
    title: string;
    final_content: FinalContractContent;
    pdf_path: string | null;
    signed_by: SignatureRecord[];
    created_at: string;
}

export interface FinalContractContent {
    templateName: string;
    parties: { name: string; email: string; role: string }[];
    terms: Record<string, string>;
    sections: Record<string, Record<string, string>>;
    generatedAt: string;
    generatedText?: string;
}

export interface SignatureRecord {
    user_id: string;
    user_name: string;
    signed_at: string;
}

// Type for Supabase responses
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, 'created_at' | 'updated_at'>;
                Update: Partial<Profile>;
            };
            templates: {
                Row: Template;
                Insert: Omit<Template, 'id' | 'created_at'>;
                Update: Partial<Template>;
            };
            negotiations: {
                Row: Negotiation;
                Insert: Omit<Negotiation, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Negotiation>;
            };
            participants: {
                Row: Participant;
                Insert: Omit<Participant, 'id'>;
                Update: Partial<Participant>;
            };
            messages: {
                Row: Message;
                Insert: Omit<Message, 'id' | 'created_at'>;
                Update: Partial<Message>;
            };
            contracts: {
                Row: Contract;
                Insert: Omit<Contract, 'id' | 'created_at'>;
                Update: Partial<Contract>;
            };
        };
    };
}
