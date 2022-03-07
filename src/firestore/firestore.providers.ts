import { SettingDocument } from '../settings/documents/setting.document';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
  SettingDocument.collectionName,
];
