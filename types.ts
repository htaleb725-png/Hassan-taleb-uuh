
export interface RequestEntry {
  id: string;
  applicantName: string;
  recipient: string;
  subject: string;
  date: string;
  notes: string;
  ocrText: string;
  imageUri: string;
  createdAt: string;
}

export interface User {
  username: string;
  role: 'admin' | 'staff';
}

export interface AppSettings {
  googleSheetsUrl: string;
  primaryColor: string;
  systemName: string;
  enableAutoFill: boolean;
}

export interface OCRResult {
  applicantName: string;
  recipient: string;
  subject: string;
  date: string;
  fullText: string;
}
